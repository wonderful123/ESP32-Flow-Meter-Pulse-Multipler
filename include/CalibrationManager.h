// CalibrationManager.h
#pragma once

#include <vector>
#include <functional>

#include "EEPROMManager.h"
#include "Settings.h"

class CalibrationManager {
 public:
  explicit CalibrationManager(size_t maxRecords = MAX_CALIBRATION_RECORDS);
  void begin();
  void addCalibrationRecord(float oilTemperature, unsigned long pulseCount,
                            float targetOilVolume, float observedOilVolume,
                            unsigned long timestamp);
  std::vector<CalibrationRecord> getCalibrationHistory() const;
  void updateCalibrationHistory();
  void updateCalibrationRecord(size_t id, float oilTemperature,
                               unsigned long pulseCount, float targetOilVolume,
                               float observedOilVolume, unsigned long timestamp);
  void deleteCalibrationRecord(size_t id);
  void clearCalibrationRecords();
  String getCalibrationRecordsJson() const;
  String getCalibrationRecordJson(size_t id) const;
  bool findRecordById(size_t id, CalibrationRecord& outRecord) const;

 private:
  std::vector<CalibrationRecord> _calibrationHistory;
  EEPROMManager _eepromManager;
};