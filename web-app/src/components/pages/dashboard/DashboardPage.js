import m from "mithril";
import TitleAndSubtitle from "components/common/TitleAndSubtitle";
import SectionContainer from "components/common/SectionContainer";
import LiveData from "./LiveData";
import CalibrationSummary from "./CalibrationSummary";

const DashboardPage = {
  view: function () {
    return m(SectionContainer, [
      m(TitleAndSubtitle, {
        title: "Dashboard",
        subtitle: "[Pins: Input D3 and Output D7]",
      }),
      // m(CalibrationSummary),
      m(LiveData),
    ]);
  },
};

export default DashboardPage;
