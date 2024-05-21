import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('json-server-mock-data.json');
const middlewares = jsonServer.defaults();
import WebSocket, {
  WebSocketServer
} from 'ws';

// Settings
const WEB_APP_URL = 'http://localhost:8080';
const API_SERVER_PORT = 3000;
const WEBSOCKET_SERVER_PORT = 8085;
const PULSE_COUNT_UPDATE_INTERVAL = 100; // in milliseconds

// Create a WebSocket server
const wss = new WebSocketServer({
  port: WEBSOCKET_SERVER_PORT,
  path: '/ws',
});
const clients = new Set();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log(`WebSocket client connected. Total clients: ${clients.size + 1}`);
  clients.add(ws);

  ws.on('close', () => {
    console.log(`WebSocket client disconnected. Total clients: ${clients.size - 1}`);
    clients.delete(ws);
  });
});

// Simulate pulse count data
let pulseCount = 0;
let isPulseCountingActive = false;

function startPulseCountSimulation() {
  if (!isPulseCountingActive) {
    pulseCount = 0;
    console.log('Pulse count simulation started.');
    isPulseCountingActive = true;
    sendPulseCountUpdate();
  }
}

startPulseCountSimulation(); // Start the simulation on server startup

function stopPulseCountSimulation() {
  if (isPulseCountingActive) {
    console.log('Pulse count simulation stopped.');
    isPulseCountingActive = false;
  }
}

function sendPulseCountUpdate() {
  if (!isPulseCountingActive) return;

  pulseCount += Math.floor(Math.random() * 5); // Increment pulse count by a random value between 0 and 4

  const message = {
    type: 'pulseCount',
    data: pulseCount,
  };

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });

  setTimeout(sendPulseCountUpdate, PULSE_COUNT_UPDATE_INTERVAL);
}

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

server.post('/api/calibration-factor', (req, res) => {
  const factor = req.body.calibrationFactor;
  if (factor !== undefined) {
    // Update the calibration factor
    router.db.set('calibrationFactor.value', factor).write();
    res.jsonp({
      message: "Calibration factor updated successfully."
    });
  } else {
    res.status(400).jsonp({
      error: "Missing calibrationFactor parameter."
    });
  }
});

server.get('/api/calibration-factor', (req, res) => {
  const calibrationFactor = router.db.get('calibrationFactor.value').value();
  res.jsonp({
    calibrationFactor
  });
});

// GET /api/calibration-records
server.get('/api/calibration-records', (req, res) => {
  const records = router.db.get('calibrationRecords').value();
  res.jsonp(records);
});

// GET /api/calibration-records/:id
server.get('/api/calibration-records/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const record = router.db.get('calibrationRecords').find({
    id
  }).value();

  if (record) {
    res.jsonp(record);
  } else {
    res.status(404).jsonp({
      error: 'Calibration record not found'
    });
  }
});

// POST /api/calibration-records
server.post('/api/calibration-records', (req, res) => {
  const {
    targetVolume,
    observedVolume,
    pulseCount
  } = req.body;

  if (targetVolume !== undefined && observedVolume !== undefined && pulseCount !== undefined) {
    const newRecord = {
      id: Date.now(),
      targetVolume,
      observedVolume,
      pulseCount,
      createdAt: new Date().toISOString(),
    };

    router.db.get('calibrationRecords').push(newRecord).write();
    res.status(201).jsonp(newRecord);
  } else {
    res.status(400).jsonp({
      error: 'Missing required fields'
    });
  }
});

// PUT /api/calibration-records/:id
server.put('/api/calibration-records/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const {
    targetVolume,
    observedVolume,
    pulseCount
  } = req.body;
  const record = router.db.get('calibrationRecords').find({
    id
  }).value();

  if (record) {
    if (targetVolume !== undefined) record.targetVolume = targetVolume;
    if (observedVolume !== undefined) record.observedVolume = observedVolume;
    if (pulseCount !== undefined) record.pulseCount = pulseCount;

    router.db.get('calibrationRecords').find({
      id
    }).assign(record).write();
    res.jsonp(record);
  } else {
    res.status(404).jsonp({
      error: 'Calibration record not found'
    });
  }
});

// DELETE /api/calibration-records/:id
server.delete('/api/calibration-records/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const record = router.db.get('calibrationRecords').find({
    id
  }).value();

  if (record) {
    router.db.get('calibrationRecords').remove({
      id
    }).write();
    res.sendStatus(204);
  } else {
    res.status(404).jsonp({
      error: 'Calibration record not found'
    });
  }
});

// Route to start pulse count simulation
server.get('/api/calibration/start', (req, res) => {
  startPulseCountSimulation();
  console.log('Calibration started.');
  res.jsonp({
    message: "Calibration started."
  });
});

// Route to stop pulse count simulation
server.get('/api/calibration/stop', (req, res) => {
  stopPulseCountSimulation();
  console.log('Calibration stopped.');
  res.jsonp({
    message: "Calibration stopped.",
    pulseCount: pulseCount
  });
});

server.get('/api/firmware-version', (req, res) => {
  res.jsonp({
    message: "Update check initiated."
  });
});

server.post('/api/firmware-update', (req, res) => {
  res.jsonp({
    message: "Attempting to perform OTA update..."
  });
});

server.use(router); // Use the router

server.listen(API_SERVER_PORT, () => {
  console.log(`\x1b[32m[MOCK-SERVER] Mock API server is running at http://localhost:${API_SERVER_PORT}\x1b[0m`);
  console.log(`\x1b[34m[MOCK-SERVER] WebSocket server is running at ws://localhost:${WEBSOCKET_SERVER_PORT}\x1b[0m`);
  console.log(`\x1b[35m[MOCK-SERVER] Ensure your web app is running at ${WEB_APP_URL}\x1b[0m`);
});