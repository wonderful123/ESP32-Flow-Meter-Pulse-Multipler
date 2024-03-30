// FirmwareModel.js
// FirmwareModel.js
import m from "mithril";

const FirmwareModel = {
  currentVersion: "Fetching...",
  updateAvailable: null,
  updateStatus: "",
  isLoading: false,

  getFirmwareVersion: function () {
    FirmwareModel.isLoading = true;
    m.request({
      method: "GET",
      url: "http://localhost:3000/firmware-version",
    }).then((result) => {
      console.log(result)
      FirmwareModel.currentVersion = result.version;
    }).catch(() => {
      FirmwareModel.currentVersion = "Error fetching version";
    }).finally(() => {
      FirmwareModel.isLoading = false;
      m.redraw();
    });
  },

  checkForUpdate: function () {
    FirmwareModel.isLoading = true;
    // Simulate an asynchronous action for checking updates
    setTimeout(() => {
      FirmwareModel.updateAvailable = "Update to version X.Y.Z available";
      FirmwareModel.isLoading = false;
      m.redraw();
    }, 1000); // Adjust based on actual implementation
  },

  performOTAUpdate: function (url) {
    // You may need to adjust this function to properly handle OTA updates
    m.request({
      method: "POST",
      url: "http://localhost:3000/firmware-update",
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
};

export default FirmwareModel;