// config.js
const config = {
  API: {
    baseURL: 'http://localhost',
    port: 80,
    prefix: 'api',
    version: 'v1',
  },
  websocket: {
    url: 'ws://localhost',
    port: 80,
    timeout: 5000,
    maxReconnectAttempts: 10,
    reconnectDelay: 5000,
  }
};

export default config;