// CalibrationTable.js
import m from "mithril";
import CalibrationTableRow from "./CalibrationTableRow";
import CalibrationSummaryRow from "./CalibrationSummaryRow";
import CalibrationRecordsModel from "models/CalibrationRecordsModel";
import CalibrationFactorModel from "models/CalibrationFactorModel";
import StatusMessageService from "services/StatusMessageService";
import ConfirmationModal from "components/common/ConfirmationModal";

const CalibrationTable = {
  selectedRowId: null,
  itemToDelete: null,
  isDeleteModalOpen: false,

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
    } else {
      this.selectedRowId = id;
      const selectedRecord = CalibrationRecordsModel.records.find(record => record.id === id);
      if (selectedRecord) {
        CalibrationFactorModel.setCalibrationFactor(selectedRecord.calibrationFactor);
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
          m("tr", ["Set As Calibration", "ID", "Target Volume (L)", "Observed Volume (L)", "Pulses per Litre", "Volume Deviation (%)", "Actions"].map(header => m("th", header)))
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