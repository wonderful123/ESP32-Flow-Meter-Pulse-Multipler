// LoggerLib.cpp
#include "LoggerLib.h"

#include <Arduino.h>

#include "Logger.h"

namespace LoggerLib {

// Private constructor for singleton pattern
Logger::Logger() {
#if ENABLE_LOGGING
  // Default log output to Serial
  // addLogOutput([](const std::string& message) {
  //   if (!Serial) return;
  //   Serial.println(message.c_str());
  //   Serial.flush();
  // });
#endif
}

Logger& Logger::instance() {
  static Logger instance;
  return instance;
}

void Logger::addLogOutput(Logger::LogOutput output) {
#if ENABLE_LOGGING
  Logger& logger = instance();

  std::lock_guard<std::mutex> guard(logger._mutex);
  logger._outputs.emplace_back(std::move(output));
#endif
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
#if ENABLE_LOGGING
  unsigned long millisPassed = millis();
  unsigned long hours =
      millisPassed / 3600000;  // Convert milliseconds to hours
  unsigned long mins = (millisPassed % 3600000) / 60000;  // Remaining minutes
  unsigned long secs = (millisPassed % 60000) / 1000;     // Remaining seconds

  char buffer[20];
  sprintf(buffer, "%lu:%02lu:%02lu", hours, mins, secs);

  return std::string(buffer);
#endif
}

void Logger::logInternal(LogLevel level, const std::string& file, int line,
                         const std::string& message) {
#if ENABLE_LOGGING
  auto timestamp = getUptimeTimestamp();
  std::string color;

  switch (level) {
    case LogLevel::ERROR:
      color = RED;
      break;
    case LogLevel::WARN:
      color = YELLOW;
      break;
    case LogLevel::INFO:
      color = GREEN;
      break;
    case LogLevel::DEBUG:
      color = CYAN;
      break;
    case LogLevel::VERBOSE:
      color = MAGENTA;
      break;
    default:
      color = WHITE;
  }

  std::string formattedMessage =
      fmt::format("[{}] {}[{}][{}]{} {}", timestamp, color,
                  levelToString(level), extractFileName(file), RESET, message);

  std::lock_guard<std::mutex> guard(_mutex);
  for (const auto& output : _outputs) {
    output(formattedMessage);
  }
#endif
}

// Method to extract the filename from the full path, without the extension
std::string Logger::extractFileName(const std::string& filePath) {
  size_t lastSlash = filePath.find_last_of("\\/");
  std::string filename = (lastSlash == std::string::npos)
                             ? filePath
                             : filePath.substr(lastSlash + 1);
  size_t extension = filename.find_last_of('.');
  return (extension == std::string::npos) ? filename
                                          : filename.substr(0, extension);
}

std::string Logger::levelToString(LogLevel level) {
  switch (level) {
    case LogLevel::ERROR:
      return "ERROR";
    case LogLevel::WARN:
      return "WARN";
    case LogLevel::INFO:
      return "INFO";
    case LogLevel::DEBUG:
      return "DEBUG";
    case LogLevel::VERBOSE:
      return "VERBOSE";
    default:
      return "UNKNOWN";
  }
}

}  // namespace LoggerLib