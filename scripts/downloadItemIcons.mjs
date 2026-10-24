import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const companionsPath = '/home/brandon/projects/bg3-team-builder/src/data/companions.json';
const targetDir = '/home/brandon/projects/bg3-team-builder/public/items';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const rawData = JSON.parse(fs.readFileSync(companionsPath, 'utf8'));
const itemNames = new Set();

for (const companion of rawData) {
  if (companion.optimalGear?.weapons) {
    for (const w of companion.optimalGear.weapons) {
      if (w.name) itemNames.add(w.name.trim());
    }
  }
  if (companion.optimalGear?.armor) {
    const armor = companion.optimalGear.armor;
    for (const [key, val] of Object.entries(armor)) {
      if (typeof val === 'string' && val.trim()) {
        itemNames.add(val.trim());
      } else if (Array.isArray(val)) {
        for (const ring of val) {
          if (ring && ring.trim()) itemNames.add(ring.trim());
        }
      }
    }
  }
}

console.log(`Found ${itemNames.size} distinct items to download.`);

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BG3ItemIconScraper/1.0 (Mozilla/5.0)' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

function downloadBinary(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BG3ItemIconScraper/1.0 (Mozilla/5.0)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBinary(res.headers.location, dest).then(resolve).catch(reject);
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

// UK spelling converter for BG3 wiki titles
function toWikiTitle(name) {
  let title = name;
  title = title.replace(/\bArmor\b/g, 'Armour');
  return title;
}

async function resolveAndDownload(itemName) {
  const slug = slugify(itemName);
  const outPath = path.join(targetDir, `${slug}.webp`);
  const pngPath = path.join(targetDir, `${slug}.png`);

  if (fs.existsSync(outPath) || fs.existsSync(pngPath)) {
    return { name: itemName, status: 'already_exists', file: fs.existsSync(outPath) ? `${slug}.webp` : `${slug}.png` };
  }

  const wikiTitle = toWikiTitle(itemName);
  const apiUrl = `https://bg3.wiki/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=128`;

  try {
    const data = await fetchJson(apiUrl);
    const pages = data.query?.pages || {};
    let thumbUrl = null;

    for (const pageId of Object.keys(pages)) {
      if (pageId !== '-1' && pages[pageId].thumbnail?.source) {
        thumbUrl = pages[pageId].thumbnail.source;
        break;
      }
    }

    if (!thumbUrl) {
      // Try searching via opensearch if direct title query failed
      const searchUrl = `https://bg3.wiki/w/api.php?action=opensearch&search=${encodeURIComponent(itemName)}&limit=1&format=json`;
      const searchData = await fetchJson(searchUrl);
      if (searchData[1] && searchData[1][0]) {
        const foundTitle = searchData[1][0];
        const secondApi = `https://bg3.wiki/w/api.php?action=query&titles=${encodeURIComponent(foundTitle)}&prop=pageimages&format=json&pithumbsize=128`;
        const secondData = await fetchJson(secondApi);
        const secondPages = secondData.query?.pages || {};
        for (const pId of Object.keys(secondPages)) {
          if (pId !== '-1' && secondPages[pId].thumbnail?.source) {
            thumbUrl = secondPages[pId].thumbnail.source;
            break;
          }
        }
      }
    }

    if (thumbUrl) {
      const ext = thumbUrl.endsWith('.png') ? '.png' : '.webp';
      const finalDest = path.join(targetDir, `${slug}${ext}`);
      await downloadBinary(thumbUrl, finalDest);
      return { name: itemName, status: 'downloaded', file: `${slug}${ext}` };
    } else {
      return { name: itemName, status: 'not_found' };
    }
  } catch (err) {
    return { name: itemName, status: 'error', error: err.message };
  }
}

async function main() {
  const results = {};
  const list = Array.from(itemNames);
  let successCount = 0;

  for (let i = 0; i < list.length; i += 5) {
    const chunk = list.slice(i, i + 5);
    const promises = chunk.map(name => resolveAndDownload(name));
    const chunkResults = await Promise.all(promises);

    for (const res of chunkResults) {
      results[res.name] = res;
      if (res.status === 'downloaded' || res.status === 'already_exists') {
        successCount++;
        console.log(`[OK] ${res.name} -> ${res.file}`);
      } else {
        console.log(`[WARN] ${res.name}: ${res.status}`);
      }
    }
  }

  // Write mapping manifest for frontend usage
  const manifest = {};
  for (const [name, res] of Object.entries(results)) {
    if (res.file) {
      manifest[name] = `/items/${res.file}`;
    }
  }

  const manifestPath = '/home/brandon/projects/bg3-team-builder/src/data/itemIcons.json';
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nManifest written to ${manifestPath} (${Object.keys(manifest).length}/${list.length} mapped).`);
}

main().catch(console.error);
