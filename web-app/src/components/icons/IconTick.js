// IconTick.js
import m from "mithril";
import BaseIcon from "./BaseIcon";

const IconTick = {
  view: function (vnode) {
    return m(BaseIcon, {
      viewBox: "0 0 24 24", // Adjusted viewBox for consistent aspect ratio
      ...vnode.attrs
    }, [
      m("path", {
        fill: "currentColor",
        d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
      })
    ]);
  }
};

export default IconTick;