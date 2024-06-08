// CalibrationRecords/Table/DeleteAction.js
import m from 'mithril';
import IconTrash from 'components/icons/IconTrash';

const DeleteAction = {
  view: function (vnode) {
    const {
      record,
      onDelete
    } = vnode.attrs;

    return m(IconTrash, {
      class: 'has-text-danger',
      'data-tooltip': 'Delete',
      onclick: () => onDelete(record)
    });
  }
};

export default DeleteAction;