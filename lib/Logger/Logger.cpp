// Logger.cpp
#include <cstdio>
#include <cstring>
#include <mutex>

#include "Logger.h"

// Initialize static members for callbacks
Logger::LogCallback Logger::_log_callback =
    nullptr;  // For callbacks without context
Logger::LogCallbackWithContext Logger::_log_callback_with_context =
    nullptr;  // For callbacks with context
void *Logger::_callback_context =
    nullptr;  // Context for the context-aware callback

/**
 * @brief Sets the log callback function without context.
 *
 * This overload allows setting a log callback function that will be invoked
 * for each log message without requiring additional context. It's useful for
 * simple logging scenarios where the callback function does not need external
 * state or context information.
 *
 * @param callback The log callback function that matches the LogCallback
 * signature. This function will be called for each log message emitted by the
 * logger.
 */
void Logger::setLogCallback(LogCallback callback) {
  // Wrap the provided callback to match the LogCallbackWithContext signature,
  // ignoring context
  _log_callback_with_context =
      [callback](Level level, const std::string &message, void * /*context*/) {
        callback(level, message);
      };
  // Explicitly set the context to nullptr as it's not used in this overload
  _callback_context = nullptr;
}

/**
 * @brief Sets the log callback function with context.
 *
 * This overload enables setting a log callback function along with a context
 * pointer. The context is passed to the callback function each time it's
 * invoked, allowing the callback to access external state or resources. This
 * approach is beneficial for more complex logging scenarios where the callback
 * needs to interact with other parts of the application.
 *
 * @param callback The log callback function that matches the
 * LogCallbackWithContext signature. This function will receive the log level,
 * message, and a context pointer for each log message.
 * @param context A void pointer to the context to be passed to the callback
 * function. This can be a pointer to any user-defined data or object.
 */
void Logger::setLogCallback(LogCallbackWithContext callback, void *context) {
  _log_callback_with_context = callback;
  _callback_context = context;
}

/**
 * Logs a message at the specified level. If the message level is at or above
 * the current log level, the message is formatted and passed to the log
 * callback.
 *
 * @param level The severity level of the message.
 * @param message The message to log.
 */
void Logger::log(Level level, const std::string &message,
                 const std::string &fileName) {
  std::string formattedMessage = formatMessage(level, message, fileName);
#if defined(LOGGER_LEVEL_DEBUG) || defined(LOGGER_LEVEL_INFO) || \
    defined(LOGGER_LEVEL_WARN) || defined(LOGGER_LEVEL_ERROR)
  if (_log_callback_with_context) {
    _log_callback_with_context(level, formattedMessage, _callback_context);
  } else if (_log_callback) {
    _log_callback(level, formattedMessage);
  }
#endif
}

/**
 * Converts a log level to its string representation.
 *
 * @param level The log level to convert.
 * @return String representation of the log level.
 */
const std::string Logger::levelToString(Level level) {
  switch (level) {
    case DEBUG:
      return "DEBUG";
    case INFO:
      return "INFO";
    case WARN:
      return "WARN";
    case ERROR:
      return "ERROR";
    default:
      return "UNKNOWN";
  }
}

/**
 * Retrieves the ANSI color code for a given log level. This is dependent
 * on LOGGER_USE_COLOR being defined.
 *
 * @param level The log level.
 * @return The ANSI color code as a string.
 */
const std::string Logger::getColorCodeForLevel(Level level) {
#ifdef LOGGER_USE_COLOR
  switch (level) {
    case DEBUG:
      return "\033[34m";  // Blue for DEBUG
    case INFO:
      return "\033[32m";  // Green for INFO
    case WARN:
      return "\033[33m";  // Yellow for WARN
    case ERROR:
      return "\033[31m";  // Red for ERROR
    default:
      return "\033[0m";  // Default color
  }
#else
  return "";
#endif
}

/**
 * Formats the log message by appending the log level, color coding, and
 * optionally the filename.
 *
 * This method formats the log message by including the log level, applying
 * color coding based on the log level, and appending the filename if provided.
 *
 * @param level The level of the log message.
 * @param message The message to format.
 * @param fileName The filename from which the log is generated. If empty, the
 * filename is not included.
 * @return The formatted log message as a string.
 */
std::string Logger::formatMessage(Level level, const std::string &message,
                                  const std::string &fileName) {
  std::ostringstream formattedMessage;

  // Apply color coding based on the log level
  const std::string colorCode = getColorCodeForLevel(level);
  const std::string levelStr = levelToString(level);
  const std::string standardColor = "\033[0m";

  formattedMessage << colorCode << "[" << levelStr << "]";

  // Include filename if provided
  if (!fileName.empty()) {
    std::string shortFileName = extractFileName(fileName);
    formattedMessage << " [" << shortFileName << "]";
  }

#ifdef LOGGER_USE_COLOR
  formattedMessage << standardColor;
#endif

  formattedMessage << " " << message;

  return formattedMessage.str();
}

// Method to extract the filename from the full path, without the extension
std::string Logger::extractFileName(const std::string &filePath) {
  size_t lastSlash = filePath.find_last_of("\\/");
  std::string filename = (lastSlash == std::string::npos)
                             ? filePath
                             : filePath.substr(lastSlash + 1);
  size_t extension = filename.find_last_of('.');
  return (extension == std::string::npos) ? filename
                                          : filename.substr(0, extension);
}

// Logging methods
// Each method checks if the corresponding log level is enabled before logging.

void Logger::debug(const std::string &message) {
#if defined(LOGGER_LEVEL_DEBUG)
  log(DEBUG, message);
#endif
}

void Logger::info(const std::string &message) {
#if defined(LOGGER_LEVEL_DEBUG) || defined(LOGGER_LEVEL_INFO)
  log(INFO, message);
#endif
}

void Logger::warn(const std::string &message) {
#if defined(LOGGER_LEVEL_DEBUG) || defined(LOGGER_LEVEL_INFO) || \
    defined(LOGGER_LEVEL_WARN)
  log(WARN, message);
#endif
}

void Logger::error(const std::string &message) {
#if defined(LOGGER_LEVEL_DEBUG) || defined(LOGGER_LEVEL_INFO) || \
    defined(LOGGER_LEVEL_WARN) || defined(LOGGER_LEVEL_ERROR)
  log(ERROR, message);
#endif
}

void Logger::debug(const std::string &message, const std::string &fileName) {
#if defined(LOGGER_LEVEL_DEBUG)
  std::string formattedMessage = formatMessage(DEBUG, message, fileName);
  if (_log_callback_with_context) {
    _log_callback_with_context(DEBUG, formattedMessage, _callback_context);
  } else if (_log_callback) {
    _log_callback(DEBUG, formattedMessage);
  }
#endif
}

void Logger::info(const std::string &message, const std::string &fileName) {
#if defined(LOGGER_LEVEL_DEBUG) || defined(LOGGER_LEVEL_INFO)
  std::string formattedMessage = formatMessage(INFO, message, fileName);
  if (_log_callback_with_context) {
    _log_callback_with_context(INFO, formattedMessage, _callback_context);
  } else if (_log_callback) {
    _log_callback(INFO, formattedMessage);
  }
#endif
}

void Logger::warn(const std::string &message, const std::string &fileName) {
#if defined(LOGGER_LEVEL_DEBUG) || defined(LOGGER_LEVEL_INFO) || \
    defined(LOGGER_LEVEL_WARN)
  std::string formattedMessage = formatMessage(WARN, message, fileName);
  if (_log_callback_with_context) {
    _log_callback_with_context(WARN, formattedMessage, _callback_context);
  } else if (_log_callback) {
    _log_callback(WARN, formattedMessage);
  }
#endif
}

void Logger::error(const std::string &message, const std::string &fileName) {
#if defined(LOGGER_LEVEL_DEBUG) || defined(LOGGER_LEVEL_INFO) || \
    defined(LOGGER_LEVEL_WARN) || defined(LOGGER_LEVEL_ERROR)
  std::string formattedMessage = formatMessage(ERROR, message, fileName);
  if (_log_callback_with_context) {
    _log_callback_with_context(ERROR, formattedMessage, _callback_context);
  } else if (_log_callback) {
    _log_callback(ERROR, formattedMessage);
  }
#endif
}
