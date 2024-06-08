// CalibrationRecords/Table/Table.js
import m from 'mithril';
import CalibrationService from 'services/CalibrationService';
import TableRow from './TableRow';
import ConfirmationModal from "components/common/ConfirmationModal";

const Table = {
  oninit: function (vnode) {
    vnode.state.isDeleteModalOpen = false;
    vnode.state.recordToDelete = null;
    vnode.state.records = [];

    CalibrationService.getCalibrationRecords()
      .then(records => {
        vnode.state.records = records;
        m.redraw();
      })
      .catch(error => {
        console.error('Error fetching calibration records:', error);
      });
  },

  openDeleteConfirmation: function (vnode, record) {
    vnode.state.isDeleteModalOpen = true;
    vnode.state.recordToDelete = record;
  },

  confirmDelete: async function (vnode) {
    try {
      await CalibrationService.deleteCalibrationRecord(vnode.state.recordToDelete.id);
      vnode.state.records = vnode.state.records.filter(record => record.id !== vnode.state.recordToDelete.id);
      vnode.state.isDeleteModalOpen = false;
      vnode.state.recordToDelete = null;
      m.redraw();
    } catch (error) {
      console.error('Failed to delete calibration record:', error);
    }
  },

  cancelDelete: function (vnode) {
    vnode.state.isDeleteModalOpen = false;
    vnode.state.recordToDelete = null;
  },

  editRecord: function (vnode, id) {
    const record = vnode.state.records.find(r => r.id === id);
    if (record) {
      console.log('Edit record:', record);
    }
  },

  view: function (vnode) {
    return m("div.table-container", [
      m("table.table.is-fullwidth.is-striped.is-hoverable", [
        m('thead', [
          m('tr', [
            m('th', 'Oil Temp (°C)'),
            m('th', 'Target (L)'),
            m('th', 'Observed (L)'),
            m('th', { 'data-tooltip': 'Flow meter pulses per liter of oil' }, 'Pulses/L', ),
            m('th', 'Calibration'),
            m('th', 'Time'),
            m('th', 'Actions'),
          ]),
        ]),
        m('tbody', vnode.state.records.map(record => {
          return m(TableRow, {
            record,
            onEdit: (id) => this.editRecord(vnode, id),
            onDelete: () => this.openDeleteConfirmation(vnode, record),
          });
        }))
      ]),
      m(ConfirmationModal, {
        isOpen: vnode.state.isDeleteModalOpen,
        onConfirm: () => this.confirmDelete(vnode),
        onCancel: () => this.cancelDelete(vnode),
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this calibration record?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      })
    ]);
  }
};

export default Table;