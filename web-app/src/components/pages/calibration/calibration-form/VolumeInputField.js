// VolumeInputField.js
import m from "mithril";
import IconDrop from "icons/IconDrop";
import Tooltip from 'components/common/Tooltip';

const MIN_VOLUME = 0.1;

const VolumeInputField = {
  view: function (vnode) {
    const {
      label,
      units = 'L',
      tooltipText,
      id,
      name,
      placeholder,
      value,
      oninput,
      ...inputAttributes
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

    return m("div.field", [
      m("label.label", {
        for: id
      }, [
        label,
        ' ',
        m('span.unit', `(${units})`),
        tooltipText && m(Tooltip, {
          text: tooltipText
        })
      ]),
      m("div.control.has-icons-left", [
        m("input.input[type=number]", {
          id,
          name,
          step: MIN_VOLUME,
          min: MIN_VOLUME,
          placeholder,
          required: true,
          value,
          oninput: oninput,
          ...inputAttributes
        }),
        m("span.icon.is-left", [
          m(IconDrop, {
            class: "icon",
            style: "width: 10px; height: auto;"
          }),
        ])
      ])
    ]);
  }
};

export default VolumeInputField;