// FirmwareModel.js
import m from "mithril";
import WebSocketService from "services/WebSocketService";

const FirmwareModel = {
  currentVersion: "Fetching...",
  updateAvailable: null,
  updateStatus: "",
  isLoading: false,
  progress: 0, // Initialize progress at 0%

  getFirmwareVersion: function () {
    FirmwareModel.isLoading = true;
    m.request({
        method: "GET",
        url: "api/firmware-version",
      })
      .then(() => {
        // The server will initiate the update check via WebSocket
        FirmwareModel.isLoading = false;
        m.redraw();
      })
      .catch(() => {
        FirmwareModel.currentVersion = "Error fetching version";
        FirmwareModel.isLoading = false;
        m.redraw();
      });
  },

  checkForUpdate: function () {
    // Send a WebSocket message to trigger the update check on the server
    FirmwareModel.isLoading = true;
    WebSocketService.sendMessage({
      action: "checkForUpdate"
    });
  },

  performOTAUpdate: function () {
    // Trigger the OTA update on the server
    m.request({
        method: "POST",
        url: "api/firmware-update",
      })
      .then(() => {
        // The server will initiate the OTA update process via WebSocket
        m.redraw();
      })
      .catch(() => {
        FirmwareModel.updateStatus = "Error performing OTA update";
        m.redraw();
      });
  },

  initWebSocket() {
    WebSocketService.registerHandler((message) => {
      switch (message.type) {
        case "status":
          FirmwareModel.updateStatus = message.message;
          break;
        case "progress":
          FirmwareModel.updateStatus = `Update Progress: ${message.percentage}%`;
          FirmwareModel.progress = message.percentage;
          break;
        case "error":
          FirmwareModel.updateStatus = `Error checking update: ${message.message}`;
          break;
        case "updateAvailable":
          FirmwareModel.updateAvailable = `Update to version ${message.newVersion} available.<br>Changes: ${message.changes}`;
          FirmwareModel.updateStatus = "";
          break;
        case "noUpdate":
          FirmwareModel.updateAvailable = null;
          FirmwareModel.updateStatus = message.message;
          break;
        case "updateCompleted":
          FirmwareModel.updateStatus = "Update completed";
          FirmwareModel.currentVersion = message.newVersion;
          break;
        default:
          console.log("Unhandled message type:", message.type);
      }
      m.redraw();
    });

    // Automatically connect; adjust URL as needed
    WebSocketService.connect('ws://' + window.location.hostname + '/ws');
  },
};

export default FirmwareModel;