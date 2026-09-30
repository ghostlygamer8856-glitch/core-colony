// pixel.js - tiny toolkit for drawing pixel-art sprites in code.
// Sprites are drawn 1 logical pixel at a time onto small offscreen canvases,
// given an automatic dark outline, then cached. The renderer scales them up
// with image smoothing OFF so they stay crisp.

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** Pen: pixel-grid drawing helpers around a 2D context. */
export class Pen {
  constructor(g) {
    this.g = g;
  }

  rect(x, y, w, h, c) {
    this.g.fillStyle = c;
    this.g.fillRect(x, y, w, h);
  }

  px(x, y, c) {
    this.rect(x, y, 1, 1, c);
  }

  /** Rectangle with the four corner pixels cut off (reads as "rounded" at low res). */
  rrect(x, y, w, h, c) {
    this.rect(x + 1, y, w - 2, h, c);
    this.rect(x, y + 1, w, h - 2, c);
  }

  ellipse(cx, cy, rx, ry, c) {
    for (let y = -ry; y <= ry; y++) {
      const t = 1 - (y * y) / ((ry + 0.5) * (ry + 0.5));
      const hw = Math.round(rx * Math.sqrt(Math.max(0, t)));
      this.rect(cx - hw, cy + y, hw * 2 + 1, 1, c);
    }
  }

  line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;

    for (;;) {
      this.px(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
}

/** Adds a 1px outline around all opaque pixels (in place). */
export function addOutline(canvas, color) {
  const g = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const img = g.getImageData(0, 0, w, h);
  const d = img.data;
  const r = parseInt(color.slice(1, 3), 16);
  const gr = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const out = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (d[i + 3] > 0) continue;

      const n =
        (x > 0 && d[i - 1] > 0) ||
        (x < w - 1 && d[i + 7] > 0) ||
        (y > 0 && d[i - w * 4 + 3] > 0) ||
        (y < h - 1 && d[i + w * 4 + 3] > 0);

      if (n) out.push(i);
    }
  }

  for (const i of out) {
    d[i] = r; d[i + 1] = gr; d[i + 2] = b; d[i + 3] = 255;
  }

  g.putImageData(img, 0, 0);
}

/**
 * Build a sprite. draw(pen) paints in a w*h logical area; a 1px border is added
 * for the outline. (ax, ay) = anchor point (usually the feet) in draw-space.
 * Returns { canvas, w, h, ax, ay }.
 */
export function makeSprite(w, h, draw, opt = {}) {
  const { outline = '#1d1830', ax = w / 2, ay = h } = opt;
  const c = makeCanvas(w + 2, h + 2);
  const g = c.getContext('2d');
  g.translate(1, 1);
  draw(new Pen(g));
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (outline) addOutline(c, outline);
  return { canvas: c, w: w + 2, h: h + 2, ax: ax + 1, ay: ay + 1 };
}

/** Horizontally mirrored copy of a sprite (anchor mirrored too). */
export function flipSprite(s) {
  const c = makeCanvas(s.w, s.h);
  const g = c.getContext('2d');
  g.translate(s.w, 0);
  g.scale(-1, 1);
  g.drawImage(s.canvas, 0, 0);
  return { canvas: c, w: s.w, h: s.h, ax: s.w - s.ax, ay: s.ay };
}

/** White-tinted copy (used for hit flashes). */
export function whiteSprite(s) {
  const c = makeCanvas(s.w, s.h);
  const g = c.getContext('2d');
  g.drawImage(s.canvas, 0, 0);
  g.globalCompositeOperation = 'source-atop';
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, s.w, s.h);
  return { canvas: c, w: s.w, h: s.h, ax: s.ax, ay: s.ay };
}
