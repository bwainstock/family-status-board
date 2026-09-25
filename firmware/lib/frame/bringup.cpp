#include "bringup.h"

#include "frame.h"

namespace bringup {
namespace {

using frame::Canvas;
using frame::kCenterX;
using frame::kHeight;
using frame::kWidth;

namespace lo = layout;

// A row of `count` pips, laid out left to right from `x`.
void pips_from(Canvas& canvas, int16_t x, int16_t y, int count) {
  for (int i = 0; i < count; i++) {
    canvas.fill_rect(int16_t(x + i * (lo::kPipSize + lo::kPipGap)), y, lo::kPipSize,
                     lo::kPipSize);
  }
}

// A row of `count` pips, laid out right to left so the last one ends at `right`.
void pips_to(Canvas& canvas, int16_t right, int16_t y, int count) {
  const int16_t stride = int16_t(lo::kPipSize + lo::kPipGap);
  const int16_t x = int16_t(right - lo::kPipSize - (count - 1) * stride);
  pips_from(canvas, x, y, count);
}

}  // namespace

void left_half(uint8_t* bytes) {
  Canvas canvas(bytes);
  canvas.clear(false);
  canvas.fill_rect(0, 0, kCenterX, kHeight);
}

void top_half(uint8_t* bytes) {
  Canvas canvas(bytes);
  canvas.clear(false);
  canvas.fill_rect(0, 0, kWidth, frame::kCenterY);
}

void corner_blocks(uint8_t* bytes) {
  Canvas canvas(bytes);
  canvas.clear(false);

  const int16_t stride = int16_t(lo::kBlockSize + lo::kBlockGap);
  const int16_t top = lo::kBlockInset;
  const int16_t bottom = int16_t(kHeight - lo::kBlockInset - lo::kBlockSize);

  for (int i = 0; i < 1; i++) {
    canvas.fill_rect(int16_t(lo::kBlockInset + i * stride), top, lo::kBlockSize,
                     lo::kBlockSize);
  }
  for (int i = 0; i < 2; i++) {
    canvas.fill_rect(int16_t(kWidth - lo::kBlockInset - lo::kBlockSize - i * stride), top,
                     lo::kBlockSize, lo::kBlockSize);
  }
  for (int i = 0; i < 3; i++) {
    canvas.fill_rect(int16_t(lo::kBlockInset + i * stride), bottom, lo::kBlockSize,
                     lo::kBlockSize);
  }
  for (int i = 0; i < 4; i++) {
    canvas.fill_rect(int16_t(kWidth - lo::kBlockInset - lo::kBlockSize - i * stride),
                     bottom, lo::kBlockSize, lo::kBlockSize);
  }
}

void ghost_bait(uint8_t* bytes) {
  Canvas canvas(bytes);
  canvas.clear(false);
  for (int16_t row = 0; row < lo::kBaitRows; row++) {
    for (int16_t col = 0; col < lo::kBaitCols; col++) {
      if ((row + col) % 2 != 0) continue;
      canvas.fill_rect(int16_t(col * lo::kBaitW), int16_t(row * lo::kBaitH), lo::kBaitW,
                       lo::kBaitH);
    }
  }
}

void test_pattern(uint8_t* bytes) {
  Canvas canvas(bytes);
  canvas.clear(false);

  // The full extent of the panel, so a dropped edge column or row shows up as a
  // missing side rather than as nothing at all.
  canvas.stroke_rect(0, 0, kWidth, kHeight, lo::kBorderWeight);

  // 1-2-3-4 clockwise from the top left: proof of orientation and mirroring.
  // On the previous two-controller panel this also proved that all four
  // combinations of controller half were written; the GDEY075T7 has only the
  // one controller, so orientation is the whole of what this checks now.
  const int16_t top = lo::kPipInset;
  const int16_t bottom = int16_t(kHeight - lo::kPipInset - lo::kPipSize);
  const int16_t right = int16_t(kWidth - lo::kPipInset);
  pips_from(canvas, lo::kPipInset, top, 1);
  pips_to(canvas, right, top, 2);
  pips_from(canvas, lo::kPipInset, bottom, 3);
  pips_to(canvas, right, bottom, 4);

  // Solid beside hollow, on white.
  canvas.fill_rect(lo::kPolarityX, lo::kPolarityY, lo::kPolaritySize, lo::kPolaritySize);
  canvas.stroke_rect(lo::kRingX, lo::kPolarityY, lo::kPolaritySize, lo::kPolaritySize,
                     lo::kRingWeight);

  // Whole bytes above, high nibbles cleared below: the lower bar's left edge
  // steps right by four pixels and its right edge stays flush.
  canvas.fill_rect(lo::kNibbleX, lo::kByteBarY, lo::kNibbleW, lo::kByteBarH);
  canvas.fill_rect(int16_t(lo::kNibbleX + lo::kNibbleInset), lo::kNibbleBarY,
                   int16_t(lo::kNibbleW - lo::kNibbleInset), lo::kNibbleBarH);

  for (int16_t i = 0; i < lo::kRampWeight; i++) {
    canvas.line(lo::kRampX0, int16_t(lo::kRampY0 + i), lo::kRampX1,
                int16_t(lo::kRampY1 + i));
  }

  canvas.fill_rect(0, lo::kRuleY, kWidth, lo::kRuleH);

  // Alternating single columns, centred on the panel. One lands exactly on
  // kCenterX; the rest step away from it two pixels at a time.
  for (int16_t x = int16_t(kCenterX - lo::kGratingHalfWidth);
       x < int16_t(kCenterX + lo::kGratingHalfWidth); x++) {
    if (((x - kCenterX) & 1) != 0) continue;
    canvas.fill_rect(x, lo::kGratingY, 1, lo::kGratingH);
  }

  // A one-pixel line at the panel's centre, below the grating. On the previous
  // two-controller panel this spot also carried a wedge and a solid block,
  // both there to prove the dead-column gap between the controllers had not
  // leaked into the buffer. The GDEY075T7 is a single UC8179 with nothing to
  // straddle, so those two marks are gone; this line survives only as a
  // centring reference, to be checked against the middle of the panel by eye.
  // (The committed docs/hardware/bringup-pattern.png predates this rung and is
  // 792x272 with the old wedge/grating/seam-block marks — re-render it with
  // render_pattern before trusting it as a reference for this pattern.)
  canvas.fill_rect(kCenterX, lo::kCenterLineY, 1, lo::kCenterLineH);
}

}  // namespace bringup
