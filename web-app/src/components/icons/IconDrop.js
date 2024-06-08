// IconDrop.js
import m from "mithril";
import BaseIcon from "./BaseIcon";

const IconDrop = {
  view: function (vnode) {
    return m(BaseIcon, {
      viewBox: "0 0 352 512",
      ...vnode.attrs
    }, [
      m("path", {
        fill: "currentColor",
        d: "M205.2 22.1c-7.9-28.8-49.4-30.1-58.4 0C100 179.9 0 222.7 0 333.9 0 432.4 78.7 512 176 512s176-79.7 176-178.1c0-111.8-99.8-153.3-146.8-311.8zM176 448c-61.8 0-112-50.3-112-112 0-8.8 7.2-16 16-16s16 7.2 16 16c0 44.1 35.9 80 80 80 8.8 0 16 7.2 16 16s-7.2 16-16 16z"
      })
    ]);
  }
};

export default IconDrop;