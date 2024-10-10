#include "WiFi/WiFiManager.h"

#include <WiFi.h>
#include <time.h>

#include "Logger.h"
#include "Settings.h"
#include "WiFi/CaptivePortal.h"

WiFiManager::WiFiManager() {
  // Register the event handler as a static function
  WiFi.onEvent(handleWiFiEvent);
}

void WiFiManager::begin() {
  if (!connectWithStoredCredentials()) {
    startSoftAP();  // Start SoftAP if no stored credentials
  }
}

void WiFiManager::startSoftAP() {
  WiFi.softAP(MDNS_DOMAIN_NAME);
  LOG_INFO("SoftAP started. SSID: {}", MDNS_DOMAIN_NAME);
}

void WiFiManager::connectToWiFi(const std::string& ssid,
                                const std::string& password) {
  int retries = 3;  // Retry connection 3 times
  while (retries-- > 0) {
    LOG_INFO("Connecting to Wi-Fi: {}", ssid);
    WiFi.begin(ssid.c_str(), password.c_str());

    int timeout = 10000;  // 10 seconds timeout
    unsigned long startAttemptTime = millis();

    while (WiFi.status() != WL_CONNECTED &&
           millis() - startAttemptTime < timeout) {
      delay(500);
      Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
      LOG_INFO("Wi-Fi connected successfully!");
      break;  // Exit if connected
    } else {
      LOG_INFO("Wi-Fi connection failed, retrying...");
    }
  }

  if (WiFi.status() != WL_CONNECTED) {
    LOG_INFO("All connection attempts failed. Starting SoftAP...");
    startSoftAP();  // Fallback to SoftAP if connection fails after retries
  }
}

bool WiFiManager::connectWithStoredCredentials() {
  // Check if stored credentials are available
  if (WiFi.SSID() != "") {
    LOG_INFO("Connecting to stored Wi-Fi: {}", WiFi.SSID());
    WiFi.begin();  // Connect using saved SSID and password

    int timeout = 10000;  // 10 seconds timeout
    unsigned long startAttemptTime = millis();

    while (WiFi.status() != WL_CONNECTED &&
           millis() - startAttemptTime < timeout) {
      delay(500);
      Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
      LOG_INFO("Wi-Fi connected using stored credentials!");
      return true;
    } else {
      LOG_INFO("Failed to connect using stored credentials.");
      return false;
    }
  } else {
    LOG_INFO("No stored credentials found.");
    return false;
  }
}

void WiFiManager::monitorWiFi() {
  if (WiFi.status() != WL_CONNECTED) {
    LOG_INFO("Wi-Fi disconnected, attempting to reconnect...");
    connectWithStoredCredentials();

    // Fallback to SoftAP if unable to reconnect after retries
    if (WiFi.status() != WL_CONNECTED) {
      LOG_INFO("Reconnection failed, switching to SoftAP...");
      startSoftAP();
    }
  }
}

void WiFiManager::handleWiFiEvent(WiFiEvent_t event) {
  switch (event) {
    case SYSTEM_EVENT_STA_DISCONNECTED:
      LOG_INFO("Wi-Fi disconnected.");
      // Optionally start SoftAP or handle reconnection logic
      break;
    case SYSTEM_EVENT_STA_CONNECTED:
      LOG_INFO("Wi-Fi connected.");
      break;
    case SYSTEM_EVENT_AP_START:
      LOG_INFO("SoftAP started.");
      break;
    case SYSTEM_EVENT_AP_STOP:
      LOG_INFO("SoftAP stopped.");
      break;
    default:
      break;
  }
}

void WiFiManager::initializeTime() {
  configTime(0, 3600, "pool.ntp.org", "time.nist.gov");
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    _lastNtpTime = mktime(&timeinfo);  // Update last NTP time
    _lastMillis = millis();            // Update last millis value
  }
  LOG_INFO("RTC time initialized");
}

std::string WiFiManager::getCurrentTimestamp() {
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
  return std::string(buffer);
}
