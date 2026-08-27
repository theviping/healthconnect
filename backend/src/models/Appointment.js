const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slotTime: { type: Date, required: true },
    status: { type: String, enum: ["booked", "completed", "cancelled"], default: "booked" },
    symptomCheck: { type: mongoose.Schema.Types.ObjectId, ref: "SymptomCheck" },
  },
  { timestamps: true }
);

// Prevents two patients from double-booking the same doctor + slot (NFR-4)
appointmentSchema.index({ doctor: 1, slotTime: 1 }, { unique: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
