// IconDrop.js
import m from "mithril";

const IconDrop = {
  view: function (vnode) {
    return m('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 352 512",
        class: "icon" + (vnode.attrs.class || ""), // Ensuring any passed class is applied
        style: vnode.attrs.style, // Applying any passed style
        fill: "currentColor" // This sets the SVG fill color to inherit from its parent
      },
      m('path', {
        d: "M205.2 22.1c-7.9-28.8-49.4-30.1-58.4 0C100 179.9 0 222.7 0 333.9 0 432.4 78.7 512 176 512s176-79.7 176-178.1c0-111.8-99.8-153.3-146.8-311.8zM176 448c-61.8 0-112-50.3-112-112 0-8.8 7.2-16 16-16s16 7.2 16 16c0 44.1 35.9 80 80 80 8.8 0 16 7.2 16 16s-7.2 16-16 16z"
      })
    );
  }
};

export default IconDrop;