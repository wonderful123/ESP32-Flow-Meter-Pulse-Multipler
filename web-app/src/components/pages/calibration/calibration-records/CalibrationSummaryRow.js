// CalibrationSummaryRow.js
import m from "mithril";
import IconChecked from "icons/IconChecked";
import IconUnchecked from "icons/IconUnchecked";

const CalibrationSummaryRow = {
  view: function ({
    attrs: {
      calibrations,
      isSelected,
      onSelect
    }
  }) {
    const Icon = isSelected ? IconChecked : IconUnchecked;

    // Calculate the average pulses per liter
    const validRecords = calibrations.filter(record => record.observedVolume > 0);
    const totalPulses = validRecords.reduce((sum, record) => sum + record.pulseCount, 0);
    const totalVolume = validRecords.reduce((sum, record) => sum + record.observedVolume, 0);
    const averagePulsesPerLitre = totalVolume > 0 ? (totalPulses / totalVolume).toFixed(1) : "N/A";

    // Calculate the average volume deviation
    const totalDeviation = validRecords.reduce((sum, record) => {
      const deviation = ((record.observedVolume - record.targetVolume) / record.targetVolume) * 100;
      return sum + deviation;
    }, 0);
    const averageVolumeDeviation = validRecords.length > 0 ? (totalDeviation / validRecords.length).toFixed(1) + "%" : "N/A";


    // Create class string for "is-selected" and "summary-row" classes
    const rowClass = `${isSelected ? "is-selected" : ""} summary-row`;

    return m("tr", {
      class: rowClass
    }, [
      m("td", [
        m("a.icon", {
            onclick: onSelect,
            title: "Click to select the average"
          },
          m(Icon, {
            class: "checkbox-icon",
            style: "cursor: pointer; width: 16px; height: 16px;"
          })
        )
      ]),
      m("td", {
        colspan: 3
      }, "Average: "),
      m("td", averagePulsesPerLitre),
      m("td", averageVolumeDeviation),
      m("td", ""),
    ]);
  }
};

export default CalibrationSummaryRow;