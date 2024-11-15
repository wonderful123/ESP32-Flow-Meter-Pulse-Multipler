// ErrorHandler.js
import m from "mithril";
import ToastService from "./ToastService";

const ErrorHandler = {
  handleError: error => {
    // Log the error to the console
    console.error("Error:", error);

    // Display an error toast notification
    ToastService.error("An error occurred: " + error);
  },

  handleSuccess: message => {
    // Display a success toast notification
    ToastService.success(message);
  },
};

export default ErrorHandler;
