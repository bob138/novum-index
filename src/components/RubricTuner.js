import { DIMENSIONS, WEIGHT_PRESETS, normalizeWeights } from '../scoring.js';

function matchingPresetId(weights) {
  for (const preset of WEIGHT_PRESETS) {
    const match = DIMENSIONS.every(
      (d) => Math.round(weights[d.key]) === Math.round(preset.weights[d.key])
    );
    if (match) return preset.id;
  }
  return null;
}

export function renderRubricTuner(weights, isOpen) {
  if (!isOpen) return '';
  const norm = normalizeWeights(weights);
  const activePreset = matchingPresetId(weights);

  return `
    <section class="rubric-panel" id="rubric-tuner-panel" aria-label="Impact ranking rubric tuner">
      <div class="rubric-panel__header">
        <div>
          <h2 class="rubric-panel__title">Customize the Impact Rubric</h2>
          <p class="rubric-panel__subtitle">
            Ranking scientific breakthroughs involves value judgments. Adjust the four dimension weights below to re-rank the index live and share your custom view.
          </p>
        </div>
        <div class="rubric-presets" role="group" aria-label="Weighting presets">
          ${WEIGHT_PRESETS.map(
            (p) => `
            <button
              type="button"
              class="preset-btn ${activePreset === p.id ? 'preset-btn--active' : ''}"
              id="preset-${p.id}"
              data-preset="${p.id}"
              title="${p.description}"
            >
              ${p.label}
            </button>
          `
          ).join('')}
        </div>
      </div>

      <div class="rubric-sliders">
        ${DIMENSIONS.map((d) => {
          const pct = Math.round(norm[d.key] * 100);
          return `
            <div class="rubric-slider">
              <div class="rubric-slider__head">
                <label class="rubric-slider__name" for="weight-${d.key}">${d.label}</label>
                <span class="rubric-slider__pct" id="weight-val-${d.key}">${pct}%</span>
              </div>
              <input
                type="range"
                id="weight-${d.key}"
                class="rubric-slider__range"
                data-weight-key="${d.key}"
                min="0"
                max="100"
                step="5"
                value="${weights[d.key]}"
              />
              <p class="rubric-slider__desc">${d.description}</p>
            </div>
          `;
        }).join('')}
      </div>

      <div class="rubric-panel__footer">
        <span>Weights automatically normalize to 100%. Every breakthrough's raw 0–100 sub-scores remain fixed and inspectable in its dossier.</span>
        <button type="button" class="nav-btn" id="copy-rubric-link-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span>Copy Shareable View Link</span>
        </button>
      </div>
    </section>
  `;
}
