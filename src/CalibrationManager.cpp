// CalibrationManager.cpp
#include "CalibrationManager.h"

#include <ArduinoJson.h>

CalibrationManager::CalibrationManager()
    : _eepromManager(_maxRecords) {  // Assume max 10 records
}

void CalibrationManager::begin() {
  _eepromManager.begin();  // Make sure EEPROM is initialized
  std::vector<CalibrationRecord> records;
  _eepromManager.loadCalibrationRecords(records);
  _calibrationHistory = records;  // Update the internal calibration history
}

void CalibrationManager::addCalibrationRecord(float targetVolume,
                                              float observedVolume,
                                              unsigned long pulseCount) {
  float scalingFactor = calculateScalingFactor(targetVolume, observedVolume);
  CalibrationRecord newRecord = {targetVolume, observedVolume, scalingFactor,
                                 pulseCount};
  _calibrationHistory.push_back(newRecord);
  updateCalibrationHistory();
}

std::vector<CalibrationRecord> CalibrationManager::getCalibrationHistory()
    const {
  return _calibrationHistory;
}

float CalibrationManager::calculateScalingFactor(float targetVolume,
                                                 float observedVolume) const {
  if (observedVolume == 0) return 1.0;  // Avoid division by zero
  return targetVolume / observedVolume;
}

void CalibrationManager::setScalingFactor(float scalingFactor) {
  // Save the scaling factor to EEPROM
  _eepromManager.saveScalingFactor(scalingFactor);
}

float CalibrationManager::getScalingFactor() const {
  float scalingFactor;
  if (!_eepromManager.loadScalingFactor(scalingFactor)) {
    // If no scaling factor was previously saved, return 1.0
    return 1.0;
  }
  return scalingFactor;
}

void CalibrationManager::updateCalibrationHistory() {
  _eepromManager.saveCalibrationRecords(_calibrationHistory);
}

String CalibrationManager::getCalibrationRecordsJson() const {
  String json = "[";
  for (size_t i = 0; i < _calibrationHistory.size(); ++i) {
    const auto& record = _calibrationHistory[i];
    char buffer[256];  // Ensure this buffer is large enough for your JSON
                       // strings.
    snprintf(buffer, sizeof(buffer),
             "{\"id\":%zu,\"targetVolume\":%s,\"observedVolume\":%s,"
             "\"pulseCount\":%lu}",
             i,
             isnan(record.targetVolume) ? "null"
                                        : String(record.targetVolume).c_str(),
             isnan(record.observedVolume)
                 ? "null"
                 : String(record.observedVolume).c_str(),
             record.pulseCount);
    if (i > 0) json += ",";
    json += buffer;
  }
  json += "]";
  return json;
}

void CalibrationManager::updateCalibrationRecord(int id, float targetVolume,
                                                 float observedVolume,
                                                 unsigned long pulseCount) {
  // Cast _calibrationHistory.size() to int to avoid comparison warnings
  if (id < 0 || id >= static_cast<int>(_calibrationHistory.size())) return;

  CalibrationRecord& record = _calibrationHistory[id];
  record.targetVolume = targetVolume;
  record.observedVolume = observedVolume;
  record.scalingFactor = calculateScalingFactor(targetVolume, observedVolume);

  updateCalibrationHistory();  // Persist the updated records to EEPROM
}

void CalibrationManager::deleteCalibrationRecord(int id) {
  if (id >= 0 && id < static_cast<int>(_calibrationHistory.size())) {
    // Invalidate the record in EEPROM
    CalibrationRecord& record = _calibrationHistory[id];
    record.targetVolume = NAN;
    record.observedVolume = NAN;
    record.scalingFactor = NAN;
    record.pulseCount = 0xFFFFFFFF;

    // Update EEPROM with the invalidated record
    _eepromManager.saveCalibrationRecord(id, record);

    // Remove the record from the in-memory vector
    _calibrationHistory.erase(_calibrationHistory.begin() + id);
  }
}

void CalibrationManager::clearCalibrationRecords() {
  _calibrationHistory.clear();  // Clear the in-memory history
  _eepromManager
      .clearEEPROM();  // Delegate to EEPROMManager to clear the EEPROM
}

String CalibrationManager::getCalibrationRecordJson(int id) const {
  CalibrationRecord record;
  findRecordById(id, record);

  JsonDocument doc;  // Adjust size based on your needs

  doc["targetVolume"] = record.targetVolume;
  doc["observedVolume"] = record.observedVolume;
  doc["scalingFactor"] = record.scalingFactor;
  doc["pulseCount"] = record.pulseCount;

  String json;
  ArduinoJson::serializeJson(doc, json);

  return json;
}

bool CalibrationManager::findRecordById(int id,
                                        CalibrationRecord& outRecord) const {
  if (id < 0 || static_cast<size_t>(id) >= _calibrationHistory.size())
    return false;
  outRecord = _calibrationHistory[id];
  return true;
}
