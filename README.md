# Flow Meter Pulse Scaler

## Introduction

The **Flow Meter Pulse Scaler** is an embedded system project designed for precise calibration of flow meter pulse outputs. This device dynamically adjusts the output pulses to match desired flow rates, ensuring accuracy across various operating conditions. Built on the ESP platform, it offers a modern solution with features like OTA firmware updates, a web-based interface for configuration and monitoring, and support for multiple calibration setups.

## Features

- **Dynamic Pulse Calibration**:
  - Adapts to a wide range of pulse input patterns, including varying pulse widths and frequencies.
  - Ensures precise flow measurement by dynamically scaling input pulses to desired output rates.

- **Web Interface**:
  - Built-in web server for easy configuration, monitoring, and calibration.
  - Accessible from any browser, simplifying device management.

- **OTA Firmware Updates**:
  - Remote firmware updates without requiring physical access to the device.

- **Versatile Compatibility**:
  - Compatible with a wide range of flow meters featuring pulse outputs.
  - Suitable for diverse industrial and consumer applications.

- **Calibration Data Storage**:
  - Stores multiple calibration records in EEPROM, enabling quick switching between setups.
  - Retains data across power cycles for seamless operation.

- **Configurable Output Pin**:
  - The output pin for scaled pulses is fully configurable, allowing integration with various systems.

- **Level Shifter Support**:
  - Easily integrates with systems requiring voltage level shifting using affordable level shifter boards (e.g., BSS138-based).

## How It Works

1. **Input Signal Handling**:
   - Detects rising and falling edges of the flow meter pulse signal.
   - Calculates the input frequency using exponential smoothing to account for abrupt changes.

2. **Dynamic Scaling**:
   - The scaling factor is dynamically adjusted using calibration parameters.
   - Optionally incorporates real-time adjustments based on temperature data.

3. **Output Signal Generation**:
   - Generates a scaled pulse signal based on the input frequency and calibration factor.
   - Maintains precise timing using a queue system and an interrupt-driven timer.

4. **Web-Based Configuration**:
   - Configure input/output pins, scaling factors, and calibration records.
   - View real-time device status and manage calibration through an intuitive interface.

## Installation

### Prerequisites

- [PlatformIO](https://platformio.org/)
- Arduino framework
- ESP8266 development board
- Access to a Wi-Fi network

### Hardware Setup

1. **Connect Flow Meter**:
   - Attach the flow meter's pulse output to a GPIO pin on the ESP8266. The pin can be configured in `Settings.h`.

2. **Level Shifting (Optional)**:
   - Use a level shifter (e.g., BSS138-based board) if voltage adjustment is needed between the flow meter, ESP8266, or output system.

3. **Connect Output**:
   - Attach the configurable output pin to the target system requiring scaled pulse signals.

### Software Setup

1. Clone this repository and open it in PlatformIO.
2. Configure `Settings.h` to define input/output pins, scaling parameters, and other device settings.
3. Compile and upload the firmware to your ESP8266 board using PlatformIO.

## Configuration and Use

1. Power on the ESP and connect it to your Wi-Fi network.
2. Retrieve the device's IP address via the serial console or mDNS (`http://pulse-scaler.local`).
3. Open the web interface in your browser to:
   - Set up scaling parameters.
   - View and manage calibration records stored in EEPROM.
   - Update the firmware OTA.
   - Monitor real-time device performance.

---

## Technical Overview

The **Flow Meter Pulse Scaler** processes input signals from a flow meter, dynamically scales them based on calibration factors, and generates precise output pulses. The system uses a modular design with several classes to handle input detection, scaling, output generation, and calibration.

### **Input Signal Handling**

The flow meter generates pulses corresponding to the liquid flow, with both rising and falling edges detected as a single pulse. The **InputPulseHandler** class is responsible for:

- Detecting pulses using GPIO interrupts, ensuring high responsiveness and low latency.
- Calculating the input frequency by measuring the time between successive pulses.
- Applying exponential smoothing to stabilize the frequency readings and mitigate abrupt changes in the input signal.
- Triggering a callback function with updated pulse and frequency data for downstream processing.

### **Dynamic Scaling**

The **PulseScaler** class adjusts the output pulse rate based on the input frequency and calibration settings. Key functions include:

- Receiving frequency updates from the **InputPulseHandler** via a callback mechanism.
- Maintaining an accumulator to track fractional pulses and determine when an output pulse should be generated.
- Dynamically applying a calibration factor provided by the **CalibrationManager**, which adjusts for environmental conditions (e.g., temperature).
- Handling pauses or abrupt frequency changes to maintain consistent and reliable output behavior.

### **Output Signal Generation**

The **OutputPulseHandler** class generates the scaled output signal based on the desired frequency calculated by the **PulseScaler**. Features include:

- Managing a queue of pulses to be generated, ensuring precise timing and synchronization.
- Using a hardware timer interrupt to toggle the output pin, achieving high-precision pulse generation.
- Incrementing the output pulse count to track the number of generated pulses.

### **Calibration and Temperature Adjustment**

The **CalibrationManager** manages the scaling factor used by the **PulseScaler**. It provides:

- Fixed calibration modes for static adjustments.
- Dynamic calibration modes that incorporate real-time data from the **TemperatureSensor** to adjust for environmental conditions affecting the flow meter's accuracy.
- Storage of multiple calibration records in EEPROM for quick switching and persistence across power cycles.

### **Web-Based Configuration**

The system includes a built-in web server for configuration and monitoring, enabling:

- Real-time adjustment of scaling parameters, including input/output pin mappings and calibration factors.
- Visualization of device status, such as current input frequency, output frequency, and calibration settings.
- Firmware updates via OTA, reducing maintenance efforts and ensuring the device remains up-to-date.

### **Key Technical Workflow**

1. The **InputPulseHandler** detects pulses from the flow meter and calculates the input frequency.
2. The frequency data is passed to the **PulseScaler**, which adjusts the scaling factor using data from the **CalibrationManager** and **TemperatureSensor**.
3. The **PulseScaler** queues pulses for generation by the **OutputPulseHandler** based on the scaled frequency.
4. The **OutputPulseHandler** uses a timer interrupt to generate precise output pulses on the designated GPIO pin.
5. The web interface allows users to monitor and configure the system in real time, including updating calibration records and firmware.

This technical design ensures accurate and dynamic scaling of flow meter pulses, making the device versatile and reliable for a wide range of applications.
