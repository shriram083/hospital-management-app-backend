const mongoose = require("mongoose");

const roomsSchema = new mongoose.Schema({
  typeOfRoom: { type: String, required: true },
  numberOfAvailableRooms: { type: Number, required: true },
});

const roomsModel = mongoose.model("rooms", roomsSchema);

module.exports = { roomsModel };
