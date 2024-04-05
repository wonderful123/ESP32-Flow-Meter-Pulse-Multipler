// Logger.h
#pragma once

/**
 * @file Logger.h
 * @brief The Logger class provides a logging utility for outputting log
 * messages at different severity levels.
 *
 * The Logger class allows setting a callback function to be called when a log
 * message is issued. It supports logging messages at different severity levels,
 * including DEBUG, INFO, WARN, and ERROR. The log messages are formatted with
 * the log level and color coding, and then passed to the log callback function.
 *
 * The Logger class also provides methods for converting a log level to its
 * string representation and retrieving the ANSI color code for a given log
 * level.
 *
 * Example usage:
 * @code
 * Logger::setLogCallback(myLogCallback);
 * Logger::debug("This is a debug message");
 * Logger::info("This is an info message");
 * Logger::warn("This is a warning message");
 * Logger::error("This is an error message");
 * @endcode
 */

#include <atomic>
#include <mutex>
#include <sstream>
#include <string>

/************************************************
 *  Optional settings
 ***********************************************/

// Uncomment the desired log level for compile-time control
#define LOGGER_LEVEL_DEBUG
// #define LOGGER_LEVEL_INFO
// #define LOGGER_LEVEL_WARN
// #define LOGGER_LEVEL_ERROR

// Uncomment to enable colored log output
#define LOGGER_USE_COLOR

constexpr unsigned int LOGGER_MAX_MESSAGE_LENGTH = 256;

/************************************************
 *  Class definition
 ***********************************************/

/**
 * @class Logger
 * A thread-safe logger class designed for embedded systems.
 * Provides logging functionality with various levels like DEBUG, INFO, etc.
 * Supports compile-time log level control and optional color-coded output.
 *
 * Thread Safety:
 * This class is thread-safe. The internal state is protected using mutexes,
 * and atomic operations ensure consistent behavior in multi-threaded
 * environments.
 *
 * Usage Example:
 * Logger::setLogLevel(Logger::INFO);
 * Logger::info("This is an info message");
 */
class Logger {
 public:
  /**
   * Enum to represent different logging levels.
   */
  enum Level { DEBUG, INFO, WARN, ERROR };

  /**
   * @brief Type definition for log callback function without context.
   *
   * Defines a function signature for logging callbacks that do not require
   * additional context information. This allows for simple logging scenarios
   * where the message and its severity level are sufficient for logging
   * purposes.
   */
  using LogCallback = std::function<void(Level, const std::string &)>;

  /**
   * @brief Sets the callback function used for logging messages.
   *
   * The log callback function is invoked whenever a log message is issued.
   * It takes two parameters: the log level and the message string. This allows
   * the callback implementation to handle the message according to the
   * application's logging strategy, such as outputting to the console, writing
   * to a file, or sending over a network.
   *
   * @param callback A `std::function` matching the `LogCallback` signature.
   *
   * @example
   * Here's how you can set a simple console log callback:
   * @code
   * Logger::setLogCallback([](Logger::Level level, const std::string& message)
   * { std::cout << "[" << Logger::levelToString(level) << "] " << message <<
   * std::endl;
   * });
   * @endcode
   */
  static void setLogCallback(LogCallback callback);

  /**
   * @brief Type definition for log callback function with context.
   *
   * Extends the `LogCallback` signature by adding a `void*` parameter for
   * passing arbitrary context information. This is particularly useful for
   * callbacks that need to interact with or modify external state or objects.
   */
  using LogCallbackWithContext =
      std::function<void(Level, const std::string &, void *)>;

  /**
   * @brief Sets the log callback function with context.
   *
   * This method allows the caller to set a log callback that includes a context
   * pointer, providing greater flexibility for complex logging scenarios. The
   * context can be used to pass additional information or state to the
   * callback.
   *
   * @param callback A `std::function` matching the `LogCallbackWithContext`
   * signature.
   * @param context A `void*` pointer to the context to be passed to the
   * callback.
   *
   * @example
   * Assuming `MyLoggerContext` is a struct that holds relevant logging
   * information:
   * @code
   * struct MyLoggerContext {
   *     std::string prefix;
   *     // Other context-specific fields...
   * };
   *
   * MyLoggerContext* myContext = new MyLoggerContext{"[MyApp]"};
   * Logger::setLogCallback([](Logger::Level level, const std::string& message,
   * void* context) { auto* ctx = static_cast<MyLoggerContext*>(context);
   *     std::cout << ctx->prefix << "[" << Logger::levelToString(level) << "] "
   * << message << std::endl;
   * }, static_cast<void*>(myContext));
   * @endcode
   */
  static void setLogCallback(LogCallbackWithContext callback, void *context);

  /**
   * Logs a message at the specified level with optional filename.
   * If the message level is at or above the current log level, the message
   * is formatted and passed to the log callback.
   *
   * @param level The severity level of the message.
   * @param message The message to log.
   * @param fileName Optional. The filename from which the log is generated.
   * If provided, it is included in the log message.
   */
  static void log(Level level, const std::string &message,
                  const std::string &fileName = "");

  /**
   * Converts log level enum to a corresponding string.
   *
   * @param level Log level to convert.
   * @return A string representation of the log level.
   */
  static const std::string levelToString(Level level);

  // Logging methods for different levels

  /**
   * Logs a debug message.
   *
   * @param message The debug message to log.
   */
  static void debug(const std::string &message);

  /**
   * Logs an info message.
   *
   * @param message The info message to log.
   */
  static void info(const std::string &message);

  /**
   * Logs a warning message.
   *
   * @param message The warning message to log.
   */
  static void warn(const std::string &message);

  /**
   * Logs an error message.
   *
   * @param message The error message to log.
   */
  static void error(const std::string &message);

  // Overloaded logging methods that include the filename
  /**
   * Logs a debug message with the filename where the log was generated.
   *
   * @param message The debug message to log.
   * @param fileName The filename from which the log is generated.
   */
  static void debug(const std::string &message, const std::string &fileName);

  /**
   * Logs an info message with the filename where the log was generated.
   *
   * @param message The info message to log.
   * @param fileName The filename from which the log is generated.
   */
  static void info(const std::string &message, const std::string &fileName);

  /**
   * Logs a warning message with the filename where the log was generated.
   *
   * @param message The warning message to log.
   * @param fileName The filename from which the log is generated.
   */
  static void warn(const std::string &message, const std::string &fileName);

  /**
   * Logs an error message with the filename where the log was generated.
   *
   * @param message The error message to log.
   * @param fileName The filename from which the log is generated.
   */
  static void error(const std::string &message, const std::string &fileName);

  /**
   * @brief Extracts the filename from a full file path.
   *
   * This method takes a file path and returns the filename portion,
   * excluding the directory path and the file extension.
   *
   * @param filePath The full path of the file.
   * @return The filename without the extension.
   */
  static std::string extractFileName(const std::string &filePath);

 private:
  static LogCallback _log_callback;  ///< Callback function without context.
  static LogCallbackWithContext
      _log_callback_with_context;  ///< Callback function with context.
  static void *_callback_context;  ///< Pointer to user-defined context for the
                                   ///< log callback.

  /**
   * @brief Formats a log message with the log level, color coding, and
   * filename.
   *
   * This method formats the given message by prefixing it with the log level
   * and applying color coding based on the log level. Additionally, it
   * appends the filename where the log was generated, if provided.
   *
   * @param level The level of the log message.
   * @param message The message to format.
   * @param fileName The filename from which the log is generated. Can be empty
   * if not provided.
   * @return The formatted log message as a string.
   */
  static std::string formatMessage(Level level, const std::string &message,
                                   const std::string &fileName = "");

  /**
   * Retrieves the ANSI color code for a given log level.
   *
   * @param level The log level.
   * @return ANSI color code as a string.
   */
  static const std::string getColorCodeForLevel(Level level);
};

// Macro definitions for easy logging with filename
/**
 * @brief Logs a debug message with the filename.
 *        The filename is automatically extracted using the __FILE__ macro.
 *
 * @param msg The debug message to log.
 */
#define LOG_DEBUG(msg) Logger::debug(msg, Logger::extractFileName(__FILE__))

/**
 * @brief Logs an info message with the filename.
 *        The filename is automatically extracted using the __FILE__ macro.
 *
 * @param msg The info message to log.
 */
#define LOG_INFO(msg) Logger::info(msg, Logger::extractFileName(__FILE__))

/**
 * @brief Logs a warning message with the filename.
 *        The filename is automatically extracted using the __FILE__ macro.
 *
 * @param msg The warning message to log.
 */
#define LOG_WARN(msg) Logger::warn(msg, Logger::extractFileName(__FILE__))

/**
 * @brief Logs an error message with the filename.
 *        The filename is automatically extracted using the __FILE__ macro.
 *
 * @param msg The error message to log.
 */
#define LOG_ERROR(msg) Logger::error(msg, Logger::extractFileName(__FILE__))