// calibrationRecordsActions.js
export const FETCH_CALIBRATION_RECORDS_SUCCESS = 'FETCH_CALIBRATION_RECORDS_SUCCESS';
export const CREATE_CALIBRATION_RECORD_SUCCESS = 'CREATE_CALIBRATION_RECORD_SUCCESS';
export const UPDATE_CALIBRATION_RECORD_SUCCESS = 'UPDATE_CALIBRATION_RECORD_SUCCESS';
export const DELETE_CALIBRATION_RECORD_SUCCESS = 'DELETE_CALIBRATION_RECORD_SUCCESS';

export const fetchCalibrationRecordsSuccess = (records) => ({
  type: FETCH_CALIBRATION_RECORDS_SUCCESS,
  payload: records,
});

export const createCalibrationRecordSuccess = (record) => ({
  type: CREATE_CALIBRATION_RECORD_SUCCESS,
  payload: record,
});

export const updateCalibrationRecordSuccess = (record) => ({
  type: UPDATE_CALIBRATION_RECORD_SUCCESS,
  payload: record,
});

export const deleteCalibrationRecordSuccess = (recordId) => ({
  type: DELETE_CALIBRATION_RECORD_SUCCESS,
  payload: recordId,
});