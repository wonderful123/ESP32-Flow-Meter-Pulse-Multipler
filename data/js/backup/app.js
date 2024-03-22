// script.js

import {
  updateStatusMessage
} from './modules/UIHandlers.js';
import {
  loadCalibrationRecords
} from './modules/CalibrationRecordTable.js';

// Global references to buttons and message display
const startButton = document.getElementById('startCalibration');
const stopButton = document.getElementById('stopCalibration');
const submitButton = document.getElementById('submitCalibration');

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