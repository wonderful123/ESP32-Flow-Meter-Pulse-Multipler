// CalibrationRecordsModel.js
// src/models/Calibration.js
import m from "mithril";
import StatusMessageService from "services/StatusMessageService";

const CalibrationRecordsModel = {
  records: [],
  loadRecords: function () {
    const apiUrl = "http://localhost:3000/calibration-records"; // Target API URL
    return m.request({
        method: "GET",
        url: apiUrl,
        withCredentials: true,
      })
      .then(function (result) {
        CalibrationRecordsModel.records = result;
      })
  },

  deleteRecord: function (id) {
    // Use the browser's confirm dialog for confirmation
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");
    if (!isConfirmed) {
      return; // Stop if the user cancels the action
    }

    StatusMessageService.setMessage("Deleting record...", "info");

    m.request({
      method: "DELETE",
      url: `http://localhost:3000/calibration-records/${id}`, // Adjust URL as needed
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