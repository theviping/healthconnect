"""
Flask microservice that serves the trained symptom classifier.
Exposes POST /predict which the Node.js API calls (FR-2).
"""

import json
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_PATH = "models/symptom_classifier.joblib"
LABELS_PATH = "models/label_encoder.joblib"
SYMPTOMS_PATH = "models/symptom_columns.json"

model = None
label_encoder = None
symptom_columns = None

# Simple placeholder urgency map; refine using clinical input during Review 4/5.
HIGH_URGENCY_CONDITIONS = {"heart attack", "paralysis (brain hemorrhage)", "tuberculosis"}
MODERATE_URGENCY_CONDITIONS = {"pneumonia", "dengue", "typhoid", "malaria"}


def load_artifacts():
    global model, label_encoder, symptom_columns
    model = joblib.load(MODEL_PATH)
    label_encoder = joblib.load(LABELS_PATH)
    with open(SYMPTOMS_PATH) as f:
        symptom_columns = json.load(f)


def symptoms_to_vector(selected_symptoms):
    selected = set(s.strip().lower().replace(" ", "_") for s in selected_symptoms)
    return np.array([[1 if col.lower() in selected else 0 for col in symptom_columns]])


def urgency_for(condition):
    c = condition.lower()
    if c in HIGH_URGENCY_CONDITIONS:
        return "high"
    if c in MODERATE_URGENCY_CONDITIONS:
        return "moderate"
    return "low"


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Run train_model.py first."}), 503

    data = request.get_json(force=True)
    symptoms = data.get("symptoms", [])
    if not symptoms:
        return jsonify({"error": "symptoms list is required"}), 400

    vector = symptoms_to_vector(symptoms)
    pred_encoded = model.predict(vector)[0]
    condition = label_encoder.inverse_transform([pred_encoded])[0]

    probability = None
    if hasattr(model, "predict_proba"):
        probability = float(np.max(model.predict_proba(vector)))

    return jsonify({
        "predicted_condition": condition,
        "urgency_level": urgency_for(condition),
        "confidence": round(probability, 4) if probability is not None else None,
    })


if __name__ == "__main__":
    load_artifacts()
    app.run(host="0.0.0.0", port=8000, debug=True)
