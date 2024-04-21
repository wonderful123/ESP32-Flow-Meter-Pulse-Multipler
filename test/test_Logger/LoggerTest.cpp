// #include "MockArduino.h"
#include <Logger.h>
#include <gtest/gtest.h>

#include <functional>
#include <sstream>

// Helper function to capture log output
std::string captureLogOutput(const std::function<void()>& logFunction) {
  std::stringstream logOutput;
  LoggerLib::Logger::instance().addLogOutput(
      [&](const std::string& message) { logOutput << message << std::endl; });

  logFunction();  // Execute the logging function

  return logOutput.str();
}

TEST(LoggerTest, LogSingleMessage) {
  const std::string expectedOutput =
      R"([DEBUG] [LoggerTest.cpp] Single message log test)";
  std::string logOutput =
      captureLogOutput([&] { LOG_DEBUG("Single message log test"); });

  EXPECT_EQ(logOutput, expectedOutput);
}

TEST(LoggerTest, LogMessageWithFormatting) {
  const std::string expectedOutput =
      R"([INFO] [LoggerTest.cpp] Formatted log test: Value = 42, Message = Hello, World!
)";
  std::string logOutput = captureLogOutput([&] {
    LOG_INFO("Formatted log test: Value = {}, Message = {}", 42,
             "Hello, World!");
  });

  EXPECT_EQ(logOutput, expectedOutput);
}
