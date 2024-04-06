#include "MessageFormatter.h"

#include <mutex>

MessageFormatter::MessageFormatter(const LoggerConfig& config) {
  setConfiguration(
      config);  // Use setConfiguration to ensure consistency in setup
}

void MessageFormatter::setConfiguration(const LoggerConfig& newConfig) {
  std::lock_guard<std::mutex> lock(configMutex);  // Ensure thread-safe access
  config = newConfig;  // Directly assign the new configuration

  // Additional validation or adjustment can be added here if needed.
  // For instance, if there's a need to validate user-provided color codes
  // or to reset to defaults based on certain conditions.
}

void MessageFormatter::validateAndSetDefaultColors() {
  // Placeholder for potential validation or adjustment logic.
  // Since LoggerConfig initializes defaults, focus on validation or
  // conditional adjustments as needed.
}

bool MessageFormatter::isValidColorCode(const std::string& code) const {
  // Basic validation to check if the string follows a simple pattern of ANSI
  // escape codes. This pattern is "\033[" followed by one or more numbers
  // separated by ";" and ends with "m". Example valid codes: "\033[0m",
  // "\033[1;32m"
  if (code.length() < 4 || code.substr(0, 2) != "\033[" || code.back() != 'm') {
    return false;  // Does not meet the basic criteria
  }

  // Check the middle part contains only numbers and semicolons
  std::string middlePart = code.substr(
      2, code.length() - 3);  // Exclude "\033[" at the start and "m" at the end
  for (char ch : middlePart) {
    if (!isdigit(ch) && ch != ';') {
      return false;  // Found an invalid character
    }
  }

  // Further checks could include validating the actual numbers for known color
  // codes, but this simple check ensures it follows the basic structure of an
  // ANSI escape sequence.
  return true;
}