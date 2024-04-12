// MessageFormatter.h
#pragma once

/**
 * Message Formatter Rules:
 *
 * 1. Dynamic Placeholder Replacement:
 *    - Identify placeholders within the log format string (e.g., {level},
 *      {file}, {line}, {timestamp}, {message}).
 *    - Replace each placeholder with its corresponding dynamic content.
 *
 * 2. Conditional Coloring:
 *    - Apply ANSI color codes based on configuration settings for log message
 *      components (level, file, timestamp, message).
 *    - Use defined ANSI color codes in LogLevel.h for level-specific coloring.
 *    - Configuration settings determine which components are colorized.
 *
 * 3. Efficient ANSI Color Application:
 *    - Avoid applying a new ANSI color code if the current color matches the
 *      last applied color to minimize redundant tags.
 *    - Apply ANSI color reset (\033[0m) only when transitioning between
 *      differently colored sections or at the end of the message.
 *
 * 4. Inclusion of Surrounding Characters in Coloring:
 *    - When a placeholder to be colored is immediately preceded by [, ( or
 *      followed by ], ), include these characters in the colorized section.
 *    - This enhances visual consistency and readability.
 *
 * 5. Support Customization:
 *    - Allow external definition of the LOG_FORMAT string to enable users to
 *      modify the log message structure and elements.
 *
 * These rules ensure that log messages are formatted dynamically, with
 * efficient and conditional application of color, improving readability and
 * consistency in log output.
 */

#include <array>    // For std::array
#include <cstdio>   // For snprintf
#include <cstring>  // For memcpy and size calculations
#include <string>

#include "../LogLevel.h"  // Adjust the include path as needed
#include "../Settings.h"  // Adjust the include path as needed

namespace LoggerLib {

class MessageFormatter {
 public:
  MessageFormatter() = default;

  std::string formatMessage(LogLevel level, const std::string& message,
                            const std::string& fileName = "", int line = -1,
                            const std::string& timestamp = "") const {
    static std::array<char, LOGGER_BUFFER_SIZE> buffer;  // Shared buffer
    // applyFormatPattern(buffer.data(), buffer.size(), level, message,
    // fileName,
    //                    line, timestamp);
    applyFormatPattern(buffer.data(), buffer.size(), level, message.c_str(),
                       fileName.c_str(), line, timestamp.c_str());
    return std::string(buffer.data());
  }

  template <typename... Args>
  std::string formatMessage(LogLevel level, const std::string& format,
                            Args... args, const std::string& fileName = "",
                            int line = -1,
                            const std::string& timestamp = "") const {
    static std::array<char, LOGGER_BUFFER_SIZE> buffer;  // Shared buffer
    std::snprintf(buffer.data(), buffer.size(), format.c_str(), args...);
    return formatMessage(level, std::string(buffer.data()), fileName, line,
                         timestamp);
  }

 private:
  void applyFormatPattern(char* buffer, size_t bufferSize, LogLevel level,
                          const char* message, const char* fileName, int line,
                          const char* timestamp) const {
    char formattedMessage[LOGGER_BUFFER_SIZE] = {
        0};  // Fixed-size buffer for formatting

    strncpy(formattedMessage, LOG_FORMAT,
            sizeof(formattedMessage) - 1);  // Safe copy

    char lastColor[ANSI_COLOR_CODE_SIZE] =
        "";  // To track the last applied color

    // Process each placeholder using direct buffer manipulation
    replacePlaceholder(formattedMessage, sizeof(formattedMessage), "{level}",
                       levelToString(level).c_str(),
                       LOGGER_ENABLE_LOGLEVEL_COLOR, lastColor, level);
    replacePlaceholder(formattedMessage, sizeof(formattedMessage), "{file}",
                       fileName, LOGGER_ENABLE_FILENAME_COLOR, lastColor,
                       level);
    replacePlaceholder(formattedMessage, sizeof(formattedMessage), "{line}",
                       std::to_string(line).c_str(), false, lastColor, level);
    replacePlaceholder(formattedMessage, sizeof(formattedMessage),
                       "{timestamp}", timestamp, false, lastColor, level);
    replacePlaceholder(formattedMessage, sizeof(formattedMessage), "{message}",
                       message, LOGGER_ENABLE_MESSAGE_COLOR, lastColor, level);

    // Ensure the final message fits within the buffer, truncating if necessary
    strncpy(buffer, formattedMessage, bufferSize - 1);
    buffer[bufferSize - 1] = '\0';  // Ensure null-termination
  }

  void replacePlaceholder(char* formatBuffer, size_t formatBufferSize,
                          const char* placeholder, const char* value,
                          bool colorize, char* lastColor,
                          LogLevel level) const {
    const char* colorCode = LOGGER_ENABLE_COLOR && colorize
                                ? ANSI_LEVEL_COLORS[static_cast<int>(level)]
                                : "";
    const char* colorReset =
        LOGGER_ENABLE_COLOR && colorize ? ANSI_COLOR_RESET : "";

    // Start with finding the first occurrence of the placeholder
    char* startPos = strstr(formatBuffer, placeholder);
    while (startPos != nullptr) {
      size_t offset =
          startPos - formatBuffer;  // Calculate offset for replacement start
      size_t tailLength = strlen(
          startPos + strlen(placeholder));  // Tail length after placeholder

      // Check if color application is efficient
      if (strcmp(lastColor, colorCode) == 0) {
        colorCode = "";  // Skip redundant color application
        colorReset = "";
      } else {
        strcpy(lastColor, colorCode);  // Update lastColor
      }

      // Calculate new length after replacement
      size_t replacementLength =
          strlen(value) + strlen(colorCode) + strlen(colorReset);
      size_t newLength = offset + replacementLength + tailLength;

      // Ensure new length does not exceed buffer size
      if (newLength >= formatBufferSize) {
        // Handle error or truncation
        break;
      }

      // Move the tail to accommodate replacement + color codes
      memmove(startPos + replacementLength, startPos + strlen(placeholder),
              tailLength + 1);  // Include null terminator

      // Insert color code
      if (*colorCode) {
        memcpy(startPos, colorCode, strlen(colorCode));
        startPos += strlen(colorCode);
      }

      // Insert value
      memcpy(startPos, value, strlen(value));
      startPos += strlen(value);

      // Insert color reset code
      if (*colorReset) {
        memcpy(startPos, colorReset, strlen(colorReset));
        startPos += strlen(colorReset);
      }

      // Look for next occurrence
      startPos = strstr(formatBuffer + offset + replacementLength, placeholder);
    }
  }

  // Incorporate surrounding characters directly without std::string operations
  void incorporateSurroundingCharacters(std::string& format, std::string& value,
                                        size_t& startPos,
                                        size_t placeholderLength) const {
    if (startPos > 0 &&
        (format[startPos - 1] == '[' || format[startPos - 1] == '(')) {
      value.insert(0, 1, format[startPos - 1]);
      startPos--;
    }
    size_t endPos = startPos + placeholderLength;
    if (endPos < format.length() &&
        (format[endPos] == ']' || format[endPos] == ')')) {
      value.push_back(format[endPos]);
    }
  }

  // Applies ANSI color codes to 'text' if 'colorize' is true, optimizing color
  // resets
  std::string applyColor(const std::string& text, LogLevel level,
                         std::string& lastColor) const {
    const std::string& newColor = ANSI_LEVEL_COLORS[static_cast<int>(level)];
    if (newColor == lastColor) {
      return text;  // Skip redundant color application
    }
    lastColor = newColor;
    return newColor + text;  // Prepend color code to text
  }
};

}  // namespace LoggerLib
