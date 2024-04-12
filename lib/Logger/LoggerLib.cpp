// LoggerLib.cpp
#include <Arduino.h>

#include "Logger.h"

namespace LoggerLib {

// Private constructor for singleton pattern
Logger::Logger() {
  // Default log output to Serial
  addLogOutput([](const std::string& message) {
    if (!Serial) return;
    Serial.println(message.c_str());
    Serial.flush();
  });
}

Logger& Logger::instance() {
  static Logger instance;
  return instance;
}

void Logger::addLogOutput(Logger::LogOutput output) {
  Logger& logger = instance();

  std::lock_guard<std::mutex> guard(logger._mutex);
  logger._outputs.emplace_back(std::move(output));
}

void Logger::log(LogLevel level, const std::string& file, int line,
                 const std::string& message) {
  logInternal(level, file, line, message);
}

void Logger::log(LogLevel level, const std::string& file, int line,
                 const char* message) {
  logInternal(level, file, line, std::string(message));
}

void Logger::log(LogLevel level, const std::string& file, int line,
                 const String& message) {
  logInternal(level, file, line, message.c_str());
}

std::string Logger::getUptimeTimestamp() const {
  unsigned long millisPassed = millis();
  unsigned long hours =
      millisPassed / 3600000;  // Convert milliseconds to hours
  unsigned long mins = (millisPassed % 3600000) / 60000;  // Remaining minutes
  unsigned long secs = (millisPassed % 60000) / 1000;     // Remaining seconds

  char buffer[20];
  sprintf(buffer, "%lu:%02lu:%02lu", hours, mins, secs);

  return std::string(buffer);
}

void Logger::logInternal(LogLevel level, const std::string& file, int line,
                         const std::string& message) {
  auto timestamp = getUptimeTimestamp();  // Assume this method exists and is
                                          // correctly implemented
  std::string formattedMessage =
      fmt::format("[{}] {}:{} - {}", timestamp, file, line, message);

  std::lock_guard<std::mutex> guard(_mutex);
  for (const auto& output : _outputs) {
    output(formattedMessage);
  }
}

}  // namespace LoggerLib