// SelectedRecordModel.js
import m from "mithril";
import StatusMessageService from "services/StatusMessageService";

const SelectedRecordModel = {
  selectedRecordId: null,

  loadSelectedRecordId: function () {
    const apiUrl = "api/selected-record"; // Adjust URL as needed
    return m.request({
        method: "GET",
        url: apiUrl,
        withCredentials: true,
      })
      .then((response) => {
        SelectedRecordModel.selectedRecordId = response.id;
        return response.id;
      })
      .catch((error) => {
        console.error("Error loading selected record ID:", error);
        StatusMessageService.setMessage("Error loading selected record ID.", "error");
      });
  },

  setSelectedRecordId: function (id) {
    const apiUrl = "api/selected-record"; // Adjust URL as needed
    return m.request({
        method: "POST",
        url: apiUrl,
        body: {
          id: id
        },
        withCredentials: true,
      })
      .then((response) => {
        SelectedRecordModel.selectedRecordId = id;
        StatusMessageService.setMessage(response.message, "info");
      })
      .catch((error) => {
        console.error("Error setting selected record ID:", error);
        StatusMessageService.setMessage("Error setting selected record ID.", "error");
      });
  },
};

export default SelectedRecordModel;