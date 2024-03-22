// EEPROMManager.cpp
#include "EEPROMManager.h"

EEPROMManager::EEPROMManager(size_t maxRecords) : _maxRecords(maxRecords) {}

void EEPROMManager::begin() {
  EEPROM.begin(EEPROM_SIZE);
  EEPROMHeader header;
  EEPROM.get(EEPROM_START_ADDRESS, header);
  if (header.marker != EEPROM_EMPTY_MARKER && header.marker != 0) {
    // EEPROM is uninitialized, set it to empty state
    clearEEPROM();
  } else if (header.marker == 0) {
    // EEPROM contains records, but no change needed here
    // The record count will be read when needed
  }
}

bool EEPROMManager::saveCalibrationFactor(float calibrationFactor) {
  if (calibrationFactor <= 0 || isnan(calibrationFactor)) {
    // Invalid calibration factor
    return false;
  }
  size_t address = EEPROM_SIZE - sizeof(float);  // Save at the end of EEPROM
  EEPROM.put(address, calibrationFactor);
  return EEPROM.commit();
}

bool EEPROMManager::loadCalibrationFactor(float& scalingFactor) const {
  size_t address = EEPROM_SIZE - sizeof(float);
  EEPROM.get(address, scalingFactor);
  if (isnan(scalingFactor)) {
    scalingFactor = 1.0;  // Default scaling factor
    return false;
  }
  return true;
}

bool EEPROMManager::saveCalibrationRecord(size_t index,
                                          const CalibrationRecord& record) {
  EEPROMHeader header;
  EEPROM.get(EEPROM_START_ADDRESS, header);
  if (header.marker != EEPROM_EMPTY_MARKER && header.marker != 0) {
    clearEEPROM();
    EEPROM.get(EEPROM_START_ADDRESS,
               header);  // Corrected: No need to declare header again
  }

  if (index >= _maxRecords) return false;

  size_t recordSize = sizeof(CalibrationRecord);
  size_t address =
      EEPROM_START_ADDRESS + EEPROM_HEADER_SIZE + index * recordSize;

  if (address + recordSize > CALIBRATION_FACTOR_ADDRESS)  // Use named constant
    return false;  // Ensure calibration factor space

  EEPROM.put(address, record);

  // No need to fetch header again, already have it from the beginning of this
  // method
  if (index >= header.recordCount) {
    header.recordCount =
        index + 1;  // Update record count if a new record is added
    EEPROM.put(EEPROM_START_ADDRESS, header);
  }

  return EEPROM.commit();
}

bool EEPROMManager::saveCalibrationRecords(
    const std::vector<CalibrationRecord>& records) {
  if (records.size() > _maxRecords) {
    // Attempting to save more records than EEPROM can hold
    return false;
  }

  for (size_t i = 0; i < records.size(); i++) {
    if (!saveCalibrationRecord(i, records[i])) return false;
  }
  return true;
}

bool EEPROMManager::loadCalibrationRecords(
    std::vector<CalibrationRecord>& records) const {
  EEPROMHeader header;
  EEPROM.get(EEPROM_START_ADDRESS, header);
  if (header.marker == EEPROM_EMPTY_MARKER) return false;

  records.clear();
  size_t recordSize = sizeof(CalibrationRecord);
  for (size_t i = 0; i < header.recordCount; i++) {
    size_t address = EEPROM_START_ADDRESS + EEPROM_HEADER_SIZE + i * recordSize;
    if (address + recordSize > EEPROM_SIZE - sizeof(float)) break;

    CalibrationRecord record;
    EEPROM.get(address, record);

    if (record.targetVolume <= 0 || record.observedVolume <= 0 ||
        record.pulseCount == 0) {
      // Record does not meet validation criteria, potentially end of valid
      // records Consider logging or handling this scenario as needed
      break;
    }

    records.push_back(record);
  }
  return true;
}

bool EEPROMManager::deleteCalibrationRecord(size_t index) {
  if (index >= _maxRecords) {
    return false;  // Index out of range
  }

  EEPROMHeader header;
  EEPROM.get(EEPROM_START_ADDRESS, header);

  if (index >= header.recordCount) {
    return false;  // Index out of existing records range
  }

  size_t recordSize = sizeof(CalibrationRecord);
  size_t moveCount =
      header.recordCount - index - 1;  // Records after the one to delete

  for (size_t i = 0; i < moveCount; i++) {
    size_t srcAddress = EEPROM_START_ADDRESS + EEPROM_HEADER_SIZE +
                        (index + 1 + i) * recordSize;
    size_t destAddress =
        EEPROM_START_ADDRESS + EEPROM_HEADER_SIZE + (index + i) * recordSize;

    CalibrationRecord record;
    EEPROM.get(srcAddress, record);
    EEPROM.put(destAddress, record);
  }

  header.recordCount--;  // Decrement the record count
  EEPROM.put(EEPROM_START_ADDRESS, header);

  // Optional: Clear the now-unused last record space to maintain cleanliness
  size_t lastRecordAddress = EEPROM_START_ADDRESS + EEPROM_HEADER_SIZE +
                             header.recordCount * recordSize;
  CalibrationRecord emptyRecord = {};  // Create an "empty" record
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

  EEPROMHeader header = {EEPROM_EMPTY_MARKER,
                         0};  // Reset marker and record count
  EEPROM.put(EEPROM_START_ADDRESS,
             header);  // It's assumed this is necessary even if the EEPROM was
                       // already clear, to ensure the header is correctly set.
  EEPROM.commit();  // Commit here is necessary to ensure the header update is
                    // applied.
}
