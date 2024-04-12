// DebugUtils.h
#pragma once

#include "DebugUtils.h"
#include "Logger.h"

/**
 * @class DebugUtils
 *
 * @brief Provides a set of debugging utilities, such as memory usage logging.
 *
 * DebugUtils offers methods for various debugging tasks, including memory
 * statistics logging. It uses the Logger class for outputting debug
 * information. The implementation of some functionalities might differ based on
 * the target platform.
 */
class DebugUtils {
 public:
  /**
   * @brief Logs memory usage statistics.
   *
   * The actual information logged may vary based on the platform.
   */
  static void logMemoryUsage();

  /**
   * @brief Retrieves and logs the reason for the last reset.
   *
   * This function retrieves the reset reason and logs it using the Logger
   * class. The reset reasons may differ based on the platform.
   */
  static void logResetReason();
};
