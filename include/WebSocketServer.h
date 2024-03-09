// WebSocketServer.h
#pragma once

#include <ESPAsyncWebServer.h>
#include <functional>
#include <map>

class WebSocketServer {
public:
  explicit WebSocketServer(uint16_t port);
  void begin(AsyncWebServer* server);
  void broadcastPulseCount(unsigned long pulseCount);

 private:
  AsyncWebSocket _webSocket;
  std::map<AwsEventType, std::function<void(AsyncWebSocketClient*, void*, uint8_t*, size_t)>> eventHandlers;

  void initialize();
  void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);
  void logEventInfo(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, size_t len);
  static const char* eventTypeToString(AwsEventType type);

  // Event handlers
  void handleConnect(AsyncWebSocketClient* client, void* arg, uint8_t* data, size_t len);
  void handleDisconnect(AsyncWebSocketClient* client, void* arg, uint8_t* data, size_t len);
  void handleError(AsyncWebSocketClient* client, void* arg, uint8_t* data, size_t len);
  void handlePong(AsyncWebSocketClient* client, void* arg, uint8_t* data, size_t len);
  void handleData(AsyncWebSocketClient* client, void* arg, uint8_t* data, size_t len);
};