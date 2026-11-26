import { DISCIPLINE_META, escapeHtml } from '../scoring.js';

export function renderLineageGraph(filteredItems, allRankedItems) {
  const byId = new Map(allRankedItems.map((b) => [b.id, b]));
  const filteredSet = new Set(filteredItems.map((b) => b.id));

  const allEdges = [];
  for (const item of allRankedItems) {
    for (const targetId of item.enables || []) {
      if (byId.has(targetId)) {
        allEdges.push({ from: item.id, to: targetId });
      }
    }
  }

  const relevantEdges = allEdges.filter(
    (e) => filteredSet.has(e.from) || filteredSet.has(e.to)
  );
  const connectedIds = new Set();
  for (const e of relevantEdges) {
    connectedIds.add(e.from);
    connectedIds.add(e.to);
  }

  const nodes = allRankedItems.filter((b) => connectedIds.has(b.id));

  if (nodes.length === 0) {
    return `
      <div class="viz-card">
        <div class="empty-state">
          <h3>No lineage edges in current filter</h3>
          <p>Reset filters to explore the cross-disciplinary influence graph connecting 2020–2023 anchors to 2024–2026 breakthroughs.</p>
        </div>
      </div>
    `;
  }

  const allColumns = [
    {
      id: 'anchors',
      title: '2020–23 · ANCHORS',
      match: (n) => n.date < '2024-01-01',
      items: [],
    },
    {
      id: '2024',
      title: '2024 · FOUNDATIONS',
      match: (n) => n.date.startsWith('2024'),
      items: [],
    },
    {
      id: '2025',
      title: '2025 · INFLECTION',
      match: (n) => n.date.startsWith('2025'),
      items: [],
    },
    {
      id: '2026-early',
      title: 'Q1–Q3 2026 · SURGE',
      match: (n) => n.date >= '2026-01-01' && n.date < '2026-10-01',
      items: [],
    },
    {
      id: '2026-q4',
      title: 'Q4 2026 · FRONTIER',
      match: (n) => n.date >= '2026-10-01',
      items: [],
    },
  ];

  for (const n of nodes) {
    const col = allColumns.find((c) => c.match(n)) || allColumns[allColumns.length - 1];
    col.items.push(n);
  }

  const columns = allColumns.filter((c) => c.items.length > 0);

  const discOrder = [
    'Mathematics',
    'Computer Science & AI',
    'Physics & Quantum',
    'Biology & Medicine',
    'Chemistry & Materials',
  ];
  for (const col of columns) {
    col.items.sort((a, b) => {
      const da = discOrder.indexOf(a.discipline);
      const db = discOrder.indexOf(b.discipline);
      if (da !== db) return da - db;
      return b.compositeScore - a.compositeScore;
    });
  }

  const colCount = columns.length;
  const maxRows = Math.max(...columns.map((c) => c.items.length), 3);
  const width = colCount >= 5 ? 1240 : colCount >= 4 ? 1140 : 1040;
  const nodeW = colCount >= 5 ? 204 : colCount >= 4 ? 222 : 248;
  const nodeH = 52;
  const rowGap = 13;
  const topPad = 52;
  const bottomPad = 28;
  const height = Math.max(450, topPad + maxRows * (nodeH + rowGap) + bottomPad);

  const sidePad = 24;
  const usableW = width - sidePad * 2 - nodeW;
  const colX = columns.map((_, idx) =>
    colCount === 1 ? (width - nodeW) / 2 : sidePad + (idx / (colCount - 1)) * usableW
  );

  const nodePos = new Map();
  columns.forEach((col, cIdx) => {
    const totalH = col.items.length * nodeH + Math.max(0, col.items.length - 1) * rowGap;
    const startY = topPad + Math.max(0, (height - topPad - bottomPad - totalH) / 2);
    col.items.forEach((item, rIdx) => {
      nodePos.set(item.id, {
        x: colX[cIdx],
        y: startY + rIdx * (nodeH + rowGap),
        col: cIdx,
        item,
      });
    });
  });

  return `
    <div class="viz-card">
      <div class="viz-card__header">
        <div>
          <h2 class="viz-card__title">AI-for-Science Catalyst &amp; Influence Network</h2>
          <p class="viz-card__desc">
            Traces how foundational 2020–2023 AI milestones (AlphaFold 2, DeepMind Knot Theory, AlphaTensor, AlphaDev, GNoME, FunSearch) and 2024–2025 architectures catalyzed the 2026 surge. Hover any node to trace its upstream &amp; downstream chain; click to open its dossier.
          </p>
        </div>
      </div>

      <div class="viz-legend">
        ${Object.entries(DISCIPLINE_META)
          .map(
            ([name, meta]) => `
          <span class="viz-legend__item">
            <span class="viz-legend__dot" style="background: ${meta.colorVar};"></span>
            <span>${escapeHtml(name)}</span>
          </span>
        `
          )
          .join('')}
      </div>

      <div class="viz-stage">
        <svg
          class="viz-svg"
          id="lineage-graph-svg"
          viewBox="0 0 ${width} ${height}"
          role="img"
          aria-label="Directed influence graph connecting enabling scientific breakthroughs from 2020 anchors through 2026"
        >
          <defs>
            <marker id="lineage-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--border-strong)" />
            </marker>
            <marker id="lineage-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--accent-primary)" />
            </marker>
          </defs>

          <!-- Column Headers -->
          ${columns
            .map(
              (col, idx) => `
            <text
              x="${(colX[idx] + nodeW / 2).toFixed(1)}"
              y="26"
              text-anchor="middle"
              class="viz-axis-label"
              style="font-weight: 600; letter-spacing: 0.08em;"
            >${col.title}</text>
            <line
              x1="${colX[idx].toFixed(1)}"
              y1="36"
              x2="${(colX[idx] + nodeW).toFixed(1)}"
              y2="36"
              class="viz-axis-line"
              opacity="0.55"
            />
          `
            )
            .join('')}

          <!-- Edges -->
          <g id="lineage-edges-layer">
            ${relevantEdges
              .map((edge) => {
                const a = nodePos.get(edge.from);
                const b = nodePos.get(edge.to);
                if (!a || !b) return '';

                let d;
                if (a.col === b.col) {
                  const x = a.x + nodeW;
                  const y1 = a.y + nodeH / 2;
                  const y2 = b.y + nodeH / 2;
                  const bend = Math.min(44, Math.abs(y2 - y1) * 0.4 + 20);
                  d = `M ${x.toFixed(1)} ${y1.toFixed(1)} C ${(x + bend).toFixed(1)} ${y1.toFixed(1)}, ${(x + bend).toFixed(1)} ${y2.toFixed(1)}, ${(x + 3).toFixed(1)} ${y2.toFixed(1)}`;
                } else {
                  const x1 = a.x + nodeW;
                  const y1 = a.y + nodeH / 2;
                  const x2 = b.x - 4;
                  const y2 = b.y + nodeH / 2;
                  const midX = (x1 + x2) / 2;
                  d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${midX.toFixed(1)} ${y1.toFixed(1)}, ${midX.toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
                }

                return `
                  <path
                    class="lineage-edge"
                    data-edge-from="${escapeHtml(edge.from)}"
                    data-edge-to="${escapeHtml(edge.to)}"
                    d="${d}"
                    marker-end="url(#lineage-arrow)"
                  />
                `;
              })
              .join('')}
          </g>

          <!-- Nodes -->
          <g id="lineage-nodes-layer">
            ${nodes
              .map((item) => {
                const pos = nodePos.get(item.id);
                const disc = DISCIPLINE_META[item.discipline];
                const rawTitle = item.shortTitle.replace(' (Anchor)', '');
                const maxChars = colCount >= 5 ? 25 : 29;
                const displayTitle =
                  rawTitle.length > maxChars ? `${rawTitle.slice(0, maxChars - 1).trimEnd()}…` : rawTitle;
                return `
                <g
                  class="lineage-node"
                  tabindex="0"
                  role="button"
                  data-lineage-node="${escapeHtml(item.id)}"
                  data-open-dossier="${escapeHtml(item.id)}"
                  aria-label="${escapeHtml(item.title)} (Impact ${item.compositeScore.toFixed(1)})"
                >
                  <rect
                    class="lineage-node__box"
                    x="${pos.x.toFixed(1)}"
                    y="${pos.y.toFixed(1)}"
                    width="${nodeW}"
                    height="${nodeH}"
                    rx="7"
                  />
                  <rect
                    x="${pos.x.toFixed(1)}"
                    y="${pos.y.toFixed(1)}"
                    width="5"
                    height="${nodeH}"
                    rx="2.5"
                    fill="${disc.colorVar}"
                  />
                  <text
                    x="${(pos.x + 13).toFixed(1)}"
                    y="${(pos.y + 22).toFixed(1)}"
                    style="font-family: var(--font-sans); font-size: 11.5px; font-weight: 600; fill: var(--ink-primary);"
                  >${escapeHtml(displayTitle)}</text>
                  <text
                    x="${(pos.x + 13).toFixed(1)}"
                    y="${(pos.y + 40).toFixed(1)}"
                    style="font-family: var(--font-mono); font-size: 9.8px; fill: var(--ink-muted);"
                  >#${String(item.rank).padStart(2, '0')} · ${item.compositeScore.toFixed(1)} · ${escapeHtml(item.aiRole)}</text>
                </g>
              `;
              })
              .join('')}
          </g>
        </svg>
      </div>
    </div>
  `;
}

export function bindLineageInteractions(svg) {
  if (!svg) return;
  const nodeEls = Array.from(svg.querySelectorAll('[data-lineage-node]'));
  const edgeEls = Array.from(svg.querySelectorAll('[data-edge-from]'));

  const adjacency = new Map();
  for (const e of edgeEls) {
    const from = e.dataset.edgeFrom;
    const to = e.dataset.edgeTo;
    if (!adjacency.has(from)) adjacency.set(from, new Set());
    if (!adjacency.has(to)) adjacency.set(to, new Set());
    adjacency.get(from).add(to);
    adjacency.get(to).add(from);
  }

  function highlight(activeId) {
    if (!activeId) {
      nodeEls.forEach((n) => n.classList.remove('lineage-node--active', 'lineage-node--dim'));
      edgeEls.forEach((e) => {
        e.classList.remove('lineage-edge--active', 'lineage-edge--dim');
        e.setAttribute('marker-end', 'url(#lineage-arrow)');
      });
      return;
    }

    const neighbors = adjacency.get(activeId) || new Set();
    nodeEls.forEach((n) => {
      const id = n.dataset.lineageNode;
      const isRel = id === activeId || neighbors.has(id);
      n.classList.toggle('lineage-node--active', id === activeId);
      n.classList.toggle('lineage-node--dim', !isRel);
    });

    edgeEls.forEach((e) => {
      const isRel = e.dataset.edgeFrom === activeId || e.dataset.edgeTo === activeId;
      e.classList.toggle('lineage-edge--active', isRel);
      e.classList.toggle('lineage-edge--dim', !isRel);
      e.setAttribute(
        'marker-end',
        isRel ? 'url(#lineage-arrow-active)' : 'url(#lineage-arrow)'
      );
    });
  }

  for (const node of nodeEls) {
    node.addEventListener('mouseenter', () => highlight(node.dataset.lineageNode));
    node.addEventListener('focus', () => highlight(node.dataset.lineageNode));
    node.addEventListener('mouseleave', () => highlight(null));
    node.addEventListener('blur', () => highlight(null));
  }
}
