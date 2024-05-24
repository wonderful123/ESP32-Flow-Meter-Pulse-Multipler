// calibrationReducer.js
import {
  START_CALIBRATION,
  STOP_CALIBRATION,
  RESET_CALIBRATION,
  UPDATE_CALIBRATION_STATUS
} from '../actions/calibrationActions';

const initialState = {
  isCalibrating: false,
  calibrationStatus: 'idle',
};

const calibrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_CALIBRATION:
      return {
        ...state,
        isCalibrating: true,
      };
    case STOP_CALIBRATION:
      return {
        ...state,
        isCalibrating: false,
      };
    case RESET_CALIBRATION:
      return initialState;
    case UPDATE_CALIBRATION_STATUS:
      return {
        ...state,
        calibrationStatus: action.payload,
      };
    default:
      return state;
  }
};

export default calibrationReducer;