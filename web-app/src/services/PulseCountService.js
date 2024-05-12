// PulseCountService.js
import m from 'mithril';
import Stream from 'mithril/stream';
import WebSocketService from './WebSocketService';

class PulseCountService {
  constructor() {
    this.pulseCount = Stream();
    WebSocketService.registerHandler(this.handleMessage.bind(this));
  }

  destroy() {
    WebSocketService.unregisterHandler(this.handleMessage.bind(this));
  }

  handleMessage(message) {
    if (message.type === 'pulseCount') {
      this.pulseCount(message.data);
      console.log("Received pulse count:", message.data);
    }
  }

  getPulseCount() {
    return this.pulseCount;
  }
}

export default new PulseCountService();