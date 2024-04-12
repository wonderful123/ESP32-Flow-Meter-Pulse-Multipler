// WebSocketServer.cpp
#include "WebSocketServer.h"

#include "Logger.h"

WebSocketServer::WebSocketServer(uint16_t port) : _webSocket("/ws") {
  initialize();
}

void WebSocketServer::begin(AsyncWebServer* server) {
  server->addHandler(&_webSocket);
  LOG_INFO("Server started. Waiting for connections...");
}

void WebSocketServer::initialize() {
  eventHandlers[WS_EVT_CONNECT] = [this](AsyncWebSocketClient* client,
                                         void* arg, uint8_t* data, size_t len) {
    this->handleConnect(client, arg, data, len);
  };
  eventHandlers[WS_EVT_DISCONNECT] =
      [this](AsyncWebSocketClient* client, void* arg, uint8_t* data,
             size_t len) { this->handleDisconnect(client, arg, data, len); };
  eventHandlers[WS_EVT_ERROR] = [this](AsyncWebSocketClient* client, void* arg,
                                       uint8_t* data, size_t len) {
    this->handleError(client, arg, data, len);
  };
  eventHandlers[WS_EVT_PONG] = [this](AsyncWebSocketClient* client, void* arg,
                                      uint8_t* data, size_t len) {
    this->handlePong(client, arg, data, len);
  };
  eventHandlers[WS_EVT_DATA] = [this](AsyncWebSocketClient* client, void* arg,
                                      uint8_t* data, size_t len) {
    this->handleData(client, arg, data, len);
  };

  _webSocket.onEvent([this](AsyncWebSocket* server,
                            AsyncWebSocketClient* client, AwsEventType type,
                            void* arg, uint8_t* data, size_t len) {
    this->onEvent(server, client, type, arg, data, len);
  });
}

void WebSocketServer::onEvent(AsyncWebSocket* server,
                              AsyncWebSocketClient* client, AwsEventType type,
                              void* arg, uint8_t* data, size_t len) {
  logEventInfo(server, client, type, len);

  auto handler = eventHandlers.find(type);
  if (handler != eventHandlers.end()) {
    handler->second(client, arg, data, len);
  }
}

void WebSocketServer::logEventInfo(AsyncWebSocket* server,
                                   AsyncWebSocketClient* client,
                                   AwsEventType type, size_t len) {
  Serial.printf("ws[%s][%u] %s: %u\n", server->url(), client->id(),
                eventTypeToString(type), len);
}

const char* WebSocketServer::eventTypeToString(AwsEventType type) {
  static const char* strings[] = {"CONNECT", "DISCONNECT", "ERROR", "PONG",
                                  "DATA"};
  return strings[type < 5 ? type : 4];  // Return "DATA" for unknown types
}

void WebSocketServer::broadcastPulseCount(unsigned long pulseCount) {
  String message = "{\"pulseCount\":" + String(pulseCount) + "}";
  _webSocket.textAll(message);
}

void WebSocketServer::broadcastJsonData(const String& type,
                                        const JsonVariant& data) {
  JsonDocument doc;
  doc["type"] = type;
  doc["data"] = data;

  // Serialize JSON to string
  String message;
  serializeJson(doc, message);

  // Broadcast the message to all connected WebSocket clients
  _webSocket.textAll(message);
}

void WebSocketServer::broadcastMessage(const String& type,
                                       const String& message) {
  String broadcastMessage = "{\"type\":\"" + type + "\",\"data\":\"" + message + "\"}";
  _webSocket.textAll(broadcastMessage);
}

void WebSocketServer::handleConnect(AsyncWebSocketClient* client, void* arg,
                                    uint8_t* data, size_t len) {
  // LOG_DEBUG("Client [" + std::to_string(client->id()) + "] connected.\n");
  LOG_DEBUG("Client [{}] connected.", client->id());
  // Perform any action needed on connect, e.g., sending a welcome message
  client->text("{\"message\": \"Welcome to the WebSocket server!\"}");
}

void WebSocketServer::handleDisconnect(AsyncWebSocketClient* client, void* arg,
                                       uint8_t* data, size_t len) {
  Serial.printf("Client [%u] disconnected.\n", client->id());
  // Perform any cleanup or state update needed on disconnect
}

void WebSocketServer::handleError(AsyncWebSocketClient* client, void* arg,
                                  uint8_t* data, size_t len) {
  Serial.printf("Error on client [%u].\n", client->id());
  // You might log the error or take action depending on the error nature
}

void WebSocketServer::handlePong(AsyncWebSocketClient* client, void* arg,
                                 uint8_t* data, size_t len) {
  Serial.printf("[WebSocket] Pong received from client [%u].\n", client->id());
  // Pong messages are often used in heartbeat mechanisms to check connection
  // liveliness
}

void WebSocketServer::handleData(AsyncWebSocketClient* client, void* arg,
                                 uint8_t* data, size_t len) {
  // Assuming the data is a text message, not binary. For binary data, you'll
  // need a different approach.
  String message = String((char*)data).substring(0, len);
  Serial.printf("[WebSocket] Data from client [%u]: %s\n", client->id(),
                message.c_str());

  // Example: Echo the received message back to the client
  client->text(message);
}