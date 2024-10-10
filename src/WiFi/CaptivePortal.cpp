#include "WiFi/CaptivePortal.h"

#include "Logger.h"

CaptivePortal::CaptivePortal(WiFiManager& wifiManager)
    : _server(80),
      _wifiManager(wifiManager) {}  // Initialize with WiFiManager reference

void CaptivePortal::begin() {
  setupRoutes();
  _server.begin();
  LOG_INFO("Captive portal started.");
}

void CaptivePortal::stop() {
  _server.end();
  LOG_INFO("Captive portal stopped.");
}

void CaptivePortal::handleConnectionStatus(AsyncWebServerRequest* request) {
  if (WiFi.status() == WL_CONNECTED) {
    request->send(200, "text/plain", "Connection successful!");
  } else {
    request->send(200, "text/plain", "Still connecting...");
  }
}

void CaptivePortal::setupRoutes() {
  _server.on("/", HTTP_GET, [this](AsyncWebServerRequest* request) {
    request->send(
        200, "text/html",
        "<html><body>"
        "<h1>Wi-Fi Setup</h1>"
        "<form action='/wifi' method='POST' onsubmit='startConnection()'>"
        "<label for='ssid'>SSID:</label>"
        "<input type='text' id='ssid' name='ssid'><br><br>"
        "<label for='password'>Password:</label>"
        "<input type='password' id='password' name='password'><br><br>"
        "<input type='submit' value='Submit'>"
        "</form>"
        "<div id='feedback'></div>"
        "<script>"
        "function startConnection() {"
        "    document.getElementById('feedback').innerHTML = 'Connecting...';"
        "    setTimeout(checkStatus, 2000);"
        "}"
        "function checkStatus() {"
        "    var xhr = new XMLHttpRequest();"
        "    xhr.onreadystatechange = function() {"
        "        if (xhr.readyState == 4 && xhr.status == 200) {"
        "            document.getElementById('feedback').innerHTML = "
        "xhr.responseText;"
        "            if (xhr.responseText == 'Connection successful!') {"
        "                clearTimeout(checkStatus);"
        "            } else {"
        "                setTimeout(checkStatus, 2000);"
        "            }"
        "        }"
        "    };"
        "    xhr.open('GET', '/connection-status', true);"
        "    xhr.send();"
        "}"
        "</script>"
        "</body></html>");
  });

  // Route for form submission
  _server.on("/wifi", HTTP_POST, [this](AsyncWebServerRequest* request) {
    handleWiFiForm(request);
  });

  // Route for real-time connection status updates
  _server.on("/connection-status", HTTP_GET,
             [this](AsyncWebServerRequest* request) {
               handleConnectionStatus(request);
             });

  // Route for switching to SoftAP mode via URL
  _server.on(
      "/switch-to-softap", HTTP_GET, [this](AsyncWebServerRequest* request) {
        switchToSoftAP();
        request->send(
            200, "text/html",
            "<html><body><h1>Switched to SoftAP Mode</h1></body></html>");
      });
}

void CaptivePortal::handleWiFiForm(AsyncWebServerRequest* request) {
  if (request->hasParam("ssid", true) && request->hasParam("password", true)) {
    String ssid = request->getParam("ssid", true)->value();
    String password = request->getParam("password", true)->value();

    if (ssid.length() == 0) {
      request->send(400, "text/html",
                    "<html><body><h1>Error</h1><p>SSID cannot be "
                    "empty!</p></body></html>");
      return;
    }

    Serial.println("Received Wi-Fi credentials from form:");
    Serial.print("SSID: ");
    Serial.println(ssid);
    Serial.print("Password: ");
    Serial.println(password);

    // Stop captive portal and switch to STA mode to connect
    stop();
    _wifiManager.connectToWiFi(ssid.c_str(), password.c_str());

    request->send(200, "text/html",
                  "<html><body><h1>Connecting...</h1><p>Attempting to connect "
                  "to Wi-Fi...</p></body></html>");
  } else {
    request->send(400, "text/html",
                  "<html><body><h1>Error</h1><p>Missing SSID or "
                  "password!</p></body></html>");
  }
}

void CaptivePortal::switchToSoftAP() {
  _wifiManager.startSoftAP();  // Start SoftAP mode
  LOG_INFO("Switched to SoftAP mode.");
}