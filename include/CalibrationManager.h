// CalibrationManager.h
#pragma once

#include <vector>

#include "EEPROMManager.h"
#include "Settings.h"

class CalibrationManager {
 public:
  explicit CalibrationManager(size_t maxRecords = MAX_CALIBRATION_RECORDS);
  void begin();
  void addCalibrationRecord(float targetVolume, float observedVolume,
                            unsigned long pulseCount, unsigned long epochTime,
                            float oilTemp = 0.0f,
                            const char* oilType = "unknown");
  std::vector<CalibrationRecord> getCalibrationHistory() const;
  void setCalibrationFactor(float scalingFactor);
  float getCalibrationFactor() const;
  void updateCalibrationHistory();
  void updateCalibrationRecord(size_t id, float targetVolume,
                               float observedVolume, unsigned long pulseCount);
  void deleteCalibrationRecord(size_t id);
  void clearCalibrationRecords();
  String getCalibrationRecordsJson() const;
  String getCalibrationRecordJson(size_t id) const;
  bool findRecordById(size_t id, CalibrationRecord& outRecord) const;

 private:
  std::vector<CalibrationRecord> _calibrationHistory;
  EEPROMManager _eepromManager;
  float calculateCalibrationFactor(float targetVolume,
                                   float observedVolume) const;
};
