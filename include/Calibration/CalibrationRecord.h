// CalibrationRecord.h
#pragma once

struct CalibrationRecord {
  float oilTemperature;
  unsigned long pulseCount;
  float targetOilVolume;
  float observedOilVolume;
  unsigned long timestamp;
};

enum class CalibrationMode { Fixed, TemperatureCompensated };