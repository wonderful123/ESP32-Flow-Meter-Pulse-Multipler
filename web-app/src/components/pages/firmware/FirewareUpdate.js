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
      m("p#firmware-version",
        FirmwareModel.isLoading ?
        "Checking firmware version..." :
        "Current Firmware Version: " + FirmwareModel.currentVersion
      ),
      m("p#firmware-update",
        FirmwareModel.updateAvailable ?
        m("span.has-text-success", "Firmware Update Available: " + FirmwareModel.updateAvailable) :
        m("span.has-text-info", "No update available")
      ),
      m("p#firmware-update-status",
        FirmwareModel.updateStatus ?
        m("span.has-text-info", "Firmware Update Status: " + FirmwareModel.updateStatus) :
        null
      ),
      FirmwareModel.updateAvailable ?
      m("button.button.is-success", {
        onclick: () => {
          if (confirm("Are you sure you want to perform the firmware update?")) {
            FirmwareModel.performOTAUpdate();
            FirmwareModel.updateAvailable = null; // Clear the update available message
          }
        },
        disabled: FirmwareModel.isLoading,
      }, "Perform Update") :
      null,
      // Conditionally display the progress bar if an update is in progress
      FirmwareModel.progress > 0 ?
      m("progress.progress.is-small.is-primary", {
        max: "100",
        value: FirmwareModel.progress
      }, `${FirmwareModel.progress}%`) :
      null,
      // Display update notes if available
      FirmwareModel.updateAvailable && FirmwareModel.updateNotes ?
      m("div.content.mt-4", [
        m("h4", "Update Notes:"),
        m("p", FirmwareModel.updateNotes)
      ]) :
      null
    ]);
  }
};

const FirmwareUpdate = {
  oninit: function (vnode) {
    FirmwareModel.getFirmwareVersion();
  },
  view: function () {
    return m("div.box.mt-6", [
      m("h3.title.is-4", "Firmware Update"),
      m("div.columns", [
        m("div.column.is-narrow", [
          m("button.button.is-info", {
            onclick: () => {
              FirmwareModel.checkForUpdate();
              FirmwareModel.updateStatus = ""; // Clear the update status
            },
            disabled: FirmwareModel.isLoading,
          }, FirmwareModel.isLoading ? "Checking..." : "Check for Update")
        ]),
        m("div.column", [
          m(FirmwareStatusBox)
        ])
      ]),
      m("hr"),
      m("div.content", [
        m("h4", "Firmware Update Instructions:"),
        m("ol", [
          m("li", "Click the 'Check for Update' button to check if a new firmware version is available."),
          m("li", "If an update is available, review the update notes and click 'Perform Update' to start the update process."),
          m("li", "The progress bar will indicate the update progress. Do not interrupt the process until it's completed."),
          m("li", "Once the update is finished, the device will restart automatically with the new firmware.")
        ]),
        m("p.has-text-danger", "Warning: Do not power off or disconnect the device during the firmware update process.")
      ])
    ]);
  }
};

export default FirmwareUpdate;