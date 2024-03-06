const { roomsModel } = require("../models/roomsModel");
const { bedsModel } = require("../models/bedsModel");
const { equipmentsModel } = require("../models/equipmentsModel");
const { patientsModel } = require("../models/patientsModel");
class HospitalDataHandler {
  constructor() {}

  async getAllData(model, filter, req, res, isRoute) {
    try {
      const data = await model.find(filter);
      if (isRoute) {
        res.status(200).json(data);
      } else {
        return data;
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async admitPatient(patientsModel, req, res) {
    const { patientName, roomType } = req.body;
    const roomCapacity = await this.getAllData(
      roomsModel,
      { typeOfRoom: roomType },
      req,
      res
    );

    if (roomCapacity && roomCapacity.numberOfAvailableRooms <= 0) {
      return res.status(400).send(`Room ${roomType} is already full.`);
    }
    const oxygenCylindersCapacity = await this.getAllData(
      equipmentsModel,
      { equipmentName: "Oxygen Cylinders" },
      req,
      res
    );

    const ventilatorsCapacity = await this.getAllData(
      equipmentsModel,
      { equipmentName: "Ventilators" },
      req,
      res
    );

    if (
      roomType === "Oxygen Room" &&
      oxygenCylindersCapacity[0].numberOfAvailableEquipments < 2
    ) {
      return res.status(400).send(`Oxygen Cylinders are Not Available.`);
    }
    if (
      (roomType === "ICU Room" &&
        oxygenCylindersCapacity[0].numberOfAvailableEquipments < 1) ||
      ventilatorsCapacity[0].numberOfAvailableEquipments < 1
    ) {
      return res.status(400).send(`Sufficient Equipments are Not Available.`);
    }

    const newPatient = new patientsModel({
      patientName,
      roomType,
    });

    try {
      await newPatient.save();
      await this.updateRoomAvailability(roomsModel, roomType, -1);
      await this.updateBedsAvailability(bedsModel, roomType);
      await this.updateEquipmentsAvailability(equipmentsModel, roomType);
      let equipments;
      switch (roomType) {
        case "Normal Room":
          equipments = "1 flat bed + 2 normal masks";
          break;
        case "Oxygen Room":
          equipments =
            "2 oxygen cylinders + 1 recliner bed + 2 non rebreather masks";
          break;
        case "ICU Room":
          equipments = "1 ventilator + 1 recliner bed + 1 oxygen cylinder";
          break;
      }
      res.send(`${roomType} (with ${equipments}) reserved.`);
    } catch (err) {
      res.status(500).send("Something went wrong");
    }
  }
  async updateRoomAvailability(roomsModel, roomType, updateCount) {
    try {
      const room = await roomsModel.findOne({ typeOfRoom: roomType });
      if (!room) {
        throw new Error(`Room of type ${roomType} not found.`);
      }
      room.numberOfAvailableRooms += updateCount;
      await room.save();
    } catch (err) {
      throw new Error(`Error updating room availability: ${err.message}`);
    }
  }
  async updateBedsAvailability(bedsModel, roomType, isDelete = false) {
    try {
      let filter = { typeOfBed: "Recliner Bed" };
      if (roomType == "Normal Room") {
        filter.typeOfBed = "Flat Bed";
      }

      const bed = await bedsModel.findOne(filter);
      if (!bed) {
        throw new Error(`Room of type ${roomType} not found.`);
      }
      if (isDelete) {
        bed.numberOfAvailableBeds += 1;
      } else {
        bed.numberOfAvailableBeds -= 1;
      }
      await bed.save();
    } catch (err) {
      throw new Error(`Error updating bed availability: ${err.message}`);
    }
  }
  async updateEquipmentsAvailability(
    equipmentsModel,
    roomType,
    isDelete = false
  ) {
    try {
      // Normal Room --> 2 normal masks.
      if (roomType === "Normal Room") {
        let filter = { equipmentName: "Normal Masks" };
        const equipment = await equipmentsModel.findOne(filter);
        if (!equipment) {
          throw new Error(`Room of type ${roomType} not found.`);
        }
        if (isDelete) {
          equipment.numberOfAvailableEquipments += 2;
        } else {
          equipment.numberOfAvailableEquipments -= 2;
        }
        await equipment.save();
      }
      // Oxygen Room --> 2 oxygen cylinders and 2 non rebreather masks
      else if (roomType === "Oxygen Room") {
        const oxygenCylinder = await equipmentsModel.findOne({
          equipmentName: "Oxygen Cylinders",
        });
        const nonRebreatherMask = await equipmentsModel.findOne({
          equipmentName: "Non rebreather masks",
        });
        if (!oxygenCylinder && !nonRebreatherMask) {
          throw new Error(`Room of type ${roomType} not found.`);
        }
        if (isDelete) {
          oxygenCylinder.numberOfAvailableEquipments += 2;
          nonRebreatherMask.numberOfAvailableEquipments += 2;
        } else {
          oxygenCylinder.numberOfAvailableEquipments -= 2;
          nonRebreatherMask.numberOfAvailableEquipments -= 2;
        }
        await oxygenCylinder.save();
        await nonRebreatherMask.save();
      }
      // ICU Room    --> 1 ventilator and 1 oxygen cylinder
      else if (roomType === "ICU Room") {
        const oxygenCylinder = await equipmentsModel.findOne({
          equipmentName: "Oxygen Cylinders",
        });
        const ventilator = await equipmentsModel.findOne({
          equipmentName: "Ventilators",
        });
        if (!oxygenCylinder && !ventilator) {
          throw new Error(`Room of type ${roomType} not found.`);
        }
        if (isDelete) {
          oxygenCylinder.numberOfAvailableEquipments += 1;
          ventilator.numberOfAvailableEquipments += 1;
        } else {
          oxygenCylinder.numberOfAvailableEquipments -= 1;
          ventilator.numberOfAvailableEquipments -= 1;
        }
        await oxygenCylinder.save();
        await ventilator.save();
      }
    } catch (err) {
      throw new Error(`Error updating bed availability: ${err.message}`);
    }
  }
  async deletePatient(patientsModel, patientId, req, res) {
    try {
      const patient = await patientsModel.findById(patientId);
      await patientsModel.deleteOne({ _id: patientId });
      await this.updateRoomAvailability(roomsModel, patient.roomType, 1);
      await this.updateBedsAvailability(bedsModel, patient.roomType, true);
      await this.updateEquipmentsAvailability(
        equipmentsModel,
        patient.roomType,
        true
      );
      res.send("Discharge Procedure Is Completed Successfully");
    } catch (err) {
      res.status(500).send("Something Went Wrong");
    }
  }
}

module.exports = HospitalDataHandler;
