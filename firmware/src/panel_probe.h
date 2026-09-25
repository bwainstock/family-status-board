// Raw SSD1683 access — a yardstick, not a design.
//
// GxEPD2 refreshes only half of this panel (see docs/hardware/bringup.md). To
// tell "the library mishandles this panel" apart from "this panel is broken" we
// need a second opinion, so this file drives the controllers directly.
//
// This targets the previous CrowPanel hardware specifically — its numbers
// (792, 272, 99...) describe that retired panel's two SSD1683s, not the
// GDEY075T7 issue #18 pivots to. Kept until issue #23 removes it along with
// the rest of that panel's bring-up plumbing.
//
// It follows two independent implementations that agree with each other:
//
//   Elecrow's own demo, for the init sequence
//     example/arduino/Demos/5.79_WIFI_refresh/{EPD_Init,spi}.cpp
//     https://github.com/Elecrow-RD/CrowPanel-ESP32-5.79-E-paper-HMI-Display-with-272-792
//
//   an ESPHome component for this exact board, for the RAM mapping, which is
//   simpler and better evidenced than the vendor's
//     components/crowpanel_579/crowpanel_579.cpp
//     https://github.com/samperk1/esphome-crowpanel-579
//
// This is deliberately a dead end. The firmware proper goes through GxEPD2's
// image path (issue #2); nothing here should grow features or be called from
// anywhere but the bring-up ladder.

#ifndef PANEL_PROBE_H_
#define PANEL_PROBE_H_

#include <stdint.h>

namespace panel_probe {

// Each SSD1683 addresses 400 source lines — 50 bytes of a row — across all 272
// gates.
constexpr int kSourceBytes = 50;
constexpr int kGateBits = 272;
constexpr int kControllerBytes = kSourceBytes * kGateBits;

// Hardware reset, soft reset, load the black/white waveform. Leaves both
// controllers awake and addressable.
void init();

// Flood the two controllers' black/white RAM independently. 0xFF is white and
// 0x00 is black, in controller terms. Feeding the halves different values is
// how you find out whether the slave is addressed at all: if both values land
// on the same half, the 0x80 command prefix is going nowhere.
void fill(uint8_t master_bw, uint8_t slave_bw);

// Push a Frame — 792x272, 99 bytes per row, MSB first, set bit is black — into
// both controllers.
void draw(const uint8_t* frame_bytes);

// Run the slow, conservative full-refresh waveform and wait it out.
void update();

void sleep();

}  // namespace panel_probe

#endif  // PANEL_PROBE_H_
