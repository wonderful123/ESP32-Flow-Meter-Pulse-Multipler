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
  const id = document.getElementById('recordId').value; // Get the record ID if present
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
      const action = id ? 'updated' : 'saved';
      updateStatusMessage(`Calibration ${action} successfully. System ready for the next calibration.`, 'success');
      resetCalibrationForm();
      loadCalibrationRecords();
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
        updateStatusMessage("Network response was not ok setting scaling factor", "error");
      }
      loadCurrentScalingFactor(); // Refresh the current scaling factor display
    })
    .catch(error => {
      console.error('Error setting scaling factor:', error);
      updateStatusMessage('Error setting scaling factor:', "error");
    });

  const formattedScalingFactor = (scalingFactor * 100).toFixed(2) + '%';
  alert(`Scaling factor updated to ${formattedScalingFactor}`);
  updateStatusMessage(`Scaling factor updated to ${formattedScalingFactor}`, "success");
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
    const pulsesPerLitre = item.observedVolume > 0 ? (item.pulseCount / item.observedVolume).toFixed(2) : "N/A";
    const volumeDeviation = item.observedVolume > 0 ? (((item.observedVolume - item.targetVolume) / item.targetVolume) * 100).toFixed(2) : "N/A";

    [{
        value: item.id
      },
      {
        value: item.targetVolume
      },
      {
        value: item.observedVolume
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
    const pulsesPerLitre = item.observedVolume > 0 ? item.pulseCount / item.observedVolume : 0;
    return acc + pulsesPerLitre;
  }, 0);
  const averagePulsesPerLitre = (calibrations.length > 0) ? (totalPulsesPerLitre / calibrations.length).toFixed(2) : "N/A";

  // Find or create the summary element
  let summaryElement = document.getElementById('calibrationSummary');
  if (!summaryElement) {
    summaryElement = document.createElement('div');
    summaryElement.id = 'calibrationSummary';
    summaryElement.className = 'notification is-primary'; // Use Bulma's notification and is-primary classes for styling
    document.getElementById('calibrationList').appendChild(summaryElement);
  }

  // Set the summary text
  summaryElement.innerHTML = `<strong>Average Pulses per Litre:</strong> ${averagePulsesPerLitre}`;
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
  stopButton.disabled = true;
  stopButton.textContent = 'Stopping...';
  submitButton.disabled = true; // Disable the submit button until we confirm pulse count is non-zero

  fetch('/stop-calibration')
    .then(response => response.json())
    .then(data => {
      const pulseCount = data.pulseCount;
      updatePulseCountDisplay(pulseCount); // Update the pulse count display with the fetched data

      if (pulseCount === 0) {
        // If pulse count is zero, display an error message
        updateStatusMessage("No pulses detected. Please check your setup and try again.", 'error');
        // Re-enable the start button to allow retrying the calibration process
        startButton.disabled = false;
        startButton.textContent = 'Start Calibration';
        submitButton.disabled = true; // Keep the submit button disabled as there's nothing valid to submit
      } else {
        // If pulse count is non-zero, proceed as normal
        updateStatusMessage("Calibration stopped. Please enter the observed volume.", 'success');
        submitButton.disabled = false; // Enable the submit button as we have valid data to submit
        // In this case, you might want to keep the start button disabled to prevent restarting the calibration before submitting
      }
    })
    .catch(error => {
      console.error('Error:', error);
      updateStatusMessage("Failed to stop calibration. Please try again.", 'error');
      stopButton.disabled = false; // Re-enable the stop button if there's an error
      startButton.disabled = false; // Ensure the start button is enabled so the user can try again
      startButton.textContent = 'Start Calibration';
    })
    .finally(() => {
      stopButton.textContent = 'Stop Calibration';
    });
});

// Function to update the pulse count display
function updatePulseCountDisplay(pulseCount) {
  const pulseCountDisplay = document.getElementById('pulseCountDisplay');
  pulseCountDisplay.textContent = pulseCount;
}

// Function to calculate and display pulses per liter and scaling factor
function calculatePulsesPerLiter(pulseCount) {
  const targetVolume = parseFloat(document.getElementById('targetVolume').value);
  const observedVolume = parseFloat(document.getElementById('observedVolume').value);
  const pulsesPerLiter = (observedVolume > 0) ? (pulseCount / observedVolume).toFixed(2) : "N/A";
  document.getElementById('pulsesPerLiterDisplay').textContent = pulsesPerLiter;

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
  document.getElementById('pulseCountDisplay').textContent = '0';
  document.getElementById('pulsesPerLitreDisplay').textContent = '0.00';
  document.getElementById('scalingFactorDisplay').textContent = 'N/A';
  document.getElementById('recordId').value = ''; // Clear the hidden ID field
  startButton.disabled = false;
  stopButton.disabled = true;
  submitButton.textContent = 'Save Calibration'; // Reset the button text to default
  submitButton.disabled = true;
}