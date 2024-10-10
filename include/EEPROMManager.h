// EEPROMManager.h
#pragma once

#include <EEPROM.h>
#include <stddef.h>  // for size_t

#include <vector>

#include "Calibration/CalibrationRecord.h"
#include "Settings.h"

struct EEPROMHeader {
  unsigned long marker;  // Use 0xFFFFFFFF for empty, 0 for containing records
  size_t recordCount;    // The number of calibration records stored
};

static constexpr unsigned long EEPROM_EMPTY_MARKER = 0xFFFFFFFF;
static constexpr size_t EEPROM_HEADER_SIZE = sizeof(EEPROMHeader);

class EEPROMManager {
 public:
  EEPROMManager(size_t maxRecords);
  void begin();
  bool saveCalibrationRecord(size_t index, const CalibrationRecord& record);
  bool saveCalibrationRecords(const std::vector<CalibrationRecord>& records);
  bool loadCalibrationRecords(std::vector<CalibrationRecord>& records) const;
  bool deleteCalibrationRecord(size_t index);
  void clearEEPROM();

 private:
  size_t _maxRecords;
};