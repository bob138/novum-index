#!/usr/bin/env node
/**
 * Compiles Git source-of-truth files (data/meta.json + data/entries/<year>/<id>.json)
 * into optimized static CDN assets under public/data/ (gitignored, copied into dist/ by Vite):
 *   - public/data/index.json          Lightweight catalog for Leaderboard, Charts, Models & Methodology
 *   - public/data/dossiers/<id>.json  Lazy-loaded full dossier prose, rationales, caveats & sources
 *   - public/data/breakthroughs.json  Combined MIT open-data snapshot for researchers
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const metaPath = path.join(rootDir, 'data', 'meta.json');
const entriesRoot = path.join(rootDir, 'data', 'entries');
const outRoot = path.join(rootDir, 'public', 'data');
const outDossiersDir = path.join(outRoot, 'dossiers');

function collectEntryFiles(dir) {
  const files = [];
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      files.push(...collectEntryFiles(full));
    } else if (dirent.isFile() && dirent.name.endsWith('.json')) {
      files.push(full);
    }
  }
  return files.sort();
}

function buildData() {
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const entryFiles = collectEntryFiles(entriesRoot);
  const fullBreakthroughs = entryFiles.map((filePath) =>
    JSON.parse(fs.readFileSync(filePath, 'utf8'))
  );

  // Deterministic ordering: newest date first, then id ascending
  fullBreakthroughs.sort((a, b) => {
    const cmp = (b.date || '').localeCompare(a.date || '');
    return cmp !== 0 ? cmp : (a.id || '').localeCompare(b.id || '');
  });

  // Clean & recreate public/data/dossiers
  fs.rmSync(outRoot, { recursive: true, force: true });
  fs.mkdirSync(outDossiersDir, { recursive: true });

  const indexEntries = [];

  for (const item of fullBreakthroughs) {
    const {
      summary,
      technicalHighlights,
      caveats,
      scoreRationale,
      sources,
      ...lightweight
    } = item;

    indexEntries.push(lightweight);

    const dossierPayload = {
      id: item.id,
      summary,
      technicalHighlights,
      caveats,
      scoreRationale,
      sources,
    };

    fs.writeFileSync(
      path.join(outDossiersDir, `${item.id}.json`),
      JSON.stringify(dossierPayload),
      'utf8'
    );
  }

  const indexJson = JSON.stringify({ meta, breakthroughs: indexEntries });
  fs.writeFileSync(path.join(outRoot, 'index.json'), indexJson, 'utf8');

  const fullJson = JSON.stringify({ meta, breakthroughs: fullBreakthroughs }, null, 2) + '\n';
  fs.writeFileSync(path.join(outRoot, 'breakthroughs.json'), fullJson, 'utf8');

  const indexKb = (Buffer.byteLength(indexJson, 'utf8') / 1024).toFixed(1);
  const fullKb = (Buffer.byteLength(fullJson, 'utf8') / 1024).toFixed(1);
  console.log(
    `✓ Compiled ${fullBreakthroughs.length} entries → public/data/index.json (${indexKb} kB vs. ${fullKb} kB full) + ${fullBreakthroughs.length} dossier files`
  );
}

buildData();
