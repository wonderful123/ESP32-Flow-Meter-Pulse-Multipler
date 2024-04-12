// Logger.h
#pragma once

#include "LoggerLib.h"

// Utility for checking if __VA_ARGS__ is empty
#define LOG_DETAIL_CHECK_1ST_ARG(_, ...) __VA_ARGS__
#define LOG_DETAIL_IS_EMPTY(...) \
  LOG_DETAIL_CHECK_1ST_ARG(dummy, ##__VA_ARGS__, 0)

// LOG macro utilizing __VA_ARGS__ for format and arguments
#define LOG(level, ...) \
  LoggerLib::Logger::instance().log(level, __FILE__, __LINE__, __VA_ARGS__)

// #define LOG(level, ...)                                        \
//   LoggerLib::Logger::instance().log(level, __FILE__, __LINE__, \
//                                     String(__VA_ARGS__).c_str())

// Specific level LOG macros
#define LOG_DEBUG(...) LOG(LoggerLib::LogLevel::DEBUG, __VA_ARGS__)
#define LOG_INFO(...) LOG(LoggerLib::LogLevel::INFO, __VA_ARGS__)
#define LOG_WARN(...) LOG(LoggerLib::LogLevel::WARN, __VA_ARGS__)
#define LOG_ERROR(...) LOG(LoggerLib::LogLevel::ERROR, __VA_ARGS__)
#define LOG_VERBOSE(...) LOG(LoggerLib::LogLevel::VERBOSE, __VA_ARGS__)
