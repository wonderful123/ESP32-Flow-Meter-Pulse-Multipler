// FirmwarePage.js
import m from "mithril";
import FirmwareUpdate from "./FirmwareUpdate";

const FirmwarePage = {
  view: function () {
    return m("section.section", [
      m(FirmwareUpdate)
    ]);
  }
}

export default FirmwarePage;