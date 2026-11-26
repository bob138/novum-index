import { DISCIPLINE_META, escapeHtml, formatDate } from '../scoring.js';

export function renderLineageGraph(filteredItems, allRankedItems, opts = {}) {
  const chainDepth = opts.chainDepth === 'direct' ? 'direct' : 'full';
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
          <p>Reset filters to explore the cross-disciplinary influence graph connecting pre-2020 pioneers and 2020–2023 anchors to 2024–2026 breakthroughs.</p>
        </div>
      </div>
    `;
  }

  const allColumns = [
    {
      id: 'anchors',
      title: '≤ 2023 · PIONEERS',
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
            Traces how pre-2020 symbolic pioneers (Robbins, Adam, Pythagorean Triples), 2020–2023 neural anchors (Halicin, AlphaFold 2, AlphaTensor, FunSearch), and 2024–2025 architectures catalyzed the 2026 surge. Hover to trace chains; drag to pan or zoom; click any node for its dossier.
          </p>
        </div>

        <div class="viz-toolbar" aria-label="Influence graph controls">
          <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Lineage highlight depth">
            <button type="button" data-lineage-depth="full" aria-pressed="${chainDepth === 'full' ? 'true' : 'false'}" title="Trace all transitive upstream ancestors and downstream descendants">Full Chain</button>
            <button type="button" data-lineage-depth="direct" aria-pressed="${chainDepth === 'direct' ? 'true' : 'false'}" title="Highlight immediate 1-hop connections only">1-Hop</button>
          </div>
          <div class="viz-zoom-controls" role="group" aria-label="Graph zoom controls">
            <button type="button" class="viz-icon-btn" id="lineage-zoom-in" aria-label="Zoom in" title="Zoom in (+)">+</button>
            <button type="button" class="viz-icon-btn" id="lineage-zoom-out" aria-label="Zoom out" title="Zoom out (−)">−</button>
            <button type="button" class="viz-icon-btn viz-icon-btn--text" id="lineage-zoom-reset" title="Reset pan and zoom (or double-click)">
              <span id="lineage-zoom-label">100%</span>
            </button>
          </div>
        </div>
      </div>

      <div class="viz-legend">
        ${Object.entries(DISCIPLINE_META)
          .map(
            ([name, meta]) => `
          <span class="viz-legend__item viz-legend__item--interactive" data-lineage-legend-disc="${escapeHtml(name)}" title="Hover to highlight ${escapeHtml(name)}">
            <span class="viz-legend__dot" style="background: ${meta.colorVar};"></span>
            <span>${escapeHtml(name)}</span>
          </span>
        `
          )
          .join('')}
        <span class="viz-legend__item" style="margin-left: auto; color: var(--ink-muted);">
          <span>${nodes.length} nodes · ${relevantEdges.length} links</span>
        </span>
      </div>

      <div class="viz-stage viz-stage--interactive viz-stage--pan">
        <svg
          class="viz-svg"
          id="lineage-graph-svg"
          viewBox="0 0 ${width} ${height}"
          data-base-w="${width}"
          data-base-h="${height}"
          data-chain-depth="${chainDepth}"
          role="img"
          aria-label="Directed influence graph connecting enabling scientific breakthroughs from pre-2020 pioneers through 2026"
        >
          <defs>
            <marker id="lineage-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--border-strong)" />
            </marker>
            <marker id="lineage-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--accent-primary)" />
            </marker>
          </defs>

          <!-- Full-canvas pan hit target -->
          <rect x="0" y="0" width="${width}" height="${height}" fill="transparent" />

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
              pointer-events="none"
            >${col.title}</text>
            <line
              x1="${colX[idx].toFixed(1)}"
              y1="36"
              x2="${(colX[idx] + nodeW).toFixed(1)}"
              y2="36"
              class="viz-axis-line"
              opacity="0.55"
              pointer-events="none"
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
                  rawTitle.length > maxChars
                    ? `${rawTitle.slice(0, maxChars - 1).replace(/[,(\-–—\s]+$/, '')}…`
                    : rawTitle;
                return `
                <g
                  class="lineage-node"
                  tabindex="0"
                  role="button"
                  data-lineage-node="${escapeHtml(item.id)}"
                  data-discipline-name="${escapeHtml(item.discipline)}"
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

      <div class="viz-hint-bar">
        <span>Mode: <strong>${chainDepth === 'full' ? 'Full transitive chain' : '1-hop neighbors'}</strong></span>
        <span>Drag to pan · + / − or Ctrl/⌘ + scroll to zoom · Double-click to reset</span>
      </div>
    </div>
  `;
}

export function bindLineageInteractions(svg, rankedMap, callbacks = {}) {
  if (!svg) return;
  const { showTooltip, hideTooltip } = callbacks;
  const nodeEls = Array.from(svg.querySelectorAll('[data-lineage-node]'));
  const edgeEls = Array.from(svg.querySelectorAll('[data-edge-from]'));
  const chainDepth = svg.dataset.chainDepth || 'full';

  const outgoing = new Map();
  const incoming = new Map();
  for (const e of edgeEls) {
    const from = e.dataset.edgeFrom;
    const to = e.dataset.edgeTo;
    if (!outgoing.has(from)) outgoing.set(from, new Set());
    if (!incoming.has(to)) incoming.set(to, new Set());
    outgoing.get(from).add(to);
    incoming.get(to).add(from);
  }

  function collectChain(startId) {
    const ancestors = new Set();
    const descendants = new Set();

    if (chainDepth === 'direct') {
      for (const p of incoming.get(startId) || []) ancestors.add(p);
      for (const c of outgoing.get(startId) || []) descendants.add(c);
      return { ancestors, descendants };
    }

    const upQueue = [startId];
    while (upQueue.length) {
      const cur = upQueue.shift();
      for (const p of incoming.get(cur) || []) {
        if (!ancestors.has(p)) {
          ancestors.add(p);
          upQueue.push(p);
        }
      }
    }

    const downQueue = [startId];
    while (downQueue.length) {
      const cur = downQueue.shift();
      for (const c of outgoing.get(cur) || []) {
        if (!descendants.has(c)) {
          descendants.add(c);
          downQueue.push(c);
        }
      }
    }

    return { ancestors, descendants };
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

    const { ancestors, descendants } = collectChain(activeId);
    const inChain = new Set([activeId, ...ancestors, ...descendants]);

    nodeEls.forEach((n) => {
      const id = n.dataset.lineageNode;
      const isRel = inChain.has(id);
      n.classList.toggle('lineage-node--active', id === activeId);
      n.classList.toggle('lineage-node--dim', !isRel);
    });

    edgeEls.forEach((e) => {
      const from = e.dataset.edgeFrom;
      const to = e.dataset.edgeTo;
      const isRel =
        chainDepth === 'direct'
          ? from === activeId || to === activeId
          : (inChain.has(from) && inChain.has(to)) &&
            ((ancestors.has(from) && (ancestors.has(to) || to === activeId)) ||
              ((descendants.has(from) || from === activeId) && descendants.has(to)));

      e.classList.toggle('lineage-edge--active', isRel);
      e.classList.toggle('lineage-edge--dim', !isRel);
      e.setAttribute(
        'marker-end',
        isRel ? 'url(#lineage-arrow-active)' : 'url(#lineage-arrow)'
      );
    });
  }

  for (const node of nodeEls) {
    const id = node.dataset.lineageNode;
    const showNodeTip = (ev) => {
      if (!showTooltip || !rankedMap) return;
      const item = rankedMap.get(id);
      if (!item) return;
      const upCount = (incoming.get(id) || new Set()).size;
      const downCount = (outgoing.get(id) || new Set()).size;
      showTooltip(
        ev,
        `
          <div class="viz-tooltip__title">${escapeHtml(item.title)}</div>
          <div class="viz-tooltip__meta">${escapeHtml(item.discipline)} · ${formatDate(item.date)} · ${escapeHtml(item.aiParadigm)}</div>
          <div>
            <span class="viz-tooltip__score">Impact ${item.compositeScore.toFixed(1)}/100</span>
            · ${upCount} upstream · ${downCount} downstream
          </div>
        `
      );
    };

    node.addEventListener('mouseenter', (ev) => {
      highlight(id);
      showNodeTip(ev);
    });
    node.addEventListener('mousemove', showNodeTip);
    node.addEventListener('focus', () => highlight(id));
    node.addEventListener('mouseleave', () => {
      highlight(null);
      if (hideTooltip) hideTooltip();
    });
    node.addEventListener('blur', () => {
      highlight(null);
      if (hideTooltip) hideTooltip();
    });
  }

  // Legend discipline highlight
  const card = svg.closest('.viz-card');
  if (card) {
    card.querySelectorAll('[data-lineage-legend-disc]').forEach((el) => {
      const disc = el.dataset.lineageLegendDisc;
      el.addEventListener('mouseenter', () => {
        nodeEls.forEach((n) => {
          n.classList.toggle('lineage-node--dim', n.dataset.disciplineName !== disc);
        });
      });
      el.addEventListener('mouseleave', () => {
        nodeEls.forEach((n) => n.classList.remove('lineage-node--dim'));
      });
    });
  }

  // Smooth SVG viewBox Pan & Zoom
  const baseW = Number(svg.dataset.baseW) || 1240;
  const baseH = Number(svg.dataset.baseH) || 600;
  let vb = { x: 0, y: 0, w: baseW, h: baseH };

  const zoomLabelEl = document.getElementById('lineage-zoom-label');
  const zoomInBtn = document.getElementById('lineage-zoom-in');
  const zoomOutBtn = document.getElementById('lineage-zoom-out');
  const zoomResetBtn = document.getElementById('lineage-zoom-reset');

  function applyViewBox() {
    vb.w = Math.max(baseW / 3.2, Math.min(baseW, vb.w));
    vb.h = vb.w * (baseH / baseW);
    vb.x = Math.max(-baseW * 0.05, Math.min(baseW - vb.w + baseW * 0.05, vb.x));
    vb.y = Math.max(-baseH * 0.05, Math.min(baseH - vb.h + baseH * 0.05, vb.y));
    svg.setAttribute(
      'viewBox',
      `${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`
    );
    const pct = Math.round((baseW / vb.w) * 100);
    if (zoomLabelEl) zoomLabelEl.textContent = `${pct}%`;
    if (zoomOutBtn) zoomOutBtn.disabled = pct <= 101;
  }

  function zoomBy(factor, focusFracX = 0.5, focusFracY = 0.5) {
    const oldW = vb.w;
    const oldH = vb.h;
    const newW = Math.max(baseW / 3.2, Math.min(baseW, oldW * factor));
    const newH = newW * (baseH / baseW);
    vb.x += (oldW - newW) * focusFracX;
    vb.y += (oldH - newH) * focusFracY;
    vb.w = newW;
    vb.h = newH;
    applyViewBox();
  }

  function resetView() {
    vb = { x: 0, y: 0, w: baseW, h: baseH };
    applyViewBox();
  }

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => zoomBy(1 / 1.3));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => zoomBy(1.3));
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetView);
  applyViewBox();

  // Drag to pan
  let panState = null;
  svg.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0) return;
    panState = {
      startClientX: ev.clientX,
      startClientY: ev.clientY,
      startVbX: vb.x,
      startVbY: vb.y,
      active: false,
      pointerId: ev.pointerId,
    };
  });

  svg.addEventListener('pointermove', (ev) => {
    if (!panState) return;
    const dx = ev.clientX - panState.startClientX;
    const dy = ev.clientY - panState.startClientY;
    if (!panState.active && Math.hypot(dx, dy) > 6) {
      panState.active = true;
      if (hideTooltip) hideTooltip();
      try {
        svg.setPointerCapture(panState.pointerId);
      } catch {
        // ignore
      }
    }
    if (!panState.active) return;

    const rect = svg.getBoundingClientRect();
    const scaleX = vb.w / Math.max(1, rect.width);
    const scaleY = vb.h / Math.max(1, rect.height);
    vb.x = panState.startVbX - dx * scaleX;
    vb.y = panState.startVbY - dy * scaleY;
    applyViewBox();
  });

  const endPan = () => {
    if (!panState) return;
    const wasDragging = panState.active;
    panState = null;
    if (wasDragging) {
      svg.dataset.justDragged = '1';
      setTimeout(() => {
        delete svg.dataset.justDragged;
      }, 60);
    }
  };

  svg.addEventListener('pointerup', endPan);
  svg.addEventListener('pointercancel', endPan);

  // Double-click resets pan/zoom
  svg.addEventListener('dblclick', (ev) => {
    if (ev.target.closest('[data-lineage-node]')) return;
    resetView();
  });

  // Ctrl/Cmd + Scroll zooms smoothly around cursor
  svg.addEventListener(
    'wheel',
    (ev) => {
      if (!ev.ctrlKey && !ev.metaKey) return;
      ev.preventDefault();
      const rect = svg.getBoundingClientRect();
      const fx = Math.max(0, Math.min(1, (ev.clientX - rect.left) / Math.max(1, rect.width)));
      const fy = Math.max(0, Math.min(1, (ev.clientY - rect.top) / Math.max(1, rect.height)));
      zoomBy(ev.deltaY > 0 ? 1.25 : 1 / 1.25, fx, fy);
    },
    { passive: false }
  );
}
