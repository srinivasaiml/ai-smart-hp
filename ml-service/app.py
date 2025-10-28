# File: ml-service/app.py (Corrected for Deployment)

# Step 1: Add dotenv imports at the very top
from dotenv import load_dotenv
load_dotenv() # This will load variables from a .env file for local development

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import sys

app = Flask(__name__)

# --- Step 2: Implement Secure CORS Configuration ---
# Get the allowed origins from an environment variable (e.g., your backend server's URL)
# For local dev, your Node.js backend runs on http://localhost:5000
# In production, this will be your Render backend URL.
allowed_origins_str = os.environ.get('CORS_ORIGIN', "http://localhost:5000")
allowed_origins = allowed_origins_str.split(',')

print(f"-> CORS is configured to accept requests from: {allowed_origins}")

# Initialize CORS to only allow requests from the specified origins
CORS(app, origins=allowed_origins, supports_credentials=True)
# --- End of Secure CORS Section ---


# Load the single BEST model and other assets
print("-> Loading the best performing ML model and assets...")
try:
    model = joblib.load('best_disease_model.joblib')
    prognosis_encoder = joblib.load('prognosis_encoder.joblib')
    symptom_columns = joblib.load('symptom_columns.joblib')
    print("✅ ML assets loaded successfully.")
except FileNotFoundError:
    print("\n[ERROR] Model files not found!")
    print("Please run 'python train_model.py' first.")
    sys.exit(1)

@app.route('/')
def home():
    return jsonify({
        "status": "OK",
        "message": "Symptom Prediction ML Service is running."
    })

@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    symptoms_formatted = [s.replace('_', ' ') for s in symptom_columns]
    return jsonify(symptoms_formatted)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        symptoms_from_user = data.get('symptoms', [])

        if not symptoms_from_user:
            return jsonify({'error': 'No symptoms provided'}), 400

        input_vector = pd.DataFrame(np.zeros((1, len(symptom_columns))), columns=symptom_columns)

        for symptom in symptoms_from_user:
            symptom_col_name = symptom.replace(' ', '_')
            if symptom_col_name in input_vector.columns:
                input_vector.loc[0, symptom_col_name] = 1
        
        prediction_probabilities = model.predict_proba(input_vector)
        confidence = np.max(prediction_probabilities)
        prediction_encoded = np.argmax(prediction_probabilities, axis=1)
        predicted_disease = prognosis_encoder.inverse_transform(prediction_encoded)[0]
        
        print(f"-> Prediction: {predicted_disease}, Confidence: {confidence:.4f}")
        
        return jsonify({
            'predicted_disease': predicted_disease,
            'confidence': confidence
        })

    except Exception as e:
        print(f"[ERROR] Prediction failed: {e}")
        return jsonify({'error': 'An internal error occurred during prediction.'}), 500

# This block is used when you run `python app.py` on your local machine
if __name__ == '__main__':
    # This line is good! It uses the PORT from the environment if available.
    port = int(os.environ.get('PORT', 5001))
    print(f"-> Starting Flask development server on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port)