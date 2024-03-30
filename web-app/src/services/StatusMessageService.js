// StatusMessageService.js
// src/services/StatusMessageService.js
import m from "mithril";

let message = "Ready to calibrate.";
let messageType = "info"; // Default message type

const StatusMessageService = {
  getMessage: () => ({
    text: message,
    type: messageType
  }),
  setMessage: (newMessage, newType = "info") => {
    message = newMessage;
    messageType = newType;
    m.redraw(); // Trigger redraw to update the UI
  },
  clearMessage: () => {
    message = "";
    messageType = "info";
    m.redraw();
  }
};

export default StatusMessageService;