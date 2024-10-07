// webSocketActions.js

// Action Types
export const WEBSOCKET_MESSAGE_RECEIVED = "WEBSOCKET_MESSAGE_RECEIVED";
export const WEBSOCKET_CONNECTION_OPEN = "WEBSOCKET_CONNECTION_OPEN";
export const WEBSOCKET_CONNECTION_CLOSE = "WEBSOCKET_CONNECTION_CLOSE";
export const WEBSOCKET_CONNECTION_ERROR = "WEBSOCKET_CONNECTION_ERROR";

// Action Creators
export const websocketMessageReceived = message => ({
  type: WEBSOCKET_MESSAGE_RECEIVED,
  payload: message,
});

export const websocketConnectionOpen = () => ({
  type: WEBSOCKET_CONNECTION_OPEN,
});

export const websocketConnectionClose = () => ({
  type: WEBSOCKET_CONNECTION_CLOSE,
});

export const websocketConnectionError = error => ({
  type: WEBSOCKET_CONNECTION_ERROR,
});
