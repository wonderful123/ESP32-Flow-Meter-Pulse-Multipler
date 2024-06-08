// CalibrationRecords/Table/TableRow.js
import m from 'mithril';
import EditActions from './EditActions';
import DeleteAction from './DeleteAction';

const calibrationFactor = (targetOilVolume, observedOilVolume) => {
  return (observedOilVolume / targetOilVolume * 100).toFixed(1) + '%';
};

const pulsesPerLiter = (pulseCount, targetOilVolume) => {
  return (pulseCount / targetOilVolume).toFixed(0);
}


const TableRow = {
  view: function (vnode) {
    const {
      record,
      onEdit,
      onDelete,
      onSave
    } = vnode.attrs;

    return m('tr', [
      m('td', record.oilTemperature),
      m('td', record.targetOilVolume),
      m('td', record.observedOilVolume),
      m('td', pulsesPerLiter(record.pulseCount, record.targetOilVolume)),
      m('td', calibrationFactor(record.targetOilVolume, record.observedOilVolume)),
      m('td', record.timestamp),
      m('td.actions', [
        m(DeleteAction, {
          record,
          onDelete
        }),
        m(EditActions, {
          record,
          onEdit,
          onSave
        })
      ])
    ]);
  }
};

export default TableRow;