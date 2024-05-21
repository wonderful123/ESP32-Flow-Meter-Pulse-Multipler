// ConfirmationModal.js
import m from "mithril";

const ConfirmationModal = {
  onConfirm: null,
  title: "",
  message: "",
  confirmText: "",
  cancelText: "",

  handleKeyDown: function (event) {
    if (event.key === "Escape") {
      this.props.onCancel();
    }
  },

  handleClose: function (event) {
    console.log('event', event);
    this.props.onCancel();
  },

  oncreate: function (vnode) {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  },

  onremove: function (vnode) {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  },

  view: function (vnode) {
    const {
      isOpen,
      onConfirm,
      onCancel,
      title,
      message,
      confirmText,
      cancelText
    } = vnode.attrs;

    if (!isOpen) return null;

    const isActive = isOpen ? ".is-active" : "";

    return m(`.modal${isActive}`, [
      m(".modal-background", {
        onclick: onCancel
      }),
      m(".modal-card", [
        m("header.modal-card-head", [
          m("p.modal-card-title", title),
          m("button.delete", {
            "aria-label": "close",
            onclick: onCancel
          }),
        ]),
        m("section.modal-card-body", message),
        m(
          "footer.modal-card-foot",
          m("div.buttons", [
            m(
              "button.button.is-danger", {
                onclick: () => {
                  onConfirm();
                  onCancel();
                },
              },
              confirmText
            ),
            m(
              "button.button", {
                onclick: onCancel
              },
              cancelText
            ),
          ])
        ),
      ]),
      m("button.modal-close.is-large", {
        "aria-label": "close",
        onclick: onCancel
      }),
    ]);
  },
};

export default ConfirmationModal;