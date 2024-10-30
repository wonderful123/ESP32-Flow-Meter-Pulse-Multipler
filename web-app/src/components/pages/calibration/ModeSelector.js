// ModeSelector.js
import m from "mithril";

const ModeSelector = {
  view(vnode) {
    const { selectedMode, onModeChange } = vnode.attrs;

    const handleChange = e => {
      const mode = e.target.value;
      onModeChange(mode);
    };

    return m("div", { class: "mode-selector" }, [
      m(
        "div",
        { class: "control has-text-centered" },
        m("div", { class: "select is-centered" }, [
          m(
            "select",
            {
              value: selectedMode,
              onchange: handleChange,
            },
            [
              m("option", { value: "fixed" }, "Fixed Calibration Mode"),
              m("option", { value: "temperature" }, "Temperature-Compensated Calibration Mode"),
            ]
          ),
        ])
      ),
    ]);
  },
};

export default ModeSelector;
