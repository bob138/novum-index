/**
 * Shared client-side data loader for Novum Index.
 * Fetches the lightweight compiled index once (/data/index.json) and lazy-loads
 * full per-breakthrough dossiers (/data/dossiers/<id>.json) on demand with in-memory caching.
 */

let indexPromise = null;
const dossierCache = new Map();
const dossierInFlight = new Map();

export function loadIndexDataset() {
  if (!indexPromise) {
    indexPromise = fetch('./data/index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load index dataset (HTTP ${res.status})`);
        return res.json();
      })
      .catch((err) => {
        indexPromise = null;
        throw err;
      });
  }
  return indexPromise;
}

export function getCachedDossierDetail(id) {
  return dossierCache.get(id) || null;
}

export function loadDossierDetail(id) {
  if (!id) return Promise.resolve(null);
  if (dossierCache.has(id)) return Promise.resolve(dossierCache.get(id));
  if (dossierInFlight.has(id)) return dossierInFlight.get(id);

  const req = fetch(`./data/dossiers/${encodeURIComponent(id)}.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load dossier "${id}" (HTTP ${res.status})`);
      return res.json();
    })
    .then((detail) => {
      dossierCache.set(id, detail);
      dossierInFlight.delete(id);
      return detail;
    })
    .catch((err) => {
      dossierInFlight.delete(id);
      throw err;
    });

  dossierInFlight.set(id, req);
  return req;
}

export function prefetchDossierDetail(id) {
  if (!id || dossierCache.has(id) || dossierInFlight.has(id)) return;
  loadDossierDetail(id).catch(() => {
    // non-fatal prefetch failure
  });
}
