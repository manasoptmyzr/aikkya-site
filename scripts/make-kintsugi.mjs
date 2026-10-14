// Draws public/kintsugi.svg: a tile of hairline cracks in the whitewash,
// a few of them mended with gold. The tile repeats without visible edges.
// Run `node scripts/make-kintsugi.mjs` after changing anything below.
import { writeFileSync } from 'node:fs';

const SEED = 7;
const SIZE = 1400;
const CRACKS = 5;
const GOLD_EVERY = 3; // every third crack is mended with gold

let s = SEED;
const rand = () => {
  s |= 0; s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const between = (a, b) => a + rand() * (b - a);

// A crack is a jagged walk that keeps a rough heading and sometimes branches.
// Small wobbles and the odd sharp kink, always pulled back towards the
// original direction, so it reads as a crack rather than a root.
function crack(x, y, heading, length, depth, out) {
  const pts = [[x, y]];
  const aim = heading;
  let travelled = 0;
  while (travelled < length) {
    heading += rand() < 0.18 ? between(-0.8, 0.8) : between(-0.18, 0.18);
    heading += (aim - heading) * 0.35;
    const step = between(10, 30);
    x += Math.cos(heading) * step;
    y += Math.sin(heading) * step;
    travelled += step;
    pts.push([x, y]);
    if (depth < 2 && rand() < 0.05) {
      crack(x, y, heading + (rand() < 0.5 ? -1 : 1) * between(0.5, 1.1), length * between(0.15, 0.35), depth + 1, out);
    }
  }
  out.push(pts);
}

const groups = { line: [], gold: [] };
for (let i = 0; i < CRACKS; i++) {
  const lines = [];
  crack(between(0, SIZE), between(0, SIZE), between(0, Math.PI * 2), between(450, 950), 0, lines);
  (i % GOLD_EVERY === 0 ? groups.gold : groups.line).push(...lines);
}

// Draw each line again shifted by one tile in every direction, so cracks
// that leave one edge come back in on the other.
const path = (lines) =>
  lines
    .flatMap((pts) =>
      [-SIZE, 0, SIZE].flatMap((dx) =>
        [-SIZE, 0, SIZE].map((dy) => pts.map(([x, y]) => [Math.round(x + dx), Math.round(y + dy)])),
      ),
    )
    .filter((pts) => pts.some(([x, y]) => x > -40 && x < SIZE + 40 && y > -40 && y < SIZE + 40))
    .map((pts) => 'M' + pts.map((p) => p.join(' ')).join('L'))
    .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path d="${path(groups.line)}" stroke="#d6cab4" stroke-opacity=".4" stroke-width=".7"/>
<path d="${path(groups.gold)}" stroke="#c9a14a" stroke-opacity=".08" stroke-width="3"/>
<path d="${path(groups.gold)}" stroke="#b8913a" stroke-opacity=".32" stroke-width="1"/>
</g>
</svg>
`;

writeFileSync(new URL('../public/kintsugi.svg', import.meta.url), svg);
console.log(`public/kintsugi.svg: ${(svg.length / 1024).toFixed(1)} KB`);
