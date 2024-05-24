// CalibrationTable.js
import m from "mithril";
import CalibrationTableRow from "./CalibrationTableRow";
import CalibrationSummaryRow from "./CalibrationSummaryRow";
import CalibrationRecordsModel from "models/CalibrationRecordsModel";
import SelectedRecordModel from "models/SelectedRecordModel";
import CalibrationFactorModel from "models/CalibrationFactorModel";
import StatusMessageService from "services/StatusMessageService";
import ConfirmationModal from "components/common/ConfirmationModal";

const CalibrationTable = {
  selectedRowId: null,
  itemToDelete: null,
  isDeleteModalOpen: false,

  oninit: function (vnode) {
    SelectedRecordModel.loadSelectedRecordId().then((selectedRecordId) => {
      this.selectedRowId = selectedRecordId;
      m.redraw(); // Redraw the component to reflect the selected row
    });
  },

  openDeleteModal: function (item) {
    this.itemToDelete = item;
    this.isDeleteModalOpen = true;
  },

  closeDeleteModal: function () {
    this.itemToDelete = null;
    this.isDeleteModalOpen = false;
  },

  confirmDelete: function () {
    if (this.itemToDelete) {
      this.deleteRecord(this.itemToDelete.id);
      this.closeDeleteModal();
    }
  },
  selectRow: function (id) {
    // Toggle selection: if the row is already selected, deselect it
    if (this.selectedRowId === id) {
      this.selectedRowId = null;
      StatusMessageService.setMessage("Default calibration factor restored.", "success");
      SelectedRecordModel.setSelectedRecordId(-1); // Unset the selected record ID on the backend
    } else {
      this.selectedRowId = id;
      SelectedRecordModel.setSelectedRecordId(id); // Set the selected record ID on the backend
      const selectedRecord = CalibrationRecordsModel.records.find(record => record.id === id);
      if (selectedRecord) {
        // Calculate the calibration factor based on the selected record
        const {
          targetVolume,
          observedVolume
        } = selectedRecord;
        const calibrationFactor = observedVolume / targetVolume;
        // Set the calibration factor and display a success message
        CalibrationFactorModel.setCalibrationFactor(calibrationFactor);
        StatusMessageService.setMessage(`Calibration factor updated`, "success");
      } else {
        // Handle deselection or resetting the factor to a default
        CalibrationFactorModel.setCalibrationFactor(null); // or a default value
        StatusMessageService.setMessage("Default calibration factor restored.", "success");
      }
      m.redraw();
    }
  },

  deleteRecord: function (id) {
    console.log(`Delete record ${id}`)
    CalibrationRecordsModel.deleteRecord(id);
  },

  view: function (vnode) {
    const {
      calibrations
    } = vnode.attrs;
    return m("div.table-container", [
      m("table.table.is-fullwidth.is-striped.is-hoverable", [
        m("thead",
          m("tr", ["Set As Calibration", "Target Volume (L)", "Observed Volume (L)", "Pulses per Litre", "Volume Deviation (%)", "Actions"].map(header => m("th", header)))
        ),
        m("tbody", [
          calibrations.map(item => m(CalibrationTableRow, {
            item: item,
            isSelected: this.selectedRowId === item.id,
            onSelect: this.selectRow.bind(this),
            onDelete: () => this.openDeleteModal(item)
          })),
          calibrations.length >= 2 && m(CalibrationSummaryRow, {
            calibrations: calibrations,
            isSelected: this.selectedRowId === "average",
            onSelect: () => this.selectRow("average")
          })
        ])
      ]),
      m(ConfirmationModal, {
        isOpen: this.isDeleteModalOpen,
        onConfirm: this.confirmDelete.bind(this),
        onCancel: this.closeDeleteModal.bind(this),
        title: "Confirm Deletion",
        message: "Are you sure you want to delete this calibration record?",
        confirmText: "Delete",
        cancelText: "Cancel",
      }),
    ]);
  }
};

export default CalibrationTable;