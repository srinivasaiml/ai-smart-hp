# ===============================
# File: ml-service/app.py
# AI Smart Hospital - ML Service
# ===============================

# Step 1: Load environment variables
from dotenv import load_dotenv
load_dotenv()  # For local development (Render auto-loads environment)

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import sys

# Step 2: Initialize Flask App
app = Flask(__name__)

# --- Step 3: Secure CORS Configuration ---
# Allow frontend URLs (both local and deployed)
live_frontend_url = os.environ.get("CLIENT_URL_LIVE", "http://localhost:5173")

allowed_origins = [
    "http://localhost:5173",  # Keep for local development
    live_frontend_url         # Add the live URL from the environment
]

CORS(app, origins=allowed_origins, supports_credentials=True)
print(f"✅ CORS enabled for: {allowed_origins}")
# --- End of CORS Configuration ---


# --- Step 4: Load the trained ML model and assets ---
print("🔄 Loading ML model and assets...")

try:
    model = joblib.load('best_disease_model.joblib')
    prognosis_encoder = joblib.load('prognosis_encoder.joblib')
    symptom_columns = joblib.load('symptom_columns.joblib')
    print("✅ Model and encoders loaded successfully.")
except FileNotFoundError:
    print("\n❌ [ERROR] Model files not found!")
    print("➡ Please run 'python train_model.py' first to generate model files.")
    sys.exit(1)


# --- Step 5: Define API Routes ---
@app.route('/')
def home():
    """Basic health check route."""
    return jsonify({
        "status": "OK",
        "message": "Symptom Prediction ML Service is running."
    })


@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    """Return the list of all available symptoms."""
    symptoms_formatted = [s.replace('_', ' ') for s in symptom_columns]
    return jsonify(symptoms_formatted)


@app.route('/predict', methods=['POST'])
def predict():
    """Predict the most probable disease based on symptoms."""
    try:
        data = request.get_json()
        symptoms_from_user = data.get('symptoms', [])

        if not symptoms_from_user:
            return jsonify({'error': 'No symptoms provided'}), 400

        # Create input vector (1 x N)
        input_vector = pd.DataFrame(np.zeros((1, len(symptom_columns))), columns=symptom_columns)

        # Mark the symptoms that the user has
        for symptom in symptoms_from_user:
            symptom_col_name = symptom.replace(' ', '_')
            if symptom_col_name in input_vector.columns:
                input_vector.loc[0, symptom_col_name] = 1

        # Make prediction
        prediction_probabilities = model.predict_proba(input_vector)
        confidence = np.max(prediction_probabilities)
        prediction_encoded = np.argmax(prediction_probabilities, axis=1)
        predicted_disease = prognosis_encoder.inverse_transform(prediction_encoded)[0]

        print(f"🧠 Predicted Disease: {predicted_disease} (Confidence: {confidence:.4f})")

        return jsonify({
            'predicted_disease': predicted_disease,
            'confidence': float(confidence)
        })

    except Exception as e:
        print(f"⚠️ [ERROR] Prediction failed: {e}")
        return jsonify({'error': 'An internal error occurred during prediction.'}), 500


# --- Step 6: Run locally (Render uses Gunicorn automatically) ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"🚀 Starting Flask development server on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port)
