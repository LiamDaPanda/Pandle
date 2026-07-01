// Dependency-free PNG icon generator. Draws the Pandle panda and encodes PNGs
// with Node's built-in zlib. Supersampled 3x then box-downsampled for smooth
// edges. Run: node scripts/gen-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(OUT, { recursive: true });

const SS = 3; // supersample factor

function hex(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

function makeCanvas(n) {
  return { n, data: new Uint8Array(n * n * 4) };
}

function set(c, x, y, [r, g, b], a = 1) {
  if (x < 0 || y < 0 || x >= c.n || y >= c.n) return;
  const i = (y * c.n + x) * 4;
  const ia = 1 - a;
  c.data[i] = r * a + c.data[i] * ia;
  c.data[i + 1] = g * a + c.data[i + 1] * ia;
  c.data[i + 2] = b * a + c.data[i + 2] * ia;
  c.data[i + 3] = Math.min(255, a * 255 + c.data[i + 3] * ia);
}

function ellipse(c, cx, cy, rx, ry, color, a = 1) {
  for (let y = Math.floor(cy - ry); y <= cy + ry; y++) {
    for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) set(c, x, y, color, a);
    }
  }
}

function roundedRect(c, color) {
  const n = c.n;
  const r = (112 / 512) * n;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let inside = true;
      const corners = [
        [r, r], [n - r, r], [r, n - r], [n - r, n - r],
      ];
      // Only clip the four corners.
      if (x < r && y < r) inside = (x - r) ** 2 + (y - r) ** 2 <= r * r;
      else if (x > n - r && y < r) inside = (x - (n - r)) ** 2 + (y - r) ** 2 <= r * r;
      else if (x < r && y > n - r) inside = (x - r) ** 2 + (y - (n - r)) ** 2 <= r * r;
      else if (x > n - r && y > n - r) inside = (x - (n - r)) ** 2 + (y - (n - r)) ** 2 <= r * r;
      void corners;
      if (inside) set(c, x, y, color, 1);
    }
  }
}

function drawPanda(c) {
  const s = c.n / 512;
  const black = hex('#2b2b2b');
  const white = hex('#ffffff');
  const pink = hex('#ffb7c5');
  roundedRect(c, hex('#7bc47f'));
  ellipse(c, 150 * s, 150 * s, 66 * s, 66 * s, black);
  ellipse(c, 362 * s, 150 * s, 66 * s, 66 * s, black);
  ellipse(c, 256 * s, 286 * s, 168 * s, 168 * s, white);
  ellipse(c, 196 * s, 272 * s, 46 * s, 58 * s, black);
  ellipse(c, 316 * s, 272 * s, 46 * s, 58 * s, black);
  ellipse(c, 196 * s, 280 * s, 16 * s, 16 * s, white);
  ellipse(c, 316 * s, 280 * s, 16 * s, 16 * s, white);
  ellipse(c, 256 * s, 356 * s, 26 * s, 18 * s, black);
  ellipse(c, 150 * s, 352 * s, 22 * s, 22 * s, pink, 0.8);
  ellipse(c, 362 * s, 352 * s, 22 * s, 22 * s, pink, 0.8);
}

function downsample(src, factor) {
  const n = src.n / factor;
  const out = makeCanvas(n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let dy = 0; dy < factor; dy++) {
        for (let dx = 0; dx < factor; dx++) {
          const i = ((y * factor + dy) * src.n + (x * factor + dx)) * 4;
          r += src.data[i]; g += src.data[i + 1]; b += src.data[i + 2]; a += src.data[i + 3];
        }
      }
      const k = factor * factor;
      const o = (y * n + x) * 4;
      out.data[o] = r / k; out.data[o + 1] = g / k; out.data[o + 2] = b / k; out.data[o + 3] = a / k;
    }
  }
  return out;
}

// --- minimal PNG encoder ---
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return (buf) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
})();

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(CRC(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePNG(c) {
  const n = c.n;
  const raw = Buffer.alloc((n * 4 + 1) * n);
  for (let y = 0; y < n; y++) {
    raw[y * (n * 4 + 1)] = 0;
    for (let x = 0; x < n * 4; x++) raw[y * (n * 4 + 1) + 1 + x] = c.data[y * n * 4 + x];
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(n, 0);
  ihdr.writeUInt32BE(n, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function render(size) {
  const big = makeCanvas(size * SS);
  drawPanda(big);
  return downsample(big, SS);
}

for (const [size, name] of [
  [192, 'pwa-192.png'],
  [512, 'pwa-512.png'],
  [180, 'apple-touch-icon.png'],
]) {
  writeFileSync(join(OUT, name), encodePNG(render(size)));
  console.log('wrote', name, `(${size}x${size})`);
}
