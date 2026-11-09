/**
 * Color theme registry. Palettes are transcribed exactly from the LinkN theme
 * catalog (resolved Light and Dark values per preset). Values are raw HSL
 * channels (e.g. "267 84% 81%") — never wrapped in hsl() — matching the token
 * architecture in index.css and tailwind.config.js.
 */

export interface ColorThemeVars {
  background: string;
  foreground: string;
  card: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  charts: [string, string, string, string, string];
}

export interface ColorTheme {
  id: string;
  name: string;
  /** Hex swatch shown on the chip in the selector. */
  swatch: string;
  /** The mode the palette was authored in; previews always use this mode. */
  authoredMode: 'light' | 'dark';
  lightVars: ColorThemeVars;
  darkVars: ColorThemeVars;
}

const RAW_THEMES: readonly ColorTheme[] = [
  {
    id: 'catppuccin',
    name: 'Catppuccin',
    swatch: '#cba6f7',
    authoredMode: 'dark',
    lightVars: {
      background: '240 12% 98%',
      foreground: '226 12% 15%',
      card: '240 12% 100%',
      primary: '267 84% 81%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '240 12% 94%',
      muted: '240 12% 95%',
      mutedForeground: '226 12% 40%',
      accent: '217 92% 76%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '240 12% 87%',
      charts: ['267 84% 81%', '217 92% 76%', '151 48% 65%', '25 85% 66%', '343 81% 75%'],
    },
    darkVars: {
      background: '240 21% 15%',
      foreground: '226 64% 88%',
      card: '240 21% 12%',
      primary: '267 84% 81%',
      primaryForeground: '240 23% 9%',
      secondary: '231 16% 23%',
      muted: '233 15% 20%',
      mutedForeground: '227 20% 72%',
      accent: '217 92% 76%',
      accentForeground: '240 23% 9%',
      border: '233 13% 31%',
      charts: ['267 84% 81%', '217 92% 76%', '151 48% 65%', '25 85% 66%', '343 81% 75%'],
    },
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox',
    swatch: '#b8bb26',
    authoredMode: 'dark',
    lightVars: {
      background: '0 0% 98%',
      foreground: '48 12% 15%',
      card: '0 0% 100%',
      primary: '45 96% 58%',
      primaryForeground: '210 40% 98%',
      secondary: '0 0% 94%',
      muted: '0 0% 95%',
      mutedForeground: '48 12% 40%',
      accent: '5 96% 59%',
      accentForeground: '210 40% 98%',
      border: '0 0% 87%',
      charts: ['45 96% 58%', '154 31% 59%', '60 69% 44%', '291 31% 68%', '17 98% 60%'],
    },
    darkVars: {
      background: '0 0% 16%',
      foreground: '48 52% 81%',
      card: '0 4% 13%',
      primary: '45 96% 58%',
      primaryForeground: '0 0% 16%',
      secondary: '20 6% 22%',
      muted: '20 6% 22%',
      mutedForeground: '34 11% 59%',
      accent: '5 96% 59%',
      accentForeground: '0 0% 16%',
      border: '24 8% 29%',
      charts: ['45 96% 58%', '154 31% 59%', '60 69% 44%', '291 31% 68%', '17 98% 60%'],
    },
  },
  {
    id: 'linear',
    name: 'Linear',
    swatch: '#5e6ad2',
    authoredMode: 'dark',
    lightVars: {
      background: '225 12% 98%',
      foreground: '240 8% 15%',
      card: '225 12% 100%',
      primary: '232 59% 60%',
      primaryForeground: '210 40% 98%',
      secondary: '225 12% 94%',
      muted: '225 12% 95%',
      mutedForeground: '240 8% 40%',
      accent: '232 59% 60%',
      accentForeground: '210 40% 98%',
      border: '225 12% 87%',
      charts: ['232 59% 60%', '174 60% 51%', '142 70% 50%', '38 95% 55%', '0 75% 60%'],
    },
    darkVars: {
      background: '225 15% 5%',
      foreground: '240 8% 97%',
      card: '225 13% 8%',
      primary: '232 59% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '225 10% 14%',
      muted: '225 10% 14%',
      mutedForeground: '220 6% 57%',
      accent: '232 59% 60%',
      accentForeground: '0 0% 100%',
      border: '225 9% 16%',
      charts: ['232 59% 60%', '174 60% 51%', '142 70% 50%', '38 95% 55%', '0 75% 60%'],
    },
  },
  {
    id: 'lobster',
    name: 'Lobster',
    swatch: '#e5484d',
    authoredMode: 'dark',
    lightVars: {
      background: '240 12% 98%',
      foreground: '0 0% 15%',
      card: '240 12% 100%',
      primary: '358 75% 59%',
      primaryForeground: '210 40% 98%',
      secondary: '240 12% 94%',
      muted: '240 12% 95%',
      mutedForeground: '0 0% 40%',
      accent: '25 95% 55%',
      accentForeground: '210 40% 98%',
      border: '240 12% 87%',
      charts: ['358 75% 59%', '25 95% 55%', '45 90% 55%', '174 60% 45%', '267 60% 65%'],
    },
    darkVars: {
      background: '240 12% 7%',
      foreground: '0 0% 93%',
      card: '240 12% 5%',
      primary: '358 75% 59%',
      primaryForeground: '0 0% 100%',
      secondary: '240 8% 13%',
      muted: '240 8% 13%',
      mutedForeground: '240 5% 62%',
      accent: '25 95% 55%',
      accentForeground: '0 0% 100%',
      border: '240 6% 17%',
      charts: ['358 75% 59%', '25 95% 55%', '45 90% 55%', '174 60% 45%', '267 60% 65%'],
    },
  },
  {
    id: 'material',
    name: 'Material',
    swatch: '#80cbc4',
    authoredMode: 'dark',
    lightVars: {
      background: '228 12% 98%',
      foreground: '220 12% 15%',
      card: '228 12% 100%',
      primary: '220 100% 75%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '228 12% 94%',
      muted: '228 12% 95%',
      mutedForeground: '220 12% 40%',
      accent: '194 100% 77%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '228 12% 87%',
      charts: ['220 100% 75%', '91 55% 67%', '40 100% 71%', '351 81% 69%', '267 66% 74%'],
    },
    darkVars: {
      background: '228 28% 8%',
      foreground: '220 20% 82%',
      card: '228 28% 6%',
      primary: '220 100% 75%',
      primaryForeground: '228 28% 10%',
      secondary: '228 20% 13%',
      muted: '228 20% 13%',
      mutedForeground: '227 15% 55%',
      accent: '194 100% 77%',
      accentForeground: '228 28% 10%',
      border: '228 18% 18%',
      charts: ['220 100% 75%', '91 55% 67%', '40 100% 71%', '351 81% 69%', '267 66% 74%'],
    },
  },
  {
    id: 'matrix',
    name: 'Matrix',
    swatch: '#00ff41',
    authoredMode: 'dark',
    lightVars: {
      background: '130 12% 98%',
      foreground: '130 12% 15%',
      card: '130 12% 100%',
      primary: '136 100% 50%',
      primaryForeground: '210 40% 98%',
      secondary: '130 12% 94%',
      muted: '130 12% 95%',
      mutedForeground: '130 12% 40%',
      accent: '136 100% 50%',
      accentForeground: '210 40% 98%',
      border: '130 12% 87%',
      charts: ['136 100% 50%', '120 100% 60%', '95 100% 55%', '160 100% 45%', '75 100% 50%'],
    },
    darkVars: {
      background: '130 60% 3%',
      foreground: '130 80% 65%',
      card: '130 50% 5%',
      primary: '136 100% 50%',
      primaryForeground: '130 60% 5%',
      secondary: '130 25% 9%',
      muted: '130 25% 9%',
      mutedForeground: '130 40% 45%',
      accent: '136 100% 50%',
      accentForeground: '130 60% 5%',
      border: '130 30% 15%',
      charts: ['136 100% 50%', '120 100% 60%', '95 100% 55%', '160 100% 45%', '75 100% 50%'],
    },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    swatch: '#e6db74',
    authoredMode: 'dark',
    lightVars: {
      background: '70 10% 98%',
      foreground: '60 12% 15%',
      card: '70 10% 100%',
      primary: '338 95% 56%',
      primaryForeground: '210 40% 98%',
      secondary: '70 10% 94%',
      muted: '70 10% 95%',
      mutedForeground: '60 12% 40%',
      accent: '81 81% 53%',
      accentForeground: '210 40% 98%',
      border: '70 10% 87%',
      charts: ['338 95% 56%', '81 81% 53%', '29 98% 56%', '190 81% 67%', '266 100% 75%'],
    },
    darkVars: {
      background: '70 10% 15%',
      foreground: '60 30% 96%',
      card: '80 9% 11%',
      primary: '338 95% 56%',
      primaryForeground: '0 0% 100%',
      secondary: '60 6% 22%',
      muted: '60 6% 22%',
      mutedForeground: '56 11% 55%',
      accent: '81 81% 53%',
      accentForeground: '70 10% 12%',
      border: '55 8% 26%',
      charts: ['338 95% 56%', '81 81% 53%', '29 98% 56%', '190 81% 67%', '266 100% 75%'],
    },
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    swatch: '#82aaff',
    authoredMode: 'dark',
    lightVars: {
      background: '207 12% 98%',
      foreground: '216 12% 15%',
      card: '207 12% 100%',
      primary: '220 100% 75%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '207 12% 94%',
      muted: '207 12% 95%',
      mutedForeground: '216 12% 40%',
      accent: '172 59% 68%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '207 12% 87%',
      charts: ['220 100% 75%', '172 59% 68%', '38 73% 71%', '351 100% 67%', '267 66% 74%'],
    },
    darkVars: {
      background: '207 95% 8%',
      foreground: '216 57% 88%',
      card: '205 90% 6%',
      primary: '220 100% 75%',
      primaryForeground: '207 95% 10%',
      secondary: '207 60% 12%',
      muted: '207 60% 12%',
      mutedForeground: '205 21% 52%',
      accent: '172 59% 68%',
      accentForeground: '207 95% 10%',
      border: '206 57% 16%',
      charts: ['220 100% 75%', '172 59% 68%', '38 73% 71%', '351 100% 67%', '267 66% 74%'],
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    swatch: '#88c0d0',
    authoredMode: 'dark',
    lightVars: {
      background: '220 12% 98%',
      foreground: '219 12% 15%',
      card: '220 12% 100%',
      primary: '193 43% 67%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '220 12% 94%',
      muted: '220 12% 95%',
      mutedForeground: '219 12% 40%',
      accent: '210 34% 63%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '220 12% 87%',
      charts: ['193 43% 67%', '210 34% 63%', '99 28% 65%', '40 71% 73%', '354 42% 56%'],
    },
    darkVars: {
      background: '220 16% 22%',
      foreground: '219 28% 88%',
      card: '222 17% 17%',
      primary: '193 43% 67%',
      primaryForeground: '220 16% 22%',
      secondary: '220 17% 28%',
      muted: '220 17% 28%',
      mutedForeground: '218 17% 55%',
      accent: '210 34% 63%',
      accentForeground: '220 16% 22%',
      border: '220 16% 32%',
      charts: ['193 43% 67%', '210 34% 63%', '99 28% 65%', '40 71% 73%', '354 42% 56%'],
    },
  },
  {
    id: 'notion',
    name: 'Notion',
    swatch: '#2383e2',
    authoredMode: 'light',
    lightVars: {
      background: '0 0% 100%',
      foreground: '30 8% 20%',
      card: '40 20% 96%',
      primary: '212 77% 51%',
      primaryForeground: '0 0% 100%',
      secondary: '60 3% 94%',
      muted: '60 3% 94%',
      mutedForeground: '30 2% 55%',
      accent: '0 80% 63%',
      accentForeground: '0 0% 100%',
      border: '60 3% 89%',
      charts: ['212 77% 51%', '0 80% 63%', '24 89% 45%', '168 79% 27%', '267 44% 45%'],
    },
    darkVars: {
      background: '0 0% 10%',
      foreground: '30 8% 93%',
      card: '0 0% 14%',
      primary: '212 77% 51%',
      primaryForeground: '210 40% 98%',
      secondary: '0 0% 18%',
      muted: '0 0% 17%',
      mutedForeground: '30 8% 65%',
      accent: '0 80% 63%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '0 0% 26%',
      charts: ['212 77% 51%', '0 80% 63%', '24 89% 45%', '168 79% 27%', '267 44% 45%'],
    },
  },
  {
    id: 'one',
    name: 'One',
    swatch: '#61afef',
    authoredMode: 'dark',
    lightVars: {
      background: '220 12% 98%',
      foreground: '220 12% 15%',
      card: '220 12% 100%',
      primary: '207 82% 66%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '220 12% 94%',
      muted: '220 12% 95%',
      mutedForeground: '220 12% 40%',
      accent: '286 60% 67%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '220 12% 87%',
      charts: ['207 82% 66%', '95 38% 62%', '39 67% 69%', '355 65% 65%', '286 60% 67%'],
    },
    darkVars: {
      background: '220 13% 18%',
      foreground: '220 14% 75%',
      card: '220 13% 15%',
      primary: '207 82% 66%',
      primaryForeground: '220 13% 15%',
      secondary: '220 13% 21%',
      muted: '220 13% 21%',
      mutedForeground: '218 10% 55%',
      accent: '286 60% 67%',
      accentForeground: '220 13% 15%',
      border: '218 12% 28%',
      charts: ['207 82% 66%', '95 38% 62%', '39 67% 69%', '355 65% 65%', '286 60% 67%'],
    },
  },
  {
    id: 'oscurange',
    name: 'Oscurange',
    swatch: '#ff9e2c',
    authoredMode: 'dark',
    lightVars: {
      background: '24 12% 98%',
      foreground: '30 12% 15%',
      card: '24 12% 100%',
      primary: '30 100% 55%',
      primaryForeground: '210 40% 98%',
      secondary: '24 12% 94%',
      muted: '24 12% 95%',
      mutedForeground: '30 12% 40%',
      accent: '40 100% 60%',
      accentForeground: '210 40% 98%',
      border: '24 12% 87%',
      charts: ['30 100% 55%', '40 100% 60%', '18 90% 50%', '174 60% 45%', '0 75% 60%'],
    },
    darkVars: {
      background: '24 20% 6%',
      foreground: '30 30% 92%',
      card: '24 18% 9%',
      primary: '30 100% 55%',
      primaryForeground: '24 20% 8%',
      secondary: '24 12% 13%',
      muted: '24 12% 13%',
      mutedForeground: '24 10% 55%',
      accent: '40 100% 60%',
      accentForeground: '24 20% 8%',
      border: '24 12% 18%',
      charts: ['30 100% 55%', '40 100% 60%', '18 90% 50%', '174 60% 45%', '0 75% 60%'],
    },
  },
  {
    id: 'raycast',
    name: 'Raycast',
    swatch: '#ff6363',
    authoredMode: 'dark',
    lightVars: {
      background: '240 8% 98%',
      foreground: '0 0% 15%',
      card: '240 8% 100%',
      primary: '0 100% 69%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '240 8% 94%',
      muted: '240 8% 95%',
      mutedForeground: '0 0% 40%',
      accent: '0 100% 69%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '240 8% 87%',
      charts: ['0 100% 69%', '25 100% 60%', '45 100% 60%', '174 65% 45%', '267 70% 70%'],
    },
    darkVars: {
      background: '240 8% 6%',
      foreground: '0 0% 95%',
      card: '240 8% 4%',
      primary: '0 100% 69%',
      primaryForeground: '240 8% 8%',
      secondary: '240 6% 12%',
      muted: '240 6% 12%',
      mutedForeground: '240 4% 58%',
      accent: '0 100% 69%',
      accentForeground: '240 8% 8%',
      border: '240 5% 15%',
      charts: ['0 100% 69%', '25 100% 60%', '45 100% 60%', '174 65% 45%', '267 70% 70%'],
    },
  },
  {
    id: 'rose-pine',
    name: 'Rose Pine',
    swatch: '#c4a7e7',
    authoredMode: 'dark',
    lightVars: {
      background: '248 12% 98%',
      foreground: '245 12% 15%',
      card: '248 12% 100%',
      primary: '267 57% 78%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '248 12% 94%',
      muted: '248 12% 95%',
      mutedForeground: '245 12% 40%',
      accent: '2 55% 83%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '248 12% 87%',
      charts: ['2 55% 83%', '267 57% 78%', '188 42% 70%', '31 63% 74%', '197 49% 38%'],
    },
    darkVars: {
      background: '248 22% 12%',
      foreground: '245 50% 91%',
      card: '246 24% 15%',
      primary: '267 57% 78%',
      primaryForeground: '248 22% 12%',
      secondary: '247 23% 18%',
      muted: '247 23% 18%',
      mutedForeground: '249 12% 60%',
      accent: '2 55% 83%',
      accentForeground: '248 22% 12%',
      border: '248 17% 25%',
      charts: ['2 55% 83%', '267 57% 78%', '188 42% 70%', '31 63% 74%', '197 49% 38%'],
    },
  },
  {
    id: 'sentry',
    name: 'Sentry',
    swatch: '#8d77e8',
    authoredMode: 'dark',
    lightVars: {
      background: '259 12% 98%',
      foreground: '260 12% 15%',
      card: '259 12% 100%',
      primary: '248 48% 58%',
      primaryForeground: '210 40% 98%',
      secondary: '259 12% 94%',
      muted: '259 12% 95%',
      mutedForeground: '260 12% 40%',
      accent: '343 71% 61%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '259 12% 87%',
      charts: ['248 48% 58%', '343 71% 61%', '174 60% 45%', '38 95% 55%', '142 60% 50%'],
    },
    darkVars: {
      background: '259 35% 11%',
      foreground: '260 36% 95%',
      card: '259 32% 14%',
      primary: '248 48% 58%',
      primaryForeground: '0 0% 100%',
      secondary: '259 25% 16%',
      muted: '259 25% 16%',
      mutedForeground: '259 12% 62%',
      accent: '343 71% 61%',
      accentForeground: '0 0% 100%',
      border: '259 20% 24%',
      charts: ['248 48% 58%', '343 71% 61%', '174 60% 45%', '38 95% 55%', '142 60% 50%'],
    },
  },
  {
    id: 'solarized',
    name: 'Solarized',
    swatch: '#2aa198',
    authoredMode: 'dark',
    lightVars: {
      background: '192 12% 98%',
      foreground: '180 9% 15%',
      card: '192 12% 100%',
      primary: '205 69% 49%',
      primaryForeground: '210 40% 98%',
      secondary: '192 12% 94%',
      muted: '192 12% 95%',
      mutedForeground: '180 9% 40%',
      accent: '175 59% 40%',
      accentForeground: '210 40% 98%',
      border: '192 12% 87%',
      charts: ['205 69% 49%', '175 59% 40%', '68 100% 40%', '45 100% 35%', '0 79% 53%'],
    },
    darkVars: {
      background: '192 100% 11%',
      foreground: '180 9% 65%',
      card: '193 100% 8%',
      primary: '205 69% 49%',
      primaryForeground: '192 100% 10%',
      secondary: '194 81% 15%',
      muted: '194 81% 15%',
      mutedForeground: '192 13% 48%',
      accent: '175 59% 40%',
      accentForeground: '192 100% 10%',
      border: '193 79% 18%',
      charts: ['205 69% 49%', '175 59% 40%', '68 100% 40%', '45 100% 35%', '0 79% 53%'],
    },
  },
  {
    id: 'temple',
    name: 'Temple',
    swatch: '#d8ff3e',
    authoredMode: 'dark',
    lightVars: {
      background: '60 12% 98%',
      foreground: '60 12% 15%',
      card: '60 12% 100%',
      primary: '70 100% 62%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '60 12% 94%',
      muted: '60 12% 95%',
      mutedForeground: '60 12% 40%',
      accent: '70 100% 62%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '60 12% 87%',
      charts: ['70 100% 62%', '95 90% 55%', '50 100% 60%', '160 80% 50%', '0 0% 90%'],
    },
    darkVars: {
      background: '60 25% 5%',
      foreground: '60 30% 90%',
      card: '60 20% 8%',
      primary: '70 100% 62%',
      primaryForeground: '60 25% 8%',
      secondary: '60 12% 12%',
      muted: '60 12% 12%',
      mutedForeground: '60 8% 50%',
      accent: '70 100% 62%',
      accentForeground: '60 25% 8%',
      border: '60 12% 17%',
      charts: ['70 100% 62%', '95 90% 55%', '50 100% 60%', '160 80% 50%', '0 0% 90%'],
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    swatch: '#7aa2f7',
    authoredMode: 'dark',
    lightVars: {
      background: '233 12% 98%',
      foreground: '227 12% 15%',
      card: '233 12% 100%',
      primary: '223 89% 72%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '233 12% 94%',
      muted: '233 12% 95%',
      mutedForeground: '227 12% 40%',
      accent: '261 85% 79%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '233 12% 87%',
      charts: ['223 89% 72%', '83 51% 61%', '37 66% 64%', '349 89% 72%', '261 85% 79%'],
    },
    darkVars: {
      background: '233 22% 13%',
      foreground: '227 70% 86%',
      card: '236 24% 10%',
      primary: '223 89% 72%',
      primaryForeground: '233 22% 12%',
      secondary: '232 25% 19%',
      muted: '232 25% 19%',
      mutedForeground: '228 22% 52%',
      accent: '261 85% 79%',
      accentForeground: '233 22% 12%',
      border: '230 24% 21%',
      charts: ['223 89% 72%', '83 51% 61%', '37 66% 64%', '349 89% 72%', '261 85% 79%'],
    },
  },
  {
    id: 'vercel',
    name: 'Vercel',
    swatch: '#888888',
    authoredMode: 'dark',
    lightVars: {
      background: '0 0% 98%',
      foreground: '0 0% 15%',
      card: '0 0% 100%',
      primary: '0 0% 100%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '0 0% 94%',
      muted: '0 0% 95%',
      mutedForeground: '0 0% 40%',
      accent: '212 100% 48%',
      accentForeground: '210 40% 98%',
      border: '0 0% 87%',
      charts: ['0 0% 98%', '212 100% 48%', '187 80% 50%', '38 95% 55%', '0 84% 60%'],
    },
    darkVars: {
      background: '0 0% 0%',
      foreground: '0 0% 93%',
      card: '0 0% 4%',
      primary: '0 0% 100%',
      primaryForeground: '0 0% 0%',
      secondary: '0 0% 7%',
      muted: '0 0% 7%',
      mutedForeground: '0 0% 55%',
      accent: '212 100% 48%',
      accentForeground: '0 0% 100%',
      border: '0 0% 13%',
      charts: ['0 0% 98%', '212 100% 48%', '187 80% 50%', '38 95% 55%', '0 84% 60%'],
    },
  },
  {
    id: 'vs-code-plus',
    name: 'VS Code Plus',
    swatch: '#3794ff',
    authoredMode: 'dark',
    lightVars: {
      background: '0 0% 98%',
      foreground: '0 0% 15%',
      card: '0 0% 100%',
      primary: '212 100% 61%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '0 0% 94%',
      muted: '0 0% 95%',
      mutedForeground: '0 0% 40%',
      accent: '200 100% 66%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '0 0% 87%',
      charts: ['212 100% 61%', '174 52% 55%', '55 40% 70%', '0 79% 62%', '284 38% 64%'],
    },
    darkVars: {
      background: '0 0% 12%',
      foreground: '0 0% 83%',
      card: '0 0% 9%',
      primary: '212 100% 61%',
      primaryForeground: '0 0% 10%',
      secondary: '0 0% 15%',
      muted: '0 0% 15%',
      mutedForeground: '0 0% 55%',
      accent: '200 100% 66%',
      accentForeground: '0 0% 10%',
      border: '0 0% 18%',
      charts: ['212 100% 61%', '174 52% 55%', '55 40% 70%', '0 79% 62%', '284 38% 64%'],
    },
  },
  {
    id: 'basic',
    name: 'Basic',
    swatch: '#0645ad',
    authoredMode: 'light',
    lightVars: {
      background: '0 0% 100%',
      foreground: '0 0% 0%',
      card: '0 0% 100%',
      primary: '218 93% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '210 33% 93%',
      muted: '0 0% 96%',
      mutedForeground: '0 0% 33%',
      accent: '213 61% 89%',
      accentForeground: '218 93% 25%',
      border: '0 0% 75%',
      charts: ['218 93% 35%', '210 70% 55%', '0 0% 40%', '120 60% 30%', '0 70% 45%'],
    },
    darkVars: {
      background: '0 0% 10%',
      foreground: '0 0% 93%',
      card: '0 0% 14%',
      primary: '218 93% 35%',
      primaryForeground: '210 40% 98%',
      secondary: '0 0% 18%',
      muted: '0 0% 17%',
      mutedForeground: '0 0% 65%',
      accent: '213 61% 64%',
      accentForeground: '222.2 47.4% 11.2%',
      border: '0 0% 26%',
      charts: ['218 93% 35%', '210 70% 55%', '0 0% 40%', '120 60% 30%', '0 70% 45%'],
    },
  },
];

/** --- Light-mode accessibility floor ---------------------------------------
 * Presets authored for dark mode keep bright brand colours; used as text on
 * light surfaces they fall far below WCAG AA (some primaries are lighter than
 * the background). Before a palette is applied in light mode, any brand or
 * secondary colour that fails the target contrast against white is darkened
 * (hue and saturation preserved) until it passes. Swatch previews keep the
 * authored colours via getAuthoredVars. */

const LIGHT_CONTRAST_TARGET = 5; // margin over AA 4.5 for tinted surfaces
const DARK_CONTRAST_TARGET = 4.8;

function channelsToRgb(channels: string): [number, number, number] {
  // parseFloat (not Number) — channel strings carry '%' suffixes.
  const [h, s, l] = channels.split(' ').map((part) => parseFloat(part));
  const chroma = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100);
  const hp = h / 60;
  const x = chroma * (1 - Math.abs((hp % 2) - 1));
  const rgb: [number, number, number] =
    hp < 1
      ? [chroma, x, 0]
      : hp < 2
        ? [x, chroma, 0]
        : hp < 3
          ? [0, chroma, x]
          : hp < 4
            ? [0, x, chroma]
            : hp < 5
              ? [x, 0, chroma]
              : [chroma, 0, x];
  const m = l / 100 - chroma / 2;
  return rgb.map((v) => Math.round((v + m) * 255)) as [number, number, number];
}

function channelLuminance(channels: string): number {
  const [r, g, b] = channelsToRgb(channels);
  const f = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrastRatio(a: string, b: string): number {
  const l1 = channelLuminance(a);
  const l2 = channelLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Shifts lightness (down on light surfaces, up on dark ones) until the
 * colour reaches the target contrast against the given base. Hue and
 * saturation are preserved, so the palette keeps its identity. */
function ensureReadableAgainst(channels: string, against: string, target: number, darken: boolean): string {
  if (contrastRatio(channels, against) >= target) return channels;
  const [h, s, lString] = channels.split(' ');
  let l = parseFloat(lString);
  while (darken ? l > 4 : l < 96) {
    l += darken ? -1 : 1;
    if (contrastRatio(`${h} ${s} ${l}%`, against) >= target) break;
  }
  return `${h} ${s} ${Math.round(l)}%`;
}

const ensureReadableOnLight = (channels: string): string =>
  ensureReadableAgainst(channels, '0 0% 100%', LIGHT_CONTRAST_TARGET, true);

const LIGHT_FOREGROUND = '210 40% 98%';

export const COLOR_THEMES: readonly ColorTheme[] = RAW_THEMES.map((theme) => {
  const lightVars = { ...theme.lightVars };
  lightVars.primary = ensureReadableOnLight(lightVars.primary);
  lightVars.accent = ensureReadableOnLight(lightVars.accent);
  lightVars.mutedForeground = ensureReadableOnLight(lightVars.mutedForeground);
  lightVars.charts = lightVars.charts.map(ensureReadableOnLight) as ColorThemeVars['charts'];
  // A brand colour that ended up dark needs a light foreground on top of it.
  if (parseFloat(lightVars.primary.split(' ')[2]) <= 50) {
    lightVars.primaryForeground = LIGHT_FOREGROUND;
  }
  if (parseFloat(lightVars.accent.split(' ')[2]) <= 50) {
    lightVars.accentForeground = LIGHT_FOREGROUND;
  }

  // Mirror of the light floor: on dark surfaces, brand text that is too dark
  // (e.g. Basic's link blue) is lightened against the palette's own card.
  const darkVars = { ...theme.darkVars };
  darkVars.primary = ensureReadableAgainst(
    darkVars.primary,
    theme.darkVars.card,
    DARK_CONTRAST_TARGET,
    false,
  );
  darkVars.accent = ensureReadableAgainst(darkVars.accent, theme.darkVars.card, DARK_CONTRAST_TARGET, false);
  darkVars.mutedForeground = ensureReadableAgainst(
    darkVars.mutedForeground,
    theme.darkVars.card,
    DARK_CONTRAST_TARGET,
    false,
  );

  return { ...theme, lightVars, darkVars };
});

export function getColorThemeById(id: string): ColorTheme | null {
  return COLOR_THEMES.find((theme) => theme.id === id) ?? null;
}

/** Authored-mode palette for previews (never switches with display mode). */
export function getAuthoredVars(theme: ColorTheme): ColorThemeVars {
  const raw = RAW_THEMES.find((candidate) => candidate.id === theme.id) ?? theme;
  return raw.authoredMode === 'dark' ? raw.darkVars : raw.lightVars;
}
