// EEPROMManager.h
#pragma once

#include <EEPROM.h>
#include <stddef.h>  // for size_t

#include <vector>
struct EEPROMHeader {
  unsigned long marker;  // Use 0xFFFFFFFF for empty, 0 for containing records
};
static const unsigned long EEPROM_EMPTY_MARKER = 0xFFFFFFFF;
static const size_t EEPROM_HEADER_SIZE = sizeof(EEPROMHeader);

struct CalibrationRecord {
  float targetVolume;
  float observedVolume;
  float scalingFactor;
  unsigned long pulseCount;
};

class EEPROMManager {
 public:
  EEPROMManager(size_t maxRecords);
  void begin();
  bool saveScalingFactor(float scalingFactor);
  bool loadScalingFactor(float& scalingFactor) const;
  bool saveCalibrationRecord(size_t index, const CalibrationRecord& record);
  bool saveCalibrationRecords(const std::vector<CalibrationRecord>& records);
  bool loadCalibrationRecords(std::vector<CalibrationRecord>& records) const;
  void clearEEPROM();

 private:
  size_t _maxRecords;
  static const int EEPROM_SIZE = 512;  // Define a suitable EEPROM size
  static const int START_ADDRESS = 0;  // Starting address in EEPROM
  int calculateRecordSize() const;
};
