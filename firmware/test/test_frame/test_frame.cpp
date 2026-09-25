// Host tests for the Frame layout and the bring-up spike's two Frames.
//
// These exist because the expensive mistakes here are silent. A polarity or
// bit-order error produces a garbled panel and no error anywhere, and the
// feedback loop for "flash it and look" is minutes. Everything that can be
// settled without hardware is settled here; the panel then only has to answer
// the one question a host cannot, which is what the glass actually does.
//
//     pio test -e native

#include <unity.h>

#include <string.h>

#include "bringup.h"
#include "frame.h"

using frame::Canvas;
using frame::kBytes;
using frame::kBytesPerRow;
using frame::kHeight;
using frame::kSeamX;
using frame::kWidth;

static uint8_t buffer[kBytes];

void setUp(void) { memset(buffer, 0, sizeof(buffer)); }
void tearDown(void) {}

// --- the layout contract with the Worker -----------------------------------

static void test_frame_is_the_size_the_worker_sends(void) {
  TEST_ASSERT_EQUAL_UINT16(792, kWidth);
  TEST_ASSERT_EQUAL_UINT16(272, kHeight);
  TEST_ASSERT_EQUAL_size_t(99, kBytesPerRow);
  TEST_ASSERT_EQUAL_size_t(26928, kBytes);
}

static void test_a_set_bit_is_black_and_bits_run_msb_first(void) {
  Canvas canvas(buffer);
  canvas.set_pixel(0, 0, true);
  TEST_ASSERT_EQUAL_HEX8(0x80, buffer[0]);

  canvas.set_pixel(7, 0, true);
  TEST_ASSERT_EQUAL_HEX8(0x81, buffer[0]);

  canvas.set_pixel(8, 0, true);
  TEST_ASSERT_EQUAL_HEX8(0x80, buffer[1]);
}

static void test_rows_are_99_bytes_apart(void) {
  Canvas canvas(buffer);
  canvas.set_pixel(0, 1, true);
  TEST_ASSERT_EQUAL_HEX8(0x00, buffer[98]);
  TEST_ASSERT_EQUAL_HEX8(0x80, buffer[99]);
}

static void test_the_last_pixel_is_the_last_bit(void) {
  Canvas canvas(buffer);
  canvas.set_pixel(kWidth - 1, kHeight - 1, true);
  TEST_ASSERT_EQUAL_HEX8(0x01, buffer[kBytes - 1]);
}

static void test_clear_paints_the_whole_panel(void) {
  Canvas canvas(buffer);
  canvas.clear(true);
  TEST_ASSERT_EQUAL_size_t(size_t(kWidth) * size_t(kHeight), frame::ink_count(buffer));
  canvas.clear(false);
  TEST_ASSERT_EQUAL_size_t(0, frame::ink_count(buffer));
}

static void test_drawing_off_the_edge_is_dropped_not_wrapped(void) {
  Canvas canvas(buffer);
  canvas.set_pixel(-1, 0, true);
  canvas.set_pixel(kWidth, 0, true);
  canvas.set_pixel(0, -1, true);
  canvas.set_pixel(0, kHeight, true);
  TEST_ASSERT_EQUAL_size_t(0, frame::ink_count(buffer));
}

static void test_fill_rect_clips_to_the_panel(void) {
  Canvas canvas(buffer);
  canvas.fill_rect(-10, -10, 20, 20);
  TEST_ASSERT_TRUE(canvas.pixel(0, 0));
  TEST_ASSERT_TRUE(canvas.pixel(9, 9));
  TEST_ASSERT_FALSE(canvas.pixel(10, 9));
  TEST_ASSERT_EQUAL_size_t(100, frame::ink_count(buffer));
}

static void test_stroke_rect_is_hollow(void) {
  Canvas canvas(buffer);
  canvas.stroke_rect(10, 10, 20, 20, 2);
  TEST_ASSERT_TRUE(canvas.pixel(10, 10));
  TEST_ASSERT_TRUE(canvas.pixel(11, 11));
  TEST_ASSERT_FALSE(canvas.pixel(12, 12));
  TEST_ASSERT_TRUE(canvas.pixel(29, 29));
  TEST_ASSERT_FALSE(canvas.pixel(27, 27));
}

static void test_a_pixel_can_be_cleared_again(void) {
  Canvas canvas(buffer);
  canvas.fill_rect(0, 0, 16, 1);
  canvas.set_pixel(3, 0, false);
  TEST_ASSERT_EQUAL_HEX8(0xEF, buffer[0]);
  TEST_ASSERT_EQUAL_HEX8(0xFF, buffer[1]);
}

// --- the test pattern -------------------------------------------------------

static size_t ink_in(const Canvas& canvas, int16_t x, int16_t y, int16_t w, int16_t h) {
  size_t n = 0;
  for (int16_t py = y; py < y + h; py++) {
    for (int16_t px = x; px < x + w; px++) {
      if (canvas.pixel(px, py)) n++;
    }
  }
  return n;
}

static void test_the_pattern_is_mostly_white(void) {
  // The single loudest signal that polarity is wrong is a black panel. That
  // only works if the correct rendering is nowhere near half ink.
  bringup::test_pattern(buffer);
  const size_t total = size_t(kWidth) * size_t(kHeight);
  const size_t ink = frame::ink_count(buffer);
  TEST_ASSERT_TRUE(ink > 0);
  TEST_ASSERT_TRUE(ink < total / 4);
}

static void test_the_pattern_reaches_every_edge(void) {
  // If the driver drops the last column or row, the border loses a side.
  Canvas canvas(buffer);
  bringup::test_pattern(buffer);
  TEST_ASSERT_TRUE(canvas.pixel(0, 0));
  TEST_ASSERT_TRUE(canvas.pixel(kWidth - 1, 0));
  TEST_ASSERT_TRUE(canvas.pixel(0, kHeight - 1));
  TEST_ASSERT_TRUE(canvas.pixel(kWidth - 1, kHeight - 1));
  TEST_ASSERT_TRUE(canvas.pixel(kWidth / 2, 0));
  TEST_ASSERT_TRUE(canvas.pixel(kWidth / 2, kHeight - 1));
}

static void test_the_corners_are_told_apart_by_pip_count(void) {
  // Distinct counts in all four corners is what makes rotation and mirroring
  // readable rather than a matter of opinion.
  Canvas canvas(buffer);
  bringup::test_pattern(buffer);
  const int16_t box = 120;
  const int16_t band = 30;
  const size_t top_left = ink_in(canvas, 8, 8, box, band);
  const size_t top_right = ink_in(canvas, kWidth - 8 - box, 8, box, band);
  const size_t bottom_left = ink_in(canvas, 8, kHeight - 38, box, band);
  const size_t bottom_right = ink_in(canvas, kWidth - 8 - box, kHeight - 38, box, band);

  const size_t pip = size_t(bringup::layout::kPipSize) * bringup::layout::kPipSize;
  TEST_ASSERT_EQUAL_size_t(1 * pip, top_left);
  TEST_ASSERT_EQUAL_size_t(2 * pip, top_right);
  TEST_ASSERT_EQUAL_size_t(3 * pip, bottom_left);
  TEST_ASSERT_EQUAL_size_t(4 * pip, bottom_right);
}

static void test_polarity_marks_are_one_solid_and_one_hollow(void) {
  Canvas canvas(buffer);
  bringup::test_pattern(buffer);
  const int16_t size = bringup::layout::kPolaritySize;

  const size_t solid = ink_in(canvas, bringup::layout::kPolarityX,
                              bringup::layout::kPolarityY, size, size);
  TEST_ASSERT_EQUAL_size_t(size_t(size) * size, solid);

  const size_t ring = ink_in(canvas, bringup::layout::kRingX, bringup::layout::kPolarityY,
                             size, size);
  TEST_ASSERT_TRUE(ring > 0);
  TEST_ASSERT_TRUE(ring < solid);
  // Hollow: the middle of the ring is white.
  TEST_ASSERT_FALSE(canvas.pixel(bringup::layout::kRingX + size / 2,
                                 bringup::layout::kPolarityY + size / 2));
}

static void test_the_nibble_step_lands_on_a_byte_boundary(void) {
  // The upper bar fills whole bytes; the lower one clears each byte's high
  // nibble. Read the raw bytes, because the whole point is the bit order.
  bringup::test_pattern(buffer);
  const int16_t x = bringup::layout::kNibbleX;
  TEST_ASSERT_EQUAL_INT16(0, x % 8);

  const size_t byte_index = size_t(x) / 8;
  const size_t upper = size_t(bringup::layout::kByteBarY + 4) * kBytesPerRow + byte_index;
  const size_t lower = size_t(bringup::layout::kNibbleBarY + 4) * kBytesPerRow + byte_index;
  TEST_ASSERT_EQUAL_HEX8(0xFF, buffer[upper]);
  TEST_ASSERT_EQUAL_HEX8(0x0F, buffer[lower]);
}

static void test_the_ramp_is_smooth_not_stepped(void) {
  // One pixel of rise at a time, nowhere near an 8-pixel tooth. A reversed bit
  // order turns this into a sawtooth on the glass.
  Canvas canvas(buffer);
  bringup::test_pattern(buffer);
  int16_t previous = -1;
  for (int16_t x = bringup::layout::kRampX0; x <= bringup::layout::kRampX1; x++) {
    int16_t found = -1;
    for (int16_t y = bringup::layout::kRampY0 - 4; y <= bringup::layout::kRampY1 + 4; y++) {
      if (canvas.pixel(x, y)) {
        found = y;
        break;
      }
    }
    TEST_ASSERT_TRUE(found >= 0);
    if (previous >= 0) {
      const int16_t step = found - previous;
      TEST_ASSERT_TRUE(step >= 0 && step <= 1);
    }
    previous = found;
  }
}

static void test_the_rule_crosses_the_seam_unbroken(void) {
  Canvas canvas(buffer);
  bringup::test_pattern(buffer);
  const int16_t y = bringup::layout::kRuleY + 1;
  for (int16_t x = 0; x < kWidth; x++) {
    TEST_ASSERT_TRUE(canvas.pixel(x, y));
  }
}

static void test_the_seam_block_is_solid_across_both_controllers(void) {
  Canvas canvas(buffer);
  bringup::test_pattern(buffer);
  const int16_t half = bringup::layout::kSeamBlockHalfWidth;
  const size_t ink = ink_in(canvas, kSeamX - half, bringup::layout::kSeamBlockY, half * 2,
                            bringup::layout::kSeamBlockH);
  TEST_ASSERT_EQUAL_size_t(size_t(half) * 2 * bringup::layout::kSeamBlockH, ink);
}

static void test_the_grating_puts_a_line_on_the_seam(void) {
  Canvas canvas(buffer);
  bringup::test_pattern(buffer);
  const int16_t y = bringup::layout::kGratingY + 1;
  TEST_ASSERT_TRUE(canvas.pixel(kSeamX, y));
  TEST_ASSERT_FALSE(canvas.pixel(kSeamX - 1, y));
  TEST_ASSERT_TRUE(canvas.pixel(kSeamX - 2, y));
  TEST_ASSERT_FALSE(canvas.pixel(kSeamX + 1, y));
  TEST_ASSERT_TRUE(canvas.pixel(kSeamX + 2, y));
}

// --- the ladder -------------------------------------------------------------

static void test_left_half_splits_exactly_on_the_seam(void) {
  // The seam is where one controller stops and the other starts. If a Frame's
  // x axis is mapped correctly this edge lands on it and nowhere else.
  Canvas canvas(buffer);
  bringup::left_half(buffer);
  TEST_ASSERT_EQUAL_size_t(size_t(kWidth) * kHeight / 2, frame::ink_count(buffer));
  TEST_ASSERT_TRUE(canvas.pixel(0, 0));
  TEST_ASSERT_TRUE(canvas.pixel(kSeamX - 1, kHeight - 1));
  TEST_ASSERT_FALSE(canvas.pixel(kSeamX, 0));
  TEST_ASSERT_FALSE(canvas.pixel(kWidth - 1, kHeight - 1));
}

static void test_top_half_splits_on_the_controllers_row_boundary(void) {
  Canvas canvas(buffer);
  bringup::top_half(buffer);
  TEST_ASSERT_EQUAL_size_t(size_t(kWidth) * kHeight / 2, frame::ink_count(buffer));
  TEST_ASSERT_TRUE(canvas.pixel(0, 0));
  TEST_ASSERT_TRUE(canvas.pixel(kWidth - 1, frame::kSeamY - 1));
  TEST_ASSERT_FALSE(canvas.pixel(0, frame::kSeamY));
  TEST_ASSERT_FALSE(canvas.pixel(kWidth - 1, kHeight - 1));
}

static void test_corner_blocks_count_one_two_three_four(void) {
  Canvas canvas(buffer);
  bringup::corner_blocks(buffer);
  const int16_t box = 320;
  const int16_t band = bringup::layout::kBlockSize;
  const int16_t inset = bringup::layout::kBlockInset;
  const size_t block = size_t(band) * band;

  TEST_ASSERT_EQUAL_size_t(1 * block, ink_in(canvas, 0, inset, box, band));
  TEST_ASSERT_EQUAL_size_t(2 * block, ink_in(canvas, kWidth - box, inset, box, band));
  TEST_ASSERT_EQUAL_size_t(3 * block,
                           ink_in(canvas, 0, kHeight - inset - band, box, band));
  TEST_ASSERT_EQUAL_size_t(
      4 * block, ink_in(canvas, kWidth - box, kHeight - inset - band, box, band));
}

// --- the ghost bait ---------------------------------------------------------

static void test_the_bait_is_about_half_ink(void) {
  bringup::ghost_bait(buffer);
  const size_t total = size_t(kWidth) * size_t(kHeight);
  TEST_ASSERT_EQUAL_size_t(total / 2, frame::ink_count(buffer));
}

static void test_every_inked_bait_block_lands_where_the_pattern_is_white(void) {
  // This is the property that makes the ghosting check mean anything: residue
  // from pass one has to fall somewhere pass two leaves blank, or it hides.
  static uint8_t pattern[kBytes];
  memset(pattern, 0, sizeof(pattern));
  bringup::test_pattern(pattern);
  bringup::ghost_bait(buffer);

  Canvas bait(buffer);
  Canvas pass_two(pattern);
  int inked_blocks = 0;

  for (int16_t row = 0; row < bringup::layout::kBaitRows; row++) {
    for (int16_t col = 0; col < bringup::layout::kBaitCols; col++) {
      const int16_t x = col * bringup::layout::kBaitW;
      const int16_t y = row * bringup::layout::kBaitH;
      if (!bait.pixel(x + 1, y + 1)) continue;
      inked_blocks++;

      const size_t cell = size_t(bringup::layout::kBaitW) * bringup::layout::kBaitH;
      const size_t ink =
          ink_in(pass_two, x, y, bringup::layout::kBaitW, bringup::layout::kBaitH);
      TEST_ASSERT_TRUE(ink < cell / 2);
    }
  }

  TEST_ASSERT_EQUAL_INT(bringup::layout::kBaitRows * bringup::layout::kBaitCols / 2,
                        inked_blocks);
}

int main(int, char**) {
  UNITY_BEGIN();

  RUN_TEST(test_frame_is_the_size_the_worker_sends);
  RUN_TEST(test_a_set_bit_is_black_and_bits_run_msb_first);
  RUN_TEST(test_rows_are_99_bytes_apart);
  RUN_TEST(test_the_last_pixel_is_the_last_bit);
  RUN_TEST(test_clear_paints_the_whole_panel);
  RUN_TEST(test_drawing_off_the_edge_is_dropped_not_wrapped);
  RUN_TEST(test_fill_rect_clips_to_the_panel);
  RUN_TEST(test_stroke_rect_is_hollow);
  RUN_TEST(test_a_pixel_can_be_cleared_again);

  RUN_TEST(test_the_pattern_is_mostly_white);
  RUN_TEST(test_the_pattern_reaches_every_edge);
  RUN_TEST(test_the_corners_are_told_apart_by_pip_count);
  RUN_TEST(test_polarity_marks_are_one_solid_and_one_hollow);
  RUN_TEST(test_the_nibble_step_lands_on_a_byte_boundary);
  RUN_TEST(test_the_ramp_is_smooth_not_stepped);
  RUN_TEST(test_the_rule_crosses_the_seam_unbroken);
  RUN_TEST(test_the_seam_block_is_solid_across_both_controllers);
  RUN_TEST(test_the_grating_puts_a_line_on_the_seam);

  RUN_TEST(test_left_half_splits_exactly_on_the_seam);
  RUN_TEST(test_top_half_splits_on_the_controllers_row_boundary);
  RUN_TEST(test_corner_blocks_count_one_two_three_four);

  RUN_TEST(test_the_bait_is_about_half_ink);
  RUN_TEST(test_every_inked_bait_block_lands_where_the_pattern_is_white);

  return UNITY_END();
}
