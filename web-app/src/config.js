// config.js
const config = {
  API: {
    baseURL: process.env.API_BASE_URL || 'http://pulse-scaler.local/api',
    version: process.env.API_VERSION || '1',
  },
  websocket: {
    url: process.env.WEBSOCKET_URL || 'ws://pulse-scaler.local',
    port: process.env.WEBSOCKET_PORT || 80,
    timeout: process.env.WEBSOCKET_TIMEOUT || 5000,
    maxReconnectAttempts: process.env.WEBSOCKET_MAX_RECONNECT_ATTEMPTS || 10,
    reconnectDelay: process.env.WEBSOCKET_RECONNECT_DELAY || 5000, // Add this property
  }
};

export default config;