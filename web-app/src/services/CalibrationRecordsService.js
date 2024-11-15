// CalibrationRecordsService.js

import APIService from "./APIService";
import CalibrationRecord from "store/models/CalibrationRecord";

const CalibrationRecordsService = {
  getCalibrationRecords: async () => {
    try {
      const response = await APIService.get("/calibration-records");

      if (response.message === "No calibration records available") {
        return { data: [], message: response.message };
      }

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
      let calibrationRecord = new CalibrationRecord(data);
      calibrationRecord.body = data;
      const response = await APIService.put(`/calibration-records/${id}`, calibrationRecord);
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

export default CalibrationRecordsService;
