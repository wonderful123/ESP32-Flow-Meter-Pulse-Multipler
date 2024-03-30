// VolumeInput.js
import m from "mithril";
import IconDrop from "../components/IconDrop";

const VolumeInput = {
  view: function (vnode) {
    return m("div.field", [
      m("label.label", {
        for: vnode.attrs.id
      }, vnode.attrs.label),
      m("div.control.has-icons-left", [
        m("input.input[type=number]", {
          id: vnode.attrs.id,
          name: vnode.attrs.name,
          step: "0.01",
          min: "0.01",
          placeholder: vnode.attrs.placeholder,
          required: true,
          // Use the value from vnode.attrs and update it on input
          value: vnode.attrs.value, // Bind the input value to the state
          oninput: (e) => vnode.attrs.onInput(e.target.value) // Notify parent component of changes
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