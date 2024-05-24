// calibrationActions.js
export const START_CALIBRATION = 'START_CALIBRATION';
export const STOP_CALIBRATION = 'STOP_CALIBRATION';
export const RESET_CALIBRATION = 'RESET_CALIBRATION';
export const UPDATE_CALIBRATION_STATUS = 'UPDATE_CALIBRATION_STATUS';

export const startCalibration = () => ({
  type: START_CALIBRATION,
});

export const stopCalibration = () => ({
  type: STOP_CALIBRATION,
});

export const resetCalibration = () => ({
  type: RESET_CALIBRATION,
});

export const updateCalibrationStatus = (status) => ({
  type: UPDATE_CALIBRATION_STATUS,
  payload: status,
});