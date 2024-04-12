// DebugUtils.cpp
#include "DebugUtils.h"

#if defined(ESP32)
#include "esp_heap_caps.h"
#include "esp_system.h"

void DebugUtils::logMemoryUsage() {
  // Assuming LOG_DEBUG is a macro that uses ESP_LOGD underneath, or similar
  LOG_DEBUG("Total heap: %zu", heap_caps_get_total_size(MALLOC_CAP_8BIT));
  LOG_DEBUG("Free heap: %zu", heap_caps_get_free_size(MALLOC_CAP_8BIT));
#ifdef CONFIG_SPIRAM_SUPPORT
  LOG_DEBUG("Total PSRAM: %zu", heap_caps_get_total_size(MALLOC_CAP_SPIRAM));
  LOG_DEBUG("Free PSRAM: %zu", heap_caps_get_free_size(MALLOC_CAP_SPIRAM));
  LOG_DEBUG("Used PSRAM: %zu", heap_caps_get_total_size(MALLOC_CAP_SPIRAM) -
                                   heap_caps_get_free_size(MALLOC_CAP_SPIRAM));
  LOG_DEBUG("Minimum free PSRAM: %zu",
            heap_caps_get_minimum_free_size(MALLOC_CAP_SPIRAM));
#endif
  LOG_DEBUG("Minimum free heap: %zu",
            heap_caps_get_minimum_free_size(MALLOC_CAP_8BIT));
}

void DebugUtils::logResetReason() {
  esp_reset_reason_t resetReason = esp_reset_reason();

  switch (resetReason) {
    case ESP_RST_UNKNOWN:
      LOG_DEBUG("Reset reason: Unknown");
      break;
    case ESP_RST_POWERON:
      LOG_DEBUG("Reset reason: Power on");
      break;
    case ESP_RST_EXT:
      LOG_DEBUG("Reset reason: External");
      break;
    case ESP_RST_SW:
      LOG_DEBUG("Reset reason: Software");
      break;
    case ESP_RST_PANIC:
      LOG_DEBUG("Reset reason: Panic");
      break;
    case ESP_RST_INT_WDT:
      LOG_DEBUG("Reset reason: Interrupt watchdog");
      break;
    case ESP_RST_TASK_WDT:
      LOG_DEBUG("Reset reason: Task watchdog");
      break;
    case ESP_RST_DEEPSLEEP:
      LOG_DEBUG("Reset reason: Deep sleep");
      break;
    case ESP_RST_BROWNOUT:
      LOG_DEBUG("Reset reason: Brownout");
      break;
    case ESP_RST_SDIO:
      LOG_DEBUG("Reset reason: SDIO");
      break;
    default:
      LOG_DEBUG("Reset reason: Unknown");
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