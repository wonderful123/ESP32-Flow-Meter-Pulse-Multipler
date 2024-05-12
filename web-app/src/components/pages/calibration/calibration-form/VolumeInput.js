// VolumeInput.js
import m from "mithril";
import IconDrop from "icons/IconDrop";
import Tooltip from 'components/common/Tooltip';

const VolumeInput = {
  view: function (vnode) {
    const {
      label,
      units,
      ...attrs
    } = vnode.attrs;

    return m("div.field", [
      m("label.label", {
        for: attrs.id
      }, [
        label,
        ' ',
        m('span', `(${units})`),
        attrs.tooltip && m(Tooltip, {
          text: attrs.tooltip
        })
      ]),
      m("div.control.has-icons-left", [
        m("input.input[type=number]", {
          id: attrs.id,
          name: attrs.name,
          step: "0.1",
          min: "0.01",
          placeholder: attrs.placeholder,
          required: true,
          value: attrs.value,
          oninput: attrs.oninput
        }),
        m("span.icon.is-small.is-left", [
          m(IconDrop, {
            class: "icon-class",
            style: "width: 10px; height: auto;"
          }),
        ])
      ])
    ]);
  }
};

export default VolumeInput;