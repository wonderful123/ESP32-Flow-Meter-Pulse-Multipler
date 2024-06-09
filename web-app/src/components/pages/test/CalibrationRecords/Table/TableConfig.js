// CalibrationRecords/Table/TableConfig.js
export const TableConfig = {
  columns: [
    {
      key: "oilTemperature",
      label: "Oil Temp (°C)",
      sortable: true,
    },
    {
      key: "targetOilVolume",
      label: "Target (L)",
      sortable: true,
    },
    {
      key: "observedOilVolume",
      label: "Observed (L)",
      sortable: true,
    },
    {
      key: "pulsesPerLiter",
      label: "Pulses/L",
      sortable: true,
    },
    {
      key: "calibrationFactor",
      label: "Calibration",
      sortable: true,
    },
    {
      key: "timestamp",
      label: "Time",
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
    },
  ],
  defaultSortColumn: "oilTemperature",
  defaultSortOrder: "asc",
};
