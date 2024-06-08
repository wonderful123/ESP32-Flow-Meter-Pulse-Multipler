// config.js
const config = {
  API: {
    baseURL: 'http://localhost',
    port: 3000,
    prefix: 'api',
    version: 'v1',
  },
  websocket: {
    url: 'ws://locahost',
    port: 8085,
    timeout: 5000,
    maxReconnectAttempts: 10,
    reconnectDelay: 5000,
  }
};

export default config;