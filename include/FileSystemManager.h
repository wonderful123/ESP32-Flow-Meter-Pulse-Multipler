// FileSystemManager.h
#pragma once

#include <Arduino.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <LittleFS.h>

class FileSystemManager {
 public:
  FileSystemManager();
  bool mountFileSystem();
  void serveStaticFiles(AsyncWebServer& server, const char* uri,
                        const char* path,
                        const char* defaultFile = "index.html");
};