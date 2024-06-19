// Chart.js
import m from "mithril";
import ChartComponent from "components/common/ChartComponent";
import { AutoScaleAxis, Interpolation } from "chartist";
import CalibrationService from "../../../../services/CalibrationService";
import ErrorHandler from "../../../../services/ErrorHandler";

const X_AXIS_TITLE = "Temperature (°C)";
const Y_AXIS_TITLE = "Calibration Factor (%)";

const options = {
  axisX: {
    type: AutoScaleAxis,
    onlyInteger: true,
    title: X_AXIS_TITLE,
  },
  axisY: {
    onlyInteger: true,
    title: Y_AXIS_TITLE,
  },
};

function getCalibrationFactor(targetOilVolume, observedOilVolume) {
  return (observedOilVolume / targetOilVolume) * 100;
}

function buildChartData(records) {
  if (records.length === 0) {
    return {
      series: [],
    };
  }

  const chartData = {
    series: [
      records.map(record => {
        return {
          x: record.oilTemperature,
          y: getCalibrationFactor(record.targetOilVolume, record.observedOilVolume),
        };
      }),
    ],
  };

  return chartData;
}

const Chart = {
  oninit: function (vnode) {
    vnode.state.chartData = null;
    vnode.state.error = null;
  },

  oncreate: function (vnode) {
    CalibrationService.getCalibrationRecords()
      .then(response => {
        vnode.state.chartData = buildChartData(response);
        m.redraw();
      })
      .catch(error => {
        ErrorHandler.handleError(error);
        vnode.state.error = "Error fetching calibration records. Please try again.";
        m.redraw();
      });
  },

  view: function (vnode) {
    if (vnode.state.error) {
      return m("div.error", vnode.state.error);
    }

    if (vnode.state.chartData === null) {
      return m(ChartComponent, {
        type: "line",
        data: {
          series: [],
        },
        options: {
          ...options,
          showLine: false,
          showPoint: false,
          showArea: false,
          axisX: {
            showGrid: false,
            showLabel: false,
          },
          axisY: {
            showGrid: false,
            showLabel: false,
          },
        },
        xAxisTitle: "",
        yAxisTitle: "",
        placeholderText: "Loading chart data...",
      });
    }

    return m(ChartComponent, {
      type: "line",
      data: vnode.state.chartData,
      options: options,
      xAxisTitle: X_AXIS_TITLE,
      yAxisTitle: Y_AXIS_TITLE,
      lineSmooth: Interpolation.cardinal({
        tension: 0.5,
        fillHoles: false,
      }),
    });
  },
};

export default Chart;
