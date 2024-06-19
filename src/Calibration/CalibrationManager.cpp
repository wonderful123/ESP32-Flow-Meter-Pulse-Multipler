// CalibrationManager.cpp
#include "Calibration/CalibrationManager.h"

#include <ArduinoJson.h>

#include "Calibration/CalibrationRecord.h"
#include "Calibration/CardinalSpline.h"

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
  precomputeInterpolationCoefficients();
  updateCalibrationHistory();
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

    precomputeInterpolationCoefficients();
    updateCalibrationHistory();
  }
}

void CalibrationManager::updateCalibrationHistory() {
  _eepromManager.saveCalibrationRecords(_calibrationHistory);
}

String CalibrationManager::getCalibrationRecordsJson() const {
  JsonDocument doc;

  for (const auto& record : _calibrationHistory) {
    JsonObject obj;
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

float CalibrationManager::getCalibrationFactor(float oilTemperature) const {
  if (_calibrationHistory.empty()) {
    return DEFAULT_CALIBRATION_FACTOR;
  } else if (_calibrationHistory.size() == 1) {
    return calculateLinearCalibrationFactor(oilTemperature);
  } else {
    return calculateCardinalInterpolationCalibrationFactor(oilTemperature);
  }
}

float CalibrationManager::calculateLinearCalibrationFactor(
    float oilTemperature) const {
  const CalibrationRecord& record = _calibrationHistory.front();
  return record.targetOilVolume / record.observedOilVolume;
}

void CalibrationManager::precomputeInterpolationCoefficients() {
  size_t n = _calibrationHistory.size();
  if (n < 2) return;

  _interpolationCoefficientsA.resize(n - 1);
  _interpolationCoefficientsB.resize(n - 1);
  _interpolationCoefficientsC.resize(n - 1);
  _interpolationCoefficientsD.resize(n - 1);

  for (size_t i = 0; i < n - 1; ++i) {
    float x0 = _calibrationHistory[i].oilTemperature;
    float x1 = _calibrationHistory[i + 1].oilTemperature;
    float y0 = _calibrationHistory[i].targetOilVolume /
               _calibrationHistory[i].observedOilVolume;
    float y1 = _calibrationHistory[i + 1].targetOilVolume /
               _calibrationHistory[i + 1].observedOilVolume;

    float h = x1 - x0;
    float y0d = 0.0f;
    float y1d = 0.0f;

    if (i > 0) {
      float xm1 = _calibrationHistory[i - 1].oilTemperature;
      float ym1 = _calibrationHistory[i - 1].targetOilVolume /
                  _calibrationHistory[i - 1].observedOilVolume;
      y0d = (y1 - ym1) / (x1 - xm1);
    }
    if (i < n - 2) {
      float x2 = _calibrationHistory[i + 2].oilTemperature;
      float y2 = _calibrationHistory[i + 2].targetOilVolume /
                 _calibrationHistory[i + 2].observedOilVolume;
      y1d = (y2 - y0) / (x2 - x0);
    }

    float a = 2.0f * (y0 - y1) + h * (y0d + y1d);
    float b = -3.0f * (y0 - y1) - h * (2.0f * y0d + y1d);
    float c = y0d * h;
    float d = y0;

    _interpolationCoefficientsA[i] = a;
    _interpolationCoefficientsB[i] = b;
    _interpolationCoefficientsC[i] = c;
    _interpolationCoefficientsD[i] = d;
  }
}

float CalibrationManager::calculateCardinalInterpolationCalibrationFactor(
    float oilTemperature) const {
  if (_calibrationHistory.empty()) return DEFAULT_CALIBRATION_FACTOR;

  if (oilTemperature <= _calibrationHistory.front().oilTemperature) {
    return _calibrationHistory.front().targetOilVolume /
           _calibrationHistory.front().observedOilVolume;
  }

  if (oilTemperature >= _calibrationHistory.back().oilTemperature) {
    return _calibrationHistory.back().targetOilVolume /
           _calibrationHistory.back().observedOilVolume;
  }

  size_t i = 0;
  while (i < _calibrationHistory.size() - 1 &&
         _calibrationHistory[i + 1].oilTemperature < oilTemperature) {
    ++i;
  }

  float h = _calibrationHistory[i + 1].oilTemperature -
            _calibrationHistory[i].oilTemperature;
  float t = (oilTemperature - _calibrationHistory[i].oilTemperature) / h;

  float t2 = t * t;
  float t3 = t2 * t;

  return _interpolationCoefficientsA[i] * t3 +
         _interpolationCoefficientsB[i] * t2 +
         _interpolationCoefficientsC[i] * t + _interpolationCoefficientsD[i];
}