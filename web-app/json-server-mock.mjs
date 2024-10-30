import jsonServer from "json-server";
const server = jsonServer.create();
const router = jsonServer.router("json-server-mock-data.json");
const middlewares = jsonServer.defaults();
import WebSocket, { WebSocketServer } from "ws";

// Settings
const WEB_APP_URL = "http://localhost:8080";
const API_PREFIX = "/api/v1";
const API_SERVER_PORT = 3000;
const WEBSOCKET_SERVER_PORT = 8085;
const PULSE_COUNT_UPDATE_INTERVAL = 10; // in milliseconds

// Create a WebSocket server
const wss = new WebSocketServer({
  port: WEBSOCKET_SERVER_PORT,
  path: "/ws",
});
const clients = new Set();

// Function to generate consistent JSON response format
function jsonResponse(statusCode, message, data = null) {
  return {
    status: statusCode === 200 || statusCode === 201 ? "success" : "error",
    message,
    data,
  };
}

// Handle WebSocket connections
wss.on("connection", ws => {
  console.log(`[MOCK-SERVER][WEBSOCKET] WebSocket client connected. Total clients: ${clients.size + 1}`);
  console.log(
    `[MOCK-SERVER][WEBSOCKET] Web App URL: ${WEB_APP_URL} API Port: ${API_SERVER_PORT} API Prefix: ${API_PREFIX} WebSocket Port: ${WEBSOCKET_SERVER_PORT}`
  );
  clients.add(ws);

  ws.on("message", message => {
    const data = JSON.parse(message);
    if (data.action === "checkForUpdate") {
      // Simulate checking for firmware update
      const currentVersion = "1.0.0";
      const newVersion = "1.1.0";
      const updateAvailable = currentVersion !== newVersion;

      if (updateAvailable) {
        const response = {
          type: "updateAvailable",
          currentVersion,
          newVersion,
          changes: "Bug fixes and performance improvements",
        };
        ws.send(JSON.stringify(response));
        console.log(`[MOCK-SERVER][WEBSOCKET] Firmware update available: ${currentVersion} -> ${newVersion}`);
      } else {
        const response = {
          type: "noUpdate",
          message: "[MOCK-SERVER] Firmware is up to date",
        };
        ws.send(JSON.stringify(response));
        console.log("[MOCK-SERVER][WEBSOCKET] Firmware is up to date");
      }
    }
  });

  ws.on("close", () => {
    console.log(`[MOCK-SERVER][WEBSOCKET] WebSocket client disconnected. Total clients: ${clients.size - 1}`);
    clients.delete(ws);
  });
});

/******** Simulate pulse count data ********/
let pulseCount = 0;
let isPulseCountingActive = false;

function startPulseCountSimulation() {
  if (!isPulseCountingActive) {
    pulseCount = 0;
    console.log("[MOCK-SERVER][WEBSOCKET] Pulse count simulation started.");
    isPulseCountingActive = true;
    sendPulseCountUpdate();
  } else {
    console.log("[MOCK-SERVER][WEBSOCKET] Pulse count simulation is already running.");
  }
}

function stopPulseCountSimulation() {
  if (isPulseCountingActive) {
    console.log("[MOCK-SERVER][WEBSOCKET] Pulse count simulation stopped.");
    isPulseCountingActive = false;
  } else {
    console.log("[MOCK-SERVER][WEBSOCKET] Pulse count simulation is not running.");
  }
}

function sendPulseCount() {
  const message = {
    type: "pulseUpdate",
    data: {
      inputPulseCount: pulseCount,
      outputPulseCount: pulseCount * 1.3,
      inputFrequency: 1000,
      outputFrequency: 1300,
    },
  };

  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
      console.log(`[MOCK-SERVER][WEBSOCKET] Pulse count updated: ${pulseCount}`);
    }
  });
}

function sendPulseCountUpdate() {
  if (!isPulseCountingActive) return;

  pulseCount += Math.floor(Math.random() * 5); // Increment pulse count by a random value between 0 and 4
  sendPulseCount();
  setTimeout(sendPulseCountUpdate, PULSE_COUNT_UPDATE_INTERVAL);
}

/******** End of pulse count data ********/

// Allow CORS with specific methods
server.use(middlewares);
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", WEB_APP_URL);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Middleware to parse JSON bodies - This needs to come before your routes
server.use(jsonServer.bodyParser);

// Route to get the calibration mode
server.get(`${API_PREFIX}/calibration/mode`, (req, res) => {
  // Retrieve the calibration settings from the database
  const calibrationMode = router.db.get("calibrationSettings").value();

  // Respond with the mode
  res.status(200).jsonp(jsonResponse(200, "Fetched calibration mode.", calibrationMode));

  // Log the fetched mode
  console.log(`[MOCK-SERVER][API] Fetched calibration mode: ${calibrationMode}`);
});

// Route to set the calibration mode
server.put(`${API_PREFIX}/calibration/mode`, (req, res) => {
  const { mode } = req.body;

  if (mode === "fixed" || mode === "temperature") {
    router.db.get("calibrationSettings").assign({ mode }).write();
    console.log(`[MOCK-SERVER][API] Calibration mode set to: ${mode}`);
    res.status(200).jsonp(jsonResponse(200, "Calibration mode updated successfully.", { mode }));
  } else {
    res.status(400).jsonp(jsonResponse(400, "[MOCK-SERVER] Invalid calibration mode"));
    console.log("[MOCK-SERVER][API] Invalid calibration mode");
  }
});

// Route to get the fixed calibration factor
server.get(`${API_PREFIX}/calibration/fixed-factor`, (req, res) => {
  const calibrationSettings = router.db.get("calibrationSettings").value();
  const fixedCalibrationFactor = calibrationSettings.fixedCalibrationFactor;
  res.status(200).jsonp(jsonResponse(200, "Fetched fixed calibration factor.", { "fixedCalibrationFactor": fixedCalibrationFactor }));
  console.log(`[MOCK-SERVER][API] Fetched fixed calibration factor: ${fixedCalibrationFactor}`);
});

// Route to set the fixed calibration factor
server.put(`${API_PREFIX}/calibration/fixed-factor`, (req, res) => {
  const { factor } = req.body;

  if (typeof factor === "number" && factor > 0) {
    router.db.get("calibrationSettings").assign({ fixedCalibrationFactor: factor }).write();
    console.log(`[MOCK-SERVER][API] Fixed calibration factor set to: ${factor}`);
    res
      .status(200)
      .jsonp(jsonResponse(200, "Fixed calibration factor updated successfully.", { fixedCalibrationFactor: factor }));
  } else {
    res.status(400).jsonp(jsonResponse(400, "[MOCK-SERVER] Invalid calibration factor"));
    console.log("[MOCK-SERVER][API] Invalid calibration factor");
  }
});

// GET /api/calibration-records
server.get(`${API_PREFIX}/calibration-records`, (req, res) => {
  const records = router.db.get("calibrationRecords").value();
  res.status(200).jsonp(jsonResponse(200, "Fetched calibration records.", records));
  console.log("[MOCK-SERVER][API] Fetched calibration records");
});

// GET /api/calibration-records/:id
server.get(`${API_PREFIX}/calibration-records/:id`, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const record = router.db
    .get("calibrationRecords")
    .find({
      id,
    })
    .value();

  if (record) {
    res.status(200).jsonp(jsonResponse(200, `Fetched calibration record with ID: ${id}`, record));
    console.log(`[MOCK-SERVER][API] Fetched calibration record with ID: ${id}`);
  } else {
    res.status(404).jsonp(jsonResponse(404, "[MOCK-SERVER] Calibration record not found"));
    console.log(`[MOCK-SERVER][API] Calibration record with ID ${id} not found`);
  }
});

// POST /api/calibration-records
server.post(`${API_PREFIX}/calibration-records`, (req, res) => {
  const { targetOilVolume, observedOilVolume, pulseCount } = req.body;

  if (targetOilVolume !== undefined && observedOilVolume !== undefined && pulseCount !== undefined) {
    const newRecord = {
      id: Date.now(),
      targetOilVolume,
      observedOilVolume,
      pulseCount,
      createdAt: new Date().toISOString(),
    };

    router.db.get("calibrationRecords").push(newRecord).write();
    res.status(201).jsonp(jsonResponse(201, "Calibration record added successfully.", newRecord));
    console.log("[MOCK-SERVER][API] New calibration record created");
  } else {
    let missingFields = [];
    if (targetOilVolume === undefined) missingFields.push("targetOilVolume");
    if (observedOilVolume === undefined) missingFields.push("observedOilVolume");
    if (pulseCount === undefined) missingFields.push("pulseCount");
    res.status(400).jsonp(jsonResponse(400, `[MOCK-SERVER] Missing required fields: ${missingFields.join(", ")}`));
    console.log("[MOCK-SERVER][API] Missing required fields for creating a new calibration record");
  }
});

// PUT /api/calibration-records/:id
server.put(`${API_PREFIX}/calibration-records/:id`, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { oilTemperature, targetOilVolume, observedOilVolume, pulseCount } = req.body;
  const record = router.db.get("calibrationRecords").find({ id }).value();

  if (record) {
    if (oilTemperature !== undefined) record.oilTemperature = oilTemperature;
    if (targetOilVolume !== undefined) record.targetOilVolume = targetOilVolume;
    if (observedOilVolume !== undefined) record.observedOilVolume = observedOilVolume;
    if (pulseCount !== undefined) record.pulseCount = pulseCount;

    router.db.get("calibrationRecords").find({ id }).assign(record).write();
    res.status(200).jsonp(jsonResponse(200, "Calibration record updated successfully.", record));
    console.log("[MOCK-SERVER][API] Calibration record updated successfully");
  } else {
    res.status(404).jsonp(jsonResponse(404, "[MOCK-SERVER] Calibration record not found"));
    console.log(`[MOCK-SERVER][API] Calibration record with ID ${id} not found`);
  }
});

// DELETE /api/calibration-records/:id
server.delete(`${API_PREFIX}/calibration-records/:id`, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const record = router.db.get("calibrationRecords").find({ id }).value();

  if (record) {
    router.db.get("calibrationRecords").remove({ id }).write();
    res.status(200).jsonp(jsonResponse(200, "Calibration record deleted successfully."));
    console.log(`[MOCK-SERVER][API] Calibration record with ID ${id} deleted`);
  } else {
    res.status(404).jsonp(jsonResponse(404, "[MOCK-SERVER] Calibration record not found"));
    console.log(`[MOCK-SERVER][API] Calibration record with ID ${id} not found`);
  }
});

// Route to start pulse count simulation
server.get(`${API_PREFIX}/calibration/start`, (req, res) => {
  startPulseCountSimulation();
  console.log("[MOCK-SERVER][API] Calibration started.");
  res.status(200).jsonp(jsonResponse(200, "[MOCK-SERVER] Calibration started."));
});

// Route to stop pulse count simulation
server.get(`${API_PREFIX}/calibration/stop`, (req, res) => {
  stopPulseCountSimulation();
  console.log("[MOCK-SERVER][API] Calibration stopped.");
  res.status(200).jsonp(jsonResponse(200, "[MOCK-SERVER] Calibration stopped.", { pulseCount }));
});

// Route to reset pulse count
server.get(`${API_PREFIX}/calibration/reset`, (req, res) => {
  pulseCount = 0;
  sendPulseCount();
  console.log("[MOCK-SERVER][API] Calibration pulse counter reset.");
  res.status(200).jsonp(jsonResponse(200, "[MOCK-SERVER] Calibration pulse counter reset.", { pulseCount }));
});

// Route to check firmware version
server.get(`${API_PREFIX}/firmware-version`, (req, res) => {
  // Trigger the firmware update check
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "checkForUpdate",
        })
      );
    }
  });

  const currentVersion = router.db.get("firmware").value().currentVersion;
  console.log("[MOCK-SERVER][API] Firmware update check initiated");

  res.status(200).jsonp(jsonResponse(200, "[MOCK-SERVER] Firmware update check initiated.", { currentVersion }));
});

// Route to simulate firmware OTA update
server.post(`${API_PREFIX}/firmware-update`, (req, res) => {
  // Simulate the OTA update process
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      const messages = [
        { type: "status", message: "Starting OTA update..." },
        { type: "progress", percentage: 25 },
        { type: "progress", percentage: 50 },
        { type: "progress", percentage: 75 },
        { type: "progress", percentage: 100 },
        { type: "updateCompleted", newVersion: "1.1.0" },
      ];

      messages.forEach((msg, index) => {
        setTimeout(() => {
          client.send(JSON.stringify(msg));
          console.log(`[MOCK-SERVER][WEBSOCKET] ${msg.type}: ${msg.message || msg.percentage || msg.newVersion}`);
        }, index * 1000);
      });
    }
  });

  console.log("[MOCK-SERVER][API] Attempting to perform OTA update");

  res.status(200).jsonp(jsonResponse(200, "[MOCK-SERVER] Attempting to perform OTA update."));
});

server.use(router); // Use the router

server.listen(API_SERVER_PORT, () => {
  console.log(`\x1b[32m[MOCK-SERVER] Mock API server is running at http://localhost:${API_SERVER_PORT}\x1b[0m`);
  console.log(`\x1b[34m[MOCK-SERVER] WebSocket server is running at ws://localhost:${WEBSOCKET_SERVER_PORT}\x1b[0m`);
  console.log(`\x1b[35m[MOCK-SERVER] Ensure your web app is running at ${WEB_APP_URL}\x1b[0m`);
});
