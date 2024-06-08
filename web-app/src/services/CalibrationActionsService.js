// CalibrationActionsService.js
import m from 'mithril';
import APIService from './APIService';
import {
  startCalibrationSuccess,
  startCalibrationFailure,
  stopCalibrationSuccess,
  stopCalibrationFailure,
  resetCalibrationSuccess,
  resetCalibrationFailure,
} from '../store/actions/calibrationActions';

const CalibrationActionsService = {
  startCalibration: async () => {
    try {
      await APIService.post('/calibration/start');
      startCalibrationSuccess();
      m.redraw();
    } catch (error) {
      startCalibrationFailure(error);
      throw error;
    }
  },

  stopCalibration: async () => {
    try {
      await APIService.post('/calibration/stop');
      stopCalibrationSuccess();
      m.redraw();
    } catch (error) {
      stopCalibrationFailure(error);
      throw error;
    }
  },

  resetCalibration: async () => {
    try {
      await APIService.post('/calibration/reset');
      resetCalibrationSuccess();
      m.redraw();
    } catch (error) {
      resetCalibrationFailure(error);
      throw error;
    }
  },
};

export default CalibrationActionsService;