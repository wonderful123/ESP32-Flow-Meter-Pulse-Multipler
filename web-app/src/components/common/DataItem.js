// DataItem.js
import m from 'mithril';

const formatValue = (value, format) => {
  const {
    decimalPlaces = 2,
      prefix = '',
      suffix = '',
      formatter = (val) => val,
  } = format;

  const formattedValue = formatter(Number(value).toFixed(decimalPlaces));
  return prefix + formattedValue + suffix;
};

const DataItem = {
  view: function (vnode) {
    const {
      icon: Icon,
      label,
      value,
      format = {},
      className = '',
    } = vnode.attrs;

    const formattedValue = formatValue(value, format);

    return m('div.data-item', {
      className
    }, [
      Icon && m(Icon, {
        className: 'data-item__icon'
      }),
      m('span.data-item__label', label),
      m('span.data-item__value', formattedValue),
    ]);
  },
};

export default DataItem;