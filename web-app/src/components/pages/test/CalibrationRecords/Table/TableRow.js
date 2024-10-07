// CalibrationRecords/Table/TableRow.js
import m from "mithril";
import EditActions from "./EditActions";
import DeleteAction from "./DeleteAction";
import { calibrationFactor, pulsesPerLiter } from "./Utils";

const TableRow = {
  oninit: function (vnode) {
    vnode.state.editedRecord = { ...vnode.attrs.record };
  },
  view: function (vnode) {
    const { record, isEditing, onStartEditing, onCancelEditing, onSaveEdits, onDelete } = vnode.attrs;
    const { editedRecord } = vnode.state;

    if (isEditing) {
      return m("tr", [
        m(
          "td",
          m("input.input[type=number]", {
            value: editedRecord.oilTemperature,
            oninput: e => (editedRecord.oilTemperature = parseFloat(e.target.value)),
            step: "0.1",
          })
        ),
        m(
          "td",
          m("input.input[type=number]", {
            value: editedRecord.targetOilVolume,
            oninput: e => (editedRecord.targetOilVolume = parseFloat(e.target.value)),
            step: "0.1",
          })
        ),
        m(
          "td",
          m("input.input[type=number]", {
            value: editedRecord.observedOilVolume,
            oninput: e => (editedRecord.observedOilVolume = parseFloat(e.target.value)),
            step: "0.1",
          })
        ),
        m("td", pulsesPerLiter(editedRecord.pulseCount, editedRecord.targetOilVolume)),
        m("td", calibrationFactor(editedRecord.targetOilVolume, editedRecord.observedOilVolume)),
        m("td", editedRecord.timestamp),
        m("td.actions", [
          m(EditActions, {
            isEditing,
            onSave: () => onSaveEdits(editedRecord),
            onCancel: onCancelEditing,
          }),
        ]),
      ]);
    }

    return m("tr", [
      m("td", record.oilTemperature),
      m("td", record.targetOilVolume),
      m("td", record.observedOilVolume),
      m("td", pulsesPerLiter(record.pulseCount, record.targetOilVolume)),
      m("td", calibrationFactor(record.targetOilVolume, record.observedOilVolume)),
      m("td", new Date(record.timestamp).toLocaleString("en-AU", { "dateStyle": "short", "timeStyle": "short" })),
      m("td.actions", [
        m(EditActions, {
          isEditing,
          onEdit: onStartEditing,
        }),
        !isEditing &&
          m(DeleteAction, {
            record,
            onDelete,
          }),
      ]),
    ]);
  },
};

export default TableRow;
