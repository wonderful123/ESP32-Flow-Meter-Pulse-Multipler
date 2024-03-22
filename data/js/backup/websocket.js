import {
  updateStatusMessage
} from './modules/UIHandlers.js';

const ws = new WebSocket(`ws://${window.location.hostname}/ws`);

function connectWebSocket() {
  ws.onopen = function () {
    console.log('WebSocket connection established');
    updateStatusMessage("WebSocket connection established", 'success');
  };

  ws.onerror = function (error) {
    console.error('WebSocket Error:', error);
    updateStatusMessage("WebSocket connection failed", 'error');
  };

  ws.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if (data.pulseCount !== undefined) {
      updatePulseCountDisplay(data.pulseCount);
    }
  };

  ws.onclose = function (e) {
    console.log('WebSocket connection closed. Attempting to reconnect...', e.reason);
    updateStatusMessage("WebSocket connection closed. Reconnecting...", 'warning');
    setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
  };
}

function updatePulseCountDisplay(pulseCount) {
  const pulseCountDisplay = document.getElementById('pulseCountDisplay');
  if (pulseCountDisplay) { // Check if the element exists
    pulseCountDisplay.textContent = pulseCount;
  }
}

// Initialize WebSocket connection
connectWebSocket();