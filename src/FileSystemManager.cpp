// FileSystemManager.cpp
#include "FileSystemManager.h"

#include <LittleFS.h>
#include <Logger.h>

FileSystemManager::FileSystemManager() {}

bool FileSystemManager::mountFileSystem() {
  if (!LittleFS.begin()) {
    LOG_ERROR("Failed to mount LittleFS");
    return false;
  }
  LOG_INFO("LittleFS mounted successfully");
  return true;
}
