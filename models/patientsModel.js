const mongoose = require("mongoose");

const patientsSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  roomType: { type: String, required: true },
});

const patientsModel = mongoose.model("patients", patientsSchema);

module.exports = { patientsModel };
