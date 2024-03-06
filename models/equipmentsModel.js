const mongoose = require("mongoose");

const equipmentsSchema = new mongoose.Schema({
  equipmentName: { type: String, required: true },
  numberOfAvailableEquipments: { type: Number, required: true },
});

const equipmentsModel = mongoose.model("Equipments", equipmentsSchema);

module.exports = { equipmentsModel };
