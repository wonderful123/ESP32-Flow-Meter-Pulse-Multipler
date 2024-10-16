// RouteHandler.h
#pragma once

#include <ESPAsyncWebServer.h>

#include "Calibration/CalibrationManager.h"
#include "InputPulseMonitor.h"
#include "OTAUpdater.h"

// Forward declaration
class WebServerManager;

class RouteHandler {
 public:
  RouteHandler(CalibrationManager& calibrationManager,
               InputPulseMonitor& inputPulseMonitor, OTAUpdater& otaUpdater,
               WebServerManager& webServerManager);
  void registerRoutes(AsyncWebServer& server);

 private:
  CalibrationManager& _calibrationManager;
  InputPulseMonitor& _inputPulseMonitor;
  OTAUpdater& _otaUpdater;
  WebServerManager& _webServerManager;

  // Helper functions
  void sendJsonResponse(AsyncWebServerRequest* request, int statusCode,
                        const char* message, JsonDocument data);
  String buildFullPath(const char* path);

  // Declaration of route handling methods
  void getCalibrationRecords(AsyncWebServerRequest* request);
  void getCalibrationRecord(AsyncWebServerRequest* request);
  void addCalibrationRecord(AsyncWebServerRequest* request);
  void editCalibrationRecord(AsyncWebServerRequest* request);
  void deleteCalibrationRecord(AsyncWebServerRequest* request);
  void startCalibration(AsyncWebServerRequest* request);
  void stopCalibration(AsyncWebServerRequest* request);
  void resetCalibration(AsyncWebServerRequest* request);
  void getFirmwareVersion(AsyncWebServerRequest* request);
  void handleOTAUpdate(AsyncWebServerRequest* request);
  void handleNotFound(AsyncWebServerRequest* request);
};