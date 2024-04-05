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
   * Logs memory usage statistics. The actual information logged may vary based
   * on the platform.
   */
  static void logMemoryUsage();
};
