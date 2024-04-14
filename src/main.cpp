// main.cpp
#include <ESPAsync_WiFiManager.h>  // Declared here to avoid multiple linking errors specified in docs
#include <HardwareSerial.h>

#include "ApplicationManager.h"
#include "Logger.h"

ApplicationManager appManager;

// Foward declarations
void serialLogCallback(const std::string& message);
void initializeLogger();

void setup() {
  initializeLogger();
  appManager.begin();
}

void loop() { appManager.loop(); }

void initializeLogger() {
  Serial.begin(115200);
  while (!Serial);  // Wait for Serial port to connect

  LoggerLib::Logger::addLogOutput(serialLogCallback);
  LOG_INFO("Logger initialized and ready");
  LOG_INFO(R"(
    ____  _       _ __        __   ____        __             _____            __         
   / __ \(_)___ _(_) /_____ _/ /  / __ \__  __/ /_______     / ___/_________ _/ /__  _____
  / / / / / __ `/ / __/ __ `/ /  / /_/ / / / / / ___/ _ \    \__ \/ ___/ __ `/ / _ \/ ___/
 / /_/ / / /_/ / / /_/ /_/ / /  / ____/ /_/ / (__  )  __/   ___/ / /__/ /_/ / /  __/ /    
/_____/_/\__, /_/\__/\__,_/_/  /_/    \__,_/_/____/\___/   /____/\___/\__,_/_/\___/_/     
        /____/                                                                            
  )");
}

void serialLogCallback(const std::string& message) {
  if (!Serial) return;
  Serial.println(message.c_str());
  Serial.flush();
}
