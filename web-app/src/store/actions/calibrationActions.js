// calibrationActions.js
import CalibrationService from '../../services/CalibrationService';
import CalibrationRecord from '../../models/CalibrationRecord';

export const START_CALIBRATION = 'START_CALIBRATION';
export const STOP_CALIBRATION = 'STOP_CALIBRATION';
export const RESET_CALIBRATION = 'RESET_CALIBRATION';

export const FETCH_CALIBRATION_RECORDS_REQUEST = 'FETCH_CALIBRATION_RECORDS_REQUEST';
export const FETCH_CALIBRATION_RECORDS_SUCCESS = 'FETCH_CALIBRATION_RECORDS_SUCCESS';
export const FETCH_CALIBRATION_RECORDS_FAILURE = 'FETCH_CALIBRATION_RECORDS_FAILURE';
export const CREATE_CALIBRATION_RECORD_REQUEST = 'CREATE_CALIBRATION_RECORD_REQUEST';
export const CREATE_CALIBRATION_RECORD_SUCCESS = 'CREATE_CALIBRATION_RECORD_SUCCESS';
export const CREATE_CALIBRATION_RECORD_FAILURE = 'CREATE_CALIBRATION_RECORD_FAILURE';
export const UPDATE_CALIBRATION_RECORD_REQUEST = 'UPDATE_CALIBRATION_RECORD_REQUEST';
export const UPDATE_CALIBRATION_RECORD_SUCCESS = 'UPDATE_CALIBRATION_RECORD_SUCCESS';
export const UPDATE_CALIBRATION_RECORD_FAILURE = 'UPDATE_CALIBRATION_RECORD_FAILURE';
export const DELETE_CALIBRATION_RECORD_REQUEST = 'DELETE_CALIBRATION_RECORD_REQUEST';
export const DELETE_CALIBRATION_RECORD_SUCCESS = 'DELETE_CALIBRATION_RECORD_SUCCESS';
export const DELETE_CALIBRATION_RECORD_FAILURE = 'DELETE_CALIBRATION_RECORD_FAILURE';

export const startCalibration = () => ({
  type: START_CALIBRATION,
});

export const stopCalibration = () => ({
  type: STOP_CALIBRATION,
});

export const resetCalibration = () => ({
  type: RESET_CALIBRATION,
});

export const fetchCalibrationRecords = () => async (dispatch) => {
  dispatch({
    type: FETCH_CALIBRATION_RECORDS_REQUEST
  });
  try {
    const records = await CalibrationService.getCalibrationRecords();
    const calibrationRecords = records.map(record => new CalibrationRecord().fromJSON(record));
    dispatch({
      type: FETCH_CALIBRATION_RECORDS_SUCCESS,
      payload: calibrationRecords
    });
  } catch (error) {
    dispatch({
      type: FETCH_CALIBRATION_RECORDS_FAILURE,
      payload: error.message
    });
  }
};

export const createCalibrationRecord = (data) => async (dispatch) => {
  dispatch({
    type: CREATE_CALIBRATION_RECORD_REQUEST
  });
  try {
    const record = await CalibrationService.createCalibrationRecord(data);
    const calibrationRecord = new CalibrationRecord().fromJSON(record);
    dispatch({
      type: CREATE_CALIBRATION_RECORD_SUCCESS,
      payload: calibrationRecord
    });
  } catch (error) {
    dispatch({
      type: CREATE_CALIBRATION_RECORD_FAILURE,
      payload: error.message
    });
  }
};

export const updateCalibrationRecord = (id, data) => async (dispatch) => {
  dispatch({
    type: UPDATE_CALIBRATION_RECORD_REQUEST
  });
  try {
    const record = await CalibrationService.updateCalibrationRecord(id, data);
    const calibrationRecord = new CalibrationRecord().fromJSON(record);
    dispatch({
      type: UPDATE_CALIBRATION_RECORD_SUCCESS,
      payload: calibrationRecord
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CALIBRATION_RECORD_FAILURE,
      payload: error.message
    });
  }
};

export const deleteCalibrationRecord = (id) => async (dispatch) => {
  dispatch({
    type: DELETE_CALIBRATION_RECORD_REQUEST
  });
  try {
    await CalibrationService.deleteCalibrationRecord(id);
    dispatch({
      type: DELETE_CALIBRATION_RECORD_SUCCESS,
      payload: id
    });
  } catch (error) {
    dispatch({
      type: DELETE_CALIBRATION_RECORD_FAILURE,
      payload: error.message
    });
  }
};