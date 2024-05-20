// PulseMetrics.js
import m from 'mithril';
import DataItem from 'components/common/DataItem';

const PulseMetrics = {
  view(vnode) {
    const {
      pulseCount,
      pulsesPerLiter,
      calibrationFactor
    } = vnode.attrs;

    return m('div.pulse-info-display', [
      m(DataItem, {
        label: 'Pulse Count',
        value: pulseCount,
        format: {
          decimalPlaces: 0,
        },
        className: 'pulse-metric',
      }),
      m(DataItem, {
        label: 'Pulses/Liter',
        value: pulsesPerLiter,
        format: {
          decimalPlaces: 1,
        },
        className: 'pulse-metric',
      }),
      m(DataItem, {
        label: 'Output Calibration Factor',
        value: calibrationFactor,
        format: {
          decimalPlaces: 1,
          suffix: '%',
        },
        className: 'pulse-metric',
      }),
    ]);
  },
};

export default PulseMetrics;