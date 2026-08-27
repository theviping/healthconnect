const mongoose = require("mongoose");

const symptomCheckSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: [{ type: String, required: true }],
    predictedCondition: { type: String },
    urgencyLevel: { type: String, enum: ["low", "moderate", "high"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SymptomCheck", symptomCheckSchema);
