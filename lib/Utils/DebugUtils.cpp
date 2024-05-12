// DebugUtils.cpp
#include "DebugUtils.h"

#include <LittleFS.h>
#include <dirent.h>  // Include for directory handling

#if defined(ESP32)
#include "esp_heap_caps.h"
#include "esp_system.h"

void DebugUtils::logMemoryUsage() {
  // Assuming LOG_DEBUG is a macro that uses ESP_LOGD underneath, or similar
  LOG_DEBUG("Total heap: {}", heap_caps_get_total_size(MALLOC_CAP_8BIT));
  LOG_DEBUG("Free heap: {}", heap_caps_get_free_size(MALLOC_CAP_8BIT));
#ifdef CONFIG_SPIRAM_SUPPORT
  LOG_DEBUG("Total PSRAM: {}", heap_caps_get_total_size(MALLOC_CAP_SPIRAM));
  LOG_DEBUG("Free PSRAM: {}", heap_caps_get_free_size(MALLOC_CAP_SPIRAM));
  LOG_DEBUG("Used PSRAM: {}", heap_caps_get_total_size(MALLOC_CAP_SPIRAM) -
                                  heap_caps_get_free_size(MALLOC_CAP_SPIRAM));
  LOG_DEBUG("Minimum free PSRAM: {}",
            heap_caps_get_minimum_free_size(MALLOC_CAP_SPIRAM));
#endif
  LOG_DEBUG("Minimum free heap: {}",
            heap_caps_get_minimum_free_size(MALLOC_CAP_8BIT));
}

void DebugUtils::logResetReason() {
  esp_reset_reason_t resetReason = esp_reset_reason();
  const char* prefix = "Last reset reason: ";

  switch (resetReason) {
    case ESP_RST_UNKNOWN:
      LOG_DEBUG(prefix, "Unknown");
      break;
    case ESP_RST_POWERON:
      LOG_DEBUG(prefix, "Power on");
      break;
    case ESP_RST_EXT:
      LOG_DEBUG(prefix, "External");
      break;
    case ESP_RST_SW:
      LOG_DEBUG(prefix, "Software");
      break;
    case ESP_RST_PANIC:
      LOG_DEBUG(prefix, "Panic");
      break;
    case ESP_RST_INT_WDT:
      LOG_DEBUG(prefix, "Interrupt watchdog");
      break;
    case ESP_RST_TASK_WDT:
      LOG_DEBUG(prefix, "Task watchdog");
      break;
    case ESP_RST_DEEPSLEEP:
      LOG_DEBUG(prefix, "Deep sleep");
      break;
    case ESP_RST_BROWNOUT:
      LOG_DEBUG(prefix, "Brownout");
      break;
    case ESP_RST_SDIO:
      LOG_DEBUG(prefix, "SDIO");
      break;
    default:
      LOG_DEBUG(prefix, "Unknown");
      break;
  }
}

#else
// Fallback or mock implementation for non-ESP32 environments
void DebugUtils::logMemoryUsage() {
  LOG_DEBUG("Memory logging not supported on this platform");
}

void DebugUtils::logResetReason() {
  LOG_DEBUG("Reset reason logging not supported on this platform");
}
#endif

void DebugUtils::listFilesInDirectory(const std::string& path, int depth = 0) {
  // Open the directory
  DIR* dir = opendir(path.c_str());
  if (!dir) {
    LOG_DEBUG("Failed to open directory: {}", path);
    return;
  }

  struct dirent* entry;
  // Iterate through all the files in the directory
  while ((entry = readdir(dir)) != nullptr) {
    std::string name = entry->d_name;
    if (name == "." || name == "..")
      continue;  // Skip current and parent directory entries

    // Create indentation for sub-levels
    std::string indent(depth * 2,
                       ' ');  // Increase indent by 2 spaces per depth level

    if (entry->d_type == DT_DIR) {        // Directory
      LOG_DEBUG("{}[{}]", indent, name);  // Display directory name
      // Recursively list subdirectories
      listFilesInDirectory(path + "/" + name, depth + 1);
    } else if (entry->d_type == DT_REG) {  // Regular file
      LOG_DEBUG("{}{}", indent, name);     // Display file name
    }
  }

  // Close the directory to free resources
  closedir(dir);
}

void DebugUtils::listFiles() {
#if defined(ESP32)
  // Check if LittleFS is available and mounted
  if (!LittleFS.begin()) {
    LOG_DEBUG("Failed to mount LittleFS");
    return;
  }

  LOG_DEBUG("Listing all files in LittleFS:");
  // Start recursive directory listing at the root
  listFilesInDirectory("/littlefs");
#else
  LOG_DEBUG("LittleFS is not supported on this platform");
#endif
}