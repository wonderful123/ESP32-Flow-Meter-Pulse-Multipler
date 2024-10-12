#include "WiFi/WiFiManager.h"

#include <WiFi.h>
#include <time.h>

#include "Logger.h"
#include "Settings.h"
#include "WiFi/CaptivePortal.h"

WiFiManager::WiFiManager(AsyncWebServer& server) : _server(server) {
  // Register the event handler using a lambda
  WiFi.onEvent([this](WiFiEvent_t event, WiFiEventInfo_t info) {
    handleWiFiEvent(event);
  });
}

void WiFiManager::begin() {
  WiFi.mode(WIFI_AP_STA);  // Initialize Wi-Fi in both AP and STA modes

  if (!connectWithStoredCredentials()) {
    startSoftAP();
    LOG_INFO("Starting Captive Portal...");
    if (!_captivePortal) {
      _captivePortal = new CaptivePortal(*this, _server);
    }
    _captivePortal->begin();
  }
}

void WiFiManager::startSoftAP() {
  LOG_INFO("Starting SoftAP...");
  WiFi.softAP(AP_SSID_NAME);

  dnsServer.setErrorReplyCode(AsyncDNSReplyCode::NoError);
  dnsServer.start(53, "*", WiFi.softAPIP());

  LOG_INFO("SoftAP started. SSID: {} IP: {}", AP_SSID_NAME,
           WiFi.softAPIP().toString().c_str());
}

void WiFiManager::connectToWiFi(const std::string& ssid,
                                const std::string& password) {
  LOG_INFO("Connecting to Wi-Fi: {}", ssid);
  WiFi.begin(ssid.c_str(), password.c_str());

  int timeout = 10000;  // 10 seconds timeout
  unsigned long startAttemptTime = millis();

  while (WiFi.status() != WL_CONNECTED &&
         millis() - startAttemptTime < timeout) {
    delay(500);
  }

  if (WiFi.status() == WL_CONNECTED) {
    LOG_INFO("Wi-Fi connected successfully!");
  } else {
    LOG_ERROR("Wi-Fi connection failed, starting SoftAP...");
    startSoftAP();
  }
}

bool WiFiManager::connectWithStoredCredentials() {
  // if (WiFi.SSID() != "") {
    LOG_INFO("Connecting to stored Wi-Fi: {}", WiFi.SSID());
    WiFi.begin(WiFi.SSID().c_str(), WiFi.psk().c_str());
  WiFi.begin("GretaThurnberg", "trump2020");
    int timeout = 10000;
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
    }
  // }

  return false;
}

void WiFiManager::monitorWiFi() {
  processDNSRequests();
  if (WiFi.status() != WL_CONNECTED && !_isConnecting) {
    LOG_INFO("Wi-Fi disconnected, attempting to reconnect...");
    _isConnecting = true;
    connectWithStoredCredentials();
    _isConnecting = false;
  }
}

void WiFiManager::processDNSRequests() {}  // dnsServer.processRequest(); }

void WiFiManager::handleWiFiEvent(WiFiEvent_t event) {
  switch (event) {
    case SYSTEM_EVENT_STA_DISCONNECTED:
      LOG_WARN("Wi-Fi disconnected.");
      // startSoftAP();
      break;
    case SYSTEM_EVENT_AP_START:
      LOG_INFO("SoftAP started.");
      break;
    case SYSTEM_EVENT_AP_STOP:
      LOG_INFO("SoftAP stopped.");
      break;
    case SYSTEM_EVENT_STA_GOT_IP:
      LOG_INFO("Wi-Fi connected. IP address: {}",
               WiFi.localIP().toString().c_str());
      dnsServer.stop();
      break;
    default:
      LOG_DEBUG("Unhandled Wi-Fi event: {}", event);
      break;
  }
}

void WiFiManager::initializeTime() {
  configTime(0, 3600, "pool.ntp.org", "time.nist.gov");
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    _lastNtpTime = mktime(&timeinfo);
    _lastMillis = millis();
  }
  LOG_INFO("RTC time initialized");
}

std::string WiFiManager::getCurrentTimestamp() {
  struct tm timeinfo;
  time_t now;

  if (getLocalTime(&timeinfo)) {
    _lastNtpTime = mktime(&timeinfo);
    _lastMillis = millis();
    now = _lastNtpTime;
  } else if (_lastNtpTime > 0) {
    now = _lastNtpTime + (millis() - _lastMillis) / 1000;
  } else {
    return "00:00:00";
  }

  localtime_r(&now, &timeinfo);

  char buffer[20];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return std::string(buffer);
}