import m from 'mithril';
import WebSocketService from './WebSocketService';
import {
  startCalibration,
  stopCalibration,
  resetCalibration,
  updateCalibrationStatus
} from '../actions/calibrationActions';
import store from '../store/store';

const CalibrationProcessService = {
  startCalibration: function () {
    return m.request({
      method: 'POST',
      url: '/calibration/start',
    }).then(() => {
      store.dispatch(startCalibration());
    });
  },

  stopCalibration: function () {
    return m.request({
      method: 'POST',
      url: '/calibration/stop',
    }).then(() => {
      store.dispatch(stopCalibration());
    });
  },

  resetCalibration: function () {
    return m.request({
      method: 'POST',
      url: '/calibration/reset',
    }).then(() => {
      store.dispatch(resetCalibration());
    });
  },

  getCalibrationStatus: function () {
    return m.request({
      method: 'GET',
      url: '/calibration/status',
    });
  },

  subscribeToCalibrationUpdates: function (handler) {
    WebSocketService.registerHandler('calibrationUpdate', (message) => {
      store.dispatch(updateCalibrationStatus(message.status));
      handler(message);
    });
  },

  unsubscribeFromCalibrationUpdates: function (handler) {
    WebSocketService.unregisterHandler('calibrationUpdate', handler);
  },
};

export default CalibrationProcessService;