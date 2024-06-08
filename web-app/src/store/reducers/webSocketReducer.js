// websocketReducer.js
import {
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECTED,
  WEBSOCKET_ERROR,
  WEBSOCKET_MESSAGE_RECEIVED,
  WEBSOCKET_MESSAGE_SENT,
  CALIBRATION_MESSAGE_RECEIVED,
  CONFIGURATION_MESSAGE_RECEIVED,
  DIAGNOSTICS_MESSAGE_RECEIVED,
} from '../actions/websocketActions';

const initialState = {
  connected: false,
  error: null,
  lastMessage: null,
  calibrationData: null,
  configurationData: null,
  diagnosticsData: null,
};

const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case WEBSOCKET_CONNECTED:
      return {
        ...state,
        connected: true,
          error: null,
      };
    case WEBSOCKET_DISCONNECTED:
      return {
        ...state,
        connected: false,
      };
    case WEBSOCKET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case WEBSOCKET_MESSAGE_RECEIVED:
    case WEBSOCKET_MESSAGE_SENT:
      return {
        ...state,
        lastMessage: action.payload,
      };
    case CALIBRATION_MESSAGE_RECEIVED:
      return {
        ...state,
        calibrationData: action.payload,
      };
    case CONFIGURATION_MESSAGE_RECEIVED:
      return {
        ...state,
        configurationData: action.payload,
      };
    case DIAGNOSTICS_MESSAGE_RECEIVED:
      return {
        ...state,
        diagnosticsData: action.payload,
      };
    default:
      return state;
  }
};

export default websocketReducer;