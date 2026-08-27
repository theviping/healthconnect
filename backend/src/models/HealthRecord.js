const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    prescription: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthRecord", healthRecordSchema);
