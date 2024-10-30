// CalibrationManager.h
#pragma once

#include <ArduinoJson.h>

#include <functional>
#include <vector>

#include "CalibrationRecord.h"
#include "EEPROMManager.h"
#include "Settings.h"

class CalibrationManager {
 public:
  explicit CalibrationManager(size_t maxRecords = MAX_CALIBRATION_RECORDS);
  void begin();

  void setCalibrationMode(CalibrationMode mode);
  CalibrationMode getCalibrationMode() const;

  void setFixedCalibrationFactor(float factor);
  float getFixedCalibrationFactor() const;

  void addCalibrationRecord(float oilTemperature, unsigned long pulseCount,
                            float targetOilVolume, float observedOilVolume,
                            unsigned long timestamp);

  bool updateCalibrationRecord(size_t id, float oilTemperature,
                               unsigned long pulseCount, float targetOilVolume,
                               float observedOilVolume,
                               unsigned long timestamp);

  bool deleteCalibrationRecord(size_t id);

  float getCalibrationFactor(float oilTemperature) const;

  JsonDocument getCalibrationRecordsJson() const;
  JsonDocument getCalibrationRecordJson(size_t id) const;

 private:
  EEPROMManager _eepromManager;
  CalibrationMode _mode;
  float _fixedCalibrationFactor;
  std::vector<CalibrationRecord> _calibrationHistory;
  std::vector<float> _interpolationCoefficientsA;
  std::vector<float> _interpolationCoefficientsB;
  std::vector<float> _interpolationCoefficientsC;
  std::vector<float> _interpolationCoefficientsD;

  void updateCalibrationHistory();
  void precomputeInterpolationCoefficients();
  float calculateLinearCalibrationFactor(float oilTemperature) const;
  float calculateCardinalInterpolationCalibrationFactor(
      float oilTemperature) const;
};