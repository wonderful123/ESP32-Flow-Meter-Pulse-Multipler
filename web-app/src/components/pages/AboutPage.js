import m from "mithril";
import SectionContainer from "components/common/SectionContainer";

const AboutPage = {
  content: m.trust(`
<h1 class="title" id="introduction">Introduction</h1>
<p>The Flow Meter Pulse Scaler is an embedded project designed to calibrate flow meters by accurately scaling their pulse outputs. This project is indispensable in applications where precise flow measurement and calibration are crucial. Built on the ESP8266 platform, it not only supports OTA (Over-the-Air) firmware updates but also features a web server-based configuration and remote monitoring capabilities, enhancing its usability and accessibility.</p>
<h2 class="title" id="pins">Pins</h2>
<p>Default pins are set in Settings.h</p>
<p>Input pin: D3</p>
<p>Output pin: D7</p>
<h2 class="title" id="features">Features</h2>
<ul>
<li><p><strong>Dynamic Pulse Calibration</strong>: The system is adept at dynamically calibrating the pulse output of flow meters to match exact flow rates. Whether dealing with pulses that are 1 second on and 1 second off or shorter pulses like 50ms, the pulse scaler dynamically adjusts to maintain the desired output rate. This ensures precise flow measurement across a range of operating conditions.</p>
</li>
<li><p><strong>Web Interface</strong>: A built-in web server allows for easy configuration and monitoring of the pulse scaler. This intuitive interface simplifies the process of setting calibration parameters and viewing device status from any standard web browser.</p>
</li>
<li><p><strong>OTA Updates</strong>: Firmware updates can be deployed remotely without the need for physical access to the device, ensuring that the pulse scaler remains up-to-date with the latest features and improvements.</p>
</li>
<li><p><strong>Versatile Compatibility</strong>: Designed to support a wide array of flow meters with pulse outputs, the pulse scaler is a versatile solution suitable for various applications.</p>
</li>
<li><p><strong>EEPROM Support</strong>: Multiple calibration records can be stored directly on the device via EEPROM. This allows for the retention of calibration data even after the device is powered off, enabling quick and easy switching between different calibration setups.</p>
</li>
<li><p><strong>Configurable Output Pin</strong>: The output pin used for the scaled pulse signal is fully configurable and can be connected directly to the relevant system or equipment requiring calibration.</p>
</li>
<li><p><strong>Level Shifter Compatibility</strong>: For applications requiring voltage level adjustments, the use of a cheap level shifter board, such as those based on the BSS138, is recommended. This facilitates safe voltage shifting down for the MCU and back up to the necessary level for the flow meter or receiving system.</p>
</li>
</ul>
<h2 class="title" id="installation">Installation</h2>
<h3 class="title" id="prerequisites">Prerequisites</h3>
<ul>
<li><a href="https://platformio.org/">PlatformIO</a></li>
<li>Arduino framework</li>
<li>ESP8266 development board</li>
<li>Access to a Wi-Fi network</li>
</ul>
<h3 class="title" id="hardware-setup">Hardware Setup</h3>
<ol>
<li>Connect your flow meter&#39;s pulse output to the designated GPIO pin on the ESP8266 board. The specific pin can be configured within <code>Settings.h</code>. You can update the webpage to reflect the pin change.</li>
<li>If necessary, use a level shifter board like ones based on the BSS138 to adjust the voltage levels appropriately for the ESP8266 input and the desired output signal.</li>
<li>The output pin, which is configurable within <code>Settings.h</code>, should be connected to the system or equipment being calibrated.</li>
</ol>
<h2 class="title" id="configuration-and-use">Configuration and Use</h2>
<p>Access the web interface by connecting to the ESP8266&#39;s IP address with a web browser. From there, you can configure pulse scaling parameters, view and select calibration records stored in EEPROM, and update the firmware OTA as needed.</p>
<p>The web interface IP address is available by serial at startup or mDNS at: <a href="http://pulse-scaler.local">http://pulse-scaler.local</a></p>
`),

  view: function () {
    return m(SectionContainer, [
      m("div.box", this.content)
    ]);
  }
}

export default AboutPage;