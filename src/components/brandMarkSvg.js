/**
 * Theme-aware inline brand mark SVG mirroring public/favicon.svg and Plate I.
 * Uses CSS design tokens so switching Paper <-> Dark updates the navbar emblem
 * natively alongside Plate I with zero image flash or filter distortion.
 */
export const BRAND_MARK_SVG = `<svg class="site-brand__mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="26" height="26" fill="none" aria-hidden="true">
  <rect class="bm-bg bm-frame" x="1.5" y="1.5" width="61" height="61" rx="13.5" stroke-width="2"/>
  <line class="bm-axis" x1="7.5" y1="32" x2="56.5" y2="32" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
  <line class="bm-axis" x1="29.5" y1="8.5" x2="29.5" y2="55.5" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
  <path class="bm-math" d="M11.86 25.55 L19.5 16.5 L27.14 25.55 M11.86 38.45 L19.5 47.5 L27.14 38.45" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round" opacity="0.86"/>
  <circle class="bm-math" cx="19.5" cy="32" r="10" stroke-width="2.65"/>
  <circle class="bm-cs" cx="24" cy="32" r="5.5" stroke-width="2.15" opacity="0.94"/>
  <path class="bm-cs" d="M29.5 32 Q34.5 23.2 42 19.5" stroke-width="1.85" stroke-linecap="round" opacity="0.82"/>
  <path class="bm-bio" d="M29.5 32 A12.5 12.5 0 0 1 54.5 32" stroke-width="2.75" stroke-linecap="round"/>
  <path class="bm-physics" d="M54.5 32 A12.5 12.5 0 0 1 29.5 32" stroke-width="2.75" stroke-linecap="round"/>
  <path class="bm-physics" d="M29.5 32 Q40.5 29.5 50.36 22.71" stroke-width="1.95" stroke-linecap="round" opacity="0.9"/>
  <path class="bm-chem" d="M29.5 32 Q40.5 34.5 50.36 41.29" stroke-width="2.1" stroke-linecap="round" opacity="0.94"/>
  <circle class="bm-math-fill" cx="19.5" cy="16.5" r="2.2"/>
  <circle class="bm-bio-fill" cx="42" cy="19.5" r="2.35"/>
  <circle class="bm-physics-fill" cx="54.5" cy="32" r="2.35"/>
  <circle class="bm-chem-fill" cx="50.36" cy="41.29" r="2.35"/>
  <path class="bm-bg" d="M29.5 25.3 L31.6 29.9 L36.2 32 L31.6 34.1 L29.5 38.7 L27.4 34.1 L22.8 32 L27.4 29.9 Z"/>
  <path class="bm-core" d="M29.5 26.7 L31.1 30.4 L34.8 32 L31.1 33.6 L29.5 37.3 L27.9 33.6 L24.2 32 L27.9 30.4 Z"/>
</svg>`;
