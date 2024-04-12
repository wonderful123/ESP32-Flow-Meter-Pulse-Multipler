// LogLevel.h
#pragma once

#include <string>

namespace LoggerLib {

enum class LogLevel { NONE = 0, DEBUG, INFO, WARN, ERROR, VERBOSE };

constexpr const char* LogLevelStrings[] = {"NONE", "DEBUG", "INFO",
                                           "WARN", "ERROR", "VERBOSE"};

constexpr const char* ANSI_COLOR_RESET = "\033[0m";
constexpr const char* ANSI_LEVEL_COLORS[] = {
    "",          // NONE - No color
    "\033[34m",  // DEBUG - Blue
    "\033[32m",  // INFO - Green
    "\033[33m",  // WARN - Yellow
    "\033[31m",  // ERROR - Red
    "\033[35m"   // VERBOSE - Magenta
};

inline std::string levelToString(LogLevel level) {
  return LogLevelStrings[static_cast<int>(level)];
}

inline std::string levelToANSI(LogLevel level) {
  std::string colorCode = ANSI_LEVEL_COLORS[static_cast<int>(level)];
  return colorCode + levelToString(level) + ANSI_COLOR_RESET;
}

}  // namespace LoggerLib
