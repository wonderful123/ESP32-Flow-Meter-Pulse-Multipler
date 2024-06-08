// calibrationReducer.js
import {
  START_CALIBRATION,
  STOP_CALIBRATION,
  RESET_CALIBRATION,
  FETCH_CALIBRATION_RECORDS_REQUEST,
  FETCH_CALIBRATION_RECORDS_SUCCESS,
  FETCH_CALIBRATION_RECORDS_FAILURE,
  CREATE_CALIBRATION_RECORD_REQUEST,
  CREATE_CALIBRATION_RECORD_SUCCESS,
  CREATE_CALIBRATION_RECORD_FAILURE,
  UPDATE_CALIBRATION_RECORD_REQUEST,
  UPDATE_CALIBRATION_RECORD_SUCCESS,
  UPDATE_CALIBRATION_RECORD_FAILURE,
  DELETE_CALIBRATION_RECORD_REQUEST,
  DELETE_CALIBRATION_RECORD_SUCCESS,
  DELETE_CALIBRATION_RECORD_FAILURE,
} from '../actions/calibrationActions';

const initialState = {
  calibrating: false,
  calibrationData: {
    startPulseCount: 0,
    startTemperature: 0,
    endPulseCount: 0,
    endTemperature: 0,
    targetOilVolume: 0,
    observedOilVolume: 0,
  },
  calibrationRecord: null,
  error: null,
};

const calibrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CALIBRATION_RECORDS_REQUEST:
    case CREATE_CALIBRATION_RECORD_REQUEST:
    case UPDATE_CALIBRATION_RECORD_REQUEST:
    case DELETE_CALIBRATION_RECORD_REQUEST:
      return {
        ...state,
        loading: true,
          error: null,
      };
    case FETCH_CALIBRATION_RECORDS_SUCCESS:
      return {
        ...state,
        records: action.payload,
          loading: false,
          error: null,
      };
    case CREATE_CALIBRATION_RECORD_SUCCESS:
      return {
        ...state,
        records: [...state.records, action.payload],
          loading: false,
          error: null,
      };
    case UPDATE_CALIBRATION_RECORD_SUCCESS:
      return {
        ...state,
        records: state.records.map(record =>
            record.id === action.payload.id ? action.payload : record
          ),
          loading: false,
          error: null,
      };
    case DELETE_CALIBRATION_RECORD_SUCCESS:
      return {
        ...state,
        records: state.records.filter(record => record.id !== action.payload),
          loading: false,
          error: null,
      };
    case FETCH_CALIBRATION_RECORDS_FAILURE:
    case CREATE_CALIBRATION_RECORD_FAILURE:
    case UPDATE_CALIBRATION_RECORD_FAILURE:
    case DELETE_CALIBRATION_RECORD_FAILURE:
      return {
        ...state,
        loading: false,
          error: action.payload,
      };
    default:
      return state;
  }
};

export default calibrationReducer;