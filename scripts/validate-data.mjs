#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const metaPath = path.join(rootDir, 'data', 'meta.json');
const entriesRoot = path.join(rootDir, 'data', 'entries');

const DISCIPLINES = new Set([
  'Mathematics',
  'Computer Science & AI',
  'Physics & Quantum',
  'Biology & Medicine',
  'Chemistry & Materials',
]);

const AI_ROLES = new Set(['Autonomous AI', 'AI-Assisted']);
const AI_PARADIGMS = new Set([
  'Neural / Deep Learning',
  'Neuro-Symbolic',
  'Symbolic / Classical',
]);

const VERIFICATION_STATUSES = new Set([
  'Formally Verified',
  'Peer-Reviewed',
  'Preprint / Active Review',
  'Contested / Partial',
]);

const SOURCE_TYPES = new Set([
  'paper',
  'formal-verification',
  'announcement',
  'explainer',
  'code',
  'social-post',
]);

const SCORE_KEYS = ['foundational', 'ripple', 'verification', 'velocity'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const YEAR_RE = /^\d{4}$/;
const ID_RE = /^[a-z0-9-]+$/;
const URL_RE = /^https?:\/\/.+/;

function collectEntryFiles(dir) {
  if (!fs.existsSync(dir)) return [];
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

function validate() {
  const errors = [];

  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch (err) {
    console.error(`Failed to read/parse ${metaPath}:`, err.message);
    process.exit(1);
  }

  if (!meta || typeof meta !== 'object') {
    errors.push('data/meta.json must be an object.');
  } else {
    if (!DATE_RE.test(meta.lastUpdated || '')) {
      errors.push('data/meta.json: lastUpdated must be YYYY-MM-DD.');
    }
    const weights = meta.defaultWeights;
    if (!weights || typeof weights !== 'object') {
      errors.push('data/meta.json: missing defaultWeights.');
    } else {
      let sum = 0;
      for (const k of SCORE_KEYS) {
        if (typeof weights[k] !== 'number' || weights[k] < 0 || weights[k] > 100) {
          errors.push(`data/meta.json: defaultWeights.${k} must be a number in [0, 100].`);
        } else {
          sum += weights[k];
        }
      }
      if (Math.abs(sum - 100) > 0.001) {
        errors.push(`data/meta.json: defaultWeights must sum to 100 (got ${sum}).`);
      }
    }
  }

  const entryFiles = collectEntryFiles(entriesRoot);
  if (entryFiles.length === 0) {
    errors.push('data/entries/ must contain at least one breakthrough JSON file.');
  }

  const breakthroughs = [];
  const ids = new Set();

  for (const filePath of entryFiles) {
    const relPath = path.relative(rootDir, filePath);
    let item;
    try {
      item = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      errors.push(`${relPath}: invalid JSON (${err.message})`);
      continue;
    }

    const expectedId = path.basename(filePath, '.json');
    const parentYear = path.basename(path.dirname(filePath));
    const ctx = `${relPath} (${item?.id || 'unknown'})`;

    if (!ID_RE.test(item.id || '')) {
      errors.push(`${ctx}: id must match ^[a-z0-9-]+$`);
    } else {
      if (item.id !== expectedId) {
        errors.push(`${ctx}: filename "${expectedId}.json" must match id "${item.id}"`);
      }
      if (ids.has(item.id)) {
        errors.push(`${ctx}: duplicate id "${item.id}"`);
      } else {
        ids.add(item.id);
      }
    }

    if (!item.title || item.title.length < 5) errors.push(`${ctx}: title too short`);
    if (!item.shortTitle || item.shortTitle.length > 48) {
      errors.push(`${ctx}: shortTitle must be 1–48 chars`);
    }
    if (!DATE_RE.test(item.date || '')) {
      errors.push(`${ctx}: date must be YYYY-MM-DD`);
    } else if (!YEAR_RE.test(parentYear) || !item.date.startsWith(parentYear)) {
      errors.push(
        `${ctx}: must live in directory data/entries/${item.date.slice(0, 4)}/ (found in "${parentYear}/")`
      );
    }

    if (!DISCIPLINES.has(item.discipline)) errors.push(`${ctx}: invalid discipline "${item.discipline}"`);
    if (!AI_ROLES.has(item.aiRole)) {
      errors.push(`${ctx}: invalid aiRole "${item.aiRole}" (must be Autonomous AI or AI-Assisted)`);
    }
    if (!AI_PARADIGMS.has(item.aiParadigm)) {
      errors.push(`${ctx}: invalid aiParadigm "${item.aiParadigm}"`);
    }
    if (typeof item.aiSystem !== 'string' || item.aiSystem.trim().length < 2) {
      errors.push(`${ctx}: aiSystem must be a non-empty string identifying the AI model or architecture`);
    }
    if (!VERIFICATION_STATUSES.has(item.verificationStatus)) {
      errors.push(`${ctx}: invalid verificationStatus "${item.verificationStatus}"`);
    }
    if (
      item.yearsUnsolved !== undefined &&
      item.yearsUnsolved !== null &&
      (!Number.isInteger(item.yearsUnsolved) || item.yearsUnsolved < 0)
    ) {
      errors.push(`${ctx}: yearsUnsolved must be a non-negative integer or null`);
    }
    if (
      item.aiTimeToSolve !== undefined &&
      item.aiTimeToSolve !== null &&
      (typeof item.aiTimeToSolve !== 'string' ||
        item.aiTimeToSolve.trim().length < 2 ||
        item.aiTimeToSolve.length > 48)
    ) {
      errors.push(`${ctx}: aiTimeToSolve must be a string (2–48 chars) or null`);
    }
    if (!Array.isArray(item.subfields) || item.subfields.length === 0) {
      errors.push(`${ctx}: subfields must be a non-empty array`);
    }
    if (!item.whyItMatters || item.whyItMatters.length < 20 || item.whyItMatters.length > 240) {
      errors.push(`${ctx}: whyItMatters must be 20–240 chars`);
    }
    if (!item.summary || item.summary.length < 40) {
      errors.push(`${ctx}: summary must be >= 40 chars`);
    }
    if (!Array.isArray(item.technicalHighlights) || item.technicalHighlights.length === 0) {
      errors.push(`${ctx}: technicalHighlights must be a non-empty array`);
    }
    if (typeof item.caveats !== 'string') {
      errors.push(`${ctx}: caveats must be a string`);
    }
    if (!Array.isArray(item.contributors) || item.contributors.length === 0) {
      errors.push(`${ctx}: contributors must be a non-empty array`);
    }
    if (!Array.isArray(item.institutions) || item.institutions.length === 0) {
      errors.push(`${ctx}: institutions must be a non-empty array`);
    }

    for (const k of SCORE_KEYS) {
      const val = item.scores?.[k];
      if (typeof val !== 'number' || val < 0 || val > 100) {
        errors.push(`${ctx}: scores.${k} must be a number in [0, 100]`);
      }
      if (typeof item.scoreRationale?.[k] !== 'string' || item.scoreRationale[k].length < 8) {
        errors.push(`${ctx}: scoreRationale.${k} must be a descriptive string`);
      }
    }

    if (item.isAnchor !== undefined && typeof item.isAnchor !== 'boolean') {
      errors.push(`${ctx}: isAnchor must be a boolean if provided`);
    }

    if (!Array.isArray(item.sources) || item.sources.length === 0) {
      errors.push(`${ctx}: sources must be a non-empty array`);
    } else {
      for (const [sIdx, src] of item.sources.entries()) {
        if (!src.label) errors.push(`${ctx}.sources[${sIdx}]: missing label`);
        if (!URL_RE.test(src.url || '')) errors.push(`${ctx}.sources[${sIdx}]: invalid url "${src.url}"`);
        if (!SOURCE_TYPES.has(src.type)) errors.push(`${ctx}.sources[${sIdx}]: invalid type "${src.type}"`);
      }
    }

    breakthroughs.push(item);
  }

  // Verify lineage references resolve to existing breakthrough IDs
  for (const item of breakthroughs) {
    if (Array.isArray(item.enables)) {
      for (const targetId of item.enables) {
        if (!ids.has(targetId)) {
          errors.push(`breakthrough "${item.id}" enables unknown id "${targetId}"`);
        }
        if (targetId === item.id) {
          errors.push(`breakthrough "${item.id}" cannot enable itself`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} error(s):`);
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  const anchorCount = breakthroughs.filter((b) => b.isAnchor).length;
  console.log(
    `✓ Validated ${breakthroughs.length} breakthroughs (${anchorCount} historical calibration anchors) in data/entries/ (lastUpdated: ${meta.lastUpdated})`
  );
}

validate();
