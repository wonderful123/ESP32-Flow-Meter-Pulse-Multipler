// PulseCountService.js
import Stream from 'mithril/stream';
import WebSocketService from './WebSocketService';

class PulseCountService {
  constructor() {
    this.pulseCount = Stream(0); // Initialize pulseCount as a stream with a default value of 0
    WebSocketService.registerHandler(this.handleMessage.bind(this));
  }

  destroy() {
    WebSocketService.unregisterHandler(this.handleMessage.bind(this));
  }

  handleMessage(message) {
    if (message.type === 'pulseCount') {
      this.pulseCount(message.data); // Update the pulseCount stream with the new value
    }
  }

  getPulseCount() {
    return this.pulseCount;
  }
}

export default new PulseCountService();