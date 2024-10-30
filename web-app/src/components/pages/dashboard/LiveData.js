import m from "mithril";

const LiveData = {
  data: {
    flowRate: 35.4, // Sample data (liters/min)
    pulseCount: 1200, // Pulse count from flow meter
    temperature: 65, // Temperature in degrees Celsius
  },

  view: function () {
    return m("div.box", [
      m("h2.title.is-5", "Live Data (Not implemented)"),
      m("div.content", [
        m("p", [m("strong", "Flow Rate: "), m("span", LiveData.data.flowRate + " liters/min")]),
        m("p", [m("strong", "Pulse Count: "), m("span", LiveData.data.pulseCount)]),
        m("p", [m("strong", "Temperature: "), m("span", LiveData.data.temperature + " °C")]),
      ]),
    ]);
  },
};

export default LiveData;
