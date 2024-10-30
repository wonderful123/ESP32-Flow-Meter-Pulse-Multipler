import Stream from "mithril/stream";
import WebSocketService from "./WebSocketService";

class PulseCountService {
  constructor() {
    this.inputPulseStream = Stream(0);
    this.outputPulseStream = Stream(0);
    this.inputFrequencyStream = Stream(0);
    this.outputFrequencyStream = Stream(0);

    WebSocketService.registerHandler(this.handleMessage.bind(this));
  }

  destroy() {
    WebSocketService.unregisterHandler(this.handleMessage.bind(this));
  }

  handleMessage(message) {
    console.log(message);
    if (message.type === "pulseUpdate") {
      const { inputPulseCount, outputPulseCount, inputFrequency, outputFrequency } = message.data;
      this.inputPulseStream(inputPulseCount);
      this.outputPulseStream(outputPulseCount);
      this.inputFrequencyStream(inputFrequency);
      this.outputFrequencyStream(outputFrequency);
    }
  }

  getInputPulseCountStream() {
    return this.inputPulseStream;
  }

  getOutputPulseCountStream() {
    return this.outputPulseStream;
  }

  getInputFrequencyStream() {
    return this.inputFrequencyStream;
  }

  getOutputFrequencyStream() {
    return this.outputFrequencyStream;
  }

  getInputPulseCount() {
    return this.inputPulseStream();
  }

  getOutputPulseCount() {
    return this.outputPulseStream();
  }

  getInputFrequency() {
    return this.inputFrequencyStream();
  }

  getOutputFrequency() {
    return this.outputFrequencyStream();
  }
}

export default new PulseCountService();
