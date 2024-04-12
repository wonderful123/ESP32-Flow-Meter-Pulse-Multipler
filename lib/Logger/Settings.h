// Settings.h
#pragma once

#include <sys/cdefs.h> // For size_t

// Default logger settings

// Compile-time log level setting
// Uncomment the desired log level for compile-time control
// #define LOGGER_LEVEL LogLevel::NONE
#define LOGGER_LEVEL LogLevel::DEBUG
// #define LOGGER_LEVEL LogLevel::INFO
// #define LOGGER_LEVEL LogLevel::WARN
// #define LOGGER_LEVEL LogLevel::ERROR
// #define LOGGER_LEVEL LogLevel::VERBOSE

// The static buffer size used by the log message formatter to build log message
// strings. The purpose is to avoid dynamic memory allocation for most log
// messages which can cause fragementation.
constexpr size_t LOGGER_BUFFER_SIZE = 512;
constexpr size_t ANSI_COLOR_CODE_SIZE = 10;

// Logger feature toggles
constexpr bool LOGGER_SERIAL_USE_ANSI_COLORS = true;
constexpr bool LOGGER_INCLUDE_FILE_NAME = true;
constexpr bool LOGGER_INCLUDE_LINE_NUMBER = false;

// If true, enable ANSI color codes
constexpr bool LOGGER_ENABLE_COLOR = true;

// Allow different parts to be colored independently
constexpr bool LOGGER_ENABLE_LOGLEVEL_COLOR = true;
constexpr bool LOGGER_ENABLE_FILENAME_COLOR = true;
constexpr bool LOGGER_ENABLE_LINE_NUMBER_COLOR = false;
constexpr bool LOGGER_ENABLE_MESSAGE_COLOR = false;

// Default log message format pattern
constexpr char LOG_FORMAT[] = "[{level}] [{file}] {message}";

// Formatting settings
constexpr bool LOGGER_ENABLE_TIMESTAMPS = true;
constexpr char LOGGER_TIMESTAMP_FORMAT[] =
    "%Y-%m-%d %H:%M:%S";  // Example: 2024-01-01 12:00:00
