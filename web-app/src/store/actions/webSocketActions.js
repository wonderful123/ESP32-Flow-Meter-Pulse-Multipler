// websocketActions.js
export const WEBSOCKET_CONNECTED = 'WEBSOCKET_CONNECTED';
export const WEBSOCKET_DISCONNECTED = 'WEBSOCKET_DISCONNECTED';
export const WEBSOCKET_ERROR = 'WEBSOCKET_ERROR';
export const WEBSOCKET_MESSAGE_RECEIVED = 'WEBSOCKET_MESSAGE_RECEIVED';
export const WEBSOCKET_MESSAGE_SENT = 'WEBSOCKET_MESSAGE_SENT';
export const WEBSOCKET_INVALID_MESSAGE = 'WEBSOCKET_INVALID_MESSAGE';

export const CALIBRATION_MESSAGE_RECEIVED = 'CALIBRATION_MESSAGE_RECEIVED';
export const CONFIGURATION_MESSAGE_RECEIVED = 'CONFIGURATION_MESSAGE_RECEIVED';
export const DIAGNOSTICS_MESSAGE_RECEIVED = 'DIAGNOSTICS_MESSAGE_RECEIVED';

export const websocketConnected = () => ({
  type: WEBSOCKET_CONNECTED,
});

export const websocketDisconnected = () => ({
  type: WEBSOCKET_DISCONNECTED,
});

export const websocketError = (error) => ({
  type: WEBSOCKET_ERROR,
  payload: error,
});

export const websocketMessageReceived = (message) => ({
  type: WEBSOCKET_MESSAGE_RECEIVED,
  payload: message,
});

export const websocketMessageSent = (message) => ({
  type: WEBSOCKET_MESSAGE_SENT,
  payload: message,
});

export const calibrationMessageReceived = (calibrationData) => ({
  type: CALIBRATION_MESSAGE_RECEIVED,
  payload: calibrationData,
});

export const configurationMessageReceived = (configurationData) => ({
  type: CONFIGURATION_MESSAGE_RECEIVED,
  payload: configurationData,
});

export const diagnosticsMessageReceived = (diagnosticsData) => ({
  type: DIAGNOSTICS_MESSAGE_RECEIVED,
  payload: diagnosticsData,
});

export const websocketInvalidMessage = (message) => ({
  type: WEBSOCKET_INVALID_MESSAGE,
  payload: message,
});