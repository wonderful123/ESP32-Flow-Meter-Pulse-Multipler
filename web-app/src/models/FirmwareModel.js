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
    }).then((result) => {
      FirmwareModel.currentVersion = result.version;
      FirmwareModel.isLoading = false;
      m.redraw();
    }).catch(() => {
      FirmwareModel.currentVersion = "Error fetching version";
      FirmwareModel.isLoading = false;
      m.redraw();
    });
  },

  checkForUpdate: function () {
    // Assuming this triggers a check on the server which then sends a WebSocket message
    FirmwareModel.isLoading = true;
    WebSocketService.sendMessage({
      action: "checkForUpdate"
    });
  },

  performOTAUpdate: function (url) {
    // You may need to adjust this function to properly handle OTA updates
    m.request({
      method: "POST",
      url: "api/firmware-update",
      data: {
        url: url
      }, // Ensure your server expects this format
    }).then((result) => {
      FirmwareModel.updateStatus = result;
      m.redraw();
    }).catch(() => {
      FirmwareModel.updateStatus = "Error performing OTA update";
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
          this.updateStatus = `Error checking update: ${message.message}`;
          break;
        case "updateAvailable":
          this.updateAvailable = `Update to version ${message.newVersion} available. Changes: ${message.changes}`;
          this.updateStatus = "";
          break;
        case "noUpdate":
          this.updateAvailable = null;
          this.updateStatus = message.message;
          break;
        case "updateStarted":
          FirmwareModel.updateStatus = "Update started";
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
  }
};

export default FirmwareModel;