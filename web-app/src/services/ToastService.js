import m from "mithril";
import { toast } from "bulma-toast";

const ToastService = {
  container: null,

  initContainer: () => {
    if (!ToastService.container) {
      ToastService.container = document.createElement("div");
      ToastService.container.className = "toast-container";
      document.body.appendChild(ToastService.container);
    }
  },

  show: options => {
    ToastService.initContainer();

    const defaultOptions = {
      message: "",
      type: "is-info",
      duration: 2000,
      position: "top-right",
      dismissible: true,
      pauseOnHover: true,
      animate: { in: "fadeInUp", out: "fadeOutDown" },
      extraClasses: "toast-animation",
      appendTo: ToastService.container,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    toast(mergedOptions);
  },

  success: (message, options = {}) => {
    ToastService.show({ message, type: "is-success", ...options });
  },

  error: (message, options = {}) => {
    ToastService.show({ message, type: "is-danger", ...options });
  },

  info: (message, options = {}) => {
    ToastService.show({ message, type: "is-info", ...options });
  },

  warning: (message, options = {}) => {
    ToastService.show({ message, type: "is-warning", ...options });
  },
};

export default ToastService;
