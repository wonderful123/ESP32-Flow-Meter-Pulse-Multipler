// // CalibrationForm.js
// import m from 'mithril';
// import Button from 'components/common/Button';
// import VolumeInputField from './VolumeInputField';
// import PulseMetrics from './PulseMetrics';
// import CalibrationFormState from './CalibrationFormState';
// import PulseCountService from 'services/PulseCountService';


// function CalibrationForm() {
//   let pulseCount = PulseCountService.getPulseCountStream();

//   return {
//     oninit: () => {
//       PulseCountService.pulseCount.map(() => m.redraw());
//     },

//     view: () => {
//       return [
//         m("h2.title.is-spaced", "Calibration Process:"),
//         m("h3.subtitle.is-4.has-text-weight-semibold", "Step 1: Enter Target Volume (L)"),
//         m(VolumeInputField, {
//           id: "target-volume",
//           units: "Liters",
//           tooltipText: "Enter the desired target volume for calibration.",
//           name: "targetVolume",
//           placeholder: "Enter target volume",
//           value: CalibrationFormState.formState.targetVolume,
//           oninput: (value) => CalibrationFormState.handleTargetVolumeChange(value),
//         }),
//         m("h3.subtitle.is-4.has-text-weight-bold", "Step 2: Run Calibration"),
//         m(Button, {
//           text: CalibrationFormState.formState.startButtonText,
//           onclick: () => CalibrationFormState.handleStartClick(),
//           enabled: CalibrationFormState.formState.startEnabled,
//           classes: 'is-info'
//         }),
//         m(Button, {
//           text: "Stop Calibration",
//           onclick: () => CalibrationFormState.handleStopClick(),
//           enabled: CalibrationFormState.formState.stopEnabled,
//           classes: 'is-danger'
//         }),
//         m("h3.subtitle.is-4.has-text-weight-semibold", "Step 3: Enter Observed Volume (L)"),
//         m(VolumeInputField, {
//           id: "observed-volume",
//           units: "Liters",
//           tooltipText: "Enter the observed volume in liters.",
//           name: "observedVolume",
//           placeholder: "Enter observed volume",
//           value: CalibrationFormState.formState.observedVolume,
//           oninput: (value) => CalibrationFormState.handleObservedVolumeChange(value),
//         }),
//         m(PulseMetrics, {
//           pulseCount: pulseCount(),
//           pulsesPerLiter: CalibrationFormState.formState.pulsesPerLiter,
//           calibrationFactor: CalibrationFormState.formState.calibrationFactor,
//         }),
//         m(Button, {
//           text: CalibrationFormState.formState.saveButtonText,
//           onclick: () => CalibrationFormState.handleSaveClick(),
//           enabled: CalibrationFormState.formState.saveEnabled,
//           classes: `is-success ${CalibrationFormState.formState.saveSuccess ? 'is-animated' : ''}`
//         }),
//         m(Button, {
//           text: 'Clear Form',
//           onclick: () => CalibrationFormState.resetForm(),
//           classes: 'is-info'
//         }),
//       ];
//     },
//   }
// };

// export default CalibrationForm;