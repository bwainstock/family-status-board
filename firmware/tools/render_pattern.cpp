// Renders the bring-up Frames to PNG, so that "appears correctly" is a
// comparison rather than a memory.
//
//   c++ -std=c++17 -Ilib/frame -o /tmp/render_pattern \
//       tools/render_pattern.cpp lib/frame/frame.cpp lib/frame/bringup.cpp
//   /tmp/render_pattern pattern ../docs/hardware/bringup-pattern.png
//   /tmp/render_pattern bait    ../docs/hardware/bringup-ghost-bait.png
//
// It links the same bringup.cpp the firmware does, which is the only reason the
// output is worth trusting: a reference image drawn by a second implementation
// would just be a second thing that can be wrong.
//
// The PNG is written by hand — 1 bit per pixel, greyscale, one stored deflate
// block — because pulling in a dependency to emit 47 KB of uncompressed bytes
// would cost more than it saves. Note the inversion on the way out: in PNG
// greyscale 0 is black, and in a Frame a set bit is black (ADR 0002).

#include <cstdint>
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>

#include "bringup.h"
#include "frame.h"

namespace {

uint32_t crc32_of(const uint8_t* data, size_t length) {
  static uint32_t table[256];
  static bool built = false;
  if (!built) {
    for (uint32_t i = 0; i < 256; i++) {
      uint32_t c = i;
      for (int k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320u ^ (c >> 1)) : (c >> 1);
      table[i] = c;
    }
    built = true;
  }
  uint32_t c = 0xFFFFFFFFu;
  for (size_t i = 0; i < length; i++) c = table[(c ^ data[i]) & 0xFF] ^ (c >> 8);
  return c ^ 0xFFFFFFFFu;
}

void push_be32(std::vector<uint8_t>& out, uint32_t value) {
  out.push_back(uint8_t(value >> 24));
  out.push_back(uint8_t(value >> 16));
  out.push_back(uint8_t(value >> 8));
  out.push_back(uint8_t(value));
}

void push_chunk(std::vector<uint8_t>& out, const char* type,
                const std::vector<uint8_t>& payload) {
  push_be32(out, uint32_t(payload.size()));
  std::vector<uint8_t> body(type, type + 4);
  body.insert(body.end(), payload.begin(), payload.end());
  out.insert(out.end(), body.begin(), body.end());
  push_be32(out, crc32_of(body.data(), body.size()));
}

// Deflate with stored blocks only: no compression, no dependency.
std::vector<uint8_t> zlib_stored(const std::vector<uint8_t>& raw) {
  std::vector<uint8_t> out{0x78, 0x01};
  size_t offset = 0;
  while (offset < raw.size()) {
    const size_t chunk = std::min<size_t>(65535, raw.size() - offset);
    const bool last = offset + chunk >= raw.size();
    out.push_back(last ? 1 : 0);
    out.push_back(uint8_t(chunk));
    out.push_back(uint8_t(chunk >> 8));
    out.push_back(uint8_t(~chunk));
    out.push_back(uint8_t(~chunk >> 8));
    out.insert(out.end(), raw.begin() + offset, raw.begin() + offset + chunk);
    offset += chunk;
  }
  uint32_t a = 1, b = 0;
  for (uint8_t byte : raw) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  push_be32(out, (b << 16) | a);
  return out;
}

bool write_png(const char* path, const uint8_t* frame_bytes) {
  std::vector<uint8_t> raw;
  raw.reserve(size_t(frame::kHeight) * (frame::kBytesPerRow + 1));
  for (int16_t y = 0; y < frame::kHeight; y++) {
    raw.push_back(0);  // filter: none
    for (size_t x = 0; x < frame::kBytesPerRow; x++) {
      raw.push_back(uint8_t(~frame_bytes[size_t(y) * frame::kBytesPerRow + x]));
    }
  }

  std::vector<uint8_t> png{137, 80, 78, 71, 13, 10, 26, 10};

  std::vector<uint8_t> ihdr;
  push_be32(ihdr, uint32_t(frame::kWidth));
  push_be32(ihdr, uint32_t(frame::kHeight));
  ihdr.insert(ihdr.end(), {1, 0, 0, 0, 0});  // 1 bpp greyscale, no interlace
  push_chunk(png, "IHDR", ihdr);
  push_chunk(png, "IDAT", zlib_stored(raw));
  push_chunk(png, "IEND", {});

  FILE* file = std::fopen(path, "wb");
  if (!file) return false;
  const bool ok = std::fwrite(png.data(), 1, png.size(), file) == png.size();
  std::fclose(file);
  return ok;
}

}  // namespace

int main(int argc, char** argv) {
  if (argc != 3) {
    std::fprintf(stderr, "usage: render_pattern <pattern|bait> <out.png>\n");
    return 2;
  }

  static uint8_t buffer[frame::kBytes];
  const std::string which = argv[1];
  if (which == "pattern") {
    bringup::test_pattern(buffer);
  } else if (which == "bait") {
    bringup::ghost_bait(buffer);
  } else {
    std::fprintf(stderr, "unknown Frame: %s\n", argv[1]);
    return 2;
  }

  if (!write_png(argv[2], buffer)) {
    std::fprintf(stderr, "could not write %s\n", argv[2]);
    return 1;
  }
  std::printf("wrote %s (%u x %u, %u ink pixels)\n", argv[2], unsigned(frame::kWidth),
              unsigned(frame::kHeight), unsigned(frame::ink_count(buffer)));
  return 0;
}
