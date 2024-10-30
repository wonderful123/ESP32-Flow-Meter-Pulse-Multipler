import m from "mithril";
import SectionContainer from "components/common/SectionContainer";
import CalibrationControl from "./CalibrationControl";
import VolumeInputField from "./VolumeInputField";
import CalibrationButton from "./CalibrationButton";
import CalibrationFormLogic from "./CalibrationFormLogic";
import PulseCountService from "services/PulseCountService";
import ToastService from "services/ToastService"; // Import the ToastService

function CalibrationForm(vnode) {
  const { selectedMode } = vnode.attrs;
  // Set selectedMode in logic
  CalibrationFormLogic.setSelectedMode(selectedMode);

  // Get the pulse count stream
  const inputPulseCount = PulseCountService.getInputPulseCountStream();
  // Automatically redraw the view when inputPulseCount changes
  inputPulseCount.map(() => {
    m.redraw();
  });

  const handleSaveCalibration = async () => {
    try {
      const response = await CalibrationFormLogic.saveCalibration();
      ToastService.success(response.message); // Show success toast
      m.redraw(); // Redraw the view to reflect the reset form fields
    } catch (error) {
      ToastService.error(error.message); // Show error toast if the save fails
    }
  };

  return {
    view: function () {
      return m(SectionContainer, [
        m("h3.subtitle.is-4.has-text-weight-semibold", "Step 1: Enter Target Volume (L)"),
        m(VolumeInputField, {
          id: "target-volume",
          units: "Liters",
          tooltipText: "Enter the desired target volume for calibration.",
          name: "targetVolume",
          placeholder: "Enter target volume",
          value: CalibrationFormLogic.getTargetVolume(),
          oninput: value => {
            CalibrationFormLogic.setTargetVolume(value);
          },
        }),
        m("h3.subtitle.is-4.has-text-weight-semibold", "Step 2: Run Calibration"),
        m(CalibrationControl),
        m("div.box", [m("span.title.is-6", "Input Pulse Count"), m("div.has-text-weight-semibold", inputPulseCount())]),
        m("h3.subtitle.is-4.has-text-weight-semibold", "Step 3: Enter Observed Volume (L)"),
        m(VolumeInputField, {
          id: "observed-volume",
          units: "Liters",
          tooltipText: "Enter the observed volume.",
          name: "observedVolume",
          placeholder: "Enter observed volume",
          value: CalibrationFormLogic.getObservedVolume(),
          oninput: value => {
            CalibrationFormLogic.setObservedVolume(value);
          },
        }),
        m("h3.subtitle.is-4.has-text-weight-semibold", "Step 4: Save Calibration"),
        m(CalibrationButton, {
          className: "is-success",
          label: "Save Calibration",
          action: handleSaveCalibration,
          isDisabled: !CalibrationFormLogic.isFormValid,
        }),
      ]);
    },
  };
}

export default CalibrationForm;
