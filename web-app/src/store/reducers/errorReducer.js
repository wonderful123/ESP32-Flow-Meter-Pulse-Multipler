// errorReducer.js
import {
  ADD_ERROR,
  CLEAR_ERRORS
} from '../actions/errorActions';

const initialState = {
  message: null,
  status: null,
  timestamp: null,
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ERROR:
      return {
        ...state,
        message: action.payload.message,
          status: action.payload.status,
          timestamp: action.payload.timestamp,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        message: null,
          status: null,
          timestamp: null,
      };
    default:
      return state;
  }
};

export default errorReducer;