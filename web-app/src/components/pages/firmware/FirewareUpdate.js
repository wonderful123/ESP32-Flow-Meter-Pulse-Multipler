// FirmwareUpdate.js
import m from "mithril";
import FirmwareModel from "models/FirmwareModel";

const FirmwareStatusBox = {
  oninit: function (vnode) {
    FirmwareModel.getFirmwareVersion();
    FirmwareModel.initWebSocket(); // Initialize WebSocket connection and handling
  },

  view: function () {
    return m("div.box", [
      m("p#firmware-version", FirmwareModel.isLoading ? "Checking firmware version..." : "Current Firmware Version: " + FirmwareModel.currentVersion),
      m("p#firmware-update", "Firmware Update Available: " + (FirmwareModel.updateAvailable || "No update available")),
      m("p#firmware-update-status", "Firmware Update Status: " + FirmwareModel.updateStatus),
      FirmwareModel.updateAvailable ? m("button.button.is-success", {
        onclick: FirmwareModel.performOTAUpdate,
      }, "Perform Update") : null,
      // Conditionally display the progress bar if an update is in progress
      FirmwareModel.progress > 0 ? m("progress.progress.is-small.is-primary", {
        max: "100",
        value: FirmwareModel.progress
      }, `${FirmwareModel.progress}%`) : null
    ]);
  }
};

const FirmwareUpdate = {
  view: function () {
    return m("div.box.mt-6", [
      m("button.button.is-info.is-fullwidth", {
        onclick: FirmwareModel.checkForUpdate,
        disabled: FirmwareModel.isLoading,
      }, FirmwareModel.isLoading ? "Checking..." : "Check for firmware update"),
      m(FirmwareStatusBox),
    ]);
  }
};

export default FirmwareUpdate;