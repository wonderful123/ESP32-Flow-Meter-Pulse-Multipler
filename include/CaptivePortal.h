#pragma once

#include <ESPAsyncWebServer.h>
#include <MycilaESPConnect.h>

class CaptivePortal {
 public:
  CaptivePortal(AsyncWebServer& server);
  void begin();
  void ensureServerRunning();
  void loop();

 private:
  AsyncWebServer& _server;
  Mycila::ESPConnect _espConnect;
  bool serverStarted;
  const char* stateToString(Mycila::ESPConnect::State state);
};