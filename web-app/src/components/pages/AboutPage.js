import m from "mithril";
import SectionContainer from "components/common/SectionContainer";

const AboutPage = {
  content: m.trust(`
    <h1 class="title" id="introduction">Introduction</h1>
    <p>The Flow Meter Pulse Scaler is an embedded project designed to calibrate flow meters by accurately scaling their pulse outputs. This project is indispensable in applications where precise flow measurement and calibration are crucial. Built on the ESP8266 platform, it supports OTA (Over-the-Air) firmware updates and features a web server-based configuration and remote monitoring capabilities, enhancing its usability and accessibility.</p>
    
    <h2 class="title" id="pins">Pins</h2>
    <p>Default pins are set in <code>Settings.h</code>:</p>
    <ul>
      <li>Input pin: <strong>D3</strong></li>
      <li>Output pin: <strong>D7</strong></li>
    </ul>

    <h2 class="title" id="features">Features</h2>
    <ul>
      <li>
        <p><strong>Dynamic Pulse Calibration</strong>: The system dynamically calibrates the pulse output of flow meters to match exact flow rates. It adjusts for both long pulses (1 second on/off) and short pulses (50ms), ensuring precise flow measurement across various conditions.</p>
      </li>
      <li>
        <p><strong>Web Interface</strong>: A built-in web server provides easy configuration and monitoring. The intuitive interface allows for setting calibration parameters and viewing device status from any web browser.</p>
      </li>
      <li>
        <p><strong>OTA Updates</strong>: Firmware updates can be deployed remotely, eliminating the need for physical access to the device. This ensures the pulse scaler remains up-to-date with the latest features.</p>
      </li>
      <li>
        <p><strong>Versatile Compatibility</strong>: Compatible with a wide range of flow meters that use pulse outputs, the pulse scaler offers a flexible solution for different applications.</p>
      </li>
      <li>
        <p><strong>EEPROM Support</strong>: The device can store multiple calibration records in EEPROM, retaining them even after power loss. This enables quick switching between different calibration setups.</p>
      </li>
      <li>
        <p><strong>Configurable Output Pin</strong>: The output pin for the scaled pulse signal is configurable, allowing easy integration with the system or equipment being calibrated.</p>
      </li>
      <li>
        <p><strong>Level Shifter Compatibility</strong>: If voltage level adjustments are required, a level shifter board (e.g., BSS138-based) can be used to safely shift voltage levels between the MCU and the flow meter or receiving system.</p>
      </li>
    </ul>

    <h2 class="title" id="installation">Installation</h2>
    <h3 class="title" id="prerequisites">Prerequisites</h3>
    <ul>
      <li><a href="https://platformio.org/" target="_blank">PlatformIO</a></li>
      <li>Arduino framework</li>
      <li>ESP8266 development board</li>
      <li>Wi-Fi network access</li>
    </ul>

    <h3 class="title" id="hardware-setup">Hardware Setup</h3>
    <ol>
      <li>Connect the flow meter's pulse output to the designated GPIO pin on the ESP8266. The pin can be configured in <code>Settings.h</code>, and you can update the web interface to reflect any pin changes.</li>
      <li>Use a level shifter board (e.g., BSS138-based) if necessary to adjust voltage levels for the ESP8266 input and output signals.</li>
      <li>Connect the configurable output pin (set in <code>Settings.h</code>) to the system or equipment being calibrated.</li>
    </ol>

    <h2 class="title" id="configuration-and-use">Configuration and Use</h2>
    <p>Access the web interface by connecting to the ESP8266's IP address via a web browser. Configure pulse scaling parameters, view/select EEPROM-stored calibration records, and perform OTA firmware updates as needed.</p>
    <p>The web interface IP address is available through the serial output at startup or via mDNS at: <a href="http://pulse-scaler.local" target="_blank">http://pulse-scaler.local</a></p>
  `),

  view: function () {
    return m(SectionContainer, [m("div.box", this.content)]);
  },
};

export default AboutPage;
