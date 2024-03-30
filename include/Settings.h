// Settings.h
#pragma once

#define PULSE_PIN D3
#define PULSE_BROADCAST_INTERVAL 50  // For websocket updates
#define SCALED_OUTPUT_PIN D7

#define BASE_PULSE_DURATION_MICROS \
  50000  // The generated scaled pulse is dynamic however this sets the base
         // duration until input pulses are generated and timing is adjusted.

#define OTA_FIRMWARE_URL                                               \
  "http://smoothcontrol.com/embedded-firmware/flowmeter-pulse-scaler/" \
  "firmware.bin"
#define OTA_FIRMWARE_VERSION_URL                                       \
  "http://smoothcontrol.com/embedded-firmware/flowmeter-pulse-scaler/" \
  "version.json"
#define MDNS_DOMAIN_NAME "pulse-scaler"

#define DEFAULT_CALIBRATION_FACTOR 1.0

#define MAX_CALIBRATION_RECORDS 10
#define EEPROM_START_ADDRESS 0
#define EEPROM_SIZE 512