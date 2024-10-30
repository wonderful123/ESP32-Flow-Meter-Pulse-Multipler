// BaseIcon.js
import m from "mithril";

const BaseIcon = {
  view: function (vnode) {
    const size = vnode.attrs.size || 20; // Default size is 20px

    return m("span", {
        style: `width: ${size}px; height: ${size}px;` + (vnode.attrs.style || ""),
        'data-tooltip': vnode.attrs['data-tooltip'],
        onclick: vnode.attrs.onclick
      },
      m("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: vnode.attrs.viewBox,
        class: vnode.attrs.class,
        width: size,
        height: size,
        style: "fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
      }, vnode.children)
    );
  }
};

export default BaseIcon;