// VolumeInputField.js
import m from "mithril";
import IconDrop from "icons/IconDrop";
import Tooltip from 'components/common/Tooltip';

const MIN_VOLUME = 0.1;

const VolumeInputField = {
  view: function (vnode) {
    const {
      units = 'L', tooltipText, id, name, placeholder, value, oninput, ...inputAttributes
    } = vnode.attrs;

    const validateVolume = (volume) => {
      const parsedVolume = parseFloat(volume);
      return !isNaN(parsedVolume) && parsedVolume >= MIN_VOLUME;
    };

    const handleInputChange = (event) => {
      const newVolume = event.target.value;
      if (validateVolume(newVolume)) {
        oninput(newVolume);
      }
    };

    const displayValue = value === 0 ? '' : value;

    return m("div.field.mb-5", [
      m("div.control.has-icons-left", [
        m("input.input[type=number]", {
          id,
          name,
          step: "0.1",
          min: MIN_VOLUME,
          pattern: "^\\d+(\\.\\d+)?$",
          placeholder: value === 0 ? placeholder : '',
          required: true,
          value: displayValue,
          oninput: oninput,
          ...inputAttributes,
        }),
        m("span.icon.is-left", [
          m(IconDrop, {
            class: "icon",
            style: "width: 10px; height: auto;"
          }),
        ]),
      ]),
    ]);
  },
};

export default VolumeInputField;