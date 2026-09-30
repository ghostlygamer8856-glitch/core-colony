import { makeSprite, flipSprite } from '../../pixel.js';

export const ROBOT_COLORS = {
  cream: '#ece6d6', creamHi: '#fffaf0', creamSh: '#c4bba5', creamDk: '#9c937e',
  orange: '#f08a3c', orangeDk: '#c2591f', orangeHi: '#ffb267',
  navy: '#1b2340', navyHi: '#3a4470',
  aqua: '#6ff2ff', aquaHi: '#dffcff', aquaDk: '#2aa8c4',
  joint: '#4a4560',
  pack: '#5f7f8c', packDk: '#3f5966', packHi: '#86a9b6',
  amber: '#ffd166', wood: '#8a5a3a', steel: '#b8c2d6',
};
const C = ROBOT_COLORS;

const W = 28, H = 34;
const AX = 14, AY = 33;

function tool(P, hx, hy, vx, vy, len = 7) {
  const m = Math.hypot(vx, vy) || 1;
  vx /= m; vy /= m;
  const horiz = Math.abs(vx) > Math.abs(vy);
  const ox = horiz ? 0 : 1, oy = horiz ? 1 : 0;
  const tx = Math.round(hx + vx * len), ty = Math.round(hy + vy * len);

  P.line(hx, hy, tx, ty, C.wood);
  P.line(hx + ox, hy + oy, tx + ox, ty + oy, '#b07a4c');

  const px = -vy, py = vx;
  const ax = Math.round(tx + px * 3), ay = Math.round(ty + py * 3);
  const bx = Math.round(tx - px * 3), by = Math.round(ty - py * 3);
  P.line(ax, ay, bx, by, C.steel);
  P.line(ax + vx * 1.4, ay + vy * 1.4, bx + vx * 1.4, by + vy * 1.4, '#e4ebf7');

  P.rect(ax, ay, 1, 1, C.aqua);
  P.rect(bx, by, 1, 1, C.aqua);

  const ex = Math.round(tx + vx * 2), ey = Math.round(ty + vy * 2);
  P.px(ex, ey, C.aquaHi);
  P.px(Math.round(tx + vx * 3), Math.round(ty + vy * 3), C.aqua);
}

function arm(P, sx, sy, hx, hy, dark = false) {
  P.line(sx, sy, hx, hy, dark ? C.creamDk : C.creamSh);
  P.line(sx + 1, sy, hx + 1, hy, dark ? C.creamSh : C.cream);
  P.rect(hx, hy, 2, 2, dark ? C.orangeDk : C.orange);
}

function antenna(P, x, b, blinkOn) {
  P.rect(x, 3 + b, 1, 4, C.creamDk);
  P.rect(x - 1, 0 + b, 3, 3, blinkOn ? C.aqua : C.aquaDk);
  P.px(x - 1, 0 + b, C.aquaHi);
}

function eyes(P, x1, x2, y, w, h, blink, b) {
  const eh = blink ? 1 : h;
  const ey = blink ? y + Math.floor(h / 2) : y;
  P.rect(x1, ey + b, w, eh, C.aqua);
  P.rect(x2, ey + b, w, eh, C.aqua);
  if (!blink) {
    P.px(x1, ey + b, C.aquaHi);
    P.px(x2, ey + b, C.aquaHi);
  }
}

function front(P, o) {
  const { b, liftL, liftR, blink, pose, f } = o;

  P.rect(10, 26, 3, 3, C.joint);
  P.rect(15, 26, 3, 3, C.joint);
  P.rrect(8, 29 - liftL, 5, 4, C.orange);
  P.rect(8, 32 - liftL, 5, 1, C.orangeDk);
  P.px(9, 29 - liftL, C.orangeHi);

  P.rrect(15, 29 - liftR, 5, 4, C.orange);
  P.rect(15, 32 - liftR, 5, 1, C.orangeDk);
  P.px(16, 29 - liftR, C.orangeHi);

  P.rect(7, 17 + b, 2, 4, C.pack);
  P.rect(19, 17 + b, 2, 4, C.pack);

  P.rrect(9, 18 + b, 10, 8, C.cream);
  P.rect(9, 18 + b, 10, 1, C.creamHi);
  P.rect(10, 25 + b, 8, 1, C.creamSh);
  P.rect(12, 20 + b, 4, 3, C.orangeDk); P.rect(12, 20 + b, 4, 2, C.orange);
  P.px(13, 21 + b, C.aqua); P.px(14, 21 + b, C.aquaHi);

  let rh, tv, th = 7;
  if (pose === 'swing') {
    if (f === 0) { rh = [22, 14 + b]; tv = [0.15, -1]; }
    else if (f === 1) { rh = [18, 27 + b]; tv = [-0.2, 1]; th = 6; }
    else { rh = [21, 23 + b]; tv = [0.5, 1]; }
  } else { rh = [21, 25 + b]; tv = [0.25, 1]; }

  arm(P, 7, 19 + b, 6, 24 + b, true);
  arm(P, 19, 19 + b, rh[0], rh[1]);

  P.rect(3, 10 + b, 2, 4, C.orange);
  P.rect(23, 10 + b, 2, 4, C.orange);
  P.rrect(5, 6 + b, 18, 12, C.cream);
  P.rect(6, 6 + b, 16, 1, C.creamHi);
  P.rect(6, 17 + b, 16, 1, C.creamSh);
  P.rrect(7, 9 + b, 14, 7, C.navy);
  P.rect(8, 9 + b, 12, 1, C.navyHi);
  eyes(P, 9, 16, 10, 3, 4, blink, b);
  antenna(P, 14, b, o.blinkOn);
  tool(P, rh[0] + 1, rh[1] + 1, tv[0], tv[1], th);
}

function back(P, o) {
  const { b, liftL, liftR, pose, f } = o;
  let rh, tv, th = 8;
  if (pose === 'swing') {
    if (f === 0) { rh = [22, 17 + b]; tv = [1, -0.5]; }
    else if (f === 1) { rh = [21, 14 + b]; tv = [0.45, -1]; th = 9; }
    else { rh = [21, 20 + b]; tv = [0.9, -0.2]; }
  } else { rh = [21, 24 + b]; tv = [0.5, -0.9]; th = 6; }

  tool(P, rh[0] + 1, rh[1] + 1, tv[0], tv[1], th);

  P.rect(10, 26, 3, 3, C.joint);
  P.rect(15, 26, 3, 3, C.joint);
  P.rrect(8, 29 - liftL, 5, 4, C.orangeDk);
  P.rect(8, 32 - liftL, 5, 1, C.orangeDk);
  P.rrect(15, 29 - liftR, 5, 4, C.orangeDk);
  P.rect(15, 32 - liftR, 5, 1, C.orangeDk);

  P.rrect(9, 18 + b, 10, 8, C.creamSh);
  arm(P, 7, 19 + b, 6, 24 + b, true);
  arm(P, 19, 19 + b, rh[0], rh[1]);

  P.rrect(8, 17 + b, 12, 11, C.packDk);
  P.rrect(9, 17 + b, 10, 9, C.pack);
  P.rect(10, 17 + b, 8, 1, C.packHi);
  P.rect(11, 20 + b, 6, 4, '#26363f');
  P.rect(12, 21 + b, 4, 2, C.amber); P.px(12, 21 + b, '#fff1b8');
  P.rect(9, 25 + b, 10, 1, C.packDk);
  P.line(19, 17 + b, 22, 12 + b, C.creamDk); P.px(22, 11 + b, C.amber);

  P.rect(3, 10 + b, 2, 4, C.orange);
  P.rect(23, 10 + b, 2, 4, C.orange);
  P.rrect(5, 6 + b, 18, 12, C.cream);
  P.rect(6, 6 + b, 16, 1, C.creamHi);
  P.rect(6, 17 + b, 16, 1, C.creamSh);
  P.rect(8, 10 + b, 12, 2, C.creamSh);
  P.rect(12, 9 + b, 4, 1, C.orange);
  P.rect(12, 13 + b, 4, 3, C.creamSh);
  for (let i = 0; i < 3; i++) P.rect(12, 13 + i + b, 4, 1, i % 2 ? C.creamDk : C.creamSh);

  antenna(P, 14, b, o.blinkOn);
}

function side(P, o) {
  const { b, blink, pose, f, step, lift } = o;
  let hand, tv, th = 7;
  if (pose === 'swing') {
    if (f === 0) { hand = [14, 14 + b]; tv = [-0.25, -1]; th = 6; }
    else if (f === 1) { hand = [7, 21 + b]; tv = [-1, 0.2]; th = 8; }
    else { hand = [8, 24 + b]; tv = [-1, 0.6]; }
  } else { hand = [9, 24 + b]; tv = [-0.9, 0.6]; }

  arm(P, 17, 19 + b, 16, 24 + b, true);
  P.rect(15, 26, 3, 3, C.joint);
  P.rrect(14 - step, 29 - (step < 0 ? lift : 0), 5, 4, C.orangeDk);
  P.rect(14 - step, 32 - (step < 0 ? lift : 0), 5, 1, C.orangeDk);

  P.rrect(17, 17 + b, 8, 11, C.packDk);
  P.rrect(17, 17 + b, 7, 9, C.pack);
  P.rect(18, 17 + b, 5, 1, C.packHi);
  P.rect(21, 19 + b, 3, 5, '#26363f'); P.rect(22, 20 + b, 1, 3, C.amber);
  P.line(23, 17 + b, 25, 12 + b, C.creamDk); P.px(25, 11 + b, C.amber);

  P.rect(11, 26, 3, 3, C.joint);
  P.rrect(9 + step, 29 - (step > 0 ? lift : 0), 6, 4, C.orange);
  P.rect(9 + step, 32 - (step > 0 ? lift : 0), 6, 1, C.orangeDk);
  P.px(10 + step, 29 - (step > 0 ? lift : 0), C.orangeHi);

  P.rrect(9, 18 + b, 10, 8, C.cream);
  P.rect(9, 18 + b, 10, 1, C.creamHi);
  P.rect(10, 25 + b, 8, 1, C.creamSh);
  P.rect(9, 20 + b, 2, 3, C.orange); P.px(9, 21 + b, C.aqua);

  P.rrect(5, 6 + b, 17, 12, C.cream);
  P.rect(6, 6 + b, 15, 1, C.creamHi);
  P.rect(6, 17 + b, 15, 1, C.creamSh);
  P.rect(15, 10 + b, 3, 4, C.orange); P.rect(15, 10 + b, 3, 1, C.orangeHi);
  P.rrect(6, 9 + b, 9, 7, C.navy);
  P.rect(7, 9 + b, 7, 1, C.navyHi);
  eyes(P, 7, 12, 10, 3, 4, blink, b);
  antenna(P, 12, b, o.blinkOn);

  arm(P, 13, 19 + b, hand[0], hand[1]);
  tool(P, hand[0], hand[1] + 1, tv[0], tv[1], th);
}

function poseParams(pose, f) {
  const o = {
    b: 0, liftL: 0, liftR: 0, step: 0, lift: 0, blink: false, blinkOn: f % 2 === 0, pose, f
  };

  if (pose === 'idle') {
    o.b = f === 1 ? 1 : 0;
    o.blink = f === 2;
    o.blinkOn = f !== 1;
  } else if (pose === 'walk') {
    o.b = f % 2 === 0 ? 0 : -1;
    o.liftL = f === 0 ? 2 : 0;
    o.liftR = f === 2 ? 2 : 0;
    o.step = [-2, 0, 2, 0][f];
    o.lift = (f === 0 || f === 2) ? 1 : 0;
  } else if (pose === 'swing') {
    o.b = f === 1 ? 1 : 0;
  }

  return o;
}

const DRAW = { down: front, up: back, left: side };
const COUNTS = { idle: 3, walk: 4, swing: 3 };

export function buildRobotAtlas() {
  const atlas = {};
  for (const dir of ['down', 'up', 'left']) {
    atlas[dir] = {};
    for (const pose of Object.keys(COUNTS)) {
      atlas[dir][pose] = [];
      for (let f = 0; f < COUNTS[pose]; f++) {
        atlas[dir][pose].push(makeSprite(W, H, (P) => DRAW[dir](P, poseParams(pose, f)), { ax: AX, ay: AY }));
      }
    }
  }

  atlas.right = {};
  for (const pose of Object.keys(COUNTS)) {
    atlas.right[pose] = atlas.left[pose].map(flipSprite);
  }

  return atlas;
}
