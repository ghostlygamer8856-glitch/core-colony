import { makeSprite, flipSprite } from '../../pixel.js';

const W = {
  yel: '#ffc857', yelHi: '#ffe49a', yelDk: '#e8952e', yelDd: '#b8641c',
  navy: '#1b2340', aqua: '#6ff2ff', aquaHi: '#dffcff',
  steel: '#b8c2d6', steelDk: '#7d8aa6', joint: '#4a4560', amber: '#ffd166',
  flame: '#ff9d3a', flameHi: '#fff1a8',
};

function drawWorker(P, f) {
  const bob = f % 2;
  const y0 = 3 + bob;

  P.rect(6, y0 + 12, 3, 2, W.steelDk);
  P.rect(12, y0 + 12, 3, 2, W.steelDk);
  const fl = f % 2 === 0 ? 3 : 2;
  P.rect(6, y0 + 14, 3, fl, W.flame);
  P.rect(12, y0 + 14, 3, fl, W.flame);
  P.rect(7, y0 + 14, 1, 1, W.flameHi);
  P.rect(13, y0 + 14, 1, 1, W.flameHi);

  P.rrect(14, y0 + 2, 6, 7, W.yelDk);
  P.rect(15, y0 + 3, 4, 1, W.yelHi);
  P.rect(15, y0 + 6, 4, 1, W.yelDd);

  P.ellipse(10, y0 + 7, 7, 5, W.yel);
  P.rect(5, y0 + 10, 11, 2, W.yelDk);
  P.rect(6, y0 + 3, 7, 1, W.yelHi);
  P.rect(4, y0 + 4, 2, 1, W.yelHi);

  P.rrect(2, y0 + 5, 7, 5, W.navy);
  P.rect(3, y0 + 6, 2, 2, W.aqua); P.px(3, y0 + 6, W.aquaHi);

  P.rect(9, y0 - 1, 1, 3, W.steelDk); P.px(9, y0 - 2, W.amber);

  P.line(5, y0 + 11, 2, y0 + 13, W.steel);
  P.px(1, y0 + 13, W.steel); P.px(2, y0 + 14, W.steel);
}

function drawCombat(P, f, pose) {
  const walk = pose === 'walk';
  const b = walk ? (f % 2 ? -1 : 0) : (f % 2);
  const stride = walk ? [-2, 0, 2, 0][f] : 0;

  P.rect(12 - stride, 20, 3, 4, W.joint);
  P.rrect(11 - stride, 22, 5, 3, '#3a4a86');
  P.rect(8 + stride, 20, 3, 4, W.joint);
  P.rrect(7 + stride, 22, 5, 3, '#4f6fd0');

  P.rrect(17, 10 + b, 4, 8, '#34489a');
  P.rect(18, 12 + b, 2, 4, '#ff5468'); P.px(18, 12 + b, '#ffb3bd');
  P.line(20, 10 + b, 21, 6 + b, W.steelDk); P.px(21, 5 + b, '#ff5468');

  P.rrect(6, 11 + b, 12, 9, '#4f6fd0');
  P.rect(7, 11 + b, 10, 1, '#7f9cf0');
  P.rect(7, 19 + b, 10, 1, '#34489a');
  P.rect(8, 14 + b, 4, 3, W.steel); P.px(9, 15 + b, '#ff5468');

  P.rrect(4, 3 + b, 13, 9, '#34489a');
  P.rect(5, 3 + b, 11, 1, '#4f6fd0');
  P.rrect(4, 5 + b, 8, 4, W.navy);
  P.rect(4, 6 + b, 7, 2, '#ff5468'); P.px(4, 6 + b, '#ffb3bd');
  P.rect(13, 4 + b, 2, 2, W.steel);

  P.rrect(2, 13 + b, 7, 4, W.steelDk);
  P.rect(0, 14 + b, 4, 2, W.steel);
  P.px(0, 14 + b, '#ff5468'); P.px(0, 15 + b, '#ff5468');
  P.rect(5, 13 + b, 4, 1, W.steel);
}

export function buildNanobotAtlases() {
  const build = (w, h, ax, ay, poses, drawFn) => {
    const left = {};
    for (const [pose, n] of Object.entries(poses)) {
      left[pose] = [];
      for (let f = 0; f < n; f++) left[pose].push(makeSprite(w, h, (P) => drawFn(P, f, pose), { ax, ay }));
    }
    const right = {};
    for (const pose of Object.keys(left)) right[pose] = left[pose].map(flipSprite);
    return { left, right };
  };

  return {
    worker: build(22, 20, 11, 19, { idle: 2, move: 2 }, (P, f) => drawWorker(P, f)),
    combat: build(24, 25, 12, 24, { idle: 2, walk: 4 }, (P, f, pose) => drawCombat(P, f, pose)),
  };
}
