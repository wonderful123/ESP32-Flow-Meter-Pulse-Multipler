import m from "mithril";
import SectionContainer from "components/common/SectionContainer";
import NotificationCenter from "components/common/NotificationCenter";
import Table from "./CalibrationRecords/Table";
import Chart from "./CalibrationRecords/Chart";

const TestPage = {
  view: () => {
    return m(SectionContainer, [
      m("h1.title", "Test Page"),
      m(NotificationCenter, {}),
      m("hr"),
      m(Chart, {}),
      m("hr"),
      m(Table, {}),
    ]);
  }
};

export default TestPage;