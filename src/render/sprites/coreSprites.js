// coreSprites.js - the Core machine.
// Drawn as layers so the player can walk "inside" the pylons:
//   base   : pedestal, back pylons, glowing ring       (drawn first)
//   gem[]  : 4 animation frames of the floating crystal  (drawn on top of base)
//   front  : front pylons                               (drawn after the gem)
// Animated glow, ring energy and particles are added by the Core entity.

import { makeSprite } from '../../pixel.js';

const K = {
  metalDk: '#262a44', metal: '#3a3f5c', metalHi: '#565c82', metalLt: '#7a82b0',
  plate: '#1d2038', aqua: '#6ff2ff', aquaDk: '#2aa8c4', aquaHi: '#dffcff', teal: '#0f6e86',
};

export const CORE_W = 66, CORE_H = 54;
export const CORE_AX = 33, CORE_AY = 46;
export const CORE_GEM_Y = 6;

function pylon(P, cx, y, w, h, lit) {
  P.rect(cx - w / 2, y, w, h, K.metal);
  P.rect(cx - w / 2, y, 1, h, K.metalHi);
  P.rect(cx + w / 2 - 1, y, 1, h, K.metalDk);
  P.rect(cx - w / 2 - 1, y - 2, w + 2, 3, K.metalHi);
  P.rect(cx - w / 2 - 1, y - 2, w + 2, 1, K.metalLt);
  P.rect(cx - 1, y + 3, 2, Math.max(2, h - 8), lit ? K.aqua : K.aquaDk);
  P.rect(cx - w / 2 - 1, y + h, w + 2, 2, K.metalDk);
}

export const CORE_HOVER = 24;

export function buildCoreSprites() {
  const base = makeSprite(CORE_W, CORE_H, (P) => {
    P.ellipse(33, 43, 31, 10, K.metalDk);
    P.ellipse(33, 41, 31, 10, K.metal);
    P.rect(2, 41, 62, 3, K.metal);
    P.ellipse(33, 38, 30, 10, K.metalHi);
    P.ellipse(33, 39, 28, 9, K.metal);

    for (const [x0, y0, x1, y1] of [[8, 39, 16, 42], [58, 39, 50, 42], [33, 47, 33, 48], [14, 34, 20, 33], [52, 34, 46, 33]]) {
      P.line(x0, y0, x1, y1, K.metalDk);
    }

    P.ellipse(33, 38, 22, 7, K.plate);
    P.ellipse(33, 38, 20, 6, K.teal);
    P.ellipse(33, 38, 17, 5, K.aquaDk);
    P.ellipse(33, 38, 13, 4, '#45d3e8');
    P.ellipse(33, 38, 8, 2, K.aqua);
    P.ellipse(33, 38, 4, 1, K.aquaHi);

    for (let a = 0; a < 16; a++) {
      const t = (a / 16) * Math.PI * 2;
      P.px(Math.round(33 + Math.cos(t) * 24.5), Math.round(38 + Math.sin(t) * 8), a % 2 ? K.aqua : K.metalLt);
    }

    pylon(P, 12, 22, 5, 12, true);
    pylon(P, 54, 22, 5, 12, true);
  }, { ax: CORE_AX, ay: CORE_AY });

  const front = makeSprite(CORE_W, CORE_H, (P) => {
    pylon(P, 7, 27, 5, 11, true);
    pylon(P, 59, 27, 5, 11, true);

    for (let x = 6; x < 61; x++) {
      const t = (x - 33) / 30;
      const y = Math.round(41 + Math.sqrt(Math.max(0, 1 - t * t)) * 8);
      P.px(x, y, K.metalHi);
    }
  }, { ax: CORE_AX, ay: CORE_AY });

  const gem = [];
  for (let f = 0; f < 4; f++) {
    gem.push(makeSprite(12, 19, (P) => {
      const widths = [2, 4, 6, 8, 10, 12, 12, 12, 12, 10, 10, 8, 8, 6, 6, 4, 4, 2, 2];
      widths.forEach((w, y) => {
        const x0 = 6 - w / 2;
        P.rect(x0, y, w, 1, '#22a0c8');
        P.rect(x0, y, Math.ceil(w / 2), 1, '#4fd9e8');
      });

      P.rect(4, 1, 4, 3, '#b5f6ff');
      P.rect(5, 6 + (f % 2), 2, 6, K.aquaHi);
      P.px(3 + f, 5, '#ffffff');
      P.px(8 - f, 9, '#9ff3ff');
      P.rect(1, 6, 1, 3, '#7ee9f7');
    }, { ax: 6, ay: 19 }));
  }

  return { base, front, gem };
}
