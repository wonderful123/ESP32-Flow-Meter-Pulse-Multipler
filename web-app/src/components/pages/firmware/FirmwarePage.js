import m from "mithril";
import FirmwareUpdate from "./FirewareUpdate"; // Adjust the path if necessary

const FirmwarePage = {
  view: function () {
    return m("section.section", [
      m(FirmwareUpdate)
    ]);
  }
}

export default FirmwarePage;