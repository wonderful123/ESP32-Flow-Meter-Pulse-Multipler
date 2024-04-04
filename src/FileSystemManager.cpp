// FileSystemManager.cpp
#include "FileSystemManager.h"

FileSystemManager::FileSystemManager() {}

bool FileSystemManager::mountFileSystem() {
  if (!LittleFS.begin()) {
    Serial.println("[FileSystemManager] Error: Failed to mount LittleFS");
    return false;
  }
  Serial.println("[FileSystemManager] LittleFS mounted successfully");
  return true;
}

void FileSystemManager::serveStaticFiles(AsyncWebServer& server,
                                         const char* uri, const char* path,
                                         const char* defaultFile) {
  server.serveStatic(uri, LittleFS, path).setDefaultFile(defaultFile);
}