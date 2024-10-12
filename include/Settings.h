// Settings.h
#pragma once

#define PULSE_PIN 3
#define PULSE_BROADCAST_INTERVAL 250  // For websocket updates
#define SCALED_OUTPUT_PIN 7

#define BASE_PULSE_DURATION_MICROS \
  50000  // The generated scaled pulse is dynamic however this sets the base
         // duration until input pulses are generated and timing is adjusted.

#define WEBSOCKET_PORT 80

#define OTA_FIRMWARE_URL "http://smoothcontrol.com/embedded-firmware/flowmeter-pulse-scaler/firmware.bin"
#define OTA_FIRMWARE_MANIFEST_URL "http://smoothcontrol.com/embedded-firmware/flowmeter-pulse-scaler/version.json"
#define MDNS_DOMAIN_NAME "pulse-scaler"
#define AP_SSID_NAME "Pulse Scaler"

#define DEFAULT_CALIBRATION_FACTOR 1.0
#define CARDINAL_SPLINE_TENSION_FACTOR 0.5

#define MAX_CALIBRATION_RECORDS 10
#define EEPROM_START_ADDRESS 0
#define EEPROM_SIZE 512