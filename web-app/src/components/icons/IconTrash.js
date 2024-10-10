// IconTrash.js
import m from "mithril";
import BaseIcon from "./BaseIcon";

const IconTrash = {
  view: function (vnode) {
    return m(BaseIcon, {
      viewBox: "0 0 24 24", // Adjusted viewBox for consistent aspect ratio
      ...vnode.attrs
    }, [
      m("path", {
        fill: "currentColor",
        d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      })
    ]);
  }
};

export default IconTrash;