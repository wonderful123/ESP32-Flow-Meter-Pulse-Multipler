#include "ConfigManager.h"

// Set the use of colors in the log output
ConfigManager& ConfigManager::setUseColors(bool useColors) {
  return applyConfigChange(&LoggerConfig::useColors, useColors);
}

// Set the color code for a specific log level
ConfigManager& ConfigManager::setColorCode(
    LogLevel level, const std::string& colorCode) {
  if (!isValidColorCode(colorCode)) {
    throw std::invalid_argument("Invalid color code provided.");
  }
  std::lock_guard<std::mutex> lock(configMutex);
  currentConfig.colorCodes[level] = colorCode;
  return *this;
}

// Set the format pattern for a specific log level
ConfigManager& ConfigManager::setFormatPattern(
    LogLevel level, const std::string& formatPattern) {
  return applyConfigChange(&LoggerConfig::formatPatterns, formatPattern, level);
}

// Include or exclude file name in the log output
ConfigManager& ConfigManager::setIncludeFileName(
    bool includeFileName) {
  return applyConfigChange(&LoggerConfig::includeFileName, includeFileName);
}

// Include or exclude line number in the log output
ConfigManager& ConfigManager::setIncludeLineNumber(
    bool includeLineNumber) {
  return applyConfigChange(&LoggerConfig::includeLineNumber, includeLineNumber);
}

// Enable or disable asynchronous logging
ConfigManager& ConfigManager::setAsyncLogging(bool asyncLogging) {
  return applyConfigChange(&LoggerConfig::asyncLogging, asyncLogging);
}

// Apply the staged configuration changes
void ConfigManager::applyChanges() {
  // Implementation would depend on how the Logger is structured.
  // This could involve setting the currentConfig as the Logger's active
  // configuration, and if necessary, re-initializing or updating the Logger's
  // internal state.
}

// Retrieve the current logger configuration
LoggerConfig ConfigManager::getCurrentConfig() const {
  std::lock_guard<std::mutex> lock(configMutex);
  return currentConfig;
}

// Validate the ANSI color code
bool ConfigManager::isValidColorCode(const std::string& code) const {
  // Simplified validation; expand as needed
  return code.rfind("\033[", 0) == 0 && code.back() == 'm';
}

// Template method to apply configuration changes in a thread-safe manner
template <typename T>
ConfigManager& ConfigManager::applyConfigChange(
    T LoggerConfig::*configItem, const T& newValue) {
  std::lock_guard<std::mutex> lock(configMutex);
  currentConfig.*configItem = newValue;
  return *this;
}

// Specialization for setting format patterns since it involves two parameters
template <>
ConfigManager& ConfigManager::applyConfigChange<
    std::unordered_map<LogLevel, std::string>>(
    std::unordered_map<LogLevel, std::string> LoggerConfig::*configItem,
    const std::string& newValue, LogLevel level) {
  std::lock_guard<std::mutex> lock(configMutex);
  (currentConfig.*configItem)[level] = newValue;
  return *this;
}