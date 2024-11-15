// CalibrationRecords/Table/Table.js
import m from "mithril";
import CalibrationRecordsService from "services/CalibrationRecordsService";
import ErrorHandler from "services/ErrorHandler";
import ConfirmationModal from "components/common/ConfirmationModal";
import TableRow from "./TableRow";
import TableHead from "./TableHead";
import TableConfig from "./TableConfig";
import { pulsesPerLiter, calibrationFactor } from "./Utils";

class Table {
  constructor() {
    this.isDeleteModalOpen = false;
    this.recordToDelete = null;
    this.editingRecordId = null;
    this.records = [];
    this.sortColumn = TableConfig.defaultSortColumn;
    this.sortOrder = TableConfig.defaultSortOrder;
  }

  oninit(vnode) {
    this.fetchRecords();
  }

  async fetchRecords() {
    try {
      const response = await CalibrationRecordsService.getCalibrationRecords();
      if (response.message === "No calibration records available") {
        this.records = [];
      } else {
        this.records = response.data;
      }
      this.sortRecords();
    } catch (error) {
      ErrorHandler.handleError(error); // Only shows errors other than "no records"
    }
  }

  sortRecords() {
    this.records.sort((a, b) => {
      let valueA, valueB;

      if (this.sortColumn === "pulsesPerLiter") {
        valueA = pulsesPerLiter(a.pulseCount, a.targetOilVolume);
        valueB = pulsesPerLiter(b.pulseCount, b.targetOilVolume);
      } else if (this.sortColumn === "calibrationFactor") {
        valueA = parseFloat(calibrationFactor(a.targetOilVolume, a.observedOilVolume));
        valueB = parseFloat(calibrationFactor(b.targetOilVolume, b.observedOilVolume));
      } else {
        valueA = a[this.sortColumn];
        valueB = b[this.sortColumn];
      }

      if (valueA < valueB) return this.sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  handleSort(column) {
    if (column.sortable) {
      if (this.sortColumn === column.key) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column.key;
        this.sortOrder = "asc";
      }
      this.sortRecords();
    }
  }

  openDeleteConfirmation(record) {
    this.isDeleteModalOpen = true;
    this.recordToDelete = record;
  }

  async confirmDelete() {
    try {
      const recordId = this.recordToDelete.id;
      await CalibrationRecordsService.deleteCalibrationRecord(recordId);
      this.records = this.records.filter(record => record.id !== recordId);
      this.isDeleteModalOpen = false;
      this.recordToDelete = null;
      ErrorHandler.handleSuccess("Calibration record deleted successfully.");
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  cancelDelete() {
    this.isDeleteModalOpen = false;
    this.recordToDelete = null;
    m.redraw();
  }

  startEditing(id) {
    this.editingRecordId = id;
  }

  cancelEditing() {
    this.editingRecordId = null;
  }

  saveEdits(editedRecord) {
    CalibrationRecordsService.updateCalibrationRecord(editedRecord.id, editedRecord)
      .then(() => {
        const index = this.records.findIndex(record => record.id === editedRecord.id);
        if (index !== -1) {
          this.records[index] = editedRecord;
          this.editingRecordId = null;
          ErrorHandler.handleSuccess("Calibration record updated successfully.");
        }
      })
      .catch(error => {
        ErrorHandler.handleError(error);
      });
  }

  view() {
    const { sortColumn, sortOrder, records, editingRecordId, isDeleteModalOpen } = this;
    return m("div.table-container", [
      m("table.table", { class: "is-fullwidth is-striped is-hoverable" }, [
        m(TableHead, {
          columns: TableConfig.columns,
          sortColumn,
          sortOrder,
          onSort: this.handleSort.bind(this),
        }),
        records.length === 0
          ? m("tbody", m("tr", m("td", { colspan: TableConfig.columns.length, class: "has-text-centered" }, "No calibration records available.")))
          : m("tbody", records.map(record =>
            m(TableRow, {
              record,
              isEditing: editingRecordId === record.id,
              onStartEditing: () => this.startEditing(record.id),
              onCancelEditing: this.cancelEditing.bind(this),
              onSaveEdits: this.saveEdits.bind(this),
              onDelete: () => this.openDeleteConfirmation(record),
            })
          )),
      ]),
      m(ConfirmationModal, {
        isOpen: isDeleteModalOpen,
        onConfirm: this.confirmDelete.bind(this),
        onCancel: this.cancelDelete.bind(this),
        title: "Delete Confirmation",
        message: "Are you sure you want to delete this calibration record?",
        confirmText: "Delete",
        cancelText: "Cancel",
      }),
    ]);
  }
}

export default Table;
