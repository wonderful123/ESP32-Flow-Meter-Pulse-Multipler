// CalibrationService.js
import APIService from './APIService';
import CalibrationRecord from 'store/models/CalibrationRecord';

const CalibrationService = {
  getCalibrationRecords: async () => {
    try {
      const response = await APIService.get("/calibration-records");
      return response;
    } catch (error) {
      throw error;
    }
  },

  createCalibrationRecord: async data => {
    try {
      const calibrationRecord = new CalibrationRecord(data);
      const response = await APIService.post("/calibration-records", calibrationRecord);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCalibrationRecord: async (id, data) => {
    try {
      const response = await APIService.put(`/calibration-records/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCalibrationRecord: async id => {
    try {
      await APIService.delete(`/calibration-records/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default CalibrationService;