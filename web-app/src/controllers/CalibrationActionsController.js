// CalibrationActionsController.js
import CalibrationActionsService from '../services/CalibrationActionsService';
import {
  startCalibration,
  stopCalibration,
  resetCalibration,
} from '../store/actions/calibrationActions';

const CalibrationActionsController = {
  startCalibration: async (req, res) => {
    try {
      await CalibrationActionsService.startCalibration();
      res.store.dispatch(startCalibration());
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  },

  stopCalibration: async (req, res) => {
    try {
      await CalibrationActionsService.stopCalibration();
      res.store.dispatch(stopCalibration());
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  },

  resetCalibration: async (req, res) => {
    try {
      await CalibrationActionsService.resetCalibration();
      res.store.dispatch(resetCalibration());
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  },
};

export default CalibrationActionsController;