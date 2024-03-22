// Global references to buttons and message display
const startButton = document.getElementById('startCalibration');
const stopButton = document.getElementById('stopCalibration');
const submitButton = document.getElementById('submitCalibration');
const statusMessage = document.getElementById('statusMessage');

// Load calibration records on page load
window.onload = function () {
  loadCurrentScalingFactor();
  loadCalibrationRecords();
};

// Event listener for the Submit Calibration button
submitButton.addEventListener('click', function () {
  let id = null; // Default to null when no recordId element is found
  const recordIdElement = document.getElementById('recordId');
  if (recordIdElement) {
    id = recordIdElement.value; // Only attempt to access value if element exists
  }
  const targetVolume = parseFloat(document.getElementById('targetVolume').value);
  const observedVolume = parseFloat(document.getElementById('observedVolume').value);
  const pulseCount = parseInt(document.getElementById('pulseCountDisplay').textContent);


  // Construct the body based on whether it's an add or update action
  let bodyContent = `targetVolume=${targetVolume}&observedVolume=${observedVolume}&pulseCount=${pulseCount}`;
  if (id) {
    bodyContent += `&id=${id}`; // Add the ID for updates
  }

  // Determine the endpoint based on whether you're adding or updating a record
  const endpoint = id ? '/update-calibration' : '/add-calibration-record';

  fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyContent
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(msg => {
      updateStatusMessage(`Calibration saved. Ready for next calibration.`, 'success');
      resetCalibrationForm();
      loadCalibrationRecords();
      // UI state adjustments
      submitButton.disabled = true; // Disable save button after saving
      startButton.disabled = false; // Re-enable start button to allow new calibration
      stopButton.disabled = true; // Keep stop button disabled until calibration started again
    })
    .catch(error => {
      console.error('Error:', error);
      updateStatusMessage("Failed to save calibration. Please try again.", 'error');
    })
    .finally(() => {
      submitButton.textContent = 'Save Calibration';
      submitButton.disabled = false;
    });
});

document.getElementById('observedVolume').addEventListener('input', function () {
  const targetVolume = parseFloat(document.getElementById('targetVolume').value);
  const observedVolume = parseFloat(document.getElementById('observedVolume').value);
  const pulseCount = parseInt(document.getElementById('pulseCountDisplay').textContent, 10);

  if (!isNaN(observedVolume) && observedVolume > 0) {
    const pulsesPerLitre = pulseCount / observedVolume;
    document.getElementById('pulsesPerLitreDisplay').textContent = pulsesPerLitre.toFixed(2);

    if (!isNaN(targetVolume) && targetVolume > 0) {
      const scalingFactor = (targetVolume / observedVolume) * 100;
      document.getElementById('scalingFactorDisplay').textContent = `${scalingFactor.toFixed(2)}%`;
    } else {
      document.getElementById('scalingFactorDisplay').textContent = 'N/A';
    }
  } else {
    document.getElementById('pulsesPerLitreDisplay').textContent = 'N/A';
    document.getElementById('scalingFactorDisplay').textContent = 'N/A';
  }
});

function loadCurrentScalingFactor() {
  fetch('/get-scaling-factor')
    .then(response => response.json())
    .then(data => {
      document.getElementById('currentScalingFactor').textContent = `${(data.scalingFactor * 100).toFixed(2)}%`;
    })
    .catch(error => {
      console.error('Error loading scaling factor:', error);
      updateStatusMessage('Error loading scaling factor:', 'error');
    });
}

function setScalingFactor(scalingFactor) {
  fetch('/set-scaling-factor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `scalingFactor=${scalingFactor}`
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Change to .text() since server responds with text/plain
    })
    .then(text => {
      alert(`Scaling factor updated to ${(scalingFactor * 100).toFixed(2)}%`);
      updateStatusMessage(`Scaling factor updated successfully.`, "success");
      loadCurrentScalingFactor(); // Refresh the current scaling factor display
    })
    .catch(error => {
      console.error('Error setting scaling factor:', error);
      updateStatusMessage('Error setting scaling factor: ' + error.message, "error");
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

function loadCalibrationRecords() {
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

// Helper function to update the status message with dynamic notification types
function updateStatusMessage(message, type = 'info') {
  // Define the base class for the notification
  const baseClass = 'notification';
  // Object mapping for message types to Bulma notification classes
  const typeClassMap = {
    success: 'is-success',
    error: 'is-danger',
    warning: 'is-warning',
    info: 'is-info',
    primary: 'is-primary', // You can use 'primary' for general information or start messages
    light: 'is-light' // For less prominent messages
  };

  // Remove all potential type classes to prevent class conflicts
  for (const value of Object.values(typeClassMap)) {
    statusMessage.classList.remove(value);
  }

  // Add the base notification class if not already present
  if (!statusMessage.classList.contains(baseClass)) {
    statusMessage.classList.add(baseClass);
  }

  // Add the specific class for the message type
  statusMessage.classList.add(typeClassMap[type]);

  // Set the message text
  statusMessage.innerHTML = `${message}`;
}

// Helper function to check if an element is in the viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Event listener for the Start Calibration button
startButton.addEventListener('click', function () {
  const targetVolume = parseFloat(document.getElementById('targetVolume').value);
  if (isNaN(targetVolume) || targetVolume <= 0) {
    updateStatusMessage("Please enter a valid target volume greater than zero.", 'warning');
    return;
  }

  startButton.disabled = true;
  startButton.textContent = 'Starting...';
  stopButton.disabled = false; // Enable the stop button

  fetch('/start-calibration')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      updateStatusMessage("Calibration started. Proceed with your flow and stop when done.");
    })
    .catch(error => {
      console.error('Error:', error);
      updateStatusMessage("Failed to start calibration. Please try again.", 'error');
      startButton.disabled = false; // Re-enable the start button if there's an error
    })
    .finally(() => {
      startButton.textContent = 'Start Calibration';
    });
});

stopButton.addEventListener('click', function () {
  stopButton.disabled = true; // Optional: Disable stop button after stopping
  startButton.disabled = true; // Keep start button disabled until save
  submitButton.disabled = false; // Enable save button to allow saving

  fetch('/stop-calibration')
    .then(response => response.json())
    .then(data => {
      const pulseCount = data.pulseCount;
      updatePulseCountDisplay(pulseCount); // Keep displaying the pulse count

      if (pulseCount === 0) {
        updateStatusMessage("No pulses detected. Check setup.", 'error');
      } else {
        updateStatusMessage("Calibration stopped. Verify observed volume.", 'success');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      updateStatusMessage("Failed to stop calibration. Try again.", 'error');
    })
    .finally(() => {
      stopButton.textContent = 'Stop Calibration';
      // Do not reset the pulse count here
    });
});

// Function to calculate and display pulses per litre and scaling factor
function calculatePulsesPerLitre(pulseCount) {
  const targetVolume = parseFloat(document.getElementById('targetVolume').value);
  const observedVolume = parseFloat(document.getElementById('observedVolume').value);
  const pulsesPerLitre = (observedVolume > 0) ? (pulseCount / observedVolume).toFixed(2) : "N/A";
  document.getElementById('pulsesPerLitreDisplay').textContent = pulsesPerLitre;

  // Calculate and display the scaling factor if observed and target volumes are valid
  if (observedVolume > 0 && targetVolume > 0) {
    const scalingFactor = ((targetVolume / observedVolume) * 100).toFixed(2);
    document.getElementById('scalingFactorDisplay').textContent = `${scalingFactor}%`;
  } else {
    document.getElementById('scalingFactorDisplay').textContent = "N/A";
  }
}

// Helper function to reset the calibration form
function resetCalibrationForm() {
  document.getElementById('targetVolume').value = '';
  document.getElementById('observedVolume').value = '';
  const pulseCountDisplay = document.getElementById('pulseCountDisplay');
  if (pulseCountDisplay) pulseCountDisplay.textContent = '0';
  const pulsesPerLitreDisplay = document.getElementById('pulsesPerLitreDisplay');
  if (pulsesPerLitreDisplay) pulsesPerLitreDisplay.textContent = '0.00';
  const scalingFactorDisplay = document.getElementById('scalingFactorDisplay');
  if (scalingFactorDisplay) scalingFactorDisplay.textContent = 'N/A';
  const recordId = document.getElementById('recordId');
  if (recordId) recordId.value = ''; // This assumes 'recordId' might also be dynamically created.
  startButton.disabled = false;
  stopButton.disabled = true;
  submitButton.textContent = 'Save Calibration'; // Reset the button text to default
  submitButton.disabled = true;
}