// ChartComponent.js
import m from 'mithril';
import Chartist from 'chartist';

const ChartComponent = {
  oninit: function (vnode) {
    this.chartData = vnode.attrs.data;
    this.chartOptions = vnode.attrs.options;
    this.chartType = vnode.attrs.type;
  },

  oncreate: function (vnode) {
    this.renderChart();
  },

  onupdate: function (vnode) {
    this.chartData = vnode.attrs.data;
    this.chartOptions = vnode.attrs.options;
    this.chartType = vnode.attrs.type;
    this.renderChart();
  },

  renderChart: function () {
    if (this.chartType === 'line') {
      new Chartist.Line(this.chartContainer, this.chartData, this.chartOptions);
    } else if (this.chartType === 'bar') {
      new Chartist.Bar(this.chartContainer, this.chartData, this.chartOptions);
    }
  },

  view: function (vnode) {
    return m('.chart-container', {
      oncreate: (vnode) => {
        this.chartContainer = vnode.dom;
      },
    });
  },
};

export default ChartComponent;