import m from "mithril";

const StatusNotification = {
  view(vnode) {
    const { message, statusClass } = vnode.attrs;
    return message
      ? m(
          "div",
          {
            class: `notification ${statusClass}`,
          },
          [m("div", { class: "notification-label" }, "Status:"), m("span", message)]
        )
      : null;
  },
};

export default StatusNotification;
