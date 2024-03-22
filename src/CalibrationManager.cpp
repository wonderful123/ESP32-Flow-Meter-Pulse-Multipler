// CalibrationManager.cpp
#include "CalibrationManager.h"

#include <ArduinoJson.h>

CalibrationManager::CalibrationManager(size_t maxRecords)
    : _eepromManager(maxRecords) {}

void CalibrationManager::begin() {
  _eepromManager.begin();
  _eepromManager.loadCalibrationRecords(_calibrationHistory);
}

void CalibrationManager::addCalibrationRecord(
    float targetVolume, float observedVolume, unsigned long pulseCount,
    unsigned long epochTime, float oilTemp, const char* oilType) {
  CalibrationRecord newRecord;
  newRecord.targetVolume = targetVolume;
  newRecord.observedVolume = observedVolume;
  newRecord.pulseCount = pulseCount;
  newRecord.oilTemp = oilTemp;
  strncpy(newRecord.oilType, oilType, sizeof(newRecord.oilType) - 1);
  newRecord.oilType[sizeof(newRecord.oilType) - 1] =
      '\0';  // Ensure null-termination
  newRecord.epochTime = epochTime;
  newRecord.calibrationFactor =
      calculateCalibrationFactor(targetVolume, observedVolume);

  _calibrationHistory.push_back(newRecord);
  updateCalibrationHistory();  // Reflect the changes in EEPROM
}

void CalibrationManager::setCalibrationFactor(float calibrationFactor) {
  _eepromManager.saveCalibrationFactor(calibrationFactor);
}

float CalibrationManager::getCalibrationFactor() const {
  float calibrationFactor = DEFAULT_CALIBRATION_FACTOR;
  _eepromManager.loadCalibrationFactor(calibrationFactor);
  return calibrationFactor;
}

void CalibrationManager::updateCalibrationHistory() {
  _eepromManager.saveCalibrationRecords(_calibrationHistory);
}

String CalibrationManager::getCalibrationRecordsJson() const {
  JsonDocument doc;
  JsonArray array = doc.to<JsonArray>();

  for (const auto& record : _calibrationHistory) {
    JsonObject obj = array.add<JsonObject>();
    obj["id"] = &record - &_calibrationHistory[0];  // Calculate index
    obj["targetVolume"] = record.targetVolume;
    obj["observedVolume"] = record.observedVolume;
    obj["pulseCount"] = record.pulseCount;
    obj["oilTemp"] = record.oilTemp;
    obj["oilType"] = record.oilType;
    obj["epochTime"] = record.epochTime;
    obj["calibrationFactor"] = record.calibrationFactor;
  }

  String json;
  serializeJson(doc, json);
  return json;
}

void CalibrationManager::updateCalibrationRecord(size_t id, float targetVolume,
                                                 float observedVolume,
                                                 unsigned long pulseCount) {
  if (id < _calibrationHistory.size()) {
    CalibrationRecord& record = _calibrationHistory[id];
    record.targetVolume = targetVolume;
    record.observedVolume = observedVolume;
    record.pulseCount = pulseCount;
    record.calibrationFactor =
        calculateCalibrationFactor(targetVolume, observedVolume);

    updateCalibrationHistory();  // Persist changes to EEPROM
  }
}

void CalibrationManager::deleteCalibrationRecord(size_t id) {
  if (id < _calibrationHistory.size()) {
    _calibrationHistory.erase(_calibrationHistory.begin() + id);
    updateCalibrationHistory();  // Reflect changes in EEPROM
  }
}

void CalibrationManager::clearCalibrationRecords() {
  _calibrationHistory.clear();
  _eepromManager.clearEEPROM();  // Also clear EEPROM records
}

String CalibrationManager::getCalibrationRecordJson(size_t id) const {
  if (id >= _calibrationHistory.size()) {
    return "{}";  // Return empty JSON object if id is out of range
  }

  const auto& record = _calibrationHistory[id];
  JsonDocument doc;

  doc["id"] = id;
  doc["targetVolume"] = record.targetVolume;
  doc["observedVolume"] = record.observedVolume;
  doc["pulseCount"] = record.pulseCount;
  // Include other fields as needed

  String json;
  serializeJson(doc, json);
  return json;
}

bool CalibrationManager::findRecordById(size_t id,
                                        CalibrationRecord& outRecord) const {
  if (id < _calibrationHistory.size()) {
    outRecord = _calibrationHistory[id];
    return true;
  }
  return false;
}

float CalibrationManager::calculateCalibrationFactor(
    float targetVolume, float observedVolume) const {
  if (observedVolume == 0)
    return 0;  // Avoid division by zero or return a default value

  return targetVolume / observedVolume;
}