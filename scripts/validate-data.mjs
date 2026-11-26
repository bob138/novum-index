#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, '../data/breakthroughs.json');

const DISCIPLINES = new Set([
  'Mathematics',
  'Computer Science & AI',
  'Physics & Quantum',
  'Biology & Medicine',
  'Chemistry & Materials',
]);

const AI_ROLES = new Set(['Autonomous AI', 'AI-Assisted', 'Human']);

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
]);

const SCORE_KEYS = ['foundational', 'ripple', 'verification', 'velocity'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^[a-z0-9-]+$/;
const URL_RE = /^https?:\/\/.+/;

function validate() {
  const errors = [];
  let raw;
  try {
    raw = fs.readFileSync(dataPath, 'utf8');
  } catch (err) {
    console.error(`Failed to read ${dataPath}:`, err.message);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Invalid JSON in data/breakthroughs.json:', err.message);
    process.exit(1);
  }

  if (!data.meta || typeof data.meta !== 'object') {
    errors.push('Missing top-level "meta" object.');
  } else {
    if (!DATE_RE.test(data.meta.lastUpdated || '')) {
      errors.push('meta.lastUpdated must be YYYY-MM-DD.');
    }
    const weights = data.meta.defaultWeights;
    if (!weights || typeof weights !== 'object') {
      errors.push('Missing meta.defaultWeights.');
    } else {
      let sum = 0;
      for (const k of SCORE_KEYS) {
        if (typeof weights[k] !== 'number' || weights[k] < 0 || weights[k] > 100) {
          errors.push(`meta.defaultWeights.${k} must be a number in [0, 100].`);
        } else {
          sum += weights[k];
        }
      }
      if (Math.abs(sum - 100) > 0.001) {
        errors.push(`meta.defaultWeights must sum to 100 (got ${sum}).`);
      }
    }
  }

  if (!Array.isArray(data.breakthroughs) || data.breakthroughs.length === 0) {
    errors.push('breakthroughs must be a non-empty array.');
  } else {
    const ids = new Set();
    for (const [idx, item] of data.breakthroughs.entries()) {
      const ctx = `breakthroughs[${idx}] (${item?.id || 'unknown'})`;
      if (!ID_RE.test(item.id || '')) {
        errors.push(`${ctx}: id must match ^[a-z0-9-]+$`);
      } else if (ids.has(item.id)) {
        errors.push(`${ctx}: duplicate id "${item.id}"`);
      } else {
        ids.add(item.id);
      }

      if (!item.title || item.title.length < 5) errors.push(`${ctx}: title too short`);
      if (!item.shortTitle || item.shortTitle.length > 48) {
        errors.push(`${ctx}: shortTitle must be 1–48 chars`);
      }
      if (!DATE_RE.test(item.date || '')) errors.push(`${ctx}: date must be YYYY-MM-DD`);
      if (!DISCIPLINES.has(item.discipline)) errors.push(`${ctx}: invalid discipline "${item.discipline}"`);
      if (!AI_ROLES.has(item.aiRole)) errors.push(`${ctx}: invalid aiRole "${item.aiRole}"`);
      if (!VERIFICATION_STATUSES.has(item.verificationStatus)) {
        errors.push(`${ctx}: invalid verificationStatus "${item.verificationStatus}"`);
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
    }

    // Verify lineage references resolve to existing breakthrough IDs
    for (const item of data.breakthroughs) {
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
  }

  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} error(s):`);
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  const anchorCount = data.breakthroughs.filter((b) => b.isAnchor).length;
  console.log(
    `✓ Validated ${data.breakthroughs.length} breakthroughs (${anchorCount} historical calibration anchors) in data/breakthroughs.json (lastUpdated: ${data.meta.lastUpdated})`
  );
}

validate();
