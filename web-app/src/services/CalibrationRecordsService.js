// CalibrationRecordsService.js
import m from 'mithril';
import APIService from './APIService';
import {
  fetchCalibrationRecordsSuccess,
  createCalibrationRecordSuccess,
  updateCalibrationRecordSuccess,
  deleteCalibrationRecordSuccess
} from '../actions/calibrationRecordsActions';
import store from '../store/store';

const CalibrationRecordsService = {
  fetchCalibrationRecords: function () {
    return APIService.get('/calibrationRecords').then((records) => {
      store.dispatch(fetchCalibrationRecordsSuccess(records));
    });
  },

  createCalibrationRecord: function (record) {
    return APIService.post('/calibrationRecords', record).then((createdRecord) => {
      store.dispatch(createCalibrationRecordSuccess(createdRecord));
    });
  },

  updateCalibrationRecord: function (record) {
    return APIService.put(`/calibrationRecords/${record.id}`, record).then((updatedRecord) => {
      store.dispatch(updateCalibrationRecordSuccess(updatedRecord));
    });
  },

  deleteCalibrationRecord: function (recordId) {
    return APIService.delete(`/calibrationRecords/${recordId}`).then(() => {
      store.dispatch(deleteCalibrationRecordSuccess(recordId));
    });
  },
};

export default CalibrationRecordsService;