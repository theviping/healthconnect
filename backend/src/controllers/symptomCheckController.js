const axios = require("axios");
const SymptomCheck = require("../models/SymptomCheck");

async function checkSymptoms(req, res) {
  try {
    const { symptoms } = req.body;
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: "symptoms array is required" });
    }

    // Call the Flask ML microservice (FR-2)
    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      { symptoms },
      { timeout: 5000 }
    );

    const { predicted_condition, urgency_level, confidence } = mlResponse.data;

    // Save the check to MongoDB, linked to the logged-in patient
    const record = await SymptomCheck.create({
      patient: req.user.id,
      symptoms,
      predictedCondition: predicted_condition,
      urgencyLevel: urgency_level,
    });

    res.status(201).json({
      id: record._id,
      symptoms: record.symptoms,
      predictedCondition: predicted_condition,
      urgencyLevel: urgency_level,
      confidence,
    });
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      return res.status(503).json({ message: "ML service is unavailable. Make sure app.py is running." });
    }
    res.status(500).json({ message: "Symptom check failed", error: err.message });
  }
}

async function getMyHistory(req, res) {
  try {
    const history = await SymptomCheck.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history", error: err.message });
  }
}

module.exports = { checkSymptoms, getMyHistory };
