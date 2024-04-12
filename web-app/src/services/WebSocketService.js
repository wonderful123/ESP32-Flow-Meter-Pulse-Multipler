// WebSocketService.js
class WebSocketService {
  constructor() {
    this.socket = null;
    this.handlers = [];
    this.reconnectDelay = 5000; // Initial reconnect delay
    this.url = ''; // Store the last used URL for reconnections
  }

  connect(url) {
    this.url = url; // Remember URL for reconnection attempts
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket is already connected or connecting");
      return;
    }

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectDelay = 5000; // Reset reconnect delay on successful connection
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected. Attempting to reconnect...");
      setTimeout(() => this.attemptReconnect(), this.reconnectDelay);
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 60000); // Cap at 1 minute
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handlers.forEach(handler => handler(message));
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  attemptReconnect() {
    console.log("Attempting to reconnect...");
    this.manualReconnect();
  }

  manualReconnect() {
    console.log("Manual reconnection triggered");
    this.reconnectDelay = 5000; // Optionally reset delay
    if (this.socket) {
      this.socket.close(); // Ensure the existing connection is closed before reconnecting
    }
    this.connect(this.url);
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected.");
    }
  }

  registerHandler(handler) {
    this.handlers.push(handler);
  }

  unregisterHandler(handler) {
    this.handlers = this.handlers.filter(h => h !== handler);
  }

  getConnectionStatus() {
    return this.socket ? this.socket.readyState : WebSocket.CLOSED;
  }
}

export default new WebSocketService();