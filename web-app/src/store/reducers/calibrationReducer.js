// Action Types
export const CALIBRATION_ACTION = "CALIBRATION_ACTION";
export const CALIBRATION_SUCCESS = "CALIBRATION_SUCCESS";
export const CALIBRATION_FAILURE = "CALIBRATION_FAILURE";

// Initial State
const initialState = {
  calibrating: false,
  calibrationData: null,
  error: null,
};

// Reducer
const calibrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case CALIBRATION_ACTION:
      return {
        ...state,
        calibrating: action.payload === "START",
        error: null, // Reset error when a new action starts
      };

    case CALIBRATION_SUCCESS:
      return {
        ...state,
        calibrating: action.payload === "START", // Continue calibration if start is successful
        error: null, // Clear any errors
      };

    case CALIBRATION_FAILURE:
      return {
        ...state,
        calibrating: false, // Stop calibrating on failure
        error: action.payload, // Store the error message
      };

    default:
      return state;
  }
};

export default calibrationReducer;
