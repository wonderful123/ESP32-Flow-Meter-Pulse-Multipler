// // CalibrationFormState.js
// import m from 'mithril';
// import {
//   calculatePulsesPerLiter,
//   calculateCalibrationFactor
// } from './CalibrationUtils';
// import CalibrationService from 'services/CalibrationService';
// // import CalibrationRecordsModel from 'models/CalibrationRecordsModel';
// import PulseCountService from 'services/PulseCountService';

// const CalibrationFormState = {
//   formState: {
//     targetVolume: 0,
//     observedVolume: 0,
//     isCalibrating: false,
//     saveSuccess: false, // Used to animate a successful save
//     startButtonText: 'Start Calibration',
//     saveButtonText: 'Save Calibration',
//     get pulsesPerLiter() {
//       const observedVolume = this.observedVolume;
//       const pulseCount = PulseCountService.getPulseCount();
//       return calculatePulsesPerLiter(pulseCount, observedVolume);
//     },
//     get calibrationFactor() {
//       const targetVolume = this.targetVolume;
//       const observedVolume = this.observedVolume;
//       return calculateCalibrationFactor(targetVolume, observedVolume);
//     },
//     get startEnabled() {
//       return !this.isCalibrating && this.targetVolume > 0;
//     },
//     get stopEnabled() {
//       return this.isCalibrating;
//     },
//     get saveEnabled() {
//       const pulseCount = PulseCountService.getPulseCount();
//       return (
//         !this.isCalibrating &&
//         this.targetVolume > 0 &&
//         this.observedVolume > 0 &&
//         pulseCount > 0
//       );
//     },
//   },

//   resetForm() {
//     this.formState.targetVolume = 0;
//     this.formState.observedVolume = 0;
//     this.formState.isCalibrating = false;
//     this.formState.startButtonText = 'Start Calibration';
//     this.formState.saveButtonText = 'Save Calibration';
//   },

//   handleTargetVolumeChange(value) {
//     const parsedValue = parseFloat(value);
//     if (!isNaN(parsedValue) && parsedValue >= 0) {
//       this.formState.targetVolume = parsedValue;
//     }
//   },

//   handleObservedVolumeChange(value) {
//     const parsedValue = parseFloat(value);
//     if (!isNaN(parsedValue) && parsedValue >= 0) {
//       this.formState.observedVolume = parsedValue;
//     }
//   },

//   handleStartClick() {
//     this.formState.isCalibrating = true;
//     this.formState.startButtonText = 'Calibration Running...';
//     CalibrationService.startCounter();
//     this.formState.saveButtonText = 'Save Calibration';
//   },

//   handleStopClick() {
//     this.formState.isCalibrating = false;
//     if (this.formState.targetVolume > 0) {
//       this.formState.startButtonText = 'Restart Calibration';
//     } else {
//       this.formState.startButtonText = 'Start Calibration';
//     }
//     CalibrationService.stopCounter();
//   },

//   handleSaveClick() {
//     const record = {
//       targetVolume: parseFloat(this.formState.targetVolume),
//       observedVolume: parseFloat(this.formState.observedVolume),
//       pulseCount: parseInt(PulseCountService.getPulseCount(), 10)
//     };
//     CalibrationRecordsModel.saveRecord(record).then(() => {
//       CalibrationService.resetCounter();
//       this.resetForm();
//       this.formState.saveButtonText = 'Calibration Record Saved Successfully!';
//       // Set a flag to animate the success message
//       this.formState.saveSuccess = true;
//       setTimeout(() => {
//         this.formState.saveSuccess = false;
//         m.redraw();
//       }, 2000);
//     });
//   },
// };

// export default CalibrationFormState;