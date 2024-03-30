// PulseInfoDisplay.js
import m from "mithril";

const PulseInfoDisplay = {
  view: function (vnode) {
    return m("div.field.pulse-field", [
      m("label.label.pulse-label", vnode.attrs.label),
      m("div.pulse-display", {
        id: vnode.attrs.displayId
      }, vnode.attrs.value)
    ]);
  }
};

export default PulseInfoDisplay;
