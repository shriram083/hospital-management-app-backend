const mongoose = require("mongoose");

const bedsSchema = new mongoose.Schema({
  typeOfBed: { type: String, required: true },
  numberOfAvailableBeds: { type: Number, required: true },
});

const bedsModel = mongoose.model("beds", bedsSchema);

module.exports = { bedsModel };
