// IconUnchecked.js
import m from "mithril";

const IconUnchecked = {
  view: function (vnode) {
    return m("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 448 512",
        class: "icon" + (vnode.attrs.class || ""), // Ensuring any passed class is applied
        style: vnode.attrs.style, // Apply any passed style
        fill: "currentColor", // Ensure the SVG fill color inherits from its parent
      },
      m("path", {
        d: "M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
      })
    );
  }
};

export default IconUnchecked;