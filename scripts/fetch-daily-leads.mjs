#!/usr/bin/env node
/**
 * Broad multi-source reconnaissance script for The Novum Index.
 * Sweeps open scientific & open-internet feeds (arXiv, bioRxiv/medRxiv, OpenAlex,
 * GitHub formal proofs/AI-science repos, Hacker News, and science/AI lab RSS feeds),
 * deduplicates against data/breakthroughs.json, and emits a Markdown candidate digest.
 *
 * Usage:
 *   node scripts/fetch-daily-leads.mjs [--days 3] [--json]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, '../data/breakthroughs.json');
const USER_AGENT = 'TheNovumIndexBot/1.0 (https://novumindex.org; MIT)';

const args = process.argv.slice(2);
const daysIdx = args.indexOf('--days');
const LOOKBACK_DAYS = Math.max(1, Math.min(30, Number(daysIdx >= 0 ? args[daysIdx + 1] : 3) || 3));
const JSON_OUTPUT = args.includes('--json');

const cutoffDate = new Date(Date.now() - LOOKBACK_DAYS * 86400000);
const cutoffIso = cutoffDate.toISOString().slice(0, 10);
const cutoffUnix = Math.floor(cutoffDate.getTime() / 1000);

function normalizeText(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadExistingLedger() {
  const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const urls = new Set();
  const titleTokens = [];

  for (const item of raw.breakthroughs || []) {
    for (const src of item.sources || []) {
      if (src.url) urls.add(src.url.replace(/\/+$/, '').toLowerCase());
    }
    const tokens = new Set(
      normalizeText(`${item.title} ${item.shortTitle}`)
        .split(' ')
        .filter((w) => w.length >= 4)
    );
    titleTokens.push({ id: item.id, title: item.shortTitle, tokens });
  }
  return { meta: raw.meta, count: (raw.breakthroughs || []).length, urls, titleTokens };
}

function findPossibleDuplicate(title, url, existing) {
  if (url && existing.urls.has(url.replace(/\/+$/, '').toLowerCase())) {
    return 'exact-url-match';
  }
  const candTokens = new Set(
    normalizeText(title)
      .split(' ')
      .filter((w) => w.length >= 4)
  );
  if (candTokens.size < 3) return null;

  for (const entry of existing.titleTokens) {
    let overlap = 0;
    for (const t of candTokens) {
      if (entry.tokens.has(t)) overlap++;
    }
    const ratio = overlap / Math.min(candTokens.size, Math.max(1, entry.tokens.size));
    if (overlap >= 4 && ratio >= 0.6) {
      return `similar-to:${entry.id}`;
    }
  }
  return null;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

function stripXml(str) {
  return String(str || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? stripXml(m[1]) : '';
}

const DISCOVERY_KEYWORDS_RE =
  /\b(conjecture|theorem|proof|disproof|counterexample|lean\s*4|coq|isabelle|formaliz|bound|algorithm|complexity|protein|de novo|enzyme|antibody|genome|drug|antibiotic|crystal|superconduct|material|catalyst|fusion|quantum|particle|exoplanet|galaxy|black hole|navier|riemann|erd[oö]s|ramsey|sat solver|neuro-?symbolic|alpha(fold|proof|evolve|geometry|tensor|dev))\b/i;

const AI_SIGNAL_RE =
  /\b(ai|artificial intelligence|llm|large language model|neural|deep learning|transformer|diffusion|reinforcement learning|machine learning|foundation model|autonomous|agent|claude|gpt|gemini|o1|o3|o4|alphafold|alphaproof|alphaevolve|lean\s*4|theorem prover|sat solver|automated reasoning|symbolic)\b/i;

// 1. arXiv multi-discipline sweep
async function fetchArxivLeads() {
  const queries = [
    {
      label: 'arXiv Math & Formal Proofs',
      q: 'cat:math.* AND (all:"Lean 4" OR all:"formal proof" OR all:"conjecture" OR all:"automated theorem" OR all:"large language model" OR all:"neuro-symbolic")',
    },
    {
      label: 'arXiv CS & Algorithms',
      q: '(cat:cs.LO OR cat:cs.DS OR cat:cs.CC OR cat:cs.AI) AND (all:"new bound" OR all:"counterexample" OR all:"open problem" OR all:"conjecture" OR all:"Lean 4" OR all:"faster algorithm")',
    },
    {
      label: 'arXiv Physics & Quantum',
      q: '(cat:quant-ph OR cat:physics.* OR cat:cond-mat.* OR cat:astro-ph.*) AND (all:"machine learning" OR all:"neural network" OR all:"AI" OR all:"language model") AND (all:"discovery" OR all:"novel" OR all:"breakthrough" OR all:"superconductor" OR all:"fusion")',
    },
    {
      label: 'arXiv Bio & Chem',
      q: '(cat:q-bio.* OR cat:physics.chem-ph) AND (all:"de novo" OR all:"protein design" OR all:"foundation model" OR all:"diffusion" OR all:"autonomous" OR all:"drug discovery")',
    },
  ];

  const leads = [];
  for (const item of queries) {
    const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(item.q)}&sortBy=submittedDate&sortOrder=descending&max_results=12`;
    try {
      const xml = await (await fetchWithTimeout(url)).text();
      const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
      for (const entry of entries) {
        const published = extractTag(entry, 'published').slice(0, 10);
        if (published && published < cutoffIso) continue;
        const title = extractTag(entry, 'title');
        const summary = extractTag(entry, 'summary');
        const link = extractTag(entry, 'id');
        const text = `${title} ${summary}`;
        if (!AI_SIGNAL_RE.test(text) || !DISCOVERY_KEYWORDS_RE.test(text)) continue;
        leads.push({
          source: item.label,
          date: published || cutoffIso,
          title,
          url: link,
          snippet: summary.slice(0, 220),
        });
      }
    } catch {
      // continue to next query
    }
  }
  return leads;
}

// 2. bioRxiv & medRxiv sweep
async function fetchBiorxivLeads() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const servers = ['biorxiv', 'medrxiv'];
  const leads = [];
  for (const srv of servers) {
    const url = `https://api.biorxiv.org/details/${srv}/${cutoffIso}/${todayIso}/0/json`;
    try {
      const data = await (await fetchWithTimeout(url)).json();
      for (const p of (data.collection || []).slice(0, 120)) {
        const text = `${p.title} ${p.abstract || ''}`;
        if (!AI_SIGNAL_RE.test(text) || !DISCOVERY_KEYWORDS_RE.test(text)) continue;
        leads.push({
          source: srv,
          date: p.date || todayIso,
          title: p.title,
          url: `https://doi.org/${p.doi}`,
          snippet: (p.abstract || '').slice(0, 220),
        });
      }
    } catch {
      // ignore timeout
    }
  }
  return leads.slice(0, 20);
}

// 3. OpenAlex peer-reviewed top journal sweep
async function fetchOpenAlexLeads() {
  const url =
    `https://api.openalex.org/works?filter=from_publication_date:${cutoffIso},type:article` +
    `&search=${encodeURIComponent('"artificial intelligence" OR "deep learning" OR "large language model" OR "neural network" OR "theorem prover"')}` +
    `&sort=cited_by_count:desc&per-page=25`;
  const leads = [];
  try {
    const data = await (await fetchWithTimeout(url)).json();
    for (const w of data.results || []) {
      const venue = w.primary_location?.source?.display_name || '';
      const title = w.display_name || '';
      if (!title) continue;
      if (!DISCOVERY_KEYWORDS_RE.test(`${title} ${venue}`)) continue;
      leads.push({
        source: venue ? `OpenAlex (${venue})` : 'OpenAlex',
        date: w.publication_date || cutoffIso,
        title,
        url: w.doi || w.id,
        snippet: venue ? `Published in ${venue}` : 'Peer-reviewed article',
      });
    }
  } catch {
    // ignore
  }
  return leads;
}

// 4. GitHub formal proofs & AI-for-science repos
async function fetchGithubLeads() {
  const queries = [
    `("lean 4" OR "lean4" OR "formal proof") ("conjecture" OR "theorem" OR "erdos" OR "disproof") pushed:>=${cutoffIso}`,
    `("ai for science" OR "de novo protein" OR "materials discovery") pushed:>=${cutoffIso} stars:>=5`,
  ];
  const leads = [];
  for (const q of queries) {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=updated&order=desc&per_page=10`;
    try {
      const data = await (await fetchWithTimeout(url, { headers: { Accept: 'application/vnd.github+json' } })).json();
      for (const r of data.items || []) {
        leads.push({
          source: `GitHub (${r.stargazers_count}★)`,
          date: (r.pushed_at || '').slice(0, 10),
          title: `${r.full_name}: ${r.description || 'Repository'}`,
          url: r.html_url,
          snippet: (r.description || '').slice(0, 200),
        });
      }
    } catch {
      // ignore rate limit
    }
  }
  return leads;
}

// 5. Hacker News Algolia (catches viral X/Twitter threads, lab blogs, Lean proofs, preprints)
async function fetchHackerNewsLeads() {
  const queries = [
    'Lean 4 proof OR conjecture',
    'AI scientific breakthrough OR discovery',
    'AlphaFold OR AlphaEvolve OR AlphaProof OR protein design',
  ];
  const leads = [];
  const seen = new Set();
  for (const q of queries) {
    const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(q)}&tags=story&numericFilters=created_at_i>${cutoffUnix},points>15&hitsPerPage=15`;
    try {
      const data = await (await fetchWithTimeout(url)).json();
      for (const h of data.hits || []) {
        if (seen.has(h.objectID)) continue;
        seen.add(h.objectID);
        if (!AI_SIGNAL_RE.test(h.title) && !DISCOVERY_KEYWORDS_RE.test(h.title)) continue;
        leads.push({
          source: `Hacker News (${h.points} pts)`,
          date: (h.created_at || '').slice(0, 10),
          title: h.title,
          url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
          snippet: `HN discussion: https://news.ycombinator.com/item?id=${h.objectID}`,
        });
      }
    } catch {
      // ignore
    }
  }
  return leads;
}

// 6. RSS Feeds (Science journals & AI labs)
async function fetchRssLeads() {
  const feeds = [
    { name: 'Quanta Magazine', url: 'https://www.quantamagazine.org/feed/' },
    { name: 'Nature News', url: 'https://www.nature.com/nature.rss' },
    { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
    { name: 'MIT News AI', url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml' },
  ];
  const leads = [];
  for (const feed of feeds) {
    try {
      const xml = await (await fetchWithTimeout(feed.url, {}, 10000)).text();
      const items = xml.match(/<(item|entry)[\s\S]*?<\/\1>/g) || [];
      for (const block of items.slice(0, 15)) {
        const title = extractTag(block, 'title');
        const desc = extractTag(block, 'description') || extractTag(block, 'summary');
        const linkMatch = block.match(/<link[^>]*href="([^"]+)"/i);
        const link = linkMatch ? linkMatch[1] : extractTag(block, 'link');
        const pubRaw =
          extractTag(block, 'pubDate') ||
          extractTag(block, 'published') ||
          extractTag(block, 'dc:date');
        const pubDate = pubRaw ? new Date(pubRaw) : null;
        if (pubDate && !Number.isNaN(pubDate.getTime()) && pubDate < cutoffDate) continue;
        const text = `${title} ${desc}`;
        if (!AI_SIGNAL_RE.test(text) && !DISCOVERY_KEYWORDS_RE.test(text)) continue;
        leads.push({
          source: feed.name,
          date:
            pubDate && !Number.isNaN(pubDate.getTime())
              ? pubDate.toISOString().slice(0, 10)
              : cutoffIso,
          title,
          url: link,
          snippet: desc.slice(0, 200),
        });
      }
    } catch {
      // ignore feed errors
    }
  }
  return leads;
}

async function main() {
  const existing = loadExistingLedger();
  const sources = [
    ['arXiv', fetchArxivLeads],
    ['bioRxiv/medRxiv', fetchBiorxivLeads],
    ['OpenAlex', fetchOpenAlexLeads],
    ['GitHub', fetchGithubLeads],
    ['Hacker News', fetchHackerNewsLeads],
    ['RSS Feeds', fetchRssLeads],
  ];

  const settled = await Promise.allSettled(sources.map(([, fn]) => fn()));
  const allLeads = [];
  const stats = [];

  settled.forEach((res, idx) => {
    const name = sources[idx][0];
    if (res.status === 'fulfilled') {
      stats.push(`${name}: ${res.value.length}`);
      allLeads.push(...res.value);
    } else {
      stats.push(`${name}: error`);
    }
  });

  // Deduplicate across sources & against data/breakthroughs.json
  const seenUrls = new Set();
  const freshLeads = [];
  let dupCount = 0;

  for (const lead of allLeads) {
    const normUrl = (lead.url || '').replace(/\/+$/, '').toLowerCase();
    if (normUrl && seenUrls.has(normUrl)) continue;
    if (normUrl) seenUrls.add(normUrl);

    const dupReason = findPossibleDuplicate(lead.title, lead.url, existing);
    if (dupReason) {
      dupCount++;
      continue;
    }
    freshLeads.push(lead);
  }

  freshLeads.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (JSON_OUTPUT) {
    console.log(
      JSON.stringify(
        {
          lookbackDays: LOOKBACK_DAYS,
          cutoffIso,
          ledgerCount: existing.count,
          ledgerLastUpdated: existing.meta?.lastUpdated,
          sourceCounts: stats,
          filteredDuplicates: dupCount,
          leads: freshLeads,
        },
        null,
        2
      )
    );
    return;
  }

  console.log(`# The Novum Index — Daily Discovery Reconnaissance`);
  console.log(`- Lookback: **${LOOKBACK_DAYS} days** (since \`${cutoffIso}\`)`);
  console.log(`- Existing ledger: **${existing.count}** breakthroughs (lastUpdated: \`${existing.meta?.lastUpdated}\`)`);
  console.log(`- Source sweep: ${stats.join(' · ')}`);
  console.log(`- Fresh unindexed leads: **${freshLeads.length}** (${dupCount} already-tracked matches skipped)\n`);

  if (freshLeads.length === 0) {
    console.log('_No fresh leads returned by open API feeds in this window — supplement with live web search._');
    return;
  }

  for (const [i, l] of freshLeads.slice(0, 60).entries()) {
    console.log(`${i + 1}. **[${l.source} · ${l.date}]** ${l.title}`);
    console.log(`   - URL: ${l.url}`);
    if (l.snippet) console.log(`   - Note: ${l.snippet}`);
  }
}

main().catch((err) => {
  console.error('Discovery sweep failed:', err);
  process.exit(1);
});
