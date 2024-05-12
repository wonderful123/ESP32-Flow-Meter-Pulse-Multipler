// PulseMetrics.js
import m from 'mithril';

const formatPulseCount = (count) => {
  return Math.max(0, parseInt(count, 10)).toString();
};

const formatPulsesPerLiter = (pulsesPerLiter) => {
  return typeof pulsesPerLiter === 'number' ? pulsesPerLiter.toFixed(1) : '0.0';
};

const formatCalibrationFactor = (calibrationFactor) => {
  return typeof calibrationFactor === 'number' ? `${calibrationFactor.toFixed(1)}%` : 'N/A';
};

const PulseMetrics = {
  view(vnode) {
    const {
      pulseCount,
      pulsesPerLiter,
      calibrationFactor
    } = vnode.attrs;

    return m('div.pulse-info-display', [
      m('div.field.pulse-metric', [
        m('label.label.pulse-label', 'Pulse Count'),
        m('div.pulse-display', formatPulseCount(pulseCount))
      ]),
      m('div.field.pulse-metric', [
        m('label.label.pulse-label', 'Pulses/Liter'),
        m('div.pulse-display', formatPulsesPerLiter(pulsesPerLiter))
      ]),
      m('div.field.pulse-metric', [
        m('label.label.pulse-label', 'Output Calibration Factor'),
        m('div.pulse-display', formatCalibrationFactor(calibrationFactor))
      ])
    ]);
  }
};

export default PulseMetrics;