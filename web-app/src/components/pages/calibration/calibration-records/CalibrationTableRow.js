// CalibrationTableRow.js
import m from "mithril";
import IconTrash from "icons/IconTrash";
import IconChecked from "icons/IconChecked";
import IconUnchecked from "icons/IconUnchecked";

const CalibrationTableRow = {
  view: function ({
    attrs: {
      item,
      isSelected,
      onSelect,
      onDelete
    }
  }) {
    const Icon = isSelected ? IconChecked : IconUnchecked;
    const pulsesPerLitre = item.observedVolume > 0 ? (item.pulseCount / item.observedVolume).toFixed(1) : "N/A";
    const volumeDeviation = item.observedVolume > 0 ? (((item.observedVolume - item.targetVolume) / item.targetVolume) * 100).toFixed(1) + "%" : "N/A";

    // Create class string for "is-selected" depending if the row is selected or not
    const rowSelectedClass = isSelected ? "is-selected" : "";

    return m("tr", {
      class: rowSelectedClass
    }, [
      m("td", [
        m("a.icon", {
          onclick: () => onSelect(item.id),
          title: "Click to select this record"
        }, m(Icon, {
          class: "checkbox-icon",
          style: "cursor: pointer; width: 16px; height: 16px;"
        }))
      ]),
      m("td", item.id),
      m("td", item.targetVolume.toFixed(2)),
      m("td", item.observedVolume.toFixed(2)),
      m("td", pulsesPerLitre),
      m("td", volumeDeviation),
      m("td", [
        m("a.icon.has-text-danger.is-small", {
            onclick: () => onDelete(item),
          },
          m(IconTrash, {
            class: 'is-danger',
            style: "cursor: pointer; width: 16px; height: 16px;",
          })
        )
      ]),
    ]);
  }
};

export default CalibrationTableRow;