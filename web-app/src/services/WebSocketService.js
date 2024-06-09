import config from "config";
import store from "store/store";
import {
  websocketConnected,
  websocketDisconnected,
  websocketError,
  websocketMessageReceived,
  websocketMessageSent,
  websocketInvalidMessage,
} from "store/actions/webSocketActions";

const DEFAULT_CONFIG = {
  url: "ws://localhost",
  port: 8085,
  reconnectDelay: 1000,
  maxReconnectAttempts: 5,
  maxReconnectDelay: 60000,
};

const websocketConfig = {
  ...DEFAULT_CONFIG,
  ...config.websocket
};

const WebSocketService = {
  socket: null,
  reconnectAttempts: 0,
  messageQueue: [],

  connect() {
    if (this.isConnected() || this.isConnecting()) {
      console.log("WebSocket is already connected or connecting");
      return;
    }

    const {
      url,
      port
    } = websocketConfig;
    this.socket = new WebSocket(`${url}:${port}/ws`);
    console.log(`Connecting to WebSocket at ${url}:${port}/ws`);
    this.attachEventHandlers();
  },

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  },

  sendMessage(message) {
    if (this.isConnected()) {
      this.socket.send(JSON.stringify(message));
      store.dispatch(websocketMessageSent(message));
    } else {
      console.warn("WebSocket is not connected. Queueing the message.");
      this.messageQueue.push(message);
    }
  },

  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  },

  isConnecting() {
    return this.socket && this.socket.readyState === WebSocket.CONNECTING;
  },

  attachEventHandlers() {
    this.socket.onopen = this.handleOpen.bind(this);
    this.socket.onmessage = this.handleMessage.bind(this);
    this.socket.onclose = this.handleClose.bind(this);
    this.socket.onerror = this.handleError.bind(this);
  },

  handleOpen() {
    console.log("WebSocket connection established");
    this.reconnectAttempts = 0;
    store.dispatch(websocketConnected());
    this.flushMessageQueue();
  },

  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      store.dispatch(websocketMessageReceived(message));
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      store.dispatch(websocketInvalidMessage(event.data));
    }
  },

  handleClose() {
    console.log("WebSocket disconnected. Attempting to reconnect...");
    store.dispatch(websocketDisconnected());

    if (this.reconnectAttempts < websocketConfig.maxReconnectAttempts) {
      this.scheduleReconnect();
    } else {
      console.error("Maximum reconnection attempts reached. Giving up.");
    }
  },

  handleError(error) {
    console.error("WebSocket error:", error);
    store.dispatch(websocketError(error));

    if (error.code === "ECONNREFUSED") {
      console.error("WebSocket connection refused. Check if the server is running.");
    }
  },

  scheduleReconnect() {
    this.reconnectAttempts++;
    const reconnectDelay = Math.min(
      websocketConfig.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      websocketConfig.maxReconnectDelay
    );
    setTimeout(() => this.connect(), reconnectDelay);
  },

  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  },
};

export default WebSocketService;