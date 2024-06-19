// CalibrationManager.cpp
#include "CalibrationManager.h"

#include <ArduinoJson.h>

CalibrationManager::CalibrationManager(size_t maxRecords)
    : _eepromManager(maxRecords) {}

void CalibrationManager::begin() {
  _eepromManager.begin();
  _eepromManager.loadCalibrationRecords(_calibrationHistory);
}

void CalibrationManager::addCalibrationRecord(float oilTemperature,
                                              unsigned long pulseCount,
                                              float targetOilVolume,
                                              float observedOilVolume,
                                              unsigned long timestamp) {
  CalibrationRecord newRecord;
  newRecord.oilTemperature = oilTemperature;
  newRecord.pulseCount = pulseCount;
  newRecord.targetOilVolume = targetOilVolume;
  newRecord.observedOilVolume = observedOilVolume;
  newRecord.timestamp = timestamp;

  _calibrationHistory.push_back(newRecord);
  updateCalibrationHistory();  // Reflect the changes in EEPROM
}

void CalibrationManager::updateCalibrationHistory() {
  _eepromManager.saveCalibrationRecords(_calibrationHistory);
}

String CalibrationManager::getCalibrationRecordsJson() const {
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();

  for (const auto& record : _calibrationHistory) {
    JsonObject obj = array.createNestedObject();
    obj["id"] = &record - &_calibrationHistory[0];  // Calculate index
    obj["oilTemperature"] = record.oilTemperature;
    obj["pulseCount"] = record.pulseCount;
    obj["targetOilVolume"] = record.targetOilVolume;
    obj["observedOilVolume"] = record.observedOilVolume;
    obj["timestamp"] = record.timestamp;
  }

  String json;
  serializeJson(doc, json);
  return json;
}

void CalibrationManager::updateCalibrationRecord(
    size_t id, float oilTemperature, unsigned long pulseCount,
    float targetOilVolume, float observedOilVolume, unsigned long timestamp) {
  if (id < _calibrationHistory.size()) {
    CalibrationRecord& record = _calibrationHistory[id];
    record.oilTemperature = oilTemperature;
    record.pulseCount = pulseCount;
    record.targetOilVolume = targetOilVolume;
    record.observedOilVolume = observedOilVolume;
    record.timestamp = timestamp;

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
  DynamicJsonDocument doc(256);

  doc["id"] = id;
  doc["oilTemperature"] = record.oilTemperature;
  doc["pulseCount"] = record.pulseCount;
  doc["targetOilVolume"] = record.targetOilVolume;
  doc["observedOilVolume"] = record.observedOilVolume;
  doc["timestamp"] = record.timestamp;

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