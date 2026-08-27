const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    // Doctor-only fields
    specialization: { type: String },
    availability: [{ day: String, slots: [String] }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
