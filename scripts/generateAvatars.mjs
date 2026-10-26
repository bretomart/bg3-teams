import fs from 'node:fs';
import path from 'node:path';

const companions = [
  { id: 'tav', name: 'TAV', bg1: '#3b82f6', bg2: '#1d4ed8', symbol: '⚔️' },
  { id: 'durge', name: 'URGE', bg1: '#b91c1c', bg2: '#450a0a', symbol: '🩸' },
  { id: 'astarion', name: 'AST', bg1: '#991b1b', bg2: '#581c87', symbol: '🧛' },
  { id: 'shadowheart', name: 'SH', bg1: '#475569', bg2: '#1e1b4b', symbol: '✨' },
  { id: 'karlach', name: 'KAR', bg1: '#ea580c', bg2: '#7f1d1d', symbol: '🔥' },
  { id: 'laezel', name: 'LAE', bg1: '#65a30d', bg2: '#365314', symbol: '🗡️' },
  { id: 'gale', name: 'GALE', bg1: '#7c3aed', bg2: '#312e81', symbol: '🔮' },
  { id: 'wyll', name: 'WYLL', bg1: '#d97706', bg2: '#78350f', symbol: '⚡' },
  { id: 'minthara', name: 'MIN', bg1: '#831843', bg2: '#500724', symbol: '🕷️' },
  { id: 'halsin', name: 'HAL', bg1: '#15803d', bg2: '#14532d', symbol: '🐻' },
  { id: 'jaheira', name: 'JAH', bg1: '#0d9488', bg2: '#134e4a', symbol: '🌿' },
  { id: 'minsc', name: 'MINSC', bg1: '#eab308', bg2: '#854d0e', symbol: '🐹' },
];

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const targetDir = path.join(rootDir, 'public/companions');

for (const c of companions) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="g_${c.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c.bg1}" />
      <stop offset="100%" stop-color="${c.bg2}" />
    </linearGradient>
    <radialGradient id="ring_${c.id}" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="transparent" />
      <stop offset="100%" stop-color="rgba(255,215,0,0.4)" />
    </radialGradient>
  </defs>
  <rect width="120" height="120" rx="18" fill="url(#g_${c.id})" />
  <rect width="120" height="120" rx="18" fill="url(#ring_${c.id})" stroke="#e2d4a5" stroke-width="2" stroke-opacity="0.3" />
  <text x="50%" y="46%" font-size="34" text-anchor="middle" dominant-baseline="central">${c.symbol}</text>
  <text x="50%" y="82%" font-family="Cinzel, Georgia, serif" font-weight="bold" font-size="14" fill="#fef08a" text-anchor="middle" letter-spacing="1">${c.name}</text>
</svg>`;
  fs.writeFileSync(path.join(targetDir, `${c.id}.svg`), svg, 'utf8');
}

console.log('Generated BG3 companion SVGs successfully.');
