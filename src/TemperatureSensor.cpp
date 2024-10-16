// TemperatureSensor.cpp
#include "TemperatureSensor.h"

TemperatureSensor::TemperatureSensor(uint8_t sensorPin)
    : _sensorPin(sensorPin) {}

void TemperatureSensor::begin() { pinMode(_sensorPin, INPUT); }

float TemperatureSensor::getCurrentTemperature() {
  int rawValue = analogRead(_sensorPin);
  float voltage = rawValue * (3.3 / 4095.0);  // For ESP32 with 12-bit ADC
  // Convert voltage to temperature
  float temperatureC = (voltage - 0.5) * 100.0;
  return temperatureC;
}
