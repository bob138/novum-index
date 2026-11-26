export const THEME_STORAGE_KEY = 'novum-index-theme-pref';
export const LEGACY_THEME_STORAGE_KEY = 'frontier-index-theme-pref';

export function getSystemTheme() {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // ignore matchMedia errors
  }
  return 'light';
}

export function getSavedThemePreference() {
  try {
    const saved =
      localStorage.getItem(THEME_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore storage errors
  }
  return null;
}

export function loadInitialTheme() {
  return getSavedThemePreference() || getSystemTheme();
}

export function applyTheme(theme, { persist = false } = {}) {
  document.documentElement.setAttribute('data-theme', theme);
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }
}

/**
 * Watches system color-scheme changes (when no manual preference is saved),
 * cross-tab localStorage updates, and bfcache pageshow restores so theme state
 * never drifts across pages, reloads, or browser Back/Forward navigation.
 */
export function subscribeThemeSync(onThemeChange) {
  if (window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (ev) => {
      if (getSavedThemePreference()) return;
      const next = ev.matches ? 'dark' : 'light';
      applyTheme(next);
      onThemeChange(next);
    };
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onSystemChange);
    } else if (typeof media.addListener === 'function') {
      media.addListener(onSystemChange);
    }
  }

  window.addEventListener('storage', (ev) => {
    if (ev.key !== THEME_STORAGE_KEY && ev.key !== LEGACY_THEME_STORAGE_KEY) return;
    const next = loadInitialTheme();
    applyTheme(next);
    onThemeChange(next);
  });

  window.addEventListener('pageshow', () => {
    const next = loadInitialTheme();
    applyTheme(next);
    onThemeChange(next);
  });
}
