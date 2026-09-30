import { makeSprite, flipSprite } from '../../pixel.js';

const S = {
  pur: '#7b3fa8', purHi: '#a866d6', purDk: '#4c2470', purDd: '#2e1548',
  pink: '#ff6fb5', pinkHi: '#ffc0e0', eye: '#c8ff4a', eyeHi: '#f4ffc0', fang: '#f1e6ff',
  slate: '#48607a', slateHi: '#6a86a3', slateDk: '#2f4258', slateDd: '#1f2d3e',
  spike: '#ff8a4c', spikeHi: '#ffd08a', spikeDk: '#c2461f', skin: '#34404f', ember: '#ffb347',
};

function drawSkitter(P, f, pose) {
  const walk = pose === 'walk';
  const lunge = pose === 'attack';
  const b = walk ? (f % 2 ? -1 : 0) : (pose === 'idle' ? (f % 2) : 0);
  const sh = lunge ? -2 : 0;
  const ph = walk ? f : 0;

  const legs = [[9, 0], [13, 1], [17, 0], [21, 1]];
  for (const [lx, p] of legs) {
    const swing = ((ph + p * 2) % 4 < 2) ? 2 : -1;
    P.line(lx + sh, 11 + b, lx + swing - 1 + sh, 15, S.purDd);
    P.line(lx + swing - 1 + sh, 15, lx + swing - 2 + sh, 17, S.purDd);
  }

  P.line(12 + sh, 4 + b, 11 + sh, 1 + b, S.pink);
  P.line(16 + sh, 4 + b, 16 + sh, 0 + b, S.pink);
  P.line(20 + sh, 5 + b, 22 + sh, 2 + b, S.pink);

  P.ellipse(15 + sh, 9 + b, 9, 6, S.pur);
  P.rect(9 + sh, 5 + b, 11, 1, S.purHi); P.rect(11 + sh, 4 + b, 7, 1, S.purHi);
  P.rect(8 + sh, 12 + b, 14, 2, S.purDk);

  P.px(13 + sh, 11 + b, S.pink);
  P.px(16 + sh, 12 + b, S.pink);
  P.px(19 + sh, 11 + b, S.pink);

  P.ellipse(6 + sh, 9 + b, 4, 4, S.purDk);
  P.rect(3 + sh, 6 + b, 4, 1, S.pur);
  P.rect(3 + sh, 7 + b, 3, 3, S.eye); P.px(3 + sh, 7 + b, S.eyeHi);
  P.rect(7 + sh, 8 + b, 2, 2, S.eye);

  if (lunge) {
    P.line(2 + sh, 12 + b, 0 + sh, 10 + b, S.fang);
    P.line(4 + sh, 13 + b, 1 + sh, 14 + b, S.fang);
  } else {
    P.px(2 + sh, 12 + b, S.fang);
    P.px(1 + sh, 13 + b, S.fang);
    P.px(4 + sh, 13 + b, S.fang);
  }
}

function drawShellback(P, f, pose) {
  const walk = pose === 'walk';
  const atk = pose === 'attack';
  const b = walk ? (f % 2 ? -1 : 0) : (pose === 'idle' ? (f % 2) : 0);
  const ph = walk ? f : 0;

  [[9, 0], [14, 2], [21, 1], [26, 3]].forEach(([lx, p]) => {
    const up = walk && ((ph + p) % 4 < 2) ? 1 : 0;
    P.rrect(lx, 20 - up, 4, 5, S.slateDd);
  });

  const sp = (x, y, h) => {
    P.rect(x, y - h, 3, h, S.spike);
    P.rect(x + 1, y - h - 2, 1, 2, S.spikeHi);
    P.rect(x, y - h + 1, 1, h - 1, S.spikeHi);
    P.rect(x + 2, y - h, 1, h, S.spikeDk);
  };
  sp(14, 9 + b, 6); sp(19, 8 + b, 8); sp(24, 10 + b, 5);

  P.ellipse(19, 14 + b, 12, 8, S.slate);
  P.rect(11, 8 + b, 16, 1, S.slateHi); P.rect(13, 7 + b, 12, 1, S.slateHi);
  P.rect(8, 19 + b, 23, 2, S.slateDk);

  for (const x of [15, 20, 25]) P.rect(x, 9 + b, 1, 9, S.slateDk);
  P.px(16, 11 + b, S.slateHi); P.px(21, 11 + b, S.slateHi);

  const hx = atk ? 0 : 1;
  P.rrect(hx, 13 + b, 9, 8, S.skin);
  P.rect(hx + 1, 13 + b, 7, 1, '#4a586b');
  P.rect(hx + 1, 15 + b, 3, 2, S.ember); P.px(hx + 1, 15 + b, '#fff1b8');
  if (atk) {
    P.rect(hx, 19 + b, 8, 2, '#ff5b2e');
    P.px(hx, 19 + b, S.ember);
  } else {
    P.rect(hx + 1, 19 + b, 6, 1, S.slateDd);
  }
}

export function buildEnemyAtlases() {
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
    skitter: build(26, 19, 13, 17, { idle: 2, walk: 4, attack: 1 }, drawSkitter),
    shellback: build(34, 27, 17, 25, { idle: 2, walk: 4, attack: 1 }, drawShellback),
  };
}
