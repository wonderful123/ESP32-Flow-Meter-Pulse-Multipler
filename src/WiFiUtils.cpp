// WiFiUtils.cpp
#include "WiFiUtils.h"

#include <ESPAsyncDNSServer.h>
#include <ESPAsyncWebServer.h>
#include <time.h>

#include "Logger.h"

WiFiUtils::WiFiUtils(AsyncWebServer* server, AsyncDNSServer* dns)
    : _server(server), _dns(dns), _wifiManager(server, dns) {}

void WiFiUtils::begin() {
  // Uncomment and modify to set custom AP name and password
  // _wifiManager.autoConnect("AP-NAME", "AP-PASSWORD");
  _wifiManager.autoConnect("pulse-scaler");
  // Optionally, reset settings if needed (e.g., for testing)
  // _wifiManager.resetSettings();

  if (WiFi.status() == WL_CONNECTED) {
    LOG_INFO("Connected to WiFi");
  } else {
    LOG_ERROR("Failed to connect to WiFi");
  }

  initializeTime();
}

void WiFiUtils::initializeTime() {
  configTime(0, 3600, "pool.ntp.org", "time.nist.gov");
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    _lastNtpTime = mktime(&timeinfo);  // Update last NTP time
    _lastMillis = millis();            // Update last millis value
  }
  LOG_INFO("RTC time initialized");
}

String WiFiUtils::getCurrentTimestamp() {
  struct tm timeinfo;
  time_t now;

  if (getLocalTime(&timeinfo)) {
    _lastNtpTime =
        mktime(&timeinfo);   // Update last NTP time on successful sync
    _lastMillis = millis();  // Reset millis counter
    now = _lastNtpTime;      // Use the updated NTP time
  } else if (_lastNtpTime > 0) {
    now = _lastNtpTime + (millis() - _lastMillis) /
                             1000;  // Approximate time since last NTP sync
  } else {
    return "00:00:00";  // Default time if NTP sync has never been successful
  }

  localtime_r(&now,
              &timeinfo);  // Convert the time_t to broken down time struct

  char buffer[20];  // Adjusted buffer size for the format
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(buffer);
}