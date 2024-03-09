// EEPROMManager.cpp
#include "EEPROMManager.h"

#include <cmath>

EEPROMManager::EEPROMManager(size_t maxRecords) : _maxRecords(maxRecords) {}

void EEPROMManager::begin() {
  EEPROM.begin(EEPROM_SIZE);
  EEPROMHeader header;
  EEPROM.get(START_ADDRESS, header);
  if (header.marker != EEPROM_EMPTY_MARKER && header.marker != 0) {
    // EEPROM is uninitialized, set it to empty state
    header.marker = EEPROM_EMPTY_MARKER;
    EEPROM.put(START_ADDRESS, header);
    EEPROM.commit();
  }
}

bool EEPROMManager::saveScalingFactor(float scalingFactor) {
  int address = EEPROM_SIZE - sizeof(float);  // Save at the end of EEPROM
  EEPROM.put(address, scalingFactor);
  return EEPROM.commit();
}

bool EEPROMManager::loadScalingFactor(float& scalingFactor) const {
  int address = EEPROM_SIZE - sizeof(float);  // Load from the end of EEPROM
  EEPROM.get(address, scalingFactor);
  if (std::isnan(scalingFactor)) {  // Check if the read value is not a number
    scalingFactor = 1.0;       // Default value if not set
    return false;
  }
  return true;
}

bool EEPROMManager::saveCalibrationRecord(size_t index,
                                          const CalibrationRecord& record) {
  if (index >= _maxRecords) {
    return false;  // Index is out of bounds
  }

  int recordSize = calculateRecordSize();
  int address = START_ADDRESS + EEPROM_HEADER_SIZE +
                index * recordSize;  // Adjust for header

  if (address + recordSize > EEPROM_SIZE) {
    return false;  // Ensure we don't go past the EEPROM's storage capacity
  }

  // If it's the first record being saved, update the header to mark EEPROM as
  // non-empty
  if (index == 0) {
    EEPROMHeader header = {0};  // Mark as containing records
    EEPROM.put(START_ADDRESS, header);
  }

  // Write the record to EEPROM at the calculated address
  EEPROM.put(address, record);
  return EEPROM.commit();  // Save changes to EEPROM
}

bool EEPROMManager::saveCalibrationRecords(
    const std::vector<CalibrationRecord>& records) {
  int recordSize = calculateRecordSize();
  int totalSize = recordSize * records.size();
  if (totalSize > EEPROM_SIZE - START_ADDRESS)
    return false;  // Check for size overflow

  int address = START_ADDRESS;
  for (const auto& record : records) {
    if (address + recordSize > EEPROM_SIZE) break;  // Prevent overflow
    EEPROM.put(address, record);
    address += recordSize;
  }
  return EEPROM.commit();
}

bool EEPROMManager::loadCalibrationRecords(
    std::vector<CalibrationRecord>& records) const {
  EEPROMHeader header;
  EEPROM.get(START_ADDRESS, header);
  if (header.marker == EEPROM_EMPTY_MARKER) {
    return false;  // EEPROM is marked as empty, so skip loading records
  }

  records.clear();
  int recordSize = calculateRecordSize();
  CalibrationRecord record;
  int address = START_ADDRESS;
  while (address + recordSize <= EEPROM_SIZE) {
    EEPROM.get(address, record);
    if (std::isnan(record.targetVolume) && std::isnan(record.observedVolume) &&
        record.pulseCount == 0xFFFFFFFF) {
      address += recordSize;  // Skip invalid record
      continue;
    }
    if (record.targetVolume == 0 && record.observedVolume == 0 &&
        record.scalingFactor == 0)
      break;  // End of valid data
    records.push_back(record);
    address += recordSize;
    if (records.size() >= _maxRecords) break;
  }
  return true;
}

int EEPROMManager::calculateRecordSize() const {
  return sizeof(CalibrationRecord);
}

void EEPROMManager::clearEEPROM() {
  EEPROMHeader header = {EEPROM_EMPTY_MARKER};
  EEPROM.put(START_ADDRESS, header);  // Set EEPROM to empty state
  EEPROM.commit();
}