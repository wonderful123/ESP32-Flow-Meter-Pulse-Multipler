// CalibrationRecordsModel.js
import m from "mithril";
import StatusMessageService from "services/StatusMessageService";

const CalibrationRecordsModel = {
  records: [],
  loadRecords: function () {
    const apiUrl = "api/calibration-records"; // Target API URL
    return m.request({
        method: "GET",
        url: apiUrl,
        withCredentials: true,
      })
      .then(function (result) {
        CalibrationRecordsModel.records = result;
      })
  },

    saveRecord: function (data) {
      return m.request({
        method: "POST",
        url: "api/calibration-records",
        body: data,
        withCredentials: true,
      }).then(function (result) {
        StatusMessageService.setMessage("Calibration record saved successfully.", "success");
        CalibrationRecordsModel.loadRecords(); // Refresh the list
      }).catch(function (error) {
        console.error('Error:', error);
        StatusMessageService.setMessage("Failed to save the record. Please try again.", "error");
      });
    },

  deleteRecord: function (id) {
    StatusMessageService.setMessage("Deleting record...", "info");

    m.request({
      method: "DELETE",
      url: `api/calibration-records/${id}`, // Adjust URL as needed
      withCredentials: true, // For sending cookies in cross-origin requests, if needed
    }).then(() => {
      // On success, update the UI and show a success message
      StatusMessageService.setMessage("Record deleted successfully.", "success");
      this.loadRecords(); // Reload the list of records to reflect the deletion
    }).catch((error) => {
      // Handle any errors
      console.error('Error:', error);
      StatusMessageService.setMessage("Failed to delete the record. Please try again.", "error");
    });
  }
};

export default CalibrationRecordsModel;