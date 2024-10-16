// TemperatureSensor.h

// Purpose: 
// Reads the current liquid temperature from a temperature sensor.

// Responsibilities:
// Interface with the temperature hardware sensor.
// Provide up-to-date temperature readings.

#pragma once

#include <Arduino.h>

class TemperatureSensor {
 public:
  TemperatureSensor(uint8_t sensorPin);
  void begin();
  float getCurrentTemperature();

 private:
  uint8_t _sensorPin;
};