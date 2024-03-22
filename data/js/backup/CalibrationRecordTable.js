// modules/CalibrationRecordTable.js
import { updateStatusMessage } from 'UIUpdates.js';

export function loadCalibrationRecords() {
  updateStatusMessage("Loading calibration records...");

  fetch('/calibration-records')
    .then(response => response.json())
    .then(calibrations => {
      if (calibrations.length > 0) {
        renderCalibrationTable(calibrations);
        updateStatusMessage("Calibration records loaded successfully.", 'success');
      } else {
        displayNoRecordsMessage();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      updateStatusMessage("Failed to load calibration records. Please try again.", 'error');
    });
}

function renderCalibrationTable(calibrations) {
  const container = document.getElementById('calibrationList');
  container.innerHTML = ''; // Clear the container

  const table = document.createElement('table');
  table.className = 'table is-fullwidth is-striped is-hoverable';

  // Table head
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['ID', 'Target Volume', 'Observed Volume', 'Pulses per Litre', 'Volume Deviation (%)', 'Actions'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  // Table Body
  const tbody = document.createElement('tbody');
  calibrations.forEach(item => {
    const row = document.createElement('tr');
    const pulsesPerLitre = item.observedVolume > 0 ? (item.pulseCount / item.observedVolume).toFixed(0) : "N/A";
    const volumeDeviation = item.observedVolume > 0 ? (((item.observedVolume - item.targetVolume) / item.targetVolume) * 100).toFixed(0) : "N/A";

    [{
        value: item.id
      },
      {
        value: item.targetVolume.toFixed(2)
      },
      {
        value: item.observedVolume.toFixed(2)
      },
      {
        value: pulsesPerLitre
      },
      {
        value: `${volumeDeviation}%`
      } // Displaying the Volume Deviation
    ].forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell.value;
      row.appendChild(td);
    });

    // Actions cell with Bulma's icon-text and Font Awesome icons
    const actionsTd = document.createElement('td');
    const span = document.createElement('span');
    span.className = 'icon-text ml-auto'; // Bulma's ml-auto to align icons to the right

    const editLink = document.createElement('a');
    editLink.className = 'icon has-text-info';
    editLink.setAttribute('onclick', `editRecord(${item.id})`);
    const editIcon = document.createElement('i');
    editIcon.className = 'fas fa-edit';
    editLink.appendChild(editIcon);

    const deleteLink = document.createElement('a');
    deleteLink.className = 'icon has-text-danger';
    deleteLink.setAttribute('onclick', `deleteRecord(${item.id})`);
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash-alt';
    deleteLink.appendChild(deleteIcon);

    span.appendChild(editLink);
    span.appendChild(deleteLink);
    actionsTd.appendChild(span);
    row.appendChild(actionsTd);

    // Add click event listener to the row that will set the scaling factor
    const scalingFactorNum = item.observedVolume > 0 ? (item.targetVolume / item.observedVolume) * 100 : 0;

    console.log(`Scaling factor: ${scalingFactorNum}`);

    row.addEventListener('click', function () {
      if (scalingFactorNum > 0) { // Check scalingFactorNum is greater than 0
        const confirmSetScaling = confirm(`Set scaling factor to ${scalingFactorNum.toFixed(2)}%?`);
        if (confirmSetScaling) {
          setScalingFactor(scalingFactorNum / 100); // Assuming setScalingFactor expects a decimal (e.g., 0.95 for 95%)
        }
      } else {
        console.error('Scaling factor is not a valid number or observed volume was zero');
      }
    });

    // Append the row to the tbody as before
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // Wrap table for responsiveness
  const tableContainer = document.createElement('div');
  tableContainer.className = 'table-container';
  tableContainer.appendChild(table);

  container.appendChild(tableContainer);

  addSummaryLine(calibrations);
}

function addSummaryLine(calibrations) {
  const totalPulsesPerLitre = calibrations.reduce((acc, item) => {
    return acc + (item.pulseCount / item.observedVolume);
  }, 0);

  const averagePulsesPerLitre = (calibrations.length > 0) ? (totalPulsesPerLitre / calibrations.length).toFixed(2) : "N/A";

  // Assuming scaling factor is derived as a ratio of observed to target volume, adjust as necessary
  const totalScalingFactor = calibrations.reduce((acc, item) => {
    const scalingFactor = (item.observedVolume > 0) ? (item.targetVolume / item.observedVolume) * 100 : 0;
    return acc + scalingFactor;
  }, 0);

  const avgScalingFactor = (calibrations.length > 0) ? (totalScalingFactor / calibrations.length) : 0;

  // Find or create the summary element
  let summaryElement = document.getElementById('calibrationSummary');
  if (!summaryElement) {
    summaryElement = document.createElement('div');
    summaryElement.id = 'calibrationSummary';
    summaryElement.className = 'notification is-primary'; // Use Bulma's notification and is-primary classes for styling
    document.getElementById('calibrationList').appendChild(summaryElement);
  }

  // Set the summary text including the average pulses per litre and average scaling factor
  summaryElement.innerHTML = `<strong>Average Pulses per Litre:</strong> ${averagePulsesPerLitre}, <strong>Average Scaling Factor:</strong> ${avgScalingFactor.toFixed(2)}%`;

  // Add click event listener to the summary element that will set the average scaling factor
  summaryElement.addEventListener('click', function () {
    const confirmSetScaling = confirm(`Set scaling factor to average ${avgScalingFactor.toFixed(2)}%?`);
    if (confirmSetScaling) {
      setScalingFactor(avgScalingFactor / 100); // Adjust as needed for correct function input
    }
  });
}

function displayNoRecordsMessage() {
  const container = document.getElementById('calibrationList');
  container.innerHTML = ''; // Clear the container in case there were previous messages or data

  // Create a new div to hold the message
  const noRecordsDiv = document.createElement('div');
  noRecordsDiv.className = 'notification is-primary'; // Use Bulma's notification and is-primary classes for styling
  noRecordsDiv.textContent = 'No calibration records found. Start a new calibration to create records.';

  container.appendChild(noRecordsDiv); // Add the message to the page

  // Update the status message to a neutral informative message
  updateStatusMessage("No current calibration records saved. Ready to start new calibration.", 'primary');
}

function editRecord(id) {
  fetch(`/calibration-record?id=${id}`)
    .then(response => response.json())
    .then(record => {
      document.getElementById('targetVolume').value = record.targetVolume;
      document.getElementById('observedVolume').value = record.observedVolume;
      document.getElementById('pulseCountDisplay').textContent = record.pulseCount; // Display the current pulse count

      // Assuming you have a hidden input to hold the ID for the record being edited
      document.getElementById('recordId').value = record.id;

      // Change submit button text to indicate update action
      submitButton.textContent = 'Update Calibration';
    })
    .catch(error => console.error('Error:', error));
}

function deleteRecord(id) {
  if (confirm("Are you sure you want to delete this record?")) {
    // Assuming you can target the specific delete button, disable it or change text to indicate deletion
    // For simplicity, let's just show a status message
    updateStatusMessage("Deleting record...");

    fetch(`/delete-calibration?id=${id}`, {
        method: 'POST'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Deletion failed');
        }
        loadCalibrationRecords(); // Refresh the list to reflect the deletion
      })
      .catch(error => {
        console.error('Error:', error);
        updateStatusMessage("Failed to delete the record. Please try again.", 'error');
      })
      .finally(() => {
        // If targeting specific delete button, reset its state here
      });
  }
}