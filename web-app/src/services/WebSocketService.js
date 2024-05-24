import config from "config";

const WebSocketService = {
  socket: null,
  reconnectDelay: config.websocket.reconnectDelay,
  maxReconnectAttempts: config.websocket.maxReconnectAttempts,
  reconnectAttempts: 0,
  url: '',
  handlers: {},
  connectionStatus: 'disconnected',
  messageQueue: [],

  connect: function () {
    const wsURL = process.env.WEBSOCKET_PORT || config.websocket.url;
    const wsPort = process.env.WEBSOCKET_PORT || config.websocket.port;
    this.socket = new WebSocket(`ws://${wsURL}:${wsPort}`);

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket is already connected or connecting");
      return;
    }

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.connectionStatus = 'connected';
      this.reconnectAttempts = 0;
      this.reconnectDelay = config.websocket.reconnectDelay;
      this.flushMessageQueue();
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const messageType = message.type;
        if (this.handlers[messageType]) {
          this.handlers[messageType].forEach(handler => handler(message));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected. Attempting to reconnect...");
      this.connectionStatus = 'disconnected';
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(this.url), this.reconnectDelay);
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 60000);
      } else {
        console.error("Maximum reconnection attempts reached. Giving up.");
        this.connectionStatus = 'failed';
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus = 'error';
    };
  },

  disconnect: function () {
    if (this.socket) {
      this.socket.close();
    }
  },

  sendMessage: function (message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected. Queueing the message.");
      this.messageQueue.push(message);
    }
  },

  registerHandler: function (messageType, handler) {
    if (!this.handlers[messageType]) {
      this.handlers[messageType] = [];
    }
    this.handlers[messageType].push(handler);
  },

  unregisterHandler: function (messageType, handler) {
    if (this.handlers[messageType]) {
      this.handlers[messageType] = this.handlers[messageType].filter(h => h !== handler);
    }
  },

  unregisterAllHandlers: function () {
    this.handlers = {};
  },

  getConnectionStatus: function () {
    return this.connectionStatus;
  },

  setURL: function (url) {
    this.url = url;
  },

  flushMessageQueue: function () {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  },
};

export default WebSocketService;