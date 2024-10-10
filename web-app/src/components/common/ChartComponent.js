// ChartComponent.js
import m from 'mithril';
import {
  BarChart,
  LineChart
} from 'chartist';
import ctAxisTitle from 'chartist-plugin-axistitle';

const ChartComponent = {
  oninit: function (vnode) {
    this.chartData = vnode.attrs.data;
    this.chartOptions = vnode.attrs.options;
    this.chartType = vnode.attrs.type;
    this.xAxisTitle = vnode.attrs.xAxisTitle;
    this.yAxisTitle = vnode.attrs.yAxisTitle;
  },

  oncreate: function (vnode) {
    this.renderChart();
  },

  onupdate: function (vnode) {
    this.chartData = vnode.attrs.data;
    this.chartOptions = vnode.attrs.options;
    this.chartType = vnode.attrs.type;
    this.xAxisTitle = vnode.attrs.xAxisTitle;
    this.yAxisTitle = vnode.attrs.yAxisTitle;
    this.renderChart();
  },

  renderChart: function () {
    const plugins = [];

    if (this.xAxisTitle || this.yAxisTitle) {
      const axisTitleOptions = {
        axisX: {},
        axisY: {}
      };

      if (this.xAxisTitle) {
        axisTitleOptions.axisX = {
          axisTitle: this.xAxisTitle,
          axisClass: "ct-axis-title",
          offset: {
            x: 0,
            y: 50
          },
          textAnchor: "middle"
        };
      }

      if (this.yAxisTitle) {
        axisTitleOptions.axisY = {
          axisTitle: this.yAxisTitle,
          axisClass: "ct-axis-title",
          offset: {
            x: 0,
            y: -1
          },
          flipTitle: false
        };
      }

      plugins.push(ctAxisTitle(axisTitleOptions));
    }

    const options = {
      ...this.chartOptions,
      plugins: plugins
    };

    if (this.chartType === 'line') {
      new LineChart("#chart", this.chartData, options);
    } else if (this.chartType === 'bar') {
      new BarChart("#chart", this.chartData, options);
    }
  },
  view: function (vnode) {
    return m('div.ct-chart.ct-golden-section.#chart');
  },
};

export default ChartComponent;