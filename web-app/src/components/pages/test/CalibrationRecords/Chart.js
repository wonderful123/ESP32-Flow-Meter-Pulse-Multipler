// Chart.js
import m from 'mithril';
import ChartComponent from "components/common/ChartComponent";
import CalibrationService from '../../../../services/CalibrationService';
import {
  AutoScaleAxis
} from "chartist";

const X_AXIS_TITLE = 'Temperature (°C)';
const Y_AXIS_TITLE = 'Calibration Factor (%)';

const options = {
  axisX: {
    type: AutoScaleAxis,
    onlyInteger: true,
    title: X_AXIS_TITLE
  },
  axisY: {
    onlyInteger: true,
    title: Y_AXIS_TITLE
  }
};

function getCalibrationFactor(targetOilVolume, observedOilVolume) {
  return observedOilVolume / targetOilVolume * 100;
}

function buildChartData(records) {
  if (records.length === 0) {
    return {
      series: []
    };
  }

  const chartData = {
    series: [
      records.map(record => {
        return {
          x: record.oilTemperature,
          y: getCalibrationFactor(record.targetOilVolume, record.observedOilVolume)
        }
      })
    ]
  };

  return chartData;
}

const Chart = {
  oninit: function (vnode) {
    vnode.state.chartData = [];
  },

  oncreate: function (vnode) {
    CalibrationService.getCalibrationRecords()
      .then(response => {
        vnode.state.chartData = buildChartData(response);
        m.redraw();
      })
      .catch(error => {
        console.error('Error fetching calibration records:', error);
      });
  },

  view: function (vnode) {
    return m(ChartComponent, {
      type: "line",
      data: vnode.state.chartData,
      options: options,
      xAxisTitle: X_AXIS_TITLE,
      yAxisTitle: Y_AXIS_TITLE
    });
  }
}

export default Chart;