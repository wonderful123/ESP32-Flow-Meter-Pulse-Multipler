const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('json-server-mock-data.json');
const middlewares = jsonServer.defaults();
const WebSocket = require('ws');

// Websocket Setup
// Create a WebSocket server
const wss = new WebSocket.Server({
  port: 8080
});

// Store connected clients
const clients = new Set();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clients.delete(ws);
  });
});

// Simulate pulseCount messages every 5 seconds
setInterval(() => {
  const pulseCount = Math.floor(Math.random() * 1000); // Generate a random pulseCount

  // Send pulseCount message to all connected clients
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`{ "type": "pulseCount", "data": ${pulseCount} }`);
    }
  });
}, 5000);

// End of Websocket Setup

// Allow CORS with specific methods
server.use(middlewares);
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // Allows access from the dev server
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Middleware to parse JSON bodies - This needs to come before your routes
server.use(jsonServer.bodyParser);

server.post('/api/update-calibration', (req, res) => {
  // Simulate updating a calibration record
  // For demonstration, simply return a success message
  res.jsonp({
    message: "Calibration record updated successfully."
  });
});

server.post('/api/delete-calibration', (req, res) => {
  // Simulate deleting a calibration record
  res.jsonp({
    message: "Calibration record deleted successfully."
  });
});

server.get('/api/start-calibration', (req, res) => {
  // Simulate starting a calibration
  res.jsonp({
    message: "Calibration started."
  });
});

server.get('/api/stop-calibration', (req, res) => {
  // Simulate stopping a calibration and returning a pulse count
  const pulseCount = 1234; // Example pulse count
  res.jsonp({
    pulseCount
  });
});

server.get('/api/perform-ota-update', (req, res) => {
  // Simulate an OTA update trigger
  res.jsonp({
    message: "Attempting to perform OTA update..."
  });
});

// calibration-factor POST request
server.post('/api/calibration-factor', (req, res) => {
  const factor = req.body.calibrationFactor;
  if (factor !== undefined) {
    // Simplified: Update the first calibrationFactor record with new value
    const calibrationFactors = router.db.get('calibrationFactor');
    if (calibrationFactors.value().length > 0) {
      calibrationFactors.nth(0).assign({
        value: factor
      }).write();
      res.jsonp({
        message: "Calibration factor updated successfully."
      });
    } else {
      res.status(404).jsonp({
        error: "Calibration factor record not found."
      });
    }
  } else {
    res.status(400).jsonp({
      error: "Missing calibrationFactor parameter."
    });
  }
});

server.get('/api/calibration-factor', (req, res) => {
  // Accessing the nested calibrationFactor
  const calibrationFactor = router.db.get('get-calibration-factor.calibrationFactor').value();

  if (calibrationFactor !== undefined) {
    res.jsonp({
      calibrationFactor
    });
  } else {
    res.status(404).jsonp({
      error: "Calibration factor not found."
    });
  }
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
      id: Date.now(), // Use timestamp as a simple ID
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
    if (targetVolume !== undefined) {
      record.targetVolume = targetVolume;
    }
    if (observedVolume !== undefined) {
      record.observedVolume = observedVolume;
    }
    if (pulseCount !== undefined) {
      record.pulseCount = pulseCount;
    }

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

server.use(router); // Use the router

server.listen(3000, () => {
  console.log('Mock server is running');
});