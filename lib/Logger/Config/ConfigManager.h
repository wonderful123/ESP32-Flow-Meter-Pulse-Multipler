#pragma once

#include <mutex>

#include "LoggerConfig.h"

class ConfigManager {
 public:
  ConfigManager& setUseColors(bool useColors);
  ConfigManager& setColorCode(LogLevel level,
                                    const std::string& colorCode);
  ConfigManager& setFormatPattern(LogLevel level,
                                        const std::string& formatPattern);
  ConfigManager& setIncludeFileName(bool includeFileName);
  ConfigManager& setIncludeLineNumber(bool includeLineNumber);
  ConfigManager& setAsyncLogging(bool asyncLogging);

  // Apply changes and possibly reload the logger configuration
  void applyChanges();

  // Retrieves a copy of the current configuration for inspection
  LoggerConfig getCurrentConfig() const;

 private:
  mutable std::mutex configMutex;  // Protects access to the configuration
  LoggerConfig currentConfig;      // Staged configuration changes

  // Validates the color code format
  bool isValidColorCode(const std::string& code) const;

  // Internal utility to safely apply changes to the configuration
  template <typename T>
  ConfigManager& applyConfigChange(T LoggerConfig::*configItem,
                                         const T& newValue);
};
