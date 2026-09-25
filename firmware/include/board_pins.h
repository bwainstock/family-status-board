// The CrowPanel ESP32 5.79" (Elecrow DIS08792E), pin by pin.
//
// Recorded here rather than remembered. Every number below is read off the
// vendor's own examples and wiki, cited inline, because the schematic is the
// only authority and nothing else in this repository knows these numbers:
//
//   SPI, panel control   example/arduino/Examples/5.79_GPIO/spi.h
//   panel supply, LED    example/arduino/Examples/5.79_PWR/5.79_PWR.ino
//   buttons              example/arduino/Examples/5.79_key/5.79_key.ino
//   card slot            https://www.elecrow.com/wiki/CrowPanel_ESP32_E-paper_5.79-inch_HMI_Display.html
//
//   https://github.com/Elecrow-RD/CrowPanel-ESP32-5.79-E-paper-HMI-Display-with-272-792
//
// Nothing here is guesswork, but nothing here was confirmed on hardware before
// issue #13 either. See docs/hardware/bringup.md for what the board actually did.

#ifndef BOARD_PINS_H_
#define BOARD_PINS_H_

#include <stdint.h>

namespace pins {

// The panel's supply rail. HIGH turns the panel on. The vendor examples raise
// it and never lower it again; lowering it before deep sleep is the single
// highest-leverage line in the firmware (issue #2), so it is a named pin rather
// than a magic 7 in the middle of setup().
constexpr int8_t kPanelPower = 7;

// SPI to the two SSD1683 controllers. There is no MISO: the panel is write-only
// as far as this firmware is concerned, and BUSY carries everything we read.
constexpr int8_t kEpdSck = 12;
constexpr int8_t kEpdMosi = 11;
constexpr int8_t kEpdCs = 45;
constexpr int8_t kEpdDc = 46;
constexpr int8_t kEpdRst = 47;
constexpr int8_t kEpdBusy = 48;

// Buttons, active low. Only one of these is ever used in anger — the Caregiver's
// forced Refresh — but the rest are recorded so the next person does not have to
// go back to the vendor repository to find out which is which.
constexpr int8_t kKeyHome = 2;
constexpr int8_t kKeyExit = 1;
constexpr int8_t kKeyPrev = 6;
constexpr int8_t kKeyNext = 4;
constexpr int8_t kKeyOk = 5;

constexpr int8_t kPowerLed = 41;

// The card slot, which this firmware never uses. Listed because it has to be
// left alone deliberately rather than by accident.
constexpr int8_t kSdMosi = 40;
constexpr int8_t kSdMiso = 13;
constexpr int8_t kSdSck = 39;
constexpr int8_t kSdCs = 10;

}  // namespace pins

#endif  // BOARD_PINS_H_
