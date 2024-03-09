# Flow Meter Pulse Scaler

## Introduction

The Flow Meter Pulse Scaler is an embedded project designed to calibrate flow meters by accurately scaling their pulse outputs. This project is indispensable in applications where precise flow measurement and calibration are crucial. Built on the ESP8266 platform, it not only supports OTA (Over-the-Air) firmware updates but also features a web server-based configuration and remote monitoring capabilities, enhancing its usability and accessibility.

## Features

- **Dynamic Pulse Calibration**: The system is adept at dynamically calibrating the pulse output of flow meters to match exact flow rates. Whether dealing with pulses that are 1 second on and 1 second off or shorter pulses like 50ms, the pulse scaler dynamically adjusts to maintain the desired output rate. This ensures precise flow measurement across a range of operating conditions.

- **Web Interface**: A built-in web server allows for easy configuration and monitoring of the pulse scaler. This intuitive interface simplifies the process of setting calibration parameters and viewing device status from any standard web browser.

- **OTA Updates**: Firmware updates can be deployed remotely without the need for physical access to the device, ensuring that the pulse scaler remains up-to-date with the latest features and improvements.

- **Versatile Compatibility**: Designed to support a wide array of flow meters with pulse outputs, the pulse scaler is a versatile solution suitable for various applications.

- **EEPROM Support**: Multiple calibration records can be stored directly on the device via EEPROM. This allows for the retention of calibration data even after the device is powered off, enabling quick and easy switching between different calibration setups.

- **Configurable Output Pin**: The output pin used for the scaled pulse signal is fully configurable and can be connected directly to the relevant system or equipment requiring calibration.

- **Level Shifter Compatibility**: For applications requiring voltage level adjustments, the use of a cheap level shifter board, such as those based on the BSS138, is recommended. This facilitates safe voltage shifting down for the MCU and back up to the necessary level for the flow meter or receiving system.

## Installation

### Prerequisites

- [PlatformIO](https://platformio.org/)
- Arduino framework
- ESP8266 development board
- Access to a Wi-Fi network

### Hardware Setup

1. Connect your flow meter's pulse output to the designated GPIO pin on the ESP8266 board. The specific pin can be configured within `Settings.h`. You can update the webpage to reflect the pin change.
2. If necessary, use a level shifter board like ones based on the BSS138 to adjust the voltage levels appropriately for the ESP8266 input and the desired output signal.
3. The output pin, which is configurable within `Settings.h`, should be connected to the system or equipment being calibrated.

## Configuration and Use

Access the web interface by connecting to the ESP8266's IP address with a web browser. From there, you can configure pulse scaling parameters, view and select calibration records stored in EEPROM, and update the firmware OTA as needed.

The web interface IP address is available by serial at startup or mDNS at: http://pulse-scaler.local
