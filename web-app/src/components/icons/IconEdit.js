// IconEdit.js
import m from "mithril";
import BaseIcon from "./BaseIcon";

const IconEdit = {
  view: function (vnode) {
    return m(BaseIcon, {
      viewBox: "0 0 24 24", // Adjusted viewBox for consistent aspect ratio
      ...vnode.attrs
    }, [
      m("path", {
        fill: "currentColor",
        d: "M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      }),
      m("path", {
        fill: "currentColor",
        d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
      })
    ]);
  }
};

export default IconEdit;