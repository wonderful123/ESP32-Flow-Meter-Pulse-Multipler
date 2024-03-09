#define PULSE_PIN D3
#define PULSE_BROADCAST_INTERVAL 50  // For websocket updates
#define SCALED_OUTPUT_PIN D7
#define BASE_PULSE_DURATION_MICROS \
  50000  // The generated scaled pulse is dynamic however this sets the base
         // duration until input pulses are generated and timing is adjusted.
#define OTA_FIRMWARE_URL "http://smoothcontrol.com/embedded-firmware/flowmeter-pulse-scaler/firmware.bin"