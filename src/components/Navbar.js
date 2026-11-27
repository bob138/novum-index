import { escapeHtml } from '../scoring.js';

const REPO_URL = 'https://github.com/bob138/novum-index';

/**
 * Stationary top editorial navigation bar shared across Index, AI Systems, and Methodology.
 * Keeps primary page links in identical left-to-right order on every page with an active-page
 * indicator and ensures all 3 pages remain directly reachable on mobile viewports.
 */
export function renderNavbar({ activePage, theme, editionLabel }) {
  const themeIcon =
    theme === 'dark'
      ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg><span>Paper</span>`
      : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span>Dark</span>`;

  const brandHref = activePage === 'index' ? '#top' : './';

  return `
    <header class="site-nav" role="banner">
      <div class="container site-nav__inner">
        <a href="${brandHref}" class="site-brand" ${activePage === 'index' ? 'id="brand-home"' : ''}>
          <img src="./favicon.svg" alt="" class="site-brand__mark" width="26" height="26" />
          <span class="site-brand__title">Novum Index</span>
          ${editionLabel ? `<span class="site-brand__edition">${escapeHtml(editionLabel)}</span>` : ''}
        </a>

        <nav class="site-nav__pages" aria-label="Primary pages">
          <a
            href="./"
            class="site-nav__link ${activePage === 'index' ? 'site-nav__link--active' : ''}"
            ${activePage === 'index' ? 'aria-current="page"' : ''}
            id="nav-index"
          >Index</a>
          <a
            href="./models.html"
            class="site-nav__link ${activePage === 'models' ? 'site-nav__link--active' : ''}"
            ${activePage === 'models' ? 'aria-current="page"' : ''}
            id="nav-models"
          ><span class="nav-label-full">AI Systems</span><span class="nav-label-short">Models</span></a>
          <a
            href="./methodology.html"
            class="site-nav__link ${activePage === 'methodology' ? 'site-nav__link--active' : ''}"
            ${activePage === 'methodology' ? 'aria-current="page"' : ''}
            id="nav-methodology"
          ><span class="nav-label-full">Methodology</span><span class="nav-label-short">Method</span></a>
        </nav>

        <div class="site-nav__actions">
          <button
            type="button"
            class="nav-btn"
            id="theme-toggle-btn"
            aria-label="Toggle color theme"
            title="Switch between archival paper and obsidian dark mode"
          >
            ${themeIcon}
          </button>
          <a
            href="${REPO_URL}/issues/new?template=submit-breakthrough.yml"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-btn nav-btn--primary"
            id="nav-submit-btn"
          >
            <span class="nav-submit-full">Submit</span>
            <span class="nav-submit-short">+</span>
          </a>
        </div>
      </div>
    </header>
  `;
}
