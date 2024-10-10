import m from "mithril";
import PulseCountService from "services/PulseCountService";

const PulseCountDisplay = {
  oninit: function () {
    this.pulseCount = PulseCountService.getPulseCountStream();

    // Trigger a redraw when the pulseCount stream changes
    this.pulseCount.map(() => m.redraw());
  },

  view: function () {
    return m("div", [
      m("h3", "Current Pulse Count:"),
      m("p", this.pulseCount()), // Display the current pulse count
    ]);
  },
};

export default PulseCountDisplay;
