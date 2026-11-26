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

  const hasAnchors = items.some((i) => i.date < '2024-01-01');
  const hasWave = items.some((i) => i.date >= '2024-01-01');

  const minTime = hasAnchors ? toTimestamp('2020-08-01') : toTimestamp('2024-04-01');
  const maxTime = hasWave ? toTimestamp('2026-12-20') : toTimestamp('2024-03-01');

  const rawMinY = Math.min(...items.map((i) => i.compositeScore));
  const rawMaxY = Math.max(...items.map((i) => i.compositeScore));
  const minY = Math.max(40, Math.floor((rawMinY - 4) / 5) * 5);
  const maxY = Math.min(100, Math.ceil((rawMaxY + 2) / 5) * 5);
  const spanY = Math.max(10, maxY - minY);

  const scaleX = (iso) => {
    const t = toTimestamp(iso);
    return margin.left + ((t - minTime) / (maxTime - minTime)) * innerW;
  };

  const scaleY = (score) => {
    return margin.top + innerH - ((score - minY) / spanY) * innerH;
  };

  const xTicks = hasAnchors
    ? hasWave
      ? [
          { iso: '2021-01-01', label: '2021', major: true },
          { iso: '2022-01-01', label: '2022', major: true },
          { iso: '2023-01-01', label: '2023', major: true },
          { iso: '2024-01-01', label: '2024', major: true },
          { iso: '2025-01-01', label: '2025', major: true },
          { iso: '2026-01-01', label: '2026', major: true },
          { iso: '2026-11-25', label: 'Nov 26', major: false },
        ]
      : [
          { iso: '2020-11-01', label: 'Nov 2020', major: false },
          { iso: '2021-07-01', label: 'Jul 2021', major: false },
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
  const anchorDividerX = hasAnchors && hasWave ? scaleX('2024-02-01') : null;

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
      cx += Math.cos(angle) * 10;
      cy += Math.sin(angle) * 10;
    }

    const r =
      6.2 +
      (item.scores.ripple / 100) * 5.2 +
      (item.yearsUnsolved ? Math.min(3.8, item.yearsUnsolved / 42) : 0);
    return { item, cx, cy, r };
  });

  // Pick non-overlapping callout labels for highest-ranked & anchor items
  const prioritized = [
    ...positioned.filter((p) => p.item.isAnchor).slice(0, 4),
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
    const cleanText = node.item.shortTitle.replace(' (Anchor)', '');
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
          <h2 class="viz-card__title">Impact × Time Landscape</h2>
          <p class="viz-card__desc">
            Every breakthrough plotted by announcement date and live composite Impact Index—showing the compression from isolated 2020–2023 landmarks into the 2025–2026 flood. Circle size reflects cross-field ripple &amp; problem age; outer rings mark formally verified results.
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
          aria-label="Scatter plot of scientific breakthroughs by date and composite impact score"
        >
          <!-- Subtle Divider between 2020-2023 Anchors and 2024-2026 Wave -->
          ${
            anchorDividerX !== null
              ? `
            <rect
              x="${margin.left}"
              y="${margin.top}"
              width="${(anchorDividerX - margin.left).toFixed(1)}"
              height="${innerH}"
              fill="var(--bg-surface-alt)"
              opacity="0.45"
            />
            <line
              x1="${anchorDividerX.toFixed(1)}"
              y1="${margin.top}"
              x2="${anchorDividerX.toFixed(1)}"
              y2="${margin.top + innerH}"
              stroke="var(--border-strong)"
              stroke-width="1.2"
              stroke-dasharray="4 4"
            />
            <text
              x="${(margin.left + (anchorDividerX - margin.left) / 2).toFixed(1)}"
              y="${margin.top - 11}"
              text-anchor="middle"
              class="viz-annotation"
            >2020–2023 Calibration Anchors</text>
            <text
              x="${(anchorDividerX + (width - margin.right - anchorDividerX) / 2).toFixed(1)}"
              y="${margin.top - 11}"
              text-anchor="middle"
              class="viz-annotation"
            >2024–2026 Acceleration Wave</text>
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
            />
            <text
              x="${(floodX1 + Math.max(18, floodX2 - floodX1) / 2).toFixed(1)}"
              y="${margin.top + 16}"
              text-anchor="middle"
              class="viz-annotation"
            >Q4 26 Surge</text>
          `
              : ''
          }

          <!-- Horizontal Grid Lines & Y Axis -->
          ${yTicks
            .map((val) => {
              const y = scaleY(val);
              return `
              <line x1="${margin.left}" y1="${y.toFixed(1)}" x2="${width - margin.right}" y2="${y.toFixed(1)}" class="viz-grid-line" />
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
              />
              <text x="${x.toFixed(1)}" y="${margin.top + innerH + 22}" text-anchor="middle" class="viz-axis-label">${t.label}</text>
            `;
            })
            .join('')}

          <!-- Axes Baseline -->
          <line x1="${margin.left}" y1="${margin.top + innerH}" x2="${width - margin.right}" y2="${margin.top + innerH}" class="viz-axis-line" />
          <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + innerH}" class="viz-axis-line" />

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
              const isDisputed =
                item.verificationStatus === 'Contested / Partial' ||
                item.verificationStatus === 'Preprint / Active Review';
              const lbl = labelMap.get(item.id);

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
                    ? `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r + 3.8).toFixed(1)}" fill="none" stroke="${disc.colorVar}" stroke-width="1.5" opacity="0.85" />`
                    : ''
                }
                <circle
                  class="scatter-node__circle"
                  cx="${cx.toFixed(1)}"
                  cy="${cy.toFixed(1)}"
                  r="${r.toFixed(1)}"
                  fill="${disc.colorVar}"
                  fill-opacity="${isDisputed ? '0.62' : '0.88'}"
                  stroke="var(--bg-surface)"
                  stroke-width="1.5"
                  ${isDisputed ? 'stroke-dasharray="2.5 2"' : ''}
                />
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
