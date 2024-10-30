// EEPROMManager.cpp
#include "EEPROMManager.h"

EEPROMManager::EEPROMManager(size_t maxRecords)
    : _maxRecords(maxRecords),
      _mode(CalibrationMode::TemperatureCompensated),
      _fixedCalibrationFactor(DEFAULT_CALIBRATION_FACTOR) {}

void EEPROMManager::begin() {
  EEPROM.begin(EEPROM_SIZE);
  EEPROMHeader header;
  EEPROM.get(0, header);
  if (header.marker != EEPROM_EMPTY_MARKER && header.marker != 0) {
    _mode = static_cast<CalibrationMode>(header.mode);
    _fixedCalibrationFactor = header.fixedCalibrationFactor;
  } else {
    clearEEPROM();
  }
}

CalibrationMode EEPROMManager::getCalibrationMode() const { return _mode; }

float EEPROMManager::getFixedCalibrationFactor() const {
  return _fixedCalibrationFactor;
}

void EEPROMManager::setCalibrationMode(CalibrationMode mode) {
  _mode = mode;

  // Update the EEPROM header
  EEPROMHeader header;
  EEPROM.get(0, header);
  header.mode = static_cast<uint8_t>(_mode);
  EEPROM.put(0, header);
  EEPROM.commit();
}

void EEPROMManager::setFixedCalibrationFactor(float factor) {
  _fixedCalibrationFactor = factor;

  // Update the EEPROM header
  EEPROMHeader header;
  EEPROM.get(0, header);
  header.fixedCalibrationFactor = _fixedCalibrationFactor;
  EEPROM.put(0, header);
  EEPROM.commit();
}

bool EEPROMManager::saveCalibrationRecord(size_t index,
                                          const CalibrationRecord& record) {
  if (index >= _maxRecords) return false;

  size_t recordSize = sizeof(CalibrationRecord);
  size_t address = EEPROM_HEADER_SIZE + index * recordSize;

  EEPROM.put(address, record);

  EEPROMHeader header;
  EEPROM.get(0, header);
  if (index >= header.recordCount) {
    header.recordCount = index + 1;
    EEPROM.put(0, header);
  }

  return EEPROM.commit();
}

bool EEPROMManager::saveCalibrationRecords(
    const std::vector<CalibrationRecord>& records) {
  // Save calibration mode and fixed factor
  EEPROMHeader header = {EEPROM_EMPTY_MARKER, static_cast<uint8_t>(_mode),
                         static_cast<uint8_t>(_fixedCalibrationFactor),
                         static_cast<uint8_t>(records.size())};
  EEPROM.put(0, header);

  if (records.size() > _maxRecords) return false;

  for (size_t i = 0; i < records.size(); i++) {
    if (!saveCalibrationRecord(i, records[i])) return false;
  }
  return true;
}

bool EEPROMManager::loadCalibrationRecords(
    std::vector<CalibrationRecord>& records) const {
  EEPROMHeader header;
  EEPROM.get(0, header);
  if (header.marker == EEPROM_EMPTY_MARKER) return false;

  records.clear();
  size_t recordSize = sizeof(CalibrationRecord);
  for (size_t i = 0; i < header.recordCount; i++) {
    size_t address = EEPROM_HEADER_SIZE + i * recordSize;
    CalibrationRecord record;
    EEPROM.get(address, record);
    records.push_back(record);
  }
  return true;
}

bool EEPROMManager::deleteCalibrationRecord(size_t index) {
  if (index >= _maxRecords) return false;

  EEPROMHeader header;
  EEPROM.get(0, header);

  if (index >= header.recordCount) return false;

  size_t recordSize = sizeof(CalibrationRecord);
  size_t moveCount = header.recordCount - index - 1;

  for (size_t i = 0; i < moveCount; i++) {
    size_t srcAddress = EEPROM_HEADER_SIZE + (index + 1 + i) * recordSize;
    size_t destAddress = EEPROM_HEADER_SIZE + (index + i) * recordSize;

    CalibrationRecord record;
    EEPROM.get(srcAddress, record);
    EEPROM.put(destAddress, record);
  }

  header.recordCount--;
  EEPROM.put(0, header);

  size_t lastRecordAddress =
      EEPROM_HEADER_SIZE + header.recordCount * recordSize;
  CalibrationRecord emptyRecord = {};
  EEPROM.put(lastRecordAddress, emptyRecord);

  return EEPROM.commit();
}

void EEPROMManager::clearEEPROM() {
  bool needsCommit = false;
  for (size_t i = 0; i < EEPROM_SIZE; i++) {
    if (EEPROM.read(i) != 0xFF) {  // Only write if the byte is not already 0xFF
      EEPROM.write(i, 0xFF);
      needsCommit = true;
    }
  }
  if (needsCommit) {
    EEPROM.commit();
  }

  EEPROMHeader header = {EEPROM_EMPTY_MARKER, 0, 0,
                         0};  // Set all fields explicitly.
  EEPROM.put(EEPROM_START_ADDRESS,
             header);  // It's assumed this is necessary even if the EEPROM was
                       // already clear, to ensure the header is correctly set.
  EEPROM.commit();  // Commit here is necessary to ensure the header update is
                    // applied.
}
