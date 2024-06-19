// ConfirmationModal.js
import m from "mithril";

const ConfirmationModal = {
  oncreate: function (vnode) {
    vnode.state.handleKeyDown = event => {
      if (event.key === "Escape") {
        vnode.attrs.onCancel();
      }
    };
    window.addEventListener("keydown", vnode.state.handleKeyDown);
  },

  onremove: function (vnode) {
    // Remove the event listener from the window object when the modal is removed
    window.removeEventListener("keydown", vnode.state.handleKeyDown);
  },

  view(vnode) {
    const { isOpen, onConfirm, onCancel, title, message, confirmText, cancelText } = vnode.attrs;

    if (!isOpen) return null;

    return m(".modal", { class: isOpen ? "is-active" : "" }, [
      m(".modal-background", { onclick: onCancel }),
      m(".modal-card", [
        m("header.modal-card-head", [
          m("p.modal-card-title", title),
          m("button.delete", { "aria-label": "close", onclick: onCancel }),
        ]),
        m("section.modal-card-body", message),
        m("footer.modal-card-foot", [
          m("button.button.is-danger", { onclick: onConfirm }, confirmText),
          m("button.button", { onclick: onCancel }, cancelText),
        ]),
      ]),
      m("button.modal-close.is-large", { "aria-label": "close", onclick: onCancel }),
    ]);
  },
};

export default ConfirmationModal;
