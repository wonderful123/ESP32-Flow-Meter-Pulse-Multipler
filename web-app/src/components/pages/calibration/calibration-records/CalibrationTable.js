// CalibrationTable.js
import m from "mithril";
import CalibrationTableRow from "./CalibrationTableRow";
import CalibrationRecordsModel from "models/CalibrationRecordsModel";
import CalibrationFactorModel from "models/CalibrationFactorModel";
import StatusMessageService from "services/StatusMessageService";

const CalibrationTable = {
  selectedRowId: null,
  selectRow: function (id) {
    // Toggle selection: if the row is already selected, deselect it
    if (this.selectedRowId === id) {
      this.selectedRowId = null;
      StatusMessageService.setMessage("Default calibration factor restored.", "info");
    } else {
      this.selectedRowId = id;
      const selectedRecord = CalibrationRecordsModel.records.find(record => record.id === id);
      console.log("id: ${id} selectedRecord: ${selectedRecord.calibrationFactor}");
      if (selectedRecord) {
        CalibrationFactorModel.setCalibrationFactor(selectedRecord.calibrationFactor);
      } else {
        // Handle deselection or resetting the factor to a default
        CalibrationFactorModel.setCalibrationFactor(null); // or a default value
        StatusMessageService.setMessage("Default calibration factor restored.", "info");
      }

      m.redraw();
    }
  },

  deleteRecord: function (id) {
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");
    if (isConfirmed) {
      CalibrationRecordsModel.deleteRecord(id);
    }
  },

  view: function (vnode) {
    const {
      calibrations
    } = vnode.attrs;
    return m("div.table-container", [
      m("table.table.is-fullwidth.is-striped.is-hoverable", [
        m("thead",
          m("tr", ["Select", "ID", "Target Volume", "Observed Volume", "Pulses per Litre", "Volume Deviation (%)", "Actions"].map(header => m("th", header)))
        ),
        m("tbody",
          calibrations.map(item =>
            m(CalibrationTableRow, {
              item: item,
              isSelected: this.selectedRowId === item.id,
              onSelect: this.selectRow.bind(this),
              onDelete: this.deleteRecord.bind(this)
            })
          )
        )
      ])
    ]);
  }
};

export default CalibrationTable;