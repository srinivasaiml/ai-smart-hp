# SmartHospital ML Workflow

## PHASE 1: Model Training (One-Time Setup)

### 1. Data Preparation
- **Input:** `Training.csv` (133 columns)
  - **132 columns:** Symptoms (e.g., fever, cough, headache), each as 0 (absent) or 1 (present)
  - **1 column:** Disease name (e.g., "Malaria", "Diabetes", "Migraine")

### 2. Model Training
- Train three ML models:
  - Random Forest
  - Logistic Regression
  - Support Vector Machine (SVM)
- Each model learns patterns:  
  _“When symptoms X, Y, Z are present → Disease is likely A”_
- Evaluate all models and select the one with the highest accuracy.

### 3. Saving the Model
- Save the best model as `best_disease_model.joblib`
- Also save:
  - Symptom names (`symptom_columns.joblib`)
  - Disease encoder (`prognosis_encoder.joblib`)
- These files are used for future predictions.

---

## PHASE 2: Prediction Workflow (Runtime)

### 1. User Conversation (Frontend)
- User describes symptoms in chat (e.g., "I have a headache, fever, and nausea")
- Chatbot (Groq AI) asks follow-up questions
- All user messages are stored in an array

### 2. Symptom Extraction (Frontend)
- After several messages, the system analyzes the conversation
- Extracts medical keywords (e.g., headache, fever, nausea)
- Creates a symptom list: `["headache", "fever", "nausea"]`

### 3. Sending Data to ML Service (Frontend → Backend)
- Frontend sends an HTTP POST request to Flask server (`localhost:5001`)
- JSON payload:
  ```json
  {
    "symptoms": ["headache", "fever", "nausea"]
  }
  ```

### 4. ML Prediction (Backend)
- Flask receives the symptom list
- Converts it to a vector of 132 values (0 for absent, 1 for present symptoms)
- Example: `[0, 0, 1, 0, 1, ..., 1, 0]`
- The trained ML model processes this vector and predicts the disease and confidence score

### 5. Sending Response (Backend → Frontend)
- Flask returns JSON:
  ```json
  {
    "predicted_disease": "Migraine",
    "confidence": 0.85
  }
  ```

### 6. Doctor Recommendation (Frontend)
- Frontend matches the predicted disease to the appropriate doctor specialty
- Displays a recommendation card (e.g., "Dr. James Anderson - Neurosurgeon") with a booking button

---

## Why This Works

- **ML Model:** Learns disease patterns from thousands of patient records
- **Frontend:** Extracts symptoms, sends to ML, receives disease prediction, matches to doctor
- **Backend:** Only sees standardized symptom keywords, not the full conversation

---

## Example Flow

1. User: "I have severe headache and light sensitivity"
2. Chatbot: "How long have you had the headache? Any nausea?"
3. User: "Since yesterday, yes nausea too"
4. System extracts: `["headache", "light sensitivity", "nausea"]`
5. Sends to ML: POST to `/predict`
6. ML predicts: "Migraine" (87% confidence)
7. Frontend matches doctor: Neurosurgeon
8. Shows card: "Dr. James Anderson - Neurosurgeon" with booking option

---

## Fallback System

- **If ML service is OFF:**  
  Frontend uses simple keyword matching (less accurate)
  - "headache" → Neurosurgeon
  - "chest pain" → Cardiologist
  - "skin rash" → Dermatologist

- **If ML service is ON:**  
  Uses trained model for accurate predictions  
  Shows "ML Powered" badge and confidence percentage

---

## Key Points

- ML model is trained once on 4920+ patient records
- Frontend collects symptoms via chat
- Backend predicts disease using trained model
- Frontend matches disease to doctor specialty
- User books appointment via chatbot

---

**Note:**  
The ML model only receives extracted symptom keywords in a standardized format, not the full conversation.