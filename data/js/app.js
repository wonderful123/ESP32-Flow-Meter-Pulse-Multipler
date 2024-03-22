var CalibrationApp = {
  // Component state
  pulseCount: 0,

  // View function
  view: function () {
    return m("div", [
      m("h1", "Pulse Count: " + CalibrationApp.pulseCount),
      m("button", {
        onclick: function () {
          CalibrationApp.pulseCount++;
        }
      }, "Increment Pulse")
    ]);
  }
};

// Mount the Mithril application
m.mount(document.body, CalibrationApp);
