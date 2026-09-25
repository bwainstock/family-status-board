#include "frame.h"

namespace frame {
namespace {

bool in_bounds(int16_t x, int16_t y) {
  return x >= 0 && x < kWidth && y >= 0 && y < kHeight;
}

int16_t absolute(int16_t v) { return v < 0 ? int16_t(-v) : v; }

}  // namespace

void Canvas::clear(bool black) {
  const uint8_t value = black ? 0xFF : 0x00;
  for (size_t i = 0; i < kBytes; i++) bytes_[i] = value;
}

bool Canvas::pixel(int16_t x, int16_t y) const {
  if (!in_bounds(x, y)) return false;
  const uint8_t byte = bytes_[size_t(y) * kBytesPerRow + size_t(x >> 3)];
  return (byte & (0x80 >> (x & 7))) != 0;
}

void Canvas::set_pixel(int16_t x, int16_t y, bool black) {
  if (!in_bounds(x, y)) return;
  const size_t index = size_t(y) * kBytesPerRow + size_t(x >> 3);
  const uint8_t mask = uint8_t(0x80 >> (x & 7));
  if (black) {
    bytes_[index] |= mask;
  } else {
    bytes_[index] &= uint8_t(~mask);
  }
}

void Canvas::fill_rect(int16_t x, int16_t y, int16_t w, int16_t h, bool black) {
  if (w <= 0 || h <= 0) return;
  const int16_t x1 = int16_t(x + w < kWidth ? x + w : kWidth);
  const int16_t y1 = int16_t(y + h < kHeight ? y + h : kHeight);
  for (int16_t py = int16_t(y > 0 ? y : 0); py < y1; py++) {
    for (int16_t px = int16_t(x > 0 ? x : 0); px < x1; px++) {
      set_pixel(px, py, black);
    }
  }
}

void Canvas::stroke_rect(int16_t x, int16_t y, int16_t w, int16_t h, int16_t weight,
                         bool black) {
  if (w <= 0 || h <= 0 || weight <= 0) return;
  fill_rect(x, y, w, weight, black);
  fill_rect(x, int16_t(y + h - weight), w, weight, black);
  fill_rect(x, y, weight, h, black);
  fill_rect(int16_t(x + w - weight), y, weight, h, black);
}

void Canvas::line(int16_t x0, int16_t y0, int16_t x1, int16_t y1, bool black) {
  const int16_t dx = absolute(int16_t(x1 - x0));
  const int16_t dy = int16_t(-absolute(int16_t(y1 - y0)));
  const int16_t sx = x0 < x1 ? 1 : -1;
  const int16_t sy = y0 < y1 ? 1 : -1;
  int32_t error = int32_t(dx) + int32_t(dy);

  for (;;) {
    set_pixel(x0, y0, black);
    if (x0 == x1 && y0 == y1) break;
    const int32_t doubled = error * 2;
    if (doubled >= int32_t(dy)) {
      if (x0 == x1) break;
      error += dy;
      x0 = int16_t(x0 + sx);
    }
    if (doubled <= int32_t(dx)) {
      if (y0 == y1) break;
      error += dx;
      y0 = int16_t(y0 + sy);
    }
  }
}

size_t ink_count(const uint8_t* bytes) {
  size_t n = 0;
  for (size_t i = 0; i < kBytes; i++) {
    uint8_t byte = bytes[i];
    while (byte) {
      n += byte & 1;
      byte = uint8_t(byte >> 1);
    }
  }
  return n;
}

}  // namespace frame
