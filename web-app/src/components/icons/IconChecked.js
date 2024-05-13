// IconChecked.js
import m from "mithril";

const IconChecked = {
  view: function (vnode) {
    return m("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 448 512",
        class: "icon" + (vnode.attrs.class || ""), // Ensuring any passed class is applied
        style: vnode.attrs.style, // Apply any passed style
        fill: "currentColor", // Ensure the SVG fill color inherits from its parent
      },
      m("path", {
        d: "M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
      })
    );
  }
};

export default IconChecked;