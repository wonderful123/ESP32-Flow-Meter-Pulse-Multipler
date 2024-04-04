// StatusMessageBox.js
import m from "mithril";
import StatusMessageService from "services/StatusMessageService";

const typeClassMap = {
  success: 'is-success',
  error: 'is-danger',
  warning: 'is-warning',
  info: 'is-info',
  primary: 'is-primary'
};

// Function to generate a readable title from the type
const typeToHeaderMap = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Information',
  primary: 'Primary'
};

const StatusMessageBox = {
  view: function () {
    const {
      text,
      type
    } = StatusMessageService.getMessage();
    return text ? m(`article.message.${typeClassMap[type] || 'is-info'}`, [
      // Using typeToHeaderMap to convert type to a readable string for the header
      m('div.message-header', 'Status: ' + typeToHeaderMap[type] || 'Info'),
      m('div.message-body', text)
    ]) : null;
  }
};

export default StatusMessageBox;
