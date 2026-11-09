import { ColorThemeVars, COLOR_THEMES, getColorThemeById } from '@/shared/themes';

/**
 * Color theme engine: applies preset palettes as inline CSS variables on
 * <html>, which outrank the stylesheet defaults (the WPEG brand palette).
 * `null` means the WPEG default; the managed properties are then removed and
 * the stylesheet owns the tokens again. Presets are mode-aware: flipping the
 * `dark` class re-applies the matching palette via a MutationObserver.
 */

const STORAGE_KEY = 'color-theme';

/** Inline properties managed by the engine (mapping follows the token layer). */
const MANAGED_PROPERTIES = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--border',
  '--input',
  '--ring',
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
  '--sidebar',
  '--sidebar-foreground',
  '--sidebar-primary',
  '--sidebar-primary-foreground',
  '--sidebar-accent',
  '--sidebar-accent-foreground',
  '--sidebar-border',
  '--sidebar-ring',
] as const;

type Listener = () => void;

let currentId: string | null | undefined;
const listeners = new Set<Listener>();
let observer: MutationObserver | null = null;

function getVarsForMode(vars: ColorThemeVars): Map<string, string> {
  const map = new Map<string, string>([
    ['--background', vars.background],
    ['--foreground', vars.foreground],
    ['--card-foreground', vars.foreground],
    ['--popover-foreground', vars.foreground],
    ['--card', vars.card],
    ['--popover', vars.card],
    ['--primary', vars.primary],
    ['--ring', vars.primary],
    ['--sidebar-primary', vars.primary],
    ['--sidebar-ring', vars.primary],
    ['--primary-foreground', vars.primaryForeground],
    ['--sidebar-primary-foreground', vars.primaryForeground],
    ['--secondary', vars.secondary],
    ['--secondary-foreground', vars.foreground],
    ['--muted', vars.muted],
    ['--sidebar-accent', vars.muted],
    ['--muted-foreground', vars.mutedForeground],
    ['--accent', vars.accent],
    ['--accent-foreground', vars.accentForeground],
    ['--border', vars.border],
    ['--input', vars.border],
    ['--sidebar-border', vars.border],
    ['--sidebar', vars.card],
    ['--sidebar-foreground', vars.foreground],
    ['--sidebar-accent-foreground', vars.foreground],
  ]);
  vars.charts.forEach((chart, index) => {
    map.set(`--chart-${index + 1}`, chart);
  });
  return map;
}

function removeThemeFromDom(): void {
  const root = document.documentElement;
  for (const property of MANAGED_PROPERTIES) {
    root.style.removeProperty(property);
  }
  root.removeAttribute('data-basic-theme');
}

function applyThemeToDom(id: string): void {
  const theme = getColorThemeById(id);
  if (!theme) {
    removeThemeFromDom();
    return;
  }
  const dark = document.documentElement.classList.contains('dark');
  const vars = getVarsForMode(dark ? theme.darkVars : theme.lightVars);
  const root = document.documentElement;
  for (const [property, value] of vars) {
    root.style.setProperty(property, value);
  }
  // The Basic preset strips effects globally (see index.css).
  if (id === 'basic') {
    root.setAttribute('data-basic-theme', '');
  } else {
    root.removeAttribute('data-basic-theme');
  }
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** Reads persisted state on first use and installs the mode observer once. */
function initialize(): string | null {
  if (currentId !== undefined) return currentId;
  currentId = null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null && getColorThemeById(stored) !== null) {
      currentId = stored;
    }
  } catch {
    // Storage unavailable; the in-memory default (WPEG) stands.
  }
  if (currentId !== null) {
    applyThemeToDom(currentId);
  }
  // Re-apply the active preset whenever light/dark mode flips.
  observer = new MutationObserver((records) => {
    const classChanged = records.some((record) => record.attributeName === 'class');
    if (classChanged && currentId !== null && currentId !== undefined) {
      applyThemeToDom(currentId);
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return currentId;
}

export function getColorThemeId(): string | null {
  return initialize();
}

export function setColorTheme(id: string | null): void {
  initialize();
  const next = id !== null ? (getColorThemeById(id)?.id ?? null) : null;
  currentId = next;
  if (next === null) {
    removeThemeFromDom();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Persistence is best-effort.
    }
  } else {
    applyThemeToDom(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort.
    }
  }
  notify();
}

export function subscribeColorTheme(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const COLOR_THEME_COUNT = COLOR_THEMES.length;
