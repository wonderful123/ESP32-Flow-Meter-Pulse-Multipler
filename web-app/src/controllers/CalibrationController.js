// CalibrationController.js
import CalibrationService from "services/CalibrationService";
import {
  fetchCalibrationRecords,
  createCalibrationRecord,
  updateCalibrationRecord,
  deleteCalibrationRecord,
} from "../store/actions/calibrationActions";

const CalibrationController = {
  getCalibrationMode: async (req, res) => {
    console.debug("CalibrationController getCalibrationMode called");
    try {
      const mode = await CalibrationService.getCalibrationMode();
      console.debug("Calibration mode fetched:", mode);
      res.status(200).json({ mode });
    } catch (error) {
      console.error("Error in getCalibrationMode:", error);
      res.status(500).json({ error: error.message });
    }
  },

  setCalibrationMode: async (req, res) => {
    try {
      const { mode } = req.body;
      await CalibrationService.setCalibrationMode(mode);
      res.status(200).json({ message: "Calibration mode updated successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCalibrationRecords: async (req, res) => {
    try {
      const calibrationRecords = await CalibrationService.getCalibrationRecords();
      res.store.dispatch(fetchCalibrationRecords(calibrationRecords));
      res.status(200).json(calibrationRecords);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  createCalibrationRecord: async (req, res) => {
    try {
      const calibrationRecord = await CalibrationService.createCalibrationRecord(req.body);
      res.store.dispatch(createCalibrationRecord(calibrationRecord));
      res.status(201).json(calibrationRecord);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  updateCalibrationRecord: async (req, res) => {
    try {
      const calibrationRecord = await CalibrationService.updateCalibrationRecord(req.params.id, req.body);
      res.store.dispatch(updateCalibrationRecord(calibrationRecord));
      res.status(200).json(calibrationRecord);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  deleteCalibrationRecord: async (req, res) => {
    try {
      await CalibrationService.deleteCalibrationRecord(req.params.id);
      res.store.dispatch(deleteCalibrationRecord(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
};

export default CalibrationController;
