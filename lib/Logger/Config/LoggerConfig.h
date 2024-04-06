#pragma once

#include <string>
#include <unordered_map>

enum class LogLevel { DEBUG, INFO, WARN, ERROR };

struct LoggerConfig {
  bool useColors = true;  // Enable/disable colored output
  std::unordered_map<LogLevel, std::string>
      colorCodes;  // Custom color codes for each log level
  std::unordered_map<LogLevel, std::string>
      formatPatterns;           // Custom formatting patterns for each log level
  bool includeFileName = true;  // Include/exclude file name in the log message
  bool includeLineNumber =
      false;                  // Include/exclude line number in the log message
  bool asyncLogging = false;  // Enable/disable asynchronous logging

  LoggerConfig() {
    // Initialize with default color codes and format patterns
    colorCodes[LogLevel::DEBUG] = "\033[34m";  // Blue
    colorCodes[LogLevel::INFO] = "\033[32m";   // Green
    colorCodes[LogLevel::WARN] = "\033[33m";   // Yellow
    colorCodes[LogLevel::ERROR] = "\033[31m";  // Red

    // Default format patterns
    formatPatterns[LogLevel::DEBUG] = "[DEBUG] {message}";
    formatPatterns[LogLevel::INFO] = "[INFO] {message}";
    formatPatterns[LogLevel::WARN] = "[WARN] {message}";
    formatPatterns[LogLevel::ERROR] = "[ERROR] {message}";
  }
};
