// CalibrationManager.h
#pragma once

#include <functional>
#include <vector>

#include "CalibrationRecord.h"
#include "EEPROMManager.h"
#include "Settings.h"
#include <ArduinoJson.h>

class CalibrationManager {
 public:
  explicit CalibrationManager(size_t maxRecords = MAX_CALIBRATION_RECORDS);
  void begin();
  void addCalibrationRecord(float oilTemperature, unsigned long pulseCount,
                            float targetOilVolume, float observedOilVolume,
                            unsigned long timestamp);
  std::vector<CalibrationRecord> getCalibrationHistory() const;
  void updateCalibrationRecord(size_t id, float oilTemperature,
                               unsigned long pulseCount, float targetOilVolume,
                               float observedOilVolume,
                               unsigned long timestamp);
  void deleteCalibrationRecord(size_t id);
  void clearCalibrationRecords();
  JsonDocument getCalibrationRecordsJson() const;
  JsonDocument getCalibrationRecordJson(size_t id) const;
  bool findRecordById(size_t id, CalibrationRecord& outRecord) const;
  float getCalibrationFactor(float oilTemperature) const;

 private:
  std::vector<CalibrationRecord> _calibrationHistory;
  EEPROMManager _eepromManager;
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