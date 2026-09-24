[Skip to content](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html#crowpanel-esp32-e-paper-hmi-579-inch-display)

# CrowPanel ESP32 E-Paper HMI 5.79-inch Display [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#crowpanel-esp32-e-paper-hmi-579-inch-display "Permanent link")

## Description [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#description "Permanent link")

* * *

This CrowPanel **ESP32** 5.79” electronic paper HMI Display ( **E-Paper**) is an advanced display technology. It uses an active matrix electrophoretic display and a hard-coated anti-glare display surface to keep the **content visible** even in sunlight, perfectly mimicking the appearance and reading experience of **traditional paper**.

It boasts a high resolution of **272\*792**, offering a vivid display effect, and features the classic **black and white** display, suitable for various application scenarios. Equipped with the **ESP32-S3 chip** as the main controller, it ensures robust performance and provides fast, stable data transmission through the **SPI interface**. The design includes **multiple interfaces and buttons**, such as the BAT interface, UART0 interface, 2x10 pin GPIO interface, back button, home button, and rotary switch, facilitating user development and operation.

Based on the **ESP32 chip**, another highlight is its wide compatibility. It is compatible with three development environments: **Arduino IDE, ESP IDF, and MicroPython**, simplifying the secondary development process. Also, its **ultra-wide viewing angle** design allows you to enjoy the same brilliant image from any angle. The **ultra-low power consumption** feature consumes only a small amount of power when refreshing, ensuring long-lasting battery life. **Pure reflection mode** means **no backlight is required**, and information remains clearly visible after power failure, without worrying about information loss.

Due to its excellent characteristics such as low power consumption, high contrast, and high reflectivity, this electronic paper screen is widely applicable to shelf tags, price tags, badges, smart tags, smart home devices, e-readers, smart wearable devices, and other portable devices, making it an ideal choice for various smart devices and applications.

**Model: [DIS08792E](https://www.elecrow.com/crowpanel-esp32-5-79-e-paper-hmi-display-with-272-792-resolution-black-white-color-driven-by-spi-interface.html)**

![CrowPanel-ESP32-EPAPER-5.79inch](https://www.elecrow.com/wiki/assets/images/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display/CrowPanel-ESP32-EPAPER-5.79inch.webp)

## Feature [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#feature "Permanent link")

* * *

- 5.79-inch E-Paper display, 272\*792 resolution, black and white, using SPI interface communication;
- ESP32-S3 as the main chip, frequency up to 240MHz;
- Pure reflection mode, completely relying on light reflection to display content, no backlight is required, and the displayed content will not be lost even if the power is off;
- Hard-coated anti-glare display surface effectively resists glare;
- High contrast and high reflectivity provide a clearer and more vivid visual experience;
- Ultra-low power consumption and partial refresh function, significantly saving energy and achieving long standby time;
- Support full viewing angle, clearly visible from any angle;
- Rich buttons and interfaces (such as GPIO interface, UART interface, home button, etc.) for easy development and operation；
- Support multiple development environments (Arduino IDE, ESP IDF, MicroPython), suitable for different people's needs, simplifying the secondary development process.

## Application [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#application "Permanent link")

* * *

- Electronic label: supermarket or shelf product information and price；
- E-book reader；
- Electronic business card: display the corresponding participant information；
- Smart home and other applications

## Specification [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#specification "Permanent link")

* * *

| Item | Descriptions |
| --- | --- |
| Size | 5.79 inch |
| MCU | ESP32-S3-WROOM-1-N8R8, up to 240 MHz |
| Flash | 8 MB |
| PSRAM | 8 MB |
| Material | Active Matrix Electrophoretic Display (AM EPD) |
| Driver Chip | SSD1683x2 |
| Resolution | 272(H)x792(L) Pixel |
| Pixel pitch | 0.1755x0.1755 |
| Viewing Angle | Full Viewing Angle |
| Communication interface | 3-/4-wire SPI, default 4-wire SPI |
| Interface | UART0x1, BATx1, GPIOx1, TF Card Slot x1 |
| Button | Dial Switchx1, Menu Buttonx1, Back Buttonx1, REST Buttonx1, BOOT Buttonx1 |
| Development Environment | Arduino IDE、ESP IDF、MicroPython |
| Display Color | Black and white |
| Refresh Mode | Partial refresh (saves more power) |
| Operation Voltage | 2.2~3.7V |
| Battery connector type | SH1.0, 2Pin |
| Battery voltage | 3.7V |
| Operation Temperature | -0~50℃ |
| Storage Temperature | -25~70℃ |
| Active Area | 47.74mm(H)x139.00mm(L)(HxL) |

## Interfaces [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#interfaces "Permanent link")

* * *

![ESP32-EPAPER-5.79inch-pinout](https://www.elecrow.com/wiki/assets/images/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display/ESP32-EPAPER-5.79inch-pinout.webp)

| Interface Name | Description | Module Type |
| --- | --- | --- |
| MENU Button | Used for custom programming. |  |
| Rotary Switch | Used for custom programming. |  |
| EXIT Button | Used for custom programming. |  |
| RST | Reset button. Push it to reset the system. |  |
| BOOT | The Boot button is mainly used to control the startup and download mode of the development board. |  |
| GPIO | Reserved available GPIO pins. |  |
| TF | Provide off-line save and extra storage space. |  |
| BAT | Connect with the lithium battery. (With the battery charging circuit) | SH1.0-2Pin socket |
| Type-C | Provide serial communication, supply voltage and serial information printing. |  |

| **5.19-inch Display Port** | **Pin Number** |
| --- | --- |
| MENU Button | IO2 |
| Rotary Switch | Down(IO4); Up(IO6); CONF(IO5) |
| EXIT Button | IO1 |
| GPIO | IO3; IO9; IO15; IO17; IO19; IO21 |
| SD Card Slot(SPI) | MOSI(IO40); MISO(IO13); CLK(IO39); CS(IO10) |

## Platforms Supported [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#platforms-supported "Permanent link")

* * *

| **Arduino IDE** |
| --- |
| ![Arduino](https://www.elecrow.com/wiki/assets/images/common/Arduino.webp) |
| [![GetStarted](https://www.elecrow.com/wiki/assets/images/common/GetStarted.webp)](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-Paper_5.79inch_Arduino_Tutorial.html) |

## Resources [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#resources "Permanent link")

* * *

### Github Link [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#github-link "Permanent link")

- [CrowPanel ESP32 5.79 E-paper HMI Display with 272x792](https://github.com/Elecrow-RD/CrowPanel-ESP32-5.79-E-paper-HMI-Display-with-272-792)

### Schematic & PCB [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#schematic-pcb "Permanent link")

- [CrowPanel-ESP32-Display-5.79E-Inch.zip](https://www.elecrow.com/download/product/CrowPanel/E-paper/5.79-DIS08792E/CrowPanel-ESP32-Display-5.79E-Inch.zip)

### Specifications [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#specifications "Permanent link")

- [ESP32-S3-WROOM](https://www.elecrow.com/download/product/CrowPanel/E-paper/5.79-DIS08792E/esp32-s3-wroom-1_wroom-1u_datasheet_cn.pdf)

### Certification [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#certification "Permanent link")

- [ESP32-S3-WROOM-1-Wi-Fi-Certification](https://www.elecrow.com/download/product/CrowPanel/E-paper/5.79-DIS08792E/ESP32-S3-WROOM-1-Wi-Fi-Certification.pdf)
- [ESP32-S3-WROOM-1-NCC-Certification](https://www.elecrow.com/download/product/CrowPanel/E-paper/5.79-DIS08792E/ESP32-S3-WROOM-1-NCC-Certification.pdf)
- [ESP32-S3-WROOM-1-IC-Certification](https://www.elecrow.com/download/product/CrowPanel/E-paper/5.79-DIS08792E/ESP32-S3-WROOM-1-IC-Certification.pdf)
- [ESP32-S3-WROOM-1-MIC-Certification](https://www.elecrow.com/download/product/CrowPanel/E-paper/5.79-DIS08792E/ESP32-S3-WROOM-1-MIC-Certification.pdf)
- [ESP32-S3-WROOM-1-KCC-Certification](https://www.elecrow.com/download/product/CrowPanel/E-paper/5.79-DIS08792E/ESP32-S3-WROOM-1-KCC-Certification.pdf)

### Demo Code [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#demo-code "Permanent link")

#### Arduino IDE [¶](https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html\#arduino-ide "Permanent link")

- [Arduino Code for demos](https://www.elecrow.com/download/product/CrowPanel/E-paper/5.79-DIS08792E/Arduino/Demos.zip)
- [Arduino Code for examples](https://www.elecrow.com/download/product/CrowPanel/E-paper/5.79-DIS08792E/Arduino/Examples.zip)
