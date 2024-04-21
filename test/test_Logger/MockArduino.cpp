#include "MockArduino.h"

#include <chrono>

MockSerial Serial;

// Mock millis using chrono
unsigned long millis() {
  static auto start = std::chrono::steady_clock::now();
  auto now = std::chrono::steady_clock::now();
  return std::chrono::duration_cast<std::chrono::milliseconds>(now - start)
      .count();
}
