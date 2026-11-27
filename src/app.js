import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import { loadIndexDataset } from './dataLoader.js';
import { escapeHtml } from './scoring.js';
import { loadInitialTheme, applyTheme } from './theme.js';

const ROUTES = {
  index: {
    title: 'Novum Index — AI-Enabled Scientific Breakthroughs & Acceleration Curve',
    loader: () => import('./main.js'),
    mountKey: 'mountIndexPage',
  },
  models: {
    title: 'AI Systems & Model Rankings — Novum Index',
    loader: () => import('./models.js'),
    mountKey: 'mountModelsPage',
  },
  methodology: {
    title: 'Methodology — Novum Index',
    loader: () => import('./methodology.js'),
    mountKey: 'mountMethodologyPage',
  },
};

const moduleCache = new Map();
let dataset = null;
let activeRoute = null;
let activeCleanup = null;
let navToken = 0;

function resolveRoute(pathname) {
  const normalized = (pathname || '/').replace(/\/+$/, '') || '/';
  const lastSegment = normalized.split('/').pop() || '';
  if (lastSegment === 'models' || lastSegment === 'models.html') return 'models';
  if (lastSegment === 'methodology' || lastSegment === 'methodology.html') return 'methodology';
  if (normalized === '/' || lastSegment === 'index.html' || !lastSegment.includes('.')) {
    // Allow root and directory index paths (e.g. / or /repo/), but skip non-HTML files like /data/...
    if (normalized.includes('/data/') || normalized.includes('/assets/')) return null;
    if (lastSegment === '' || lastSegment === 'index.html') return 'index';
    // Also support subpath deploy roots like /novum-index
    if (!lastSegment.includes('.')) return 'index';
  }
  return null;
}

function loadRouteModule(route) {
  if (!ROUTES[route]) return Promise.reject(new Error(`Unknown route: ${route}`));
  if (!moduleCache.has(route)) {
    const promise = ROUTES[route].loader().catch((err) => {
      moduleCache.delete(route);
      throw err;
    });
    moduleCache.set(route, promise);
  }
  return moduleCache.get(route);
}

function prefetchRoute(route) {
  if (!route || !ROUTES[route] || moduleCache.has(route)) return;
  loadRouteModule(route).catch(() => {
    // non-fatal background prefetch
  });
}

function prefersReducedMotion() {
  try {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function applyScrollAfterNavigation(hash) {
  if (hash && hash !== '#top' && !hash.startsWith('#breakthrough/')) {
    const targetId = hash.slice(1);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      return;
    }
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

async function mountRoute(route, { animate = false, hash = '' } = {}) {
  const token = ++navToken;
  const [loadedDataset, mod] = await Promise.all([
    dataset ? Promise.resolve(dataset) : loadIndexDataset(),
    loadRouteModule(route),
  ]);
  if (token !== navToken) return;

  dataset = loadedDataset;
  const routeConfig = ROUTES[route];
  const mountFn = mod[routeConfig.mountKey];

  const performSwap = () => {
    if (activeCleanup) {
      try {
        activeCleanup();
      } catch {
        // ignore cleanup errors
      }
      activeCleanup = null;
    }
    document.title = routeConfig.title;
    activeRoute = route;
    activeCleanup = mountFn(dataset);
    applyScrollAfterNavigation(hash);
  };

  const canUseViewTransition =
    animate &&
    !prefersReducedMotion() &&
    typeof document.startViewTransition === 'function';

  if (canUseViewTransition) {
    try {
      const vt = document.startViewTransition(() => {
        performSwap();
      });
      await vt.finished.catch(() => {});
      return;
    } catch {
      // Fall back cleanly if a concurrent transition aborted
    }
  }

  performSwap();

  if (animate && !prefersReducedMotion()) {
    const main = document.querySelector('#app main');
    if (main) {
      main.classList.remove('novum-page-enter');
      // Force reflow so rapid repeated transitions replay smoothly
      void main.offsetWidth;
      main.classList.add('novum-page-enter');
    }
  }
}

async function navigateToUrl(targetUrl, { push = true } = {}) {
  const url = new URL(targetUrl, window.location.href);
  const targetRoute = resolveRoute(url.pathname);
  if (!targetRoute) {
    window.location.href = url.toString();
    return;
  }

  const sameRoute = targetRoute === activeRoute;
  const sameSearch = url.search === window.location.search;

  // Same route & same search with an in-page hash anchor (#top, #rubric, #breakthrough/...)
  if (sameRoute && sameSearch && url.hash) {
    if (url.hash === '#top') {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
      return;
    }
    if (url.hash.startsWith('#breakthrough/')) {
      window.location.hash = url.hash;
      return;
    }
    const anchorEl = document.getElementById(url.hash.slice(1));
    if (anchorEl) {
      anchorEl.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
      if (push) window.history.pushState({ route: targetRoute }, '', url.toString());
      return;
    }
  }

  if (sameRoute && sameSearch && !url.hash) {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
    return;
  }

  if (push) {
    window.history.pushState({ route: targetRoute }, '', url.toString());
  }

  await mountRoute(targetRoute, { animate: !sameRoute, hash: url.hash });
}

function getInternalRouteAnchor(target) {
  const anchor = target?.closest?.('a[href]');
  if (!anchor) return null;
  if (anchor.target && anchor.target !== '_self') return null;
  if (anchor.hasAttribute('download')) return null;

  const rawHref = anchor.getAttribute('href') || '';
  if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
    return null;
  }

  let url;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }

  if (url.origin !== window.location.origin) return null;
  const route = resolveRoute(url.pathname);
  if (!route) return null;

  return { anchor, url, route };
}

function attachRouterListeners() {
  // Prefetch target page chunk on hover or keyboard focus for 0ms click transitions
  const handlePrefetch = (e) => {
    const match = getInternalRouteAnchor(e.target);
    if (match && match.route !== activeRoute) {
      prefetchRoute(match.route);
    }
  };
  document.addEventListener('pointerenter', handlePrefetch, true);
  document.addEventListener('focusin', handlePrefetch, true);

  // Intercept internal cross-page clicks for zero-reload SPA transitions
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const match = getInternalRouteAnchor(e.target);
    if (!match) return;

    e.preventDefault();
    navigateToUrl(match.url.toString(), { push: true });
  });

  // Support browser Back / Forward smoothly
  window.addEventListener('popstate', () => {
    const nextRoute = resolveRoute(window.location.pathname) || 'index';
    mountRoute(nextRoute, {
      animate: nextRoute !== activeRoute,
      hash: window.location.hash,
    });
  });
}

async function boot() {
  applyTheme(loadInitialTheme());
  attachRouterListeners();

  const initialRoute = resolveRoute(window.location.pathname) || 'index';
  try {
    await mountRoute(initialRoute, { animate: false, hash: window.location.hash });
    // Warm up the other two lightweight route chunks when idle so switches are instant
    const warmOtherRoutes = () => {
      Object.keys(ROUTES).forEach((r) => {
        if (r !== activeRoute) prefetchRoute(r);
      });
    };
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(warmOtherRoutes, { timeout: 2000 });
    } else {
      window.setTimeout(warmOtherRoutes, 1200);
    }
  } catch (err) {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `<div class="container" style="padding:3rem 1rem;"><div class="empty-state"><h3>Unable to load Novum Index</h3><p>${escapeHtml(err.message)}</p></div></div>`;
    }
  }
}

boot();
