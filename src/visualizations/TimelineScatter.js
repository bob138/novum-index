import { DISCIPLINE_META, escapeHtml, formatDate } from '../scoring.js';

function toTimestamp(iso) {
  return Date.parse(`${iso}T00:00:00Z`);
}

export function renderTimelineScatter(items) {
  if (items.length === 0) {
    return `
      <div class="viz-card">
        <div class="empty-state">
          <h3>No breakthroughs to plot</h3>
          <p>Adjust your active filters to visualize milestones across time and impact.</p>
        </div>
      </div>
    `;
  }

  const width = 1040;
  const height = 500;
  const margin = { top: 38, right: 42, bottom: 52, left: 58 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const hasPioneers = items.some((i) => i.date < '2020-01-01');
  const hasEarlyAnchors = items.some((i) => i.date >= '2020-01-01' && i.date < '2024-01-01');
  const hasWave = items.some((i) => i.date >= '2024-01-01');
  const hasModern = hasEarlyAnchors || hasWave;
  const splitPioneerZone = hasPioneers && hasModern;

  const pioneerZoneW = splitPioneerZone ? Math.round(innerW * 0.14) : 0;
  const pioneerGap = splitPioneerZone ? 16 : 0;
  const modernStartX = margin.left + pioneerZoneW + pioneerGap;
  const modernW = innerW - pioneerZoneW - pioneerGap;

  const pioneerMinTime = toTimestamp('1994-01-01');
  const pioneerMaxTime = toTimestamp('2019-06-01');

  const minTime = hasEarlyAnchors || splitPioneerZone
    ? toTimestamp('2019-11-01')
    : hasWave
      ? toTimestamp('2024-04-01')
      : toTimestamp('1994-01-01');
  const maxTime = hasWave
    ? toTimestamp('2026-12-20')
    : hasEarlyAnchors
      ? toTimestamp('2024-03-01')
      : toTimestamp('2019-06-01');

  const rawMinY = Math.min(...items.map((i) => i.compositeScore));
  const rawMaxY = Math.max(...items.map((i) => i.compositeScore));
  const minY = Math.max(40, Math.floor((rawMinY - 4) / 5) * 5);
  const maxY = Math.min(100, Math.ceil((rawMaxY + 2) / 5) * 5);
  const spanY = Math.max(10, maxY - minY);

  const scaleX = (iso) => {
    const t = toTimestamp(iso);
    if (splitPioneerZone) {
      if (iso < '2020-01-01') {
        const clamped = Math.max(pioneerMinTime, Math.min(pioneerMaxTime, t));
        return margin.left + ((clamped - pioneerMinTime) / (pioneerMaxTime - pioneerMinTime)) * pioneerZoneW;
      }
      return modernStartX + ((t - minTime) / (maxTime - minTime)) * modernW;
    }
    return margin.left + ((t - minTime) / (maxTime - minTime)) * innerW;
  };

  const scaleY = (score) => {
    return margin.top + innerH - ((score - minY) / spanY) * innerH;
  };

  const xTicks = !hasModern
    ? [
        { iso: '1996-10-10', label: '1996', major: true },
        { iso: '2005-01-01', label: '2005', major: false },
        { iso: '2009-04-03', label: '2009', major: true },
        { iso: '2016-05-03', label: '2016', major: true },
      ]
    : hasEarlyAnchors || splitPioneerZone
      ? hasWave
        ? [
            ...(splitPioneerZone
              ? [
                  { iso: '1996-10-10', label: '’96', major: false },
                  { iso: '2016-05-03', label: '’16', major: false },
                ]
              : []),
            { iso: '2020-01-01', label: '2020', major: true },
            { iso: '2021-01-01', label: '2021', major: true },
            { iso: '2022-01-01', label: '2022', major: true },
            { iso: '2023-01-01', label: '2023', major: true },
            { iso: '2024-01-01', label: '2024', major: true },
            { iso: '2025-01-01', label: '2025', major: true },
            { iso: '2026-01-01', label: '2026', major: true },
            { iso: '2026-11-25', label: 'Nov 26', major: false },
          ]
        : [
            ...(splitPioneerZone
              ? [{ iso: '2009-01-01', label: '1996–2016', major: false }]
              : []),
            { iso: '2020-01-01', label: '2020', major: true },
            { iso: '2021-01-01', label: '2021', major: true },
            { iso: '2022-01-01', label: '2022', major: true },
            { iso: '2023-01-01', label: '2023', major: true },
            { iso: '2024-01-01', label: '2024', major: true },
          ]
      : [
          { iso: '2024-05-01', label: 'May 2024', major: false },
          { iso: '2024-09-01', label: 'Sep 2024', major: false },
          { iso: '2025-01-01', label: 'Jan 2025', major: true },
          { iso: '2025-05-01', label: 'May 2025', major: false },
          { iso: '2025-09-01', label: 'Sep 2025', major: false },
          { iso: '2026-01-01', label: 'Jan 2026', major: true },
          { iso: '2026-05-01', label: 'May 2026', major: false },
          { iso: '2026-09-01', label: 'Sep 2026', major: false },
          { iso: '2026-12-01', label: 'Dec 2026', major: false },
        ];

  const yTicks = [];
  for (let y = minY; y <= maxY; y += 5) {
    yTicks.push(y);
  }

  const floodX1 = hasWave ? scaleX('2026-08-01') : null;
  const floodX2 = hasWave ? scaleX('2026-12-05') : null;
  const pioneerDividerX = splitPioneerZone ? margin.left + pioneerZoneW + pioneerGap / 2 : null;
  const anchorDividerX = (hasEarlyAnchors || splitPioneerZone) && hasWave ? scaleX('2024-01-15') : null;

  // Compute node positions + light deterministic jitter for tightly clustered items
  const seenCoords = new Map();
  const positioned = items.map((item) => {
    let cx = scaleX(item.date);
    let cy = scaleY(item.compositeScore);
    const bucket = `${Math.round(cx / 11)}_${Math.round(cy / 11)}`;
    const count = seenCoords.get(bucket) || 0;
    seenCoords.set(bucket, count + 1);
    if (count > 0) {
      const angle = count * 2.15;
      const dist = 9 + Math.min(8, Math.floor(count / 3) * 4);
      cx += Math.cos(angle) * dist;
      cy += Math.sin(angle) * dist;
    }

    const r =
      6.0 +
      (item.scores.ripple / 100) * 4.8 +
      (item.yearsUnsolved ? Math.min(3.5, item.yearsUnsolved / 45) : 0);

    cx = Math.max(margin.left + r + 2, Math.min(width - margin.right - r - 2, cx));
    cy = Math.max(margin.top + r + 2, Math.min(margin.top + innerH - r - 2, cy));

    return { item, cx, cy, r };
  });

  // Pick non-overlapping callout labels for pre-2020 pioneers, 2020–23 anchors & top wave items
  const prioritized = [
    ...positioned.filter((p) => p.item.date < '2020-01-01').slice(0, 3),
    ...positioned.filter((p) => p.item.isAnchor && p.item.date >= '2020-01-01').slice(0, 4),
    ...positioned.filter((p) => !p.item.isAnchor).slice(0, 12),
  ];
  const seenPriority = new Set();
  const labelCandidates = prioritized.filter((p) => {
    if (seenPriority.has(p.item.id)) return false;
    seenPriority.add(p.item.id);
    return true;
  });

  const placedLabels = [];
  for (const node of labelCandidates) {
    const cleanText = node.item.shortTitle
      .replace(' (Anchor)', '')
      .replace('Robbins Conjecture (EQP, 1996)', 'Robbins (1996)')
      .replace('Robot Scientist Adam (2009)', 'Adam (2009)')
      .replace(' (SAT)', ' (2016)');
    const labelW = cleanText.length * 6.3 + 12;
    const labelH = 15;
    const preferredRight = node.cx > width - 220;
    const candidates = preferredRight ? [true, false] : [false, true];

    for (const alignRight of candidates) {
      const lx = alignRight ? node.cx - node.r - 8 : node.cx + node.r + 8;
      const boxLeft = alignRight ? lx - labelW : lx;
      const boxTop = node.cy - labelH / 2;

      if (boxLeft < margin.left + 2 || boxLeft + labelW > width - margin.right - 2) {
        continue;
      }

      const overlapsLabel = placedLabels.some(
        (b) =>
          boxLeft < b.right + 4 &&
          boxLeft + labelW > b.left - 4 &&
          boxTop < b.bottom + 3 &&
          boxTop + labelH > b.top - 3
      );
      if (overlapsLabel) continue;

      const overlapsCircle = positioned.some((other) => {
        if (other.item.id === node.item.id) return false;
        const pad = other.r + 5;
        return (
          other.cx + pad > boxLeft &&
          other.cx - pad < boxLeft + labelW &&
          other.cy + pad > boxTop &&
          other.cy - pad < boxTop + labelH
        );
      });
      if (overlapsCircle) continue;

      placedLabels.push({
        id: node.item.id,
        text: cleanText,
        left: boxLeft,
        right: boxLeft + labelW,
        top: boxTop,
        bottom: boxTop + labelH,
        lx,
        ly: node.cy + 3.5,
        anchor: alignRight ? 'end' : 'start',
      });
      break;
    }
  }
  const labelMap = new Map(placedLabels.map((l) => [l.id, l]));

  return `
    <div class="viz-card">
      <div class="viz-card__header">
        <div>
          <h2 class="viz-card__title">AI Impact × Time Landscape</h2>
          <p class="viz-card__desc">
            Every breakthrough plotted by announcement date and live composite Impact Index—contrasting rare pre-2020 symbolic AI pioneers (◆) with the 2020–2023 deep learning inflection and dense 2024–2026 neural &amp; neuro-symbolic wave (●). Outer rings mark formally verified results.
          </p>
        </div>
      </div>

      <div class="viz-legend" aria-label="Chart legend">
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
        <span class="viz-legend__item" style="margin-left: auto;">
          <span style="display:inline-block;width:8px;height:8px;background:var(--ink-muted);transform:rotate(45deg);margin-right:2px;"></span>
          <span>Symbolic (&lt;2020)</span>
        </span>
        <span class="viz-legend__item">
          <span class="viz-legend__ring"></span>
          <span>Outer ring = Formally Verified</span>
        </span>
      </div>

      <div class="viz-stage">
        <svg
          class="viz-svg"
          id="timeline-scatter-svg"
          viewBox="0 0 ${width} ${height}"
          role="img"
          aria-label="Scatter plot of AI scientific breakthroughs by date and composite impact score"
        >
          <!-- Pre-2020 Symbolic Pioneers Compressed Band -->
          ${
            pioneerDividerX !== null
              ? `
            <rect
              x="${margin.left}"
              y="${margin.top}"
              width="${(pioneerDividerX - margin.left).toFixed(1)}"
              height="${innerH}"
              fill="var(--bg-surface-alt)"
              opacity="0.72"
              pointer-events="none"
            />
            <line
              x1="${pioneerDividerX.toFixed(1)}"
              y1="${margin.top}"
              x2="${pioneerDividerX.toFixed(1)}"
              y2="${margin.top + innerH}"
              stroke="var(--border-strong)"
              stroke-width="1.3"
              stroke-dasharray="3 3"
              pointer-events="none"
            />
            <text
              x="${(margin.left + (pioneerDividerX - margin.left) / 2).toFixed(1)}"
              y="${margin.top - 11}"
              text-anchor="middle"
              class="viz-annotation"
              pointer-events="none"
            >1996–2019 · Symbolic</text>
          `
              : ''
          }

          <!-- Subtle Divider between 2020-2023 Early Neural Anchors and 2024-2026 Wave -->
          ${
            anchorDividerX !== null
              ? `
            <rect
              x="${(pioneerDividerX ?? margin.left).toFixed(1)}"
              y="${margin.top}"
              width="${(anchorDividerX - (pioneerDividerX ?? margin.left)).toFixed(1)}"
              height="${innerH}"
              fill="var(--bg-surface-alt)"
              opacity="0.38"
              pointer-events="none"
            />
            <line
              x1="${anchorDividerX.toFixed(1)}"
              y1="${margin.top}"
              x2="${anchorDividerX.toFixed(1)}"
              y2="${margin.top + innerH}"
              stroke="var(--border-strong)"
              stroke-width="1.2"
              stroke-dasharray="4 4"
              pointer-events="none"
            />
            <text
              x="${((pioneerDividerX ?? margin.left) + (anchorDividerX - (pioneerDividerX ?? margin.left)) / 2).toFixed(1)}"
              y="${margin.top - 11}"
              text-anchor="middle"
              class="viz-annotation"
              pointer-events="none"
            >2020–23 · Early Neural</text>
            <text
              x="${(anchorDividerX + (width - margin.right - anchorDividerX) / 2).toFixed(1)}"
              y="${margin.top - 11}"
              text-anchor="middle"
              class="viz-annotation"
              pointer-events="none"
            >2024–2026 Neural &amp; Neuro-Symbolic Wave</text>
          `
              : ''
          }

          <!-- Shaded Autumn 2026 Acceleration Band -->
          ${
            floodX1 !== null && floodX2 !== null
              ? `
            <rect
              x="${floodX1.toFixed(1)}"
              y="${margin.top}"
              width="${Math.max(18, floodX2 - floodX1).toFixed(1)}"
              height="${innerH}"
              fill="var(--accent-warm-soft)"
              rx="4"
              pointer-events="none"
            />
            <text
              x="${(floodX1 + Math.max(18, floodX2 - floodX1) / 2).toFixed(1)}"
              y="${margin.top + 16}"
              text-anchor="middle"
              class="viz-annotation"
              pointer-events="none"
            >Q4 26 Surge</text>
          `
              : ''
          }

          <!-- Horizontal Grid Lines & Y Axis -->
          ${yTicks
            .map((val) => {
              const y = scaleY(val);
              return `
              <line x1="${margin.left}" y1="${y.toFixed(1)}" x2="${width - margin.right}" y2="${y.toFixed(1)}" class="viz-grid-line" pointer-events="none" />
              <text x="${margin.left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="viz-axis-label">${val}</text>
            `;
            })
            .join('')}

          <!-- Vertical Year Dividers & X Axis -->
          ${xTicks
            .map((t) => {
              const x = scaleX(t.iso);
              return `
              <line
                x1="${x.toFixed(1)}"
                y1="${margin.top}"
                x2="${x.toFixed(1)}"
                y2="${margin.top + innerH}"
                class="${t.major ? 'viz-axis-line' : 'viz-grid-line'}"
                opacity="${t.major ? '0.5' : '0.4'}"
                pointer-events="none"
              />
              <text x="${x.toFixed(1)}" y="${margin.top + innerH + 22}" text-anchor="middle" class="viz-axis-label">${t.label}</text>
            `;
            })
            .join('')}

          <!-- Axes Baseline -->
          <line x1="${margin.left}" y1="${margin.top + innerH}" x2="${width - margin.right}" y2="${margin.top + innerH}" class="viz-axis-line" pointer-events="none" />
          <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + innerH}" class="viz-axis-line" pointer-events="none" />

          <!-- Y Axis Title -->
          <text
            x="16"
            y="${margin.top + innerH / 2}"
            text-anchor="middle"
            transform="rotate(-90 16 ${margin.top + innerH / 2})"
            class="viz-axis-label"
          >COMPOSITE IMPACT INDEX (0–100)</text>

          <!-- Breakthrough Nodes -->
          ${positioned
            .slice()
            .reverse()
            .map(({ item, cx, cy, r }) => {
              const disc = DISCIPLINE_META[item.discipline];
              const isFormal = item.verificationStatus === 'Formally Verified';
              const isSymbolic = item.aiParadigm === 'Symbolic / Classical';
              const isDisputed =
                item.verificationStatus === 'Contested / Partial' ||
                item.verificationStatus === 'Preprint / Active Review';
              const lbl = labelMap.get(item.id);
              const dHalf = r * 1.12;
              const ringHalf = dHalf + 4.4;
              const diamondPoints = (h) =>
                `${cx.toFixed(1)},${(cy - h).toFixed(1)} ${(cx + h).toFixed(1)},${cy.toFixed(1)} ${cx.toFixed(1)},${(cy + h).toFixed(1)} ${(cx - h).toFixed(1)},${cy.toFixed(1)}`;

              return `
              <g
                class="scatter-node"
                tabindex="0"
                role="button"
                aria-label="${escapeHtml(item.title)}, score ${item.compositeScore.toFixed(1)}, ${formatDate(item.date)}"
                data-open-dossier="${escapeHtml(item.id)}"
                data-tooltip-id="${escapeHtml(item.id)}"
              >
                ${
                  isFormal
                    ? isSymbolic
                      ? `<polygon points="${diamondPoints(ringHalf)}" fill="none" stroke="${disc.colorVar}" stroke-width="1.5" stroke-linejoin="round" opacity="0.85" pointer-events="none" />`
                      : `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r + 3.8).toFixed(1)}" fill="none" stroke="${disc.colorVar}" stroke-width="1.5" opacity="0.85" pointer-events="none" />`
                    : ''
                }
                ${
                  isSymbolic
                    ? `<polygon
                        class="scatter-node__circle"
                        points="${diamondPoints(dHalf)}"
                        fill="${disc.colorVar}"
                        fill-opacity="0.9"
                        stroke="var(--bg-surface)"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />`
                    : `<circle
                        class="scatter-node__circle"
                        cx="${cx.toFixed(1)}"
                        cy="${cy.toFixed(1)}"
                        r="${r.toFixed(1)}"
                        fill="${disc.colorVar}"
                        fill-opacity="${isDisputed ? '0.62' : '0.88'}"
                        stroke="var(--bg-surface)"
                        stroke-width="1.5"
                        ${isDisputed ? 'stroke-dasharray="2.5 2"' : ''}
                      />`
                }
                ${
                  lbl
                    ? `<text x="${lbl.lx.toFixed(1)}" y="${lbl.ly.toFixed(1)}" text-anchor="${lbl.anchor}" class="scatter-node__label">${escapeHtml(lbl.text)}</text>`
                    : ''
                }
              </g>
            `;
            })
            .join('')}
        </svg>
      </div>
    </div>
  `;
}
