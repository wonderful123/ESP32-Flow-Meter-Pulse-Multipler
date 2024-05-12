// Tooltip.js
import m from "mithril";

const Tooltip = {
  view(vnode) {
    const {
      text,
      ...attrs
    } = vnode.attrs;
    return m('span.tooltip', attrs, [
      m('i.fas.fa-question-circle'),
      m('span.tooltiptext', text)
    ]);
  }
};

export default Tooltip;