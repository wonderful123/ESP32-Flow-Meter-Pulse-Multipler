import m from "mithril";
import PulseCountService from "services/PulseCountService";

const PulseDataDisplay = {
  oninit: function () {
    // Bind each stream to a property in the component
    this.inputPulseCount = PulseCountService.getInputPulseCountStream();

    // Redraw when any of the streams change
    this.inputPulseCount.map(() => m.redraw());
  },

  view: function () {
    return m("div.container", [
      m("div.columns.is-multiline", [
        m("div.column.is-half", [
          m("div.box", [
            m("span.title.is-6", "Input Pulse Count"),
            m("div.has-text-weight-semibold", this.inputPulseCount()),
          ]),
        ]),
        m("div.column.is-half", [
          m("div.box", [
            m("span.title.is-6", "Output Pulse Count"),
            m("div.has-text-weight-semibold", this.outputPulseCount()),
          ]),
        ]),
        m("div.column.is-half", [
          m("div.box", [m("span.title.is-6", "Input Frequency"), m("div.has-text-weight-semibold", this.inputFrequency())]),
        ]),
        m("div.column.is-half", [
          m("div.box", [
            m("span.title.is-6", "Output Frequency"),
            m("div.has-text-weight-semibold", this.outputFrequency()),
          ]),
        ]),
      ]),
    ]);
  },
};

export default PulseDataDisplay;
