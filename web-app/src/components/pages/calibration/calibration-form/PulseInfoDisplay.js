import m from "mithril";
import WebSocketService from "services/WebSocketService";

const PulseInfoDisplay = {
  oninit(vnode) {
    this.pulseCount = 0; // Initial state

    this.handleMessage = (message) => {
      // Assuming the message is already parsed JSON
      if (message.type === "pulseCount") {
        this.pulseCount = message.data; // Update state
        m.redraw(); // Trigger Mithril to redraw the component
      }
    };

    WebSocketService.registerHandler(this.handleMessage);
    WebSocketService.connect('ws://' + window.location.hostname + '/ws'); // Connect using the device's host
  },

  onremove(vnode) {
    WebSocketService.unregisterHandler(this.handleMessage);
  },

  view(vnode) {
    return m("div.field.pulse-field", [
      m("label.label.pulse-label", vnode.attrs.label),
      m("div.pulse-display", {
        id: vnode.attrs.displayId
      }, this.pulseCount) // Display the updated pulse count
    ]);
  }
};

export default PulseInfoDisplay;