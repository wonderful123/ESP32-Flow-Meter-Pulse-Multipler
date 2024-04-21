// LoggerLib.h
#pragma once

#define ENABLE_LOGGING 1

#include <WString.h>  // Arduino String library
#undef B0             // Undefine conflicting macro
#undef B1             // Undefine conflicting macro
#include <fmt/core.h>  // Include fmt library headers after undefining the
// macros

#include <functional>
#include <iostream>
#include <mutex>
#include <string>
#include <vector>

#include "Formatter/MessageFormatter.h"
#include "LogLevel.h"

namespace LoggerLib {

class Logger {
 public:
  static Logger& instance();

  using LogOutput = std::function<void(const std::string&)>;
  static void addLogOutput(LogOutput output);

  std::string getUptimeTimestamp() const;

  // Overloads for different string types
  void log(LogLevel level, const std::string& file, int line,
           const std::string& message);
  void log(LogLevel level, const std::string& file, int line,
           const char* message);
  void log(LogLevel level, const std::string& file, int line,
           const String& message);

  // Variadic template for printf-style logging
  template <typename... Args>
  void log(LogLevel level, const std::string& file, int line,
           const std::string& format, Args&&... args) {
#if ENABLE_LOGGING
    auto formattedMessage = fmt::format(format, std::forward<Args>(args)...);
    logInternal(level, file, line, formattedMessage);
#endif
  }

 private:
  std::vector<LogOutput> _outputs;
  std::mutex _mutex;

  // Singleton usage
  Logger();
  Logger(const Logger&) = delete;
  Logger& operator=(const Logger&) = delete;

  // Internal logging function
  void logInternal(LogLevel level, const std::string& file, int line,
                   const std::string& message);

  // Method to extract the filename from the full path, without the extension
  std::string extractFileName(const std::string& filePath);

  std::string levelToString(LogLevel level);
};

}  // namespace LoggerLib
