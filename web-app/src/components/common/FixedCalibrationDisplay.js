// FixedCalibrationDisplay.js
import m from "mithril";
import CalibrationService from "services/CalibrationService";

const FixedCalibrationDisplay = () => {
  // Component state variables
  let fixedCalibrationFactor = null;
  let errorMessage = null;
  let displayText = "Current Calibration Factor: Loading...";

  const updateDisplayText = () => {
    if (fixedCalibrationFactor !== null) {
      displayText = `Current Calibration Factor: ${(fixedCalibrationFactor * 100).toFixed(2)}%`;
    } else if (errorMessage) {
      displayText = errorMessage;
    }
  };

  return {
    // Lifecycle method to fetch calibration factor on initialization
    oninit: async () => {
      try {
        const response = await CalibrationService.getFixedCalibrationFactor();
        fixedCalibrationFactor = response.fixedCalibrationFactor;
      } catch (error) {
        console.error("Error fetching fixed calibration factor:", error);
        errorMessage = "Failed to fetch fixed calibration factor.";
      }
      updateDisplayText();
    },

    // View method to render the component
    view: () => {
      return m("div.subtitle.has-text-centered.pt-2", displayText);
    },
  };
};

export default FixedCalibrationDisplay;
