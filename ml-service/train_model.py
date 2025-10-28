# File: ml-service/train_model.py

import pandas as pd
import joblib
import sys
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

# Import the three model algorithms
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC # Support Vector Classifier

def train_and_evaluate():
    """
    Trains three different ML models, evaluates their performance,
    and saves only the best-performing model to disk.
    """
    # 1. Load the dataset
    print("-> 1. Loading dataset (Training.csv)...")
    try:
        df = pd.read_csv('Training.csv')
    except FileNotFoundError:
        print("\n[ERROR] 'Training.csv' not found. Please ensure it's in the 'ml-service' directory.")
        sys.exit(1)

    # 2. Prepare and clean the data
    print("-> 2. Preparing and cleaning data...")
    if 'Unnamed: 133' in df.columns:
        df = df.drop('Unnamed: 133', axis=1)

    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]
    symptom_columns = X.columns.tolist()

    # Encode the target variable (disease names)
    le_prognosis = LabelEncoder()
    y_encoded = le_prognosis.fit_transform(y)

    # 3. Split data into training and testing sets
    # 80% for training, 20% for testing. This lets us evaluate model performance on unseen data.
    print("-> 3. Splitting data into training (80%) and testing (20%) sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    # 4. Initialize the models
    print("-> 4. Initializing ML models...")
    models = {
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Support Vector Machine (SVM)": SVC(kernel='linear', probability=True, random_state=42)
    }

    # 5. Train and evaluate each model
    print("-> 5. Training and evaluating models...")
    model_performance = {}
    
    for model_name, model in models.items():
        print(f"   - Training {model_name}...")
        model.fit(X_train, y_train)
        
        # Make predictions on the test set
        y_pred = model.predict(X_test)
        
        # Calculate accuracy
        accuracy = accuracy_score(y_test, y_pred)
        model_performance[model_name] = accuracy
        print(f"   - {model_name} Accuracy: {accuracy:.4f}")

    # 6. Find the best model
    best_model_name = max(model_performance, key=model_performance.get)
    best_model = models[best_model_name]
    best_accuracy = model_performance[best_model_name]

    print(f"\n-> 6. Best performing model is '{best_model_name}' with an accuracy of {best_accuracy:.4f}.")

    # 7. Save the best model and other necessary assets
    print("-> 7. Saving the best model and supporting files...")
    joblib.dump(best_model, 'best_disease_model.joblib')
    joblib.dump(le_prognosis, 'prognosis_encoder.joblib')
    joblib.dump(symptom_columns, 'symptom_columns.joblib')

    # Also save the performance report for reference
    performance_df = pd.DataFrame.from_dict(model_performance, orient='index', columns=['Accuracy'])
    performance_df.to_csv('model_performance_report.csv')

    print("\n✅ Success! The best model and all assets were saved.")
    print(f"   - best_disease_model.joblib ({best_model_name})")
    print(f"   - prognosis_encoder.joblib")
    print(f"   - symptom_columns.joblib")
    print(f"   - model_performance_report.csv")


if __name__ == '__main__':
    train_and_evaluate()