// CalibrationManager.h
#pragma once

#include <Arduino.h>

#include <vector>

#include "EEPROMManager.h"  // Include EEPROMManage

constexpr int _maxRecords = 10;

class CalibrationManager {
 public:
  CalibrationManager();
  void begin();
  void addCalibrationRecord(float targetVolume, float observedVolume,
                            unsigned long pulseCount);
  std::vector<CalibrationRecord> getCalibrationHistory() const;
  void setScalingFactor(float scalingFactor);
  float getScalingFactor() const;
  void updateCalibrationHistory();
  void updateCalibrationRecord(int id, float targetVolume, float observedVolume,
                               unsigned long pulseCount);
  void deleteCalibrationRecord(int id);
  void clearCalibrationRecords();
  String getCalibrationRecordsJson() const;
  String getCalibrationRecordJson(int id) const;
  bool findRecordById(int id, CalibrationRecord& outRecord) const;

 private:
  std::vector<CalibrationRecord> _calibrationHistory;
  EEPROMManager _eepromManager;  // Instance of EEPROMManager
  float calculateScalingFactor(float targetVolume, float observedVolume) const;
  float selectOptimalScalingFactor() const;
};
