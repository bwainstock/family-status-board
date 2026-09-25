// The Frame's byte layout, on the firmware side of the contract.
//
// This mirrors worker/src/framebuffer.ts deliberately, because the two must
// agree byte for byte:
//
//     row-major, top-left origin, MSB first, 1bpp, a set bit is black
//     99 bytes per row x 272 rows = 26,928 bytes
//
// See docs/adr/0002-hand-rolled-1bit-framebuffer.md. The panel is driven by two
// SSD1683 controllers with 400 RAM columns each, of which only 396 are wired,
// so raw controller access needs a 100-byte row with a dead 8-pixel gap. A
// Frame is the *logical* 792-wide image with no gap; GxEPD2's writeImage()
// owns that quirk. Nothing here may reintroduce it.
//
// Nothing in this file may include Arduino.h. The point of the seam is that the
// layout is verifiable on a host with no panel in the room.

#ifndef FRAME_H_
#define FRAME_H_

#include <stddef.h>
#include <stdint.h>

namespace frame {

constexpr int16_t kWidth = 792;
constexpr int16_t kHeight = 272;
constexpr size_t kBytesPerRow = kWidth / 8;             // 99
constexpr size_t kBytes = kBytesPerRow * kHeight;       // 26,928

// Where the two controllers meet, in logical pixels. Everything either side of
// this column is written by a different SSD1683, which is why the seam is worth
// a test pattern of its own.
constexpr int16_t kSeamX = kWidth / 2;                  // 396

// Where GxEPD2 splits the image vertically between the two controllers' halves.
constexpr int16_t kSeamY = kHeight / 2;                 // 136

// Draws into a caller-owned Frame. Owns no storage: the buffer outlives it.
class Canvas {
 public:
  explicit Canvas(uint8_t* bytes) : bytes_(bytes) {}

  // Paint the whole panel. Defaults to white, which is how a Frame starts.
  void clear(bool black = false);

  bool pixel(int16_t x, int16_t y) const;

  // Out-of-bounds writes are dropped, so callers may draw off the edge freely.
  void set_pixel(int16_t x, int16_t y, bool black);

  void fill_rect(int16_t x, int16_t y, int16_t w, int16_t h, bool black = true);

  // Outline only, drawn inside the given bounds.
  void stroke_rect(int16_t x, int16_t y, int16_t w, int16_t h, int16_t weight = 1,
                   bool black = true);

  // Bresenham, one pixel wide. A long shallow diagonal is the cheapest visible
  // proof that bit order within a byte is right: reverse it and a smooth ramp
  // becomes an 8-pixel sawtooth.
  void line(int16_t x0, int16_t y0, int16_t x1, int16_t y1, bool black = true);

  const uint8_t* bytes() const { return bytes_; }

 private:
  uint8_t* bytes_;
};

// How many pixels of the Frame are black. Used by the tests to assert that the
// Board's normal state is ink on white rather than the other way round.
size_t ink_count(const uint8_t* bytes);

}  // namespace frame

#endif  // FRAME_H_
