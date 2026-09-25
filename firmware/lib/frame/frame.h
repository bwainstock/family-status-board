// The Frame's byte layout, on the firmware side of the contract.
//
// This mirrors worker/src/framebuffer.ts deliberately, because the two must
// agree byte for byte:
//
//     row-major, top-left origin, MSB first, 1bpp, a set bit is black
//     100 bytes per row x 480 rows = 48,000 bytes
//
// See docs/adr/0002-hand-rolled-1bit-framebuffer.md. The previous panel was
// driven by two SSD1683 controllers with 400 RAM columns each, of which only
// 396 were wired, so raw controller access needed a 100-byte row with a dead
// 8-pixel gap — a hazard this file's comments used to warn about by name. The
// GDEY075T7 is a single UC8179 with no such gap to guard against. What still
// holds is the reason the warning existed in the first place: a Frame is the
// *logical* image, and whatever a display driver's own RAM addressing needs
// is the driver's problem to own, never this file's.
//
// Nothing in this file may include Arduino.h. The point of the seam is that the
// layout is verifiable on a host with no panel in the room.

#ifndef FRAME_H_
#define FRAME_H_

#include <stddef.h>
#include <stdint.h>

namespace frame {

constexpr int16_t kWidth = 800;
constexpr int16_t kHeight = 480;
constexpr size_t kBytesPerRow = kWidth / 8;             // 100
constexpr size_t kBytes = kBytesPerRow * kHeight;       // 48,000

// The panel's own horizontal and vertical midpoints. On the previous
// two-controller panel these marked the seam where one SSD1683 stopped and
// the other started, which is why the bring-up ladder still exercises them —
// left_half()/top_half() split the panel exactly in two, and the test pattern
// draws a centre line at kCenterX. None of that is a seam check any more: the
// GDEY075T7 is a single UC8179 with nothing to straddle here.
constexpr int16_t kCenterX = kWidth / 2;                // 400
constexpr int16_t kCenterY = kHeight / 2;               // 240

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
