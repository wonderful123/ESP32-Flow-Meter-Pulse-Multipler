import m from "mithril";
import SectionContainer from "components/common/SectionContainer";
import Table from "./CalibrationRecords/Table";
import Chart from "./CalibrationRecords/Chart";
import ToastService from "../../../services/ToastService";
import ErrorHandler from "../../../services/ErrorHandler";
const TestPage = {
  view: () => {
    return m(SectionContainer, [
      m("h1.title", "Test Page"),
      m("button", { onclick: () => ErrorHandler.handleSuccess("Calibration Successfully saved") }, "Test success toast"),
      m("hr"),
      m(Chart, {}),
      m("hr"),
      m(Table, {}),
    ]);
  },
};

export default TestPage;
