export const THEMES = {
  default: {
    name: 'AMATERASU', icon: 'flame',
    primary: '#ef4444', accent: '#dc2626',
    dim: 'rgba(127,29,29,0.2)', dark: '#450a0a', rgb: '220, 38, 38',
    bodyBg:        '#050505',
    cardBg:        'linear-gradient(145deg, rgba(24,24,27,0.92), rgba(9,9,11,0.97))',
    cardBorder:    'rgba(127,29,29,0.11)',
    navBg:         'rgba(9,9,11,0.90)',    navBorder:     'rgba(127,29,29,0.12)',
    headerBg:      'rgba(9,9,11,0.96)',    headerBorder:  'rgba(127,29,29,0.10)',
  },
  raiton: {
    name: 'RAITON', icon: 'zap',
    primary: '#22d3ee', accent: '#0891b2',
    dim: 'rgba(22,78,99,0.3)', dark: '#083344', rgb: '34, 211, 238',
    bodyBg:        '#010A12',
    cardBg:        'linear-gradient(145deg, rgba(4,20,32,0.93), rgba(1,8,16,0.97))',
    cardBorder:    'rgba(22,78,99,0.20)',
    navBg:         'rgba(1,8,16,0.92)',    navBorder:     'rgba(22,78,99,0.18)',
    headerBg:      'rgba(1,8,16,0.97)',    headerBorder:  'rgba(22,78,99,0.15)',
  },
  emerald: {
    name: 'SAGE MODE', icon: 'leaf',
    primary: '#4ade80', accent: '#16a34a',
    dim: 'rgba(22,101,52,0.25)', dark: '#052e16', rgb: '74, 222, 128',
    bodyBg:        '#010805',
    cardBg:        'linear-gradient(145deg, rgba(4,18,8,0.93), rgba(1,7,3,0.97))',
    cardBorder:    'rgba(22,101,52,0.18)',
    navBg:         'rgba(1,7,3,0.92)',     navBorder:     'rgba(22,101,52,0.15)',
    headerBg:      'rgba(1,7,3,0.97)',     headerBorder:  'rgba(22,101,52,0.12)',
  },
  violet: {
    name: 'SUSANOO', icon: 'eye',
    primary: '#a78bfa', accent: '#7c3aed',
    dim: 'rgba(91,33,182,0.25)', dark: '#2e1065', rgb: '167, 139, 250',
    bodyBg:        '#030108',
    cardBg:        'linear-gradient(145deg, rgba(18,5,40,0.93), rgba(6,1,14,0.97))',
    cardBorder:    'rgba(91,33,182,0.20)',
    navBg:         'rgba(6,1,14,0.92)',    navBorder:     'rgba(91,33,182,0.18)',
    headerBg:      'rgba(6,1,14,0.97)',    headerBorder:  'rgba(91,33,182,0.15)',
  },
  amber: {
    name: 'KURAMA', icon: 'sun',
    primary: '#fbbf24', accent: '#d97706',
    dim: 'rgba(146,64,14,0.25)', dark: '#451a03', rgb: '251, 191, 36',
    bodyBg:        '#060300',
    cardBg:        'linear-gradient(145deg, rgba(24,10,0,0.93), rgba(9,4,0,0.97))',
    cardBorder:    'rgba(146,64,14,0.20)',
    navBg:         'rgba(9,4,0,0.92)',     navBorder:     'rgba(146,64,14,0.18)',
    headerBg:      'rgba(9,4,0,0.97)',     headerBorder:  'rgba(146,64,14,0.15)',
  },
  rose: {
    name: 'SAKURA', icon: 'heart',
    primary: '#fb7185', accent: '#e11d48',
    dim: 'rgba(159,18,57,0.2)', dark: '#4c0519', rgb: '251, 113, 133',
    bodyBg:        '#060103',
    cardBg:        'linear-gradient(145deg, rgba(22,3,9,0.93), rgba(8,1,3,0.97))',
    cardBorder:    'rgba(159,18,57,0.16)',
    navBg:         'rgba(8,1,3,0.92)',     navBorder:     'rgba(159,18,57,0.14)',
    headerBg:      'rgba(8,1,3,0.97)',     headerBorder:  'rgba(159,18,57,0.12)',
  },
  performance: {
    name: 'PERFORMANCE', icon: 'trending-up',
    primary: '#3b82f6', accent: '#1d4ed8',
    dim: 'rgba(29,78,216,0.15)', dark: '#0c1a33', rgb: '59, 130, 246',
    bodyBg:        '#020610',
    cardBg:        'linear-gradient(145deg, rgba(4,12,38,0.97), rgba(1,5,16,0.99))',
    cardBorder:    'rgba(59,130,246,0.14)',
    navBg:         'rgba(1,5,16,0.95)',    navBorder:     'rgba(59,130,246,0.12)',
    headerBg:      'rgba(1,5,16,0.98)',    headerBorder:  'rgba(59,130,246,0.10)',
  },
  gym: {
    name: 'GYM', icon: 'dumbbell',
    primary: '#f97316', accent: '#c2410c',
    dim: 'rgba(194,65,12,0.2)', dark: '#1c0a00', rgb: '249, 115, 22',
    bodyBg:        '#080300',
    cardBg:        'linear-gradient(145deg, rgba(24,8,0,0.94), rgba(10,3,0,0.98))',
    cardBorder:    'rgba(194,65,12,0.18)',
    navBg:         'rgba(10,3,0,0.93)',    navBorder:     'rgba(194,65,12,0.16)',
    headerBg:      'rgba(10,3,0,0.97)',    headerBorder:  'rgba(194,65,12,0.14)',
  },
  iron: {
    name: 'IRON', icon: 'cpu',
    primary: '#d4d4d8', accent: '#a1a1aa',
    dim: 'rgba(161,161,170,0.1)', dark: '#09090b', rgb: '212, 212, 216',
    bodyBg:        '#000000',
    cardBg:        'linear-gradient(180deg, rgba(16,16,16,0.98), rgba(5,5,5,1.0))',
    cardBorder:    'rgba(212,212,216,0.06)',
    navBg:         'rgba(5,5,5,0.97)',     navBorder:     'rgba(212,212,216,0.05)',
    headerBg:      'rgba(3,3,3,0.99)',     headerBorder:  'rgba(212,212,216,0.05)',
  },
  night: {
    name: 'NIGHT', icon: 'moon',
    primary: '#6366f1', accent: '#4338ca',
    dim: 'rgba(67,56,202,0.2)', dark: '#030712', rgb: '99, 102, 241',
    bodyBg:        '#020108',
    cardBg:        'linear-gradient(145deg, rgba(10,5,32,0.94), rgba(3,1,12,0.98))',
    cardBorder:    'rgba(67,56,202,0.18)',
    navBg:         'rgba(3,1,12,0.94)',    navBorder:     'rgba(67,56,202,0.15)',
    headerBg:      'rgba(3,1,12,0.98)',    headerBorder:  'rgba(67,56,202,0.12)',
  },
  f91w: {
    name: 'F-91W', icon: 'timer',
    primary: '#FACC15', accent: '#CA9A04',
    dim: 'rgba(250,204,21,0.12)', dark: '#1A1A1A', rgb: '250, 204, 21',
    bodyBg:        '#161616',
    cardBg:        'linear-gradient(145deg, rgba(38,38,38,0.97), rgba(26,26,26,0.99))',
    cardBorder:    'rgba(64,64,64,0.55)',
    navBg:         'rgba(18,18,18,0.97)',   navBorder:     'rgba(64,64,64,0.40)',
    headerBg:      'rgba(16,16,16,0.99)',   headerBorder:  'rgba(64,64,64,0.35)',
  },
  gulfman: {
    name: 'GULFMAN', icon: 'crosshair',
    primary: '#7A9A4A', accent: '#5E7848',
    dim: 'rgba(94,120,72,0.15)', dark: '#0A1208', rgb: '122, 154, 74',
    bodyBg:        '#080B08',
    cardBg:        'linear-gradient(145deg, rgba(15,20,12,0.96), rgba(8,11,7,0.99))',
    cardBorder:    'rgba(94,120,72,0.20)',
    navBg:         'rgba(5,8,4,0.95)',     navBorder:     'rgba(94,120,72,0.16)',
    headerBg:      'rgba(5,8,4,0.98)',     headerBorder:  'rgba(94,120,72,0.14)',
  },
};

const SEMANTIC_DEFAULTS = {
  success: '#4ade80',
  danger:  '#f87171',
  warning: '#fbbf24',
  info:    '#60a5fa',
  cardio:  '#22d3ee',
  streak:  '#fb923c',
  rare:    '#c084fc',
};

export class ThemeService {
  #current;

  constructor(initial = 'default') {
    this.#current = initial;
  }

  get current() { return this.#current; }
  get config()  { return THEMES[this.#current] ?? THEMES.default; }

  apply(theme) {
    this.#current = theme in THEMES ? theme : 'default';
    const cfg  = THEMES[this.#current];
    const root = document.documentElement;

    // Accent tokens
    root.style.setProperty('--theme-primary', cfg.primary);
    root.style.setProperty('--theme-accent',  cfg.accent);
    root.style.setProperty('--theme-dim',     cfg.dim);
    root.style.setProperty('--theme-dark',    cfg.dark);
    root.style.setProperty('--ember-color',   cfg.primary);
    root.style.setProperty('--theme-rgb',     cfg.rgb);

    // Surface tokens
    root.style.setProperty('--body-bg',       cfg.bodyBg       ?? '#050505');
    root.style.setProperty('--card-bg',       cfg.cardBg       ?? 'linear-gradient(145deg, rgba(24,24,27,0.9), rgba(9,9,11,0.95))');
    root.style.setProperty('--card-border',   cfg.cardBorder   ?? 'rgba(255,255,255,0.05)');
    root.style.setProperty('--nav-bg',        cfg.navBg        ?? 'rgba(9,9,11,0.85)');
    root.style.setProperty('--nav-border',    cfg.navBorder    ?? 'rgba(255,255,255,0.08)');
    root.style.setProperty('--header-bg',     cfg.headerBg     ?? 'rgba(9,9,11,0.95)');
    root.style.setProperty('--header-border', cfg.headerBorder ?? 'rgba(255,255,255,0.06)');

    // Semantic tokens (theme-independent fixed values)
    const sem = SEMANTIC_DEFAULTS;
    root.style.setProperty('--color-success', sem.success);
    root.style.setProperty('--color-danger',  sem.danger);
    root.style.setProperty('--color-warning', sem.warning);
    root.style.setProperty('--color-info',    sem.info);
    root.style.setProperty('--color-cardio',  sem.cardio);
    root.style.setProperty('--color-streak',  sem.streak);
    root.style.setProperty('--color-rare',    sem.rare);

    // Triggers MutationObserver in index.html for ember particle refresh
    document.body.setAttribute('data-theme', this.#current);
  }

  toggle() {
    const keys = Object.keys(THEMES);
    const idx  = keys.indexOf(this.#current);
    this.apply(keys[(idx + 1) % keys.length]);
    return this.#current;
  }

  applyLightMode(enabled) {
    if (enabled) {
      document.body.setAttribute('data-light-mode', '');
    } else {
      document.body.removeAttribute('data-light-mode');
    }
  }
}
