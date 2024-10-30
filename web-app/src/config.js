// config.js
const config = {
  API: {
    baseURL: API_BASE_URL, // From webpack using define plugin
    port: 80,
    prefix: "api",
    version: "v1",
  },
  websocket: {
    url: WEBSOCKET_URL,
    port: WEBSOCKET_PORT,
    timeout: 5000,
    maxReconnectAttempts: 10,
    reconnectDelay: 5000,
  },
};

export default config;