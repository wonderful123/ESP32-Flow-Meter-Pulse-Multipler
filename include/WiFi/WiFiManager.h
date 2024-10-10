#pragma once

#include <WiFi.h>

#include <string>

class WiFiManager {
 public:
  WiFiManager();
  void begin();  // Start the Wi-Fi manager, decide to connect or use SoftAP
  void startSoftAP();  // Start SoftAP for Wi-Fi provisioning
  void connectToWiFi(
      const std::string& ssid,
      const std::string& password);  // Attempt to connect to a network
  void monitorWiFi();  // Check Wi-Fi status and manage reconnections
  std::string getCurrentTimestamp();
  bool isConnecting();           // Check if connection is still ongoing
  String getConnectionStatus();  // Provide connection status for AJAX

 private:
  bool connectWithStoredCredentials();  // Connect using saved credentials
  static void handleWiFiEvent(
      WiFiEvent_t event);  // Static member function to handle Wi-Fi events

  int connectionRetries = 3;   // Number of retries before fallback
  bool _isConnecting = false;  // Track if connection is ongoing

  time_t _lastNtpTime = 0;  // Stores the last known NTP time
  unsigned long _lastMillis =
      0;  // Stores the millis() value at the last NTP sync
  void initializeTime();
};
