// Todas as funções usam CSS vars (--theme-primary, --theme-accent, --theme-dark)
// definidos por ThemeService.apply(). Strokes dimensionados para legibilidade
// mínima em w-6 (24px) — o menor tamanho de uso no projeto.

const wrap = (cls, spin, content) =>
  `<svg viewBox="0 0 100 100" class="${cls}${spin ? ' spin-slow' : ''}">${content}</svg>`;

// ─── Naruto themes ─────────────────────────────────────────────────────────
// default · raiton · emerald · violet · amber · rose

function sharinganSVG(cls, spin) {
  const id = `sg-${Math.random().toString(36).slice(2, 7)}`;
  return wrap(cls, spin, `
    <defs>
      <radialGradient id="${id}">
        <stop offset="0%"   style="stop-color:var(--theme-primary)"/>
        <stop offset="100%" style="stop-color:var(--theme-accent)"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" style="fill:var(--theme-dark)" stroke="#000" stroke-width="2"/>
    <circle cx="50" cy="50" r="46" fill="url(#${id})"/>
    <circle cx="50" cy="50" r="30" fill="none" style="stroke:var(--theme-dark)" stroke-width="3" opacity="0.6"/>
    <circle cx="50" cy="50" r="8"  fill="black"/>
    <circle cx="50" cy="22" r="7"  fill="black"/>
    <path d="M50 22 Q 62 18 58 35" fill="none" stroke="black" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="74" cy="64" r="7"  fill="black"/>
    <path d="M74 64 Q 72 78 60 70" fill="none" stroke="black" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="26" cy="64" r="7"  fill="black"/>
    <path d="M26 64 Q 20 52 38 56" fill="none" stroke="black" stroke-width="3.5" stroke-linecap="round"/>
  `);
}

// ─── PERFORMANCE — Radar / Data Rings ──────────────────────────────────────
// Arcos tracejados concêntricos que giram como varredura de radar.
// Velocidade de rotação: 7s (via CSS body[data-theme="performance"] .spin-slow)

function dataRingsSVG(cls, spin) {
  const id = `pr-${Math.random().toString(36).slice(2, 7)}`;
  return wrap(cls, spin, `
    <defs>
      <radialGradient id="${id}">
        <stop offset="0%"   style="stop-color:var(--theme-primary)" stop-opacity="0.15"/>
        <stop offset="100%" style="stop-color:var(--theme-dark)"    stop-opacity="1"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#${id})" stroke="#000" stroke-width="2"/>
    <!-- arco externo: varredura principal -->
    <circle cx="50" cy="50" r="43" fill="none" style="stroke:var(--theme-primary)"
            stroke-width="4" stroke-dasharray="180 90" stroke-linecap="round" opacity="0.95"/>
    <!-- arco médio -->
    <circle cx="50" cy="50" r="31" fill="none" style="stroke:var(--theme-primary)"
            stroke-width="3" stroke-dasharray="120 75" stroke-linecap="round" opacity="0.6"/>
    <!-- arco interno -->
    <circle cx="50" cy="50" r="20" fill="none" style="stroke:var(--theme-primary)"
            stroke-width="2.5" stroke-dasharray="75 51" stroke-linecap="round" opacity="0.35"/>
    <!-- mira central -->
    <line x1="50" y1="43" x2="50" y2="34" style="stroke:var(--theme-primary)" stroke-width="3" opacity="0.85"/>
    <line x1="50" y1="57" x2="50" y2="66" style="stroke:var(--theme-primary)" stroke-width="3" opacity="0.85"/>
    <line x1="43" y1="50" x2="34" y2="50" style="stroke:var(--theme-primary)" stroke-width="3" opacity="0.85"/>
    <line x1="57" y1="50" x2="66" y2="50" style="stroke:var(--theme-primary)" stroke-width="3" opacity="0.85"/>
    <circle cx="50" cy="50" r="5.5" style="fill:var(--theme-primary)"/>
  `);
}

// ─── GYM — Hexagonal Power Grid ────────────────────────────────────────────
// Dois hexágonos aninhados + 6 raios. Gira como turbina/engrenagem.
// Velocidade de rotação: 6s

function hexBoltSVG(cls, spin) {
  return wrap(cls, spin, `
    <circle cx="50" cy="50" r="48" style="fill:var(--theme-dark)" stroke="#000" stroke-width="2"/>
    <!-- hexágono externo -->
    <polygon points="50,6 88,28 88,72 50,94 12,72 12,28"
             fill="none" style="stroke:var(--theme-primary)" stroke-width="3.5" opacity="0.9"/>
    <!-- hexágono interno girado 30° -->
    <polygon points="50,20 76.1,35 76.1,65 50,80 23.9,65 23.9,35"
             fill="none" style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.5"
             transform="rotate(30 50 50)"/>
    <!-- 6 raios radiais -->
    <line x1="50"   y1="40"  x2="50"   y2="23"  style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.65"/>
    <line x1="63.9" y1="47"  x2="76.1" y2="39"  style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.65"/>
    <line x1="63.9" y1="53"  x2="76.1" y2="61"  style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.65"/>
    <line x1="50"   y1="60"  x2="50"   y2="77"  style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.65"/>
    <line x1="36.1" y1="53"  x2="23.9" y2="61"  style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.65"/>
    <line x1="36.1" y1="47"  x2="23.9" y2="39"  style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.65"/>
    <!-- núcleo central preenchido -->
    <circle cx="50" cy="50" r="11" style="fill:var(--theme-primary)"/>
    <circle cx="50" cy="50" r="4.5" fill="#000" opacity="0.55"/>
  `);
}

// ─── IRON — CPU / Circuit Board ────────────────────────────────────────────
// Die quadrado com pin traces nos 4 lados. Gira devagar como cooler.
// Velocidade de rotação: 18s
// Strokes reforçados para legibilidade em w-6.

function circuitSVG(cls, spin) {
  return wrap(cls, spin, `
    <circle cx="50" cy="50" r="48" fill="#000" stroke="#111" stroke-width="2"/>
    <!-- frame externo -->
    <rect x="15" y="15" width="70" height="70" fill="none"
          style="stroke:var(--theme-primary)" stroke-width="2.5" rx="3" opacity="0.4"/>
    <!-- die CPU -->
    <rect x="28" y="28" width="44" height="44" fill="none"
          style="stroke:var(--theme-primary)" stroke-width="3.5" rx="2"/>
    <!-- core interno -->
    <rect x="37" y="37" width="26" height="26"
          style="fill:var(--theme-dark);stroke:var(--theme-primary)" stroke-width="2.5" rx="1"/>
    <!-- pin traces — 4 por lado -->
    <line x1="15" y1="36" x2="28" y2="36" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="15" y1="44" x2="28" y2="44" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="15" y1="56" x2="28" y2="56" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="15" y1="64" x2="28" y2="64" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="72" y1="36" x2="85" y2="36" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="72" y1="44" x2="85" y2="44" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="72" y1="56" x2="85" y2="56" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="72" y1="64" x2="85" y2="64" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="36" y1="15" x2="36" y2="28" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="44" y1="15" x2="44" y2="28" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="56" y1="15" x2="56" y2="28" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="64" y1="15" x2="64" y2="28" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="36" y1="72" x2="36" y2="85" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="44" y1="72" x2="44" y2="85" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="56" y1="72" x2="56" y2="85" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <line x1="64" y1="72" x2="64" y2="85" style="stroke:var(--theme-primary)" stroke-width="2.5"/>
    <!-- cruzeta no core -->
    <line x1="50" y1="37" x2="50" y2="63" style="stroke:var(--theme-primary)" stroke-width="1.5" opacity="0.4"/>
    <line x1="37" y1="50" x2="63" y2="50" style="stroke:var(--theme-primary)" stroke-width="1.5" opacity="0.4"/>
    <circle cx="50" cy="50" r="5" style="fill:var(--theme-primary)"/>
  `);
}

// ─── NIGHT — Celestial Orbital ─────────────────────────────────────────────
// Lua crescente no centro com anéis orbitais e estrelas.
// Gira como sistema planetário.
// Velocidade de rotação: 16s

function orbitalSVG(cls, spin) {
  const id = `nt-${Math.random().toString(36).slice(2, 7)}`;
  return wrap(cls, spin, `
    <defs>
      <radialGradient id="${id}" cx="40%" cy="40%">
        <stop offset="0%"   style="stop-color:var(--theme-primary)" stop-opacity="0.2"/>
        <stop offset="100%" style="stop-color:var(--theme-dark)"    stop-opacity="1"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#${id})" stroke="#000" stroke-width="2"/>
    <!-- elipse orbital externa inclinada -->
    <ellipse cx="50" cy="50" rx="43" ry="17" fill="none"
             style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.5"
             transform="rotate(-25 50 50)"/>
    <!-- anel orbital principal -->
    <circle cx="50" cy="50" r="31" fill="none"
            style="stroke:var(--theme-primary)" stroke-width="3" opacity="0.75"/>
    <!-- elipse interna inclinada no outro sentido -->
    <ellipse cx="50" cy="50" rx="18" ry="7" fill="none"
             style="stroke:var(--theme-primary)" stroke-width="2" opacity="0.45"
             transform="rotate(35 50 50)"/>
    <!-- corpo orbitante (satélite) no topo do anel principal -->
    <circle cx="50" cy="19" r="5.5" style="fill:var(--theme-primary)"/>
    <!-- estrelas espalhadas -->
    <circle cx="24" cy="24" r="2.5" style="fill:var(--theme-primary)" opacity="0.55"/>
    <circle cx="72" cy="20" r="1.5" style="fill:var(--theme-primary)" opacity="0.45"/>
    <circle cx="80" cy="68" r="2"   style="fill:var(--theme-primary)" opacity="0.5"/>
    <circle cx="20" cy="68" r="1.5" style="fill:var(--theme-primary)" opacity="0.4"/>
    <circle cx="76" cy="38" r="1.5" style="fill:var(--theme-primary)" opacity="0.35"/>
    <!-- lua crescente no centro -->
    <circle cx="50" cy="50" r="11"  style="fill:var(--theme-primary)"/>
    <circle cx="55" cy="47" r="8.5" style="fill:var(--theme-dark)"/>
  `);
}

// ─── F-91W — LCD Watch Face ────────────────────────────────────────────────
// Face digital do Casio F-91W: case retangular, display LCD, 4 botões laterais,
// segmentos de hora/minuto e barra de segundos.
// Velocidade de rotação: 20s (ponteiro de segundos lento e preciso).

function lcdWatchSVG(cls, spin) {
  return wrap(cls, spin, `
    <circle cx="50" cy="50" r="48" style="fill:var(--theme-dark)" stroke="#000" stroke-width="2"/>
    <!-- case externo -->
    <rect x="18" y="16" width="64" height="68" rx="7"
          fill="none" style="stroke:var(--theme-primary)" stroke-width="3" opacity="0.85"/>
    <!-- LCD bezel -->
    <rect x="24" y="23" width="52" height="54" rx="4"
          fill="none" style="stroke:var(--theme-primary)" stroke-width="2" opacity="0.5"/>
    <!-- LCD screen -->
    <rect x="28" y="27" width="44" height="46" rx="2" style="fill:#0A0A0A"/>
    <!-- Horas — 3 segmentos horizontais -->
    <rect x="31" y="32" width="14" height="3" rx="1" style="fill:var(--theme-primary)" opacity="0.95"/>
    <rect x="31" y="38" width="14" height="3" rx="1" style="fill:var(--theme-primary)" opacity="0.95"/>
    <rect x="31" y="44" width="14" height="3" rx="1" style="fill:var(--theme-primary)" opacity="0.30"/>
    <!-- colon -->
    <rect x="47" y="35" width="3" height="3" rx="0.5" style="fill:var(--theme-primary)" opacity="0.95"/>
    <rect x="47" y="43" width="3" height="3" rx="0.5" style="fill:var(--theme-primary)" opacity="0.95"/>
    <!-- Minutos — 3 segmentos horizontais -->
    <rect x="52" y="32" width="14" height="3" rx="1" style="fill:var(--theme-primary)" opacity="0.95"/>
    <rect x="52" y="38" width="14" height="3" rx="1" style="fill:var(--theme-primary)" opacity="0.95"/>
    <rect x="52" y="44" width="14" height="3" rx="1" style="fill:var(--theme-primary)" opacity="0.95"/>
    <!-- barra de segundos -->
    <rect x="31" y="53" width="35" height="2.5" rx="1" style="fill:var(--theme-primary)" opacity="0.30"/>
    <!-- indicadores data/alarme -->
    <rect x="31" y="60" width="8"  height="2" rx="0.5" style="fill:var(--theme-primary)" opacity="0.55"/>
    <rect x="41" y="60" width="5"  height="2" rx="0.5" style="fill:var(--theme-primary)" opacity="0.30"/>
    <!-- 4 botões laterais (2 esq, 2 dir) -->
    <rect x="8"  y="28" width="7" height="7" rx="2" style="fill:var(--theme-primary)" opacity="0.50"/>
    <rect x="8"  y="50" width="7" height="7" rx="2" style="fill:var(--theme-primary)" opacity="0.50"/>
    <rect x="85" y="28" width="7" height="7" rx="2" style="fill:var(--theme-primary)" opacity="0.50"/>
    <rect x="85" y="50" width="7" height="7" rx="2" style="fill:var(--theme-primary)" opacity="0.50"/>
  `);
}

// ─── GULFMAN — Tactical Sonar ──────────────────────────────────────────────
// Ping submarino: anéis concêntricos + linha de varredura + blips de contato.
// Velocidade de rotação: 10s (varredura de sonar).

function sonarSVG(cls, spin) {
  const id = `sf-${Math.random().toString(36).slice(2, 7)}`;
  return wrap(cls, spin, `
    <defs>
      <radialGradient id="${id}">
        <stop offset="0%"   style="stop-color:var(--theme-primary)" stop-opacity="0.12"/>
        <stop offset="100%" style="stop-color:var(--theme-dark)"    stop-opacity="1"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#${id})" stroke="#000" stroke-width="2"/>
    <!-- anéis de sonar -->
    <circle cx="50" cy="50" r="41" fill="none" style="stroke:var(--theme-primary)" stroke-width="1.5" opacity="0.30"/>
    <circle cx="50" cy="50" r="28" fill="none" style="stroke:var(--theme-primary)" stroke-width="1.5" opacity="0.30"/>
    <circle cx="50" cy="50" r="15" fill="none" style="stroke:var(--theme-primary)" stroke-width="1.5" opacity="0.30"/>
    <!-- linha de varredura (roda junto com o SVG) -->
    <line x1="50" y1="50" x2="91" y2="50" style="stroke:var(--theme-primary)" stroke-width="3" opacity="0.85" stroke-linecap="round"/>
    <!-- blips de contato -->
    <circle cx="73" cy="28" r="3.5" style="fill:var(--theme-primary)" opacity="0.9"/>
    <circle cx="33" cy="37" r="2.5" style="fill:var(--theme-primary)" opacity="0.55"/>
    <circle cx="65" cy="68" r="3"   style="fill:var(--theme-primary)" opacity="0.7"/>
    <circle cx="79" cy="59" r="2"   style="fill:var(--theme-primary)" opacity="0.4"/>
    <circle cx="40" cy="70" r="1.5" style="fill:var(--theme-primary)" opacity="0.35"/>
    <!-- mira central -->
    <line x1="50" y1="43" x2="50" y2="39" style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.9"/>
    <line x1="50" y1="57" x2="50" y2="61" style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.9"/>
    <line x1="43" y1="50" x2="39" y2="50" style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.9"/>
    <line x1="57" y1="50" x2="61" y2="50" style="stroke:var(--theme-primary)" stroke-width="2.5" opacity="0.9"/>
    <circle cx="50" cy="50" r="4" style="fill:var(--theme-primary)"/>
  `);
}

// ─── Public API ────────────────────────────────────────────────────────────

export function renderSharingan(cls = 'w-6 h-6', spin = false, theme = 'default') {
  if (theme === 'performance') return dataRingsSVG(cls, spin);
  if (theme === 'gym')         return hexBoltSVG(cls, spin);
  if (theme === 'iron')        return circuitSVG(cls, spin);
  if (theme === 'night')       return orbitalSVG(cls, spin);
  if (theme === 'gulfman')     return sonarSVG(cls, spin);
  if (theme === 'f91w')        return lcdWatchSVG(cls, spin);
  return sharinganSVG(cls, spin);
}
