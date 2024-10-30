// webSocketReducer.js

import {
  WEBSOCKET_CONNECTION_OPEN,
  WEBSOCKET_CONNECTION_CLOSE,
  WEBSOCKET_CONNECTION_ERROR,
  WEBSOCKET_MESSAGE_RECEIVED,
} from "../actions/webSocketActions";

// Initial State
const initialState = {
  isConnected: false,
  calibrationData: null,
  configurationData: null,
  diagnosticsData: null,
  error: null,
};

// WebSocket Reducer
const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case WEBSOCKET_CONNECTION_OPEN:
      return {
        ...state,
        isConnected: true,
        error: null, // Clear any errors on successful connection
      };

    case WEBSOCKET_CONNECTION_CLOSE:
      return {
        ...state,
        isConnected: false,
      };

    case WEBSOCKET_CONNECTION_ERROR:
      return {
        ...state,
        isConnected: false,
        error: action.payload, // Store the WebSocket error
      };

    case WEBSOCKET_MESSAGE_RECEIVED:
      if (!action.payload || !action.payload.type) {
        console.warn("Unexpected WebSocket message format:", action.payload);
        return state; // Return the current state if the message format is unexpected
      }
      switch (action.payload.type) {
        case "pulseUpdate":
          return {
            ...state,
            data: action.payload.data,
          };
        case "calibration":
          return {
            ...state,
            calibrationData: action.payload.data,
          };
        case "configuration":
          return {
            ...state,
            configurationData: action.payload.data,
          };
        case "diagnostics":
          return {
            ...state,
            diagnosticsData: action.payload.data,
          };
        default:
          console.warn("Unhandled WebSocket message type:", action.payload.type);
          return state;
      }

    default:
      return state;
  }
};

export default websocketReducer;
