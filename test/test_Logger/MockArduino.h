#ifndef MOCK_ARDUINO_H
#define MOCK_ARDUINO_H

#include <functional>
#include <iostream>
#include <string>
#include <vector>

// Mock implementation of the Arduino String class
class String {
  std::string data;

 public:
  String() {}
  String(const char* str) : data(str) {}
  String(const std::string& str) : data(str) {}
  String(const String& str) : data(str.data) {}

  const char* c_str() const { return data.c_str(); }

  // Add more methods as needed
};

// Mock implementation of the Serial object
class MockSerial {
 public:
  void println(const std::string& message) {
    std::cout << message << std::endl;
  }

  void flush() {}

  operator bool() const { return true; }
};

extern MockSerial Serial;

// Mock implementation of millis()
unsigned long millis();

#endif
