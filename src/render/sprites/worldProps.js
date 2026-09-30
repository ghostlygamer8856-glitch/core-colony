// worldProps.js - additional alien props and icon sprites for the Core Colony world.
// These are generated in code so they can be swapped or refined later without touching the game logic.
// The sheet is built from the provided sprite sheet and kept in a reusable atlas form.

import { makeSprite, flipSprite } from '../../pixel.js';

const PAL = {
  bg: '#0b1a20',
  teal1: '#7ef0de',
  teal2: '#63d7c1',
  teal3: '#2ca1a4',
  teal4: '#1f596d',
  teal5: '#133d52',
  moss: '#6dcf9a',
  moss2: '#9ae9c3',
  mossDark: '#2f8b66',
  coral: '#ff8db2',
  coral2: '#ffd7eb',
  berry: '#ff7bb1',
  berryDark: '#d7518a',
  violet: '#d8c0ff',
  violet2: '#b57ef0',
  violet3: '#7e57b3',
  pure: '#f4f5ff',
  stone: '#8d8ea9',
  stone2: '#b7b7c9',
  stone3: '#5c5d75',
  ore: '#c7a774',
  oreHi: '#f4c86d',
  oreDark: '#8f6d32',
  crystal: '#d7c4ff',
  crystalHi: '#f5ecff',
  crystalDark: '#9c7ad8',
  scrap1: '#c3c8d6',
  scrap2: '#8b92a8',
  scrap3: '#7d643e',
  cyan: '#6deaff',
  cyan2: '#dffcff',
  aqua: '#72f6ff',
  aqua2: '#d3fbff',
  gold: '#ffca57',
  gold2: '#ffecab',
  ember: '#ffb854',
  pnk: '#ff8ec8'
};

function makeBlobSprite(drawFn, w = 20, h = 20, ax = w / 2, ay = h) {
  return makeSprite(w, h, drawFn, { ax, ay });
}

function drawMushroomTree(P) {
  // cap
  P.ellipse(10, 8, 9, 3, PAL.teal2);
  P.ellipse(10, 7, 7, 3, PAL.teal1);
  P.rect(4, 7, 12, 2, PAL.teal1);
  P.rect(7, 5, 6, 2, PAL.teal3);
  // stalk
  P.rect(9, 11, 2, 7, PAL.teal4);
  P.rect(8, 18, 4, 1, PAL.teal3);
  // underside glow dots
  P.px(6, 10, PAL.cyan2);
  P.px(14, 10, PAL.cyan2);
  P.px(10, 9, PAL.cyan2);
  // tiny floating lights
  P.px(6, 6, PAL.pnk);
  P.px(13, 6, PAL.pnk);
  P.px(10, 4, PAL.pnk);
}

function drawGlowTree(P) {
  P.ellipse(14, 6, 14, 5, PAL.teal1);
  P.ellipse(14, 7, 10, 4, PAL.teal2);
  P.ellipse(8, 11, 7, 4, PAL.teal2);
  P.ellipse(20, 12, 7, 4, PAL.teal2);
  P.rect(13, 11, 3, 7, PAL.teal4);
  P.rect(12, 18, 5, 2, PAL.teal5);
  // ambient glow
  P.rect(10, 12, 1, 2, PAL.cyan2);
  P.rect(18, 13, 1, 2, PAL.cyan2);
  P.rect(14, 7, 2, 2, PAL.cyan2);
}

function drawPalm(P) {
  P.rect(11, 12, 2, 7, PAL.teal3);
  P.rect(9, 11, 1, 2, PAL.teal4);
  // fronds
  P.line(12, 10, 16, 7, PAL.teal2);
  P.line(12, 10, 18, 5, PAL.teal2);
  P.line(12, 10, 19, 9, PAL.teal2);
  P.line(12, 10, 17, 13, PAL.teal2);
  P.line(12, 10, 9, 6, PAL.teal2);
  P.line(12, 10, 7, 9, PAL.teal2);
  P.line(12, 10, 6, 13, PAL.teal2);
  // flower dot
  P.px(11, 8, PAL.pnk);
}

function drawBulbPlant(P) {
  P.ellipse(7, 8, 4, 4, PAL.cyan);
  P.rect(6, 12, 2, 4, PAL.mossDark);
  P.line(8, 13, 11, 12, PAL.moss);
  P.line(5, 13, 2, 12, PAL.moss);
}

function drawFern(P) {
  P.line(6, 11, 6, 15, PAL.mossDark);
  P.line(6, 11, 3, 9, PAL.moss);
  P.line(6, 11, 8, 9, PAL.moss);
  P.line(6, 11, 4, 13, PAL.moss2);
  P.line(6, 11, 8, 13, PAL.moss2);
}

function drawCoralBush(P) {
  P.ellipse(8, 9, 5, 3, PAL.coral2);
  P.ellipse(12, 10, 5, 3, PAL.coral2);
  P.ellipse(5, 11, 4, 3, PAL.coral2);
  P.rect(8, 12, 2, 5, PAL.coral);
  P.px(7, 8, PAL.coral);
  P.px(12, 8, PAL.coral);
}

function drawBerryBush(P) {
  P.ellipse(9, 9, 7, 5, PAL.moss2);
  P.px(6, 7, PAL.berry);
  P.px(8, 6, PAL.berryDark);
  P.px(10, 7, PAL.berry);
  P.px(12, 7, PAL.berryDark);
  P.px(7, 10, PAL.berry);
  P.px(11, 10, PAL.berryDark);
  P.rect(8, 13, 2, 3, PAL.mossDark);
}

function drawGrassTuft(P) {
  P.line(7, 12, 7, 5, PAL.mossDark);
  P.line(8, 12, 9, 5, PAL.moss);
  P.line(6, 12, 5, 5, PAL.moss);
  P.line(7, 11, 3, 10, PAL.moss2);
  P.line(7, 11, 11, 10, PAL.moss2);
}

function drawVioletTuft(P) {
  P.line(7, 12, 7, 5, PAL.violet3);
  P.line(7, 9, 4, 7, PAL.violet2);
  P.line(7, 9, 10, 7, PAL.violet2);
  P.line(7, 11, 3, 11, PAL.violet);
  P.line(7, 11, 11, 11, PAL.violet);
}

function drawFlowers(P) {
  P.rect(7, 11, 2, 5, PAL.mossDark);
  P.ellipse(5, 8, 2, 2, PAL.pnk);
  P.ellipse(9, 8, 2, 2, PAL.gold2);
  P.ellipse(7, 6, 2, 2, PAL.violet);
  P.px(7, 7, PAL.pure);
}

function drawMushroomCluster(P) {
  P.ellipse(6, 7, 4, 3, PAL.coral2);
  P.ellipse(12, 7, 4, 3, PAL.coral2);
  P.rect(5, 10, 2, 4, PAL.stone3);
  P.rect(12, 10, 2, 4, PAL.stone3);
  P.rect(8, 9, 2, 5, PAL.stone3);
  P.px(7, 7, PAL.pnk);
  P.px(12, 7, PAL.pnk);
}

function drawSmallRock(P, base = PAL.stone) {
  P.ellipse(8, 10, 6, 4, base);
  P.ellipse(8, 10, 4, 2, PAL.stone2);
  P.px(5, 8, PAL.stone3);
  P.px(10, 9, PAL.stone3);
}

function drawMediumRock(P, base = PAL.stone) {
  P.ellipse(8, 10, 8, 5, base);
  P.ellipse(8, 10, 6, 3, PAL.stone2);
  P.px(5, 8, PAL.stone3);
  P.px(9, 7, PAL.stone3);
  P.px(11, 11, PAL.stone3);
}

function drawLargeRock(P, base = PAL.stone) {
  P.ellipse(10, 11, 12, 7, base);
  P.ellipse(10, 12, 8, 4, PAL.stone2);
  P.px(6, 9, PAL.stone3);
  P.px(12, 8, PAL.stone3);
  P.px(15, 11, PAL.stone3);
}

function drawMossyRock(P, kind) {
  const base = kind === 'M' ? '#7aa19d' : '#7b8b9e';
  if (kind === 'M') {
    drawMediumRock(P, base);
    P.rect(6, 9, 3, 2, PAL.moss);
    P.rect(11, 10, 3, 2, PAL.moss2);
  } else {
    drawLargeRock(P, base);
    P.rect(7, 10, 5, 2, PAL.moss);
    P.rect(12, 12, 4, 2, PAL.moss2);
  }
}

function drawOreNode(P, size) {
  const s = Math.max(6, size);
  P.ellipse(8, 9, s, s - 2, PAL.stone3);
  P.ellipse(8, 9, s - 2, s - 4, PAL.oreDark);
  P.ellipse(8, 9, s - 5, s - 7, PAL.ore);
  // ore veins
  P.rect(7, 7, 2, 5, PAL.oreHi);
  P.rect(9, 8, 2, 4, PAL.oreHi);
  P.rect(11, 10, 2, 3, PAL.oreHi);
  P.px(8, 8, PAL.gold2);
}

function drawCrystalNode(P, size) {
  const s = Math.max(6, size);
  P.ellipse(8, 9, s, s - 2, PAL.stone3);
  P.rect(7, 5, 2, 8, PAL.crystalHi);
  P.rect(9, 4, 2, 9, PAL.crystal);
  P.rect(11, 5, 2, 8, PAL.crystalHi);
  P.rect(8, 7, 2, 6, PAL.crystalDark);
  P.px(8, 7, PAL.crystalHi);
}

function drawScrapPile(P) {
  P.ellipse(8, 12, 7, 4, PAL.scrap2);
  P.rect(5, 11, 2, 3, PAL.scrap3);
  P.rect(10, 11, 2, 3, PAL.scrap3);
  P.rect(7, 9, 2, 3, PAL.scrap3);
  P.px(8, 8, PAL.ember);
  P.px(10, 9, PAL.gold2);
}

function drawOreIcon(P) {
  P.ellipse(8, 9, 7, 5, PAL.oreDark);
  P.ellipse(8, 9, 5, 3, PAL.ore);
  P.ellipse(8, 9, 2, 1, PAL.gold2);
}

function drawCrystalIcon(P) {
  P.rect(7, 5, 2, 8, PAL.crystalHi);
  P.rect(9, 4, 2, 9, PAL.crystal);
  P.rect(11, 5, 2, 8, PAL.crystalHi);
  P.rect(8, 7, 2, 6, PAL.crystalDark);
}

function drawScrapIcon(P) {
  P.ellipse(8, 8, 7, 4, PAL.scrap1);
  P.rect(7, 10, 2, 3, PAL.scrap2);
  P.rect(9, 9, 2, 2, PAL.scrap3);
  P.px(8, 8, PAL.gold2);
}

function drawRefinedMetalIcon(P) {
  P.rect(4, 8, 8, 2, PAL.scrap1);
  P.rect(6, 6, 4, 2, PAL.scrap2);
  P.rect(5, 10, 6, 2, PAL.oreDark);
  P.rect(7, 4, 2, 2, PAL.gold2);
}

function drawComponentsIcon(P) {
  P.rect(4, 8, 10, 2, PAL.cyan2);
  P.rect(6, 5, 2, 7, PAL.cyan);
  P.rect(10, 5, 2, 7, PAL.cyan);
  P.rect(8, 9, 2, 6, PAL.cyan2);
  P.px(8, 8, PAL.aqua2);
}

export function buildWorldPropAtlas() {
  const trees = {
    mushroom: makeBlobSprite(drawMushroomTree, 20, 20, 10, 18),
    glow: makeBlobSprite(drawGlowTree, 28, 22, 14, 20),
    palm: makeBlobSprite(drawPalm, 22, 20, 11, 18),
  };

  const plants = {
    bulb: makeBlobSprite(drawBulbPlant, 14, 16, 7, 14),
    fern: makeBlobSprite(drawFern, 12, 18, 6, 16),
    coralBush: makeBlobSprite(drawCoralBush, 16, 16, 8, 14),
    berry: makeBlobSprite(drawBerryBush, 16, 18, 8, 16),
    grass: makeBlobSprite(drawGrassTuft, 14, 16, 7, 14),
    violet: makeBlobSprite(drawVioletTuft, 14, 16, 7, 14),
    flowers: makeBlobSprite(drawFlowers, 16, 18, 8, 16),
    mushrooms: makeBlobSprite(drawMushroomCluster, 18, 18, 9, 16),
  };

  const rocks = {
    small: makeBlobSprite((P) => drawSmallRock(P, PAL.stone), 18, 16, 9, 14),
    medium: makeBlobSprite((P) => drawMediumRock(P, PAL.stone), 20, 18, 10, 16),
    large: makeBlobSprite((P) => drawLargeRock(P, PAL.stone), 24, 20, 12, 18),
    mossyS: makeBlobSprite((P) => drawMossyRock(P, 'S'), 18, 16, 9, 14),
    mossyM: makeBlobSprite((P) => drawMossyRock(P, 'M'), 24, 20, 12, 18)
  };

  const nodes = {
    oreSmall: makeBlobSprite((P) => drawOreNode(P, 6), 18, 16, 9, 14),
    oreMedium: makeBlobSprite((P) => drawOreNode(P, 9), 20, 18, 10, 16),
    oreLarge: makeBlobSprite((P) => drawOreNode(P, 11), 24, 20, 12, 18),
    crystalSmall: makeBlobSprite((P) => drawCrystalNode(P, 6), 18, 16, 9, 14),
    crystalMedium: makeBlobSprite((P) => drawCrystalNode(P, 9), 20, 18, 10, 16),
    crystalLarge: makeBlobSprite((P) => drawCrystalNode(P, 11), 24, 20, 12, 18),
    scrap: makeBlobSprite(drawScrapPile, 18, 18, 9, 16),
  };

  const icons = {
    ore: makeBlobSprite(drawOreIcon, 16, 16, 8, 14),
    crystal: makeBlobSprite(drawCrystalIcon, 16, 16, 8, 14),
    scrap: makeBlobSprite(drawScrapIcon, 16, 16, 8, 14),
    refinedMetal: makeBlobSprite(drawRefinedMetalIcon, 16, 16, 8, 14),
    components: makeBlobSprite(drawComponentsIcon, 16, 16, 8, 14),
  };

  return { trees, plants, rocks, nodes, icons };
}

export function buildPropPreview() {
  const atlas = buildWorldPropAtlas();
  return atlas;
}
