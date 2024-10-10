#include <ArduinoFake.h>
#include <Logger.h>
#include <gtest/gtest.h>

#include <functional>
#include <string>
#include <vector>

class LogCapture : public ::testing::Test {
 protected:
  std::vector<std::string> logMessages;
  std::mutex logMutex;

  void SetUp() override {
    auto& logger = LoggerLib::Logger::instance();
    logger.addLogOutput([this](const std::string& message) {
      std::lock_guard<std::mutex> guard(logMutex);
      logMessages.push_back(message);
    });
  }

  void TearDown() override {
    auto& logger = LoggerLib::Logger::instance();
    logger.clearLogOutputs();
    {
      std::lock_guard<std::mutex> guard(logMutex);
      logMessages.clear();
    }
  }
};

TEST_F(LogCapture, LogSingleMessage) {
  const std::string expectedOutput =
      "[DEBUG] [LoggerTest.cpp] Single message log test";
  LOG_DEBUG("Single message log test");

  // ASSERT_EQ(logMessages.size(), 1);
  // EXPECT_EQ(logMessages[0], expectedOutput);
}

// TEST_F(LogCapture, LogMessageWithFormatting) {
//   const std::string expectedOutput =
//       "[INFO] [LoggerTest.cpp] Formatted log test: Value = 42, Message = "
//       "Hello, World!";
//   LOG_INFO("Formatted log test: Value = {}, Message = {}", 42, "Hello, World!");

//   ASSERT_EQ(logMessages.size(), 1);
//   EXPECT_EQ(logMessages[0], expectedOutput);
// }