const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('json-server-mock-data.json');
const middlewares = jsonServer.defaults();

server.use(middlewares); // Apply JSON Server defaults middleware (logger, static, cors and no-cache)

// Middleware to parse JSON bodies - This needs to come before your routes
server.use(jsonServer.bodyParser);

server.post('/update-calibration', (req, res) => {
  // Simulate updating a calibration record
  // For demonstration, simply return a success message
  res.jsonp({
    message: "Calibration record updated successfully."
  });
});

server.post('/delete-calibration', (req, res) => {
  // Simulate deleting a calibration record
  res.jsonp({
    message: "Calibration record deleted successfully."
  });
});

server.get('/start-calibration', (req, res) => {
  // Simulate starting a calibration
  res.jsonp({
    message: "Calibration started."
  });
});

server.get('/stop-calibration', (req, res) => {
  // Simulate stopping a calibration and returning a pulse count
  const pulseCount = 1234; // Example pulse count
  res.jsonp({
    pulseCount
  });
});

server.get('/perform-ota-update', (req, res) => {
  // Simulate an OTA update trigger
  res.jsonp({
    message: "Attempting to perform OTA update..."
  });
});

server.get('/calibration-record', (req, res) => {
  const {
    id
  } = req.query; // Assuming `id` is passed as a query parameter
  const records = router.db.get('calibrationRecords').value(); // Get all records
  const record = records.find(record => record.id === parseInt(id, 10));

  if (record) {
    res.jsonp(record);
  } else {
    res.status(404).jsonp({
      error: 'Record not found'
    });
  }
});

// calibration-factor POST request
server.post('/calibration-factor', (req, res) => {
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

server.get('/calibration-factor', (req, res) => {
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

// Example for /add-calibration-record POST request
server.post('/add-calibration-record', (req, res) => {
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
      pulseCount
    };
    router.db.get('calibrationRecords').push(newRecord).write();
    res.jsonp({
      message: "Calibration record added successfully.",
      record: newRecord
    });
  } else {
    res.status(400).jsonp({
      error: "Missing data"
    });
  }
});

server.use(router); // Use the router

server.listen(3000, () => {
  console.log('Mock server is running');
});