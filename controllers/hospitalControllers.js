const express = require("express");
const HospitalDataHandler = require("../crud/hospitalCrudFunctions");

const { roomsModel } = require("../models/roomsModel");
const { bedsModel } = require("../models/bedsModel");
const { equipmentsModel } = require("../models/equipmentsModel");
const { patientsModel } = require("../models/patientsModel");

const hospitalRoute = express.Router();
const hospitalDataHandler = new HospitalDataHandler();

hospitalRoute.get("/getRoomsOverview", async (req, res) => {
  await hospitalDataHandler.getAllData(roomsModel, {}, req, res, true);
});

hospitalRoute.get("/getBedsOverview", async (req, res) => {
  await hospitalDataHandler.getAllData(bedsModel, {}, req, res, true);
});

hospitalRoute.get("/getEquipmentsOverview", async (req, res) => {
  await hospitalDataHandler.getAllData(equipmentsModel, {}, req, res, true);
});

hospitalRoute.post("/admitPatiant", async (req, res) => {
  await hospitalDataHandler.admitPatient(patientsModel, req, res);
});

hospitalRoute.get("/getPatientsList", async (req, res) => {
  await hospitalDataHandler.getAllData(patientsModel, {}, req, res, true);
});

hospitalRoute.delete("/dischargePetiant/:patientId", async (req, res) => {
  const { patientId } = req.params;
  await hospitalDataHandler.deletePatient(patientsModel, patientId, req, res);
});

module.exports = { hospitalRoute };
