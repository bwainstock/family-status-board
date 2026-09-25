// Everything below is scoped to the previous panel: the Elecrow CrowPanel's
// pair of cascaded SSD1683 controllers, retired by issue #18's pivot to the
// GDEY075T7. It is kept only until issue #23 removes it along with the rest of
// that panel's bring-up plumbing, and every number in this file — 792, 272,
// 99 and the rest — describes that retired hardware, not the one this repo
// now targets.
#include "panel_probe.h"

#include <Arduino.h>
#include <SPI.h>

#include "board_pins.h"
#include "frame.h"

namespace panel_probe {
namespace {

// Slower than GxEPD2's 10 MHz. The vendor bit-bangs at a few hundred kHz, so
// this is still generous, and bring-up is not the place to be clever.
SPISettings spi_settings(4000000, MSBFIRST, SPI_MODE0);

// Master and slave share one bus and one chip select, and are told apart by
// bit 7 of the command byte: the master's black/white RAM is 0x24, the slave's
// is 0xA4. Everything that follows uses that one convention.
constexpr uint8_t kMaster = 0x00;
constexpr uint8_t kSlave = 0x80;

void wait_while_busy() {
  const uint32_t started = millis();
  while (digitalRead(pins::kEpdBusy) != LOW) {
    if (millis() - started > 10000) {
      Serial.println("       panel_probe: BUSY never cleared");
      return;
    }
    delay(1);
  }
}

// The vendor drops CS between every byte rather than holding it across the
// transfer as GxEPD2 does. Faithfully copied: on a cascaded pair the framing
// may well be load-bearing, and this file exists to rule that out.
void write_byte(uint8_t value) {
  digitalWrite(pins::kEpdCs, LOW);
  SPI.transfer(value);
  digitalWrite(pins::kEpdCs, HIGH);
}

void command(uint8_t reg) {
  digitalWrite(pins::kEpdDc, LOW);
  write_byte(reg);
  digitalWrite(pins::kEpdDc, HIGH);
}

void data(uint8_t value) {
  digitalWrite(pins::kEpdDc, HIGH);
  write_byte(value);
}

void reset() {
  delay(10);
  digitalWrite(pins::kEpdRst, LOW);
  delay(10);
  digitalWrite(pins::kEpdRst, HIGH);
  delay(10);
  wait_while_busy();
}

// Where each controller starts reading and which way it counts. Both walk a row
// at a time down the panel; they differ in which way along the row they go,
// because the two controllers face opposite ways on the glass. These are the
// ESPHome component's values, which are the ones observed to work.
void set_ram_window(uint8_t target) {
  const bool slave = target == kSlave;
  command(0x11 | target);
  data(slave ? 0x03 : 0x02);  // slave counts X up, master counts X down
  command(0x44 | target);
  data(slave ? 0 : kSourceBytes - 1);
  data(slave ? kSourceBytes - 1 : 0);
  command(0x45 | target);
  data(0x00);
  data(0x00);
  data((kGateBits - 1) % 256);
  data((kGateBits - 1) / 256);
  command(0x4e | target);
  data(slave ? 0 : kSourceBytes - 1);
  command(0x4f | target);
  data(0x00);
  data(0x00);
}

void flood(uint8_t target, uint8_t reg, uint8_t value) {
  command(reg | target);
  for (int i = 0; i < kControllerBytes; i++) data(value);
}

// The panel is 792 columns but the two controllers address 800 between them.
// They overlap rather than leaving a hole: byte 49 of every row is the last
// byte the slave draws and the first byte the master draws, and both are given
// it. That is the whole of the seam handling, and it is why a Frame never needs
// to know the seam exists.
constexpr int kOverlapByte = 49;

void send_half(const uint8_t* frame_bytes, uint8_t target) {
  const bool slave = target == kSlave;
  const int first = slave ? 0 : kOverlapByte;
  command(0x24 | target);
  for (int row = 0; row < kGateBits; row++) {
    const uint8_t* line = frame_bytes + size_t(row) * frame::kBytesPerRow;
    for (int i = 0; i < kSourceBytes; i++) {
      // A Frame's set bit is ink; the controllers' set bit is paper.
      data(uint8_t(~line[first + i]));
    }
  }
}

}  // namespace

void init() {
  pinMode(pins::kEpdCs, OUTPUT);
  pinMode(pins::kEpdDc, OUTPUT);
  pinMode(pins::kEpdRst, OUTPUT);
  pinMode(pins::kEpdBusy, INPUT);
  digitalWrite(pins::kEpdCs, HIGH);

  SPI.beginTransaction(spi_settings);
  reset();
  command(0x12);  // SWRESET
  wait_while_busy();

  command(0x18);  // temperature sensor
  data(0x80);     // internal
  command(0x22);
  data(0xB1);  // enable clock, load temperature
  command(0x20);
  wait_while_busy();

  command(0x1A);  // temperature register
  data(0x64);
  data(0x00);
  command(0x22);
  data(0x91);  // load the black/white LUT from OTP
  command(0x20);
  wait_while_busy();

  command(0x3C);  // border waveform
  data(0x03);
  wait_while_busy();

  // Seed both RAM banks on both controllers to black and leave old RAM there
  // for good. Every later refresh then drives each white pixel through a full
  // black-to-white transition, which is what makes it ghost-free. Skipping this
  // leaves old RAM undefined and refreshes land on nothing.
  set_ram_window(kMaster);
  flood(kMaster, 0x24, 0x00);
  set_ram_window(kMaster);
  flood(kMaster, 0x26, 0x00);
  set_ram_window(kSlave);
  flood(kSlave, 0x24, 0x00);
  set_ram_window(kSlave);
  flood(kSlave, 0x26, 0x00);

  command(0x22);
  data(0xF7);
  command(0x20);
  wait_while_busy();
  SPI.endTransaction();
}

void fill(uint8_t master_bw, uint8_t slave_bw) {
  SPI.beginTransaction(spi_settings);
  set_ram_window(kMaster);
  flood(kMaster, 0x24, master_bw);
  set_ram_window(kSlave);
  flood(kSlave, 0x24, slave_bw);
  SPI.endTransaction();
}

void draw(const uint8_t* frame_bytes) {
  SPI.beginTransaction(spi_settings);
  set_ram_window(kSlave);
  send_half(frame_bytes, kSlave);
  set_ram_window(kMaster);
  send_half(frame_bytes, kMaster);
  SPI.endTransaction();
}

void update() {
  SPI.beginTransaction(spi_settings);
  command(0x22);
  // Display mode 2, against the old RAM that init left all-black. This is the
  // value the working ESPHome driver refreshes with; 0xF7 (mode 1) is only used
  // once, to bring the panel to a known state at init.
  data(0xFF);
  command(0x20);
  wait_while_busy();
  SPI.endTransaction();
}

void sleep() {
  SPI.beginTransaction(spi_settings);
  command(0x10);
  data(0x01);
  delay(5);
  SPI.endTransaction();
}

}  // namespace panel_probe
