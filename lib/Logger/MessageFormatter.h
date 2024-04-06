#pragma once

#include <memory>  // For std::unique_ptr in asynchronous handling
#include <mutex>
#include <string>

#include "LoggerConfig.h"

class MessageFormatter {
 public:
  explicit MessageFormatter(const LoggerConfig& config = LoggerConfig());
  void setConfiguration(const LoggerConfig& config);

  // Formats a log message. Suitable for synchronous or initial processing
  // before asynchronous handling.
  std::string formatMessage(LogLevel level, const std::string& message,
                            const std::string& fileName = "",
                            int line = -1) const;

 private:
  mutable std::mutex configMutex;  // Protects configuration updates
  LoggerConfig config;             // Configuration with thread-safe access

  // Helper methods
  std::string getColorCodeForLevel(LogLevel level) const;
  std::string applyFormatPattern(LogLevel level, const std::string& message,
                                 const std::string& fileName, int line) const;
  static std::string extractFileName(const std::string& filePath);

  // Asynchronous logging support. Details to be implemented in the cpp file.
  // Involves handling the formatting and logging operations in a separate
  // thread or thread pool.
  void logAsync(LogLevel level, const std::string& message,
                const std::string& fileName, int line) const;

  // Implementations for performance optimizations:
  // - Considerations for using std::string_view to improve performance in
  // string handling.
  // - Lazy evaluation for deferred message formatting, to optimize processing
  // time.
  // - Techniques for efficient string concatenation and memory management.

  // Validate and set defaults for color codes
  // Ensures that the configured color codes are valid and sets to default if
  // necessary.
  void validateAndSetDefaultColors();

  // Configuration hot-reload mechanism
  // Allows dynamic reloading of the LoggerConfig settings without restarting
  // the application.
  void reloadConfiguration();

  // Structured Logging Support
  // Extends formatting capabilities to support structured data (e.g., JSON)
  // alongside traditional text-based logging.
  std::string formatStructuredMessage(LogLevel level,
                                      const std::string& message,
                                      const std::string& fileName = "",
                                      int line = -1) const;
};
