// CalibrationRecords/Table/EditActions.js
import m from 'mithril';
import IconEdit from 'components/icons/IconEdit';
import IconTick from 'components/icons/IconTick';
import IconCancel from 'components/icons/IconCancel';

const EditActions = {
  isEditing: false,
  editedRecord: null,

  startEditing: function (vnode) {
    vnode.state.isEditing = true;
    vnode.state.editedRecord = {
      ...vnode.attrs.record
    };
  },

  cancelEditing: function (vnode) {
    vnode.state.isEditing = false;
    vnode.state.editedRecord = null;
  },

  saveEdits: function (vnode) {
    vnode.attrs.onSave(vnode.state.editedRecord);
    vnode.state.isEditing = false;
    vnode.state.editedRecord = null;
  },

  view: function (vnode) {
    const {
      isEditing,
      editedRecord
    } = vnode.state;

    if (isEditing) {
      return [
        m(IconTick, {
          'data-tooltip': 'Save changes',
          class: 'has-text-success',
          onclick: () => this.saveEdits(vnode)
        }),
        m(IconCancel, {
          class: 'has-text-warning',
          'data-tooltip': 'Cancel',
          onclick: () => this.cancelEditing(vnode)
        })
      ];
    } else {
      return m(IconEdit, {
        class: 'has-text-info',
        'data-tooltip': 'Edit',
        onclick: () => this.startEditing(vnode)
      });
    }
  }
};

export default EditActions;