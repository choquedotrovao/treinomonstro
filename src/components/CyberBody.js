/* Referências masculinas treinadas (cm) para normalização */
const REFS = {
  Ombros:       94,
  Peito:        98,
  Costas:       112,
  Braços:       35,
  Abs:          82,
  Pernas:       54,
  Panturrilhas: 37,
};

function scoresFromCircumferences(c) {
  const norm = (val, ref) => val > 0 ? Math.min(1, val / ref) : 0;
  const bi   = (d, e) => [d || e || 0, e || d || 0];
  const [armD,  armE]  = bi(c.bracoDirContraido,    c.bracoEsqContraido);
  const [legD,  legE]  = bi(c.coxaDireita,          c.coxaEsquerda);
  const [calvD, calvE] = bi(c.panturrilhaDireita,   c.panturrilhaEsquerda);
  return {
    Ombros:  norm(c.escapular || 0, REFS.Costas),
    Peito:   norm(c.torax     || 0, REFS.Peito),
    Costas:  norm(c.escapular || 0, REFS.Costas),
    BraçoD:  norm(armD,  REFS.Braços),
    BraçoE:  norm(armE,  REFS.Braços),
    Abs:     norm(c.abdome || 0, REFS.Abs),
    PernasD: norm(legD,  REFS.Pernas),
    PernasE: norm(legE,  REFS.Pernas),
    PanturD: norm(calvD, REFS.Panturrilhas),
    PanturE: norm(calvE, REFS.Panturrilhas),
  };
}

export function renderCyberBody(scores = {}, height = 260, theme = 'default', circumferences = null) {
  const rgb = getComputedStyle(document.documentElement).getPropertyValue('--theme-rgb').trim() || '220, 38, 38';

  const activeScores = circumferences ? scoresFromCircumferences(circumferences) : scores;
  const bodyFat      = circumferences?.bodyFat ?? null;

  // resolve bilateral OR legacy key
  const get = (...keys) => {
    for (const k of keys) {
      const v = activeScores[k];
      if (v !== undefined && v !== null) return v;
    }
    return 0;
  };

  const fill = (...keys) => {
    const v = get(...keys);
    if (v === 0) return '#1c1c1f';
    return `rgba(${rgb}, ${(0.1 + v * 0.9).toFixed(2)})`;
  };

  const stroke = (...keys) => {
    const v = get(...keys);
    if (v === 0) return '#3f3f46';
    return `rgba(${rgb}, ${(0.25 + v * 0.55).toFixed(2)})`;
  };

  const glow = (...keys) => get(...keys) > 0.5 ? 'filter="url(#cglow)"' : '';

  const scoreLabel = (x, y, ...keys) => {
    const v = get(...keys);
    if (v === 0) return '';
    return `<text x="${x}" y="${y}" text-anchor="middle"
      fill="rgba(255,255,255,${v > 0.6 ? 0.9 : 0.55})"
      font-size="5.5" font-weight="700" font-family="monospace">${Math.round(v * 100)}%</text>`;
  };

  // Fat layer: invisible at ≤8% BF, opaque at ≥30%
  const fatAlpha = bodyFat
    ? Math.min(0.50, Math.max(0, (bodyFat - 8) / 22 * 0.50)).toFixed(2)
    : '0';
  const showFat = parseFloat(fatAlpha) > 0.01;

  return `<svg height="${height}" viewBox="0 0 120 250" class="mx-auto overflow-visible" style="max-width:180px">
    <defs>
      <filter id="cglow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="cglow-soft" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <pattern id="dot-grid" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.04)"/>
      </pattern>
      <linearGradient id="body-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(${rgb},0.04)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
      </linearGradient>
      ${showFat ? `
      <radialGradient id="fat-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(251,191,36,${fatAlpha})"/>
        <stop offset="100%" stop-color="rgba(251,191,36,0)"/>
      </radialGradient>` : ''}
    </defs>

    <!-- Background -->
    <rect x="0" y="0" width="120" height="250" fill="url(#dot-grid)" rx="6"/>
    <rect x="0" y="0" width="120" height="250" fill="url(#body-bg)" rx="6"/>

    <!-- Circuit detail lines -->
    <line x1="10" y1="130" x2="18" y2="130" stroke="rgba(${rgb},0.12)" stroke-width="0.5"/>
    <line x1="18" y1="130" x2="18" y2="145" stroke="rgba(${rgb},0.12)" stroke-width="0.5"/>
    <line x1="110" y1="130" x2="102" y2="130" stroke="rgba(${rgb},0.12)" stroke-width="0.5"/>
    <line x1="102" y1="130" x2="102" y2="145" stroke="rgba(${rgb},0.12)" stroke-width="0.5"/>
    <line x1="35" y1="240" x2="55" y2="240" stroke="rgba(${rgb},0.10)" stroke-width="0.5"/>
    <line x1="65" y1="240" x2="85" y2="240" stroke="rgba(${rgb},0.10)" stroke-width="0.5"/>

    <!-- Head -->
    <circle cx="60" cy="19" r="12" fill="#1c1c1e" stroke="#3f3f46" stroke-width="0.8"/>
    <circle cx="60" cy="19" r="12" fill="rgba(${rgb},0.04)"/>
    <line x1="56" y1="21" x2="58" y2="23" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
    <line x1="64" y1="21" x2="62" y2="23" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
    <path d="M57 25 Q60 27 63 25" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.7"/>

    <!-- Neck -->
    <path d="M55 31 L65 31 L64 42 L56 42 Z" fill="#222224" stroke="#3f3f46" stroke-width="0.5"/>

    <!-- Torso base -->
    <path d="M43 42 Q27 46 22 60 L24 94 Q28 100 44 98 L48 120 L72 120 L76 98 Q92 100 96 94 L98 60 Q93 46 77 42 Z"
          fill="#18181b" stroke="#3f3f46" stroke-width="0.6"/>

    <!-- Shoulders -->
    <path d="M43 44 Q30 46 22 61 L25 74 Q32 64 43 57 Z"
          fill="${fill('Ombros')}" stroke="${stroke('Ombros')}" stroke-width="0.7" ${glow('Ombros')} class="transition-all duration-700"/>
    <path d="M77 44 Q90 46 98 61 L95 74 Q88 64 77 57 Z"
          fill="${fill('Ombros')}" stroke="${stroke('Ombros')}" stroke-width="0.7" ${glow('Ombros')} class="transition-all duration-700"/>
    ${scoreLabel(32, 60, 'Ombros')}
    ${scoreLabel(88, 60, 'Ombros')}

    <!-- Chest -->
    <path d="M43 44 Q52 45 58 50 L56 78 L46 75 Q42 68 42 60 Z"
          fill="${fill('Peito')}" stroke="${stroke('Peito')}" stroke-width="0.7" ${glow('Peito')} class="transition-all duration-700"/>
    <path d="M77 44 Q68 45 62 50 L64 78 L74 75 Q78 68 78 60 Z"
          fill="${fill('Peito')}" stroke="${stroke('Peito')}" stroke-width="0.7" ${glow('Peito')} class="transition-all duration-700"/>
    <line x1="60" y1="48" x2="60" y2="78" stroke="rgba(0,0,0,0.35)" stroke-width="0.8"/>
    ${scoreLabel(51, 65, 'Peito')}
    ${scoreLabel(69, 65, 'Peito')}

    <!-- Back / Lats -->
    <path d="M43 57 Q30 65 25 75 L26 92 L44 84 Z"
          fill="${fill('Costas')}" stroke="${stroke('Costas')}" stroke-width="0.7" ${glow('Costas')} class="transition-all duration-700"/>
    <path d="M77 57 Q90 65 95 75 L94 92 L76 84 Z"
          fill="${fill('Costas')}" stroke="${stroke('Costas')}" stroke-width="0.7" ${glow('Costas')} class="transition-all duration-700"/>
    ${scoreLabel(34, 76, 'Costas')}
    ${scoreLabel(86, 76, 'Costas')}

    <!-- Abs -->
    <path d="M49 80 Q54 79 71 80 L69 118 Q60 120 51 118 Z"
          fill="${fill('Abs')}" stroke="${stroke('Abs')}" stroke-width="0.7" ${glow('Abs')} class="transition-all duration-700"/>
    <line x1="50" y1="90" x2="70" y2="90" stroke="rgba(0,0,0,0.28)" stroke-width="0.7"/>
    <line x1="51" y1="100" x2="69" y2="100" stroke="rgba(0,0,0,0.28)" stroke-width="0.7"/>
    <line x1="51" y1="110" x2="69" y2="110" stroke="rgba(0,0,0,0.2)" stroke-width="0.6"/>
    <line x1="60" y1="80" x2="60" y2="118" stroke="rgba(0,0,0,0.28)" stroke-width="0.7"/>
    ${scoreLabel(60, 97, 'Abs')}

    <!-- Body fat overlay (amber radial glow over core) -->
    ${showFat ? `
    <ellipse cx="60" cy="100" rx="14" ry="22"
             fill="url(#fat-grad)" class="transition-all duration-700"/>
    ` : ''}

    <!-- Upper Arms — bilateral: D = left-of-screen, E = right-of-screen -->
    <path d="M22 61 Q14 78 13 94 L20 94 Q24 80 30 68 Z"
          fill="${fill('BraçoD', 'Braços')}" stroke="${stroke('BraçoD', 'Braços')}" stroke-width="0.7" ${glow('BraçoD', 'Braços')} class="transition-all duration-700"/>
    <path d="M98 61 Q106 78 107 94 L100 94 Q96 80 90 68 Z"
          fill="${fill('BraçoE', 'Braços')}" stroke="${stroke('BraçoE', 'Braços')}" stroke-width="0.7" ${glow('BraçoE', 'Braços')} class="transition-all duration-700"/>

    <!-- Forearms — bilateral -->
    <path d="M13 95 Q10 112 11 120 L19 120 Q20 110 20 94 Z"
          fill="${fill('BraçoD', 'Braços')}" stroke="${stroke('BraçoD', 'Braços')}" stroke-width="0.6" opacity="0.75" class="transition-all duration-700"/>
    <path d="M107 95 Q110 112 109 120 L101 120 Q100 110 100 94 Z"
          fill="${fill('BraçoE', 'Braços')}" stroke="${stroke('BraçoE', 'Braços')}" stroke-width="0.6" opacity="0.75" class="transition-all duration-700"/>
    ${scoreLabel(17, 80, 'BraçoD', 'Braços')}
    ${scoreLabel(103, 80, 'BraçoE', 'Braços')}

    <!-- Hip bridge -->
    <path d="M47 120 L73 120 Q76 128 76 132 L44 132 Q44 128 47 120 Z" fill="#1a1a1c" stroke="#3f3f46" stroke-width="0.4"/>

    <!-- Quads — bilateral: D = left-of-screen, E = right-of-screen -->
    <path d="M44 134 Q51 133 57 134 Q58 158 55 184 L38 182 Q37 165 40 150 Z"
          fill="${fill('PernasD', 'Pernas')}" stroke="${stroke('PernasD', 'Pernas')}" stroke-width="0.7" ${glow('PernasD', 'Pernas')} class="transition-all duration-700"/>
    <path d="M76 134 Q69 133 63 134 Q62 158 65 184 L82 182 Q83 165 80 150 Z"
          fill="${fill('PernasE', 'Pernas')}" stroke="${stroke('PernasE', 'Pernas')}" stroke-width="0.7" ${glow('PernasE', 'Pernas')} class="transition-all duration-700"/>
    ${scoreLabel(47, 160, 'PernasD', 'Pernas')}
    ${scoreLabel(73, 160, 'PernasE', 'Pernas')}

    <!-- Calves — bilateral: D = left-of-screen, E = right-of-screen -->
    <path d="M38 186 Q50 185 55 186 Q57 198 53 214 Q50 224 46 224 Q42 224 40 214 Q37 200 38 186 Z"
          fill="${fill('PanturD', 'Pernas')}" stroke="${stroke('PanturD', 'Pernas')}" stroke-width="0.6" opacity="0.78" class="transition-all duration-700"/>
    <path d="M82 186 Q70 185 65 186 Q63 198 67 214 Q70 224 74 224 Q78 224 80 214 Q83 200 82 186 Z"
          fill="${fill('PanturE', 'Pernas')}" stroke="${stroke('PanturE', 'Pernas')}" stroke-width="0.6" opacity="0.78" class="transition-all duration-700"/>

    <!-- Feet -->
    <ellipse cx="46" cy="232" rx="9" ry="4" fill="#1a1a1c" stroke="#3f3f46" stroke-width="0.5"/>
    <ellipse cx="74" cy="232" rx="9" ry="4" fill="#1a1a1c" stroke="#3f3f46" stroke-width="0.5"/>

    <!-- Spine -->
    <line x1="60" y1="42" x2="60" y2="120" stroke="rgba(${rgb},0.20)" stroke-width="0.8" stroke-dasharray="3 2.5"/>

    <!-- Border frame -->
    <rect x="0" y="0" width="120" height="250" rx="6" fill="none" stroke="rgba(${rgb},0.08)" stroke-width="1"/>
  </svg>`;
}
