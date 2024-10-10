import m from 'mithril';
import IconEdit from 'components/icons/IconEdit';
import IconTick from 'components/icons/IconTick';
import IconCancel from 'components/icons/IconCancel';

const EditActions = {
  view: function (vnode) {
    const {
      isEditing,
      onEdit,
      onSave,
      onCancel
    } = vnode.attrs;

    if (isEditing) {
      return [
        m(IconTick, {
          'data-tooltip': 'Save changes',
          class: 'has-text-success',
          onclick: onSave
        }),
        m(IconCancel, {
          class: 'has-text-warning',
          'data-tooltip': 'Cancel',
          onclick: onCancel
        })
      ];
    } else {
      return m(IconEdit, {
        class: 'has-text-info',
        'data-tooltip': 'Edit',
        onclick: onEdit
      });
    }
  }
};

export default EditActions;