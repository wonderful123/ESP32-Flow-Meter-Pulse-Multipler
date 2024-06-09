// CalibrationRecords/Table/Table.js
import m from "mithril";
import CalibrationService from "services/CalibrationService";
import TableRow from "./TableRow";
import ConfirmationModal from "components/common/ConfirmationModal";
import TableHead from "./TableHead";
import { TableConfig } from "./TableConfig";
import { pulsesPerLiter, calibrationFactor } from "./Utils";

const Table = {
  oninit: function (vnode) {
    vnode.state.isDeleteModalOpen = false;
    vnode.state.recordToDelete = null;
    vnode.state.editingRecordId = null;
    vnode.state.records = [];
    vnode.state.sortColumn = TableConfig.defaultSortColumn;
    vnode.state.sortOrder = TableConfig.defaultSortOrder;

    this.fetchRecords();
  },

  fetchRecords: function () {
    CalibrationService.getCalibrationRecords()
      .then(records => {
        this.records = records;
        this.sortRecords();
        m.redraw();
      })
      .catch(error => {
        console.error("Error fetching calibration records:", error);
      });
  },

  sortRecords: function () {
    const { sortColumn, sortOrder } = this;
    this.records.sort((a, b) => {
      let valueA, valueB;

      if (sortColumn === "pulsesPerLiter") {
        valueA = pulsesPerLiter(a.pulseCount, a.targetOilVolume);
        valueB = pulsesPerLiter(b.pulseCount, b.targetOilVolume);
      } else if (sortColumn === "calibrationFactor") {
        valueA = parseFloat(calibrationFactor(a.targetOilVolume, a.observedOilVolume));
        valueB = parseFloat(calibrationFactor(b.targetOilVolume, b.observedOilVolume));
      } else {
        valueA = a[sortColumn];
        valueB = b[sortColumn];
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  },

  handleSort: function (column) {
    if (column.sortable) {
      if (this.sortColumn === column.key) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column.key;
        this.sortOrder = "asc";
      }
      this.sortRecords();
    }
  },

  openDeleteConfirmation: function (record) {
    this.isDeleteModalOpen = true;
    this.recordToDelete = record;
  },

  confirmDelete: async function () {
    try {
      await CalibrationService.deleteCalibrationRecord(this.recordToDelete.id);
      this.records = this.records.filter(record => record.id !== this.recordToDelete.id);
      this.isDeleteModalOpen = false;
      this.recordToDelete = null;
      m.redraw();
    } catch (error) {
      console.error("Failed to delete calibration record:", error);
    }
  },

  cancelDelete: function () {
    this.isDeleteModalOpen = false;
    this.recordToDelete = null;
  },

  startEditing: function (id) {
    this.editingRecordId = id;
  },

  cancelEditing: function () {
    this.editingRecordId = null;
  },

  saveEdits: function (editedRecord) {
    CalibrationService.updateCalibrationRecord(editedRecord.id, editedRecord)
      .then(() => {
        const index = this.records.findIndex(record => record.id === editedRecord.id);
        if (index !== -1) {
          this.records[index] = editedRecord;
          this.editingRecordId = null;
          m.redraw();
        }
      })
      .catch(error => {
        console.error("Failed to update calibration record:", error);
      });
  },

  view: function (vnode) {
    return m("div.table-container", [
      m("table.table.is-fullwidth.is-striped.is-hoverable", [
        m(TableHead, {
          columns: TableConfig.columns,
          sortColumn: this.sortColumn,
          sortOrder: this.sortOrder,
          onSort: column => this.handleSort(column),
        }),
        m(
          "tbody",
          this.records.map(record => {
            return m(TableRow, {
              record,
              isEditing: this.editingRecordId === record.id,
              onStartEditing: () => this.startEditing(record.id),
              onCancelEditing: () => this.cancelEditing(),
              onSaveEdits: editedRecord => this.saveEdits(editedRecord),
              onDelete: () => this.openDeleteConfirmation(record),
            });
          })
        ),
      ]),
      m(ConfirmationModal, {
        isOpen: this.isDeleteModalOpen,
        onConfirm: () => this.confirmDelete(),
        onCancel: () => this.cancelDelete(),
        title: "Delete Confirmation",
        message: "Are you sure you want to delete this calibration record?",
        confirmText: "Delete",
        cancelText: "Cancel",
      }),
    ]);
  },
};

export default Table;
