import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const downloads = [
  { file: 'astarion.png', url: 'https://bg3.wiki/w/images/1/1b/Portrait_Astarion.png' },
  { file: 'gale.png', url: 'https://bg3.wiki/w/images/1/11/Portrait_Gale.png' },
  { file: 'halsin.png', url: 'https://bg3.wiki/w/images/f/fe/Portrait_Halsin.png' },
  { file: 'jaheira.png', url: 'https://bg3.wiki/w/images/a/a8/Portrait_Jaheira.png' },
  { file: 'karlach.png', url: 'https://bg3.wiki/w/images/b/b2/Portrait_Karlach.png' },
  { file: 'laezel.png', url: 'https://bg3.wiki/w/images/8/86/Portrait_Lae%27zel.png' },
  { file: 'minsc.png', url: 'https://bg3.wiki/w/images/d/d6/Portrait_Minsc.png' },
  { file: 'minthara.png', url: 'https://bg3.wiki/w/images/8/8e/Portrait_Minthara_%28263%29.png' },
  { file: 'shadowheart.png', url: 'https://bg3.wiki/w/images/7/7e/Portrait_Shadowheart.png' },
  { file: 'wyll.png', url: 'https://bg3.wiki/w/images/6/6d/Portrait_Wyll.png' },
  { file: 'durge.png', url: 'https://bg3.wiki/w/images/8/8c/Portrait_The_Dark_Urge.png' }
];

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const targetDir = path.join(rootDir, 'public/companions');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BG3TeamBuilder/1.0 (Mozilla/5.0)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  for (const item of downloads) {
    const dest = path.join(targetDir, item.file);
    try {
      await downloadFile(item.url, dest);
      console.log(`Downloaded ${item.file}`);
    } catch (err) {
      console.error(`Failed ${item.file}:`, err.message);
    }
  }
}

run();
