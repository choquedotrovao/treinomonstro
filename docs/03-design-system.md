# 03 — Design System · ForjaFit

## Identidade

Dark, retro-tech, "battle mode". Nunca usar branco puro ou fundos claros fora do contexto de destaque.

## Variáveis CSS de tema

```css
--theme-primary   /* cor principal (ex: #ef4444 no AMATERASU) */
--theme-accent    /* destaque — versão mais saturada */
--theme-dim       /* fundo com opacidade baixa da cor do tema */
--theme-dark      /* fundo escuro da cor do tema */
--theme-rgb       /* valores R,G,B separados para rgba() */
```

Nunca hardcodar cores do tema — sempre `var(--theme-*)` ou classes Tailwind.

## Classes Tailwind de tema

```
text-theme-primary   bg-theme-dim   border-theme-accent   bg-theme-dark
```

## Paleta semântica

| Classe | Uso |
|---|---|
| `text-green-400` | PR batido, sucesso, progresso ↑ |
| `text-red-400` | Perigo, erro, skip, regressão |
| `text-yellow-400` | Achievement, aviso, deload |
| `text-orange-400` | Streak, motivação |
| `text-blue-400` | Volume, dados numéricos |
| `text-cyan-400` | Cardio |
| `text-purple-400` | Raro, achievement especial |
| `text-zinc-400/500/600` | Texto secundário, inativo |

## Componentes

```html
<!-- Card base -->
<div class="glass-card p-4 rounded-2xl border border-zinc-800/70">

<!-- Botão primário -->
<button class="btn-akatsuki ripple-target w-full py-3 rounded-xl font-black tracking-widest text-sm">

<!-- Botão ativo/selecionado -->
<button class="bg-theme-dim border border-theme-accent text-theme-primary rounded-xl px-3 py-2 ripple-target active:scale-95 transition-all">

<!-- Botão inativo -->
<button class="bg-zinc-800/40 border border-zinc-700/40 text-zinc-500 rounded-xl px-3 py-2 ripple-target active:scale-95 transition-all">

<!-- Botão ícone pequeno -->
<button class="ripple-target w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-all">

<!-- Input numérico -->
<input class="input-ninja w-full px-3 py-2 rounded-xl text-center" type="number">

<!-- Label de seção -->
<h2 class="text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase mb-3">
```

## Regras UX obrigatórias

- **Touch target mínimo:** `min-w-[32px] min-h-[32px]` em todo botão
- **Ripple:** classe `ripple-target` em todo elemento clicável
- **Feedback tátil:** `active:scale-95 transition-all` em botões (ou `active:scale-90` em ícones)
- **Ícones:** `<i data-lucide="nome">` — inicializado via `lucide.createIcons()`
- Nunca usar `scan-line`, `weight`, `swords`, `user-circle` (instáveis nesta versão)

## Temas (10)

| ID | Nome exibido | Cor |
|---|---|---|
| `default` | AMATERASU | `#ef4444` |
| `raiton` | RAITON | `#22d3ee` |
| `emerald` | SAGE | `#4ade80` |
| `violet` | SUSANOO | `#a78bfa` |
| `amber` | KURAMA | `#fbbf24` |
| `rose` | SAKURA | `#fb7185` |
| `performance` | PERFORMANCE | `#3b82f6` |
| `gym` | GYM | `#f97316` |
| `iron` | IRON | `#d4d4d8` |
| `night` | NIGHT | `#6366f1` |

Aplicar: `ThemeService.apply(id)` ou `document.body.dataset.theme = id`.

## Tipografia

| Fonte | Classe | Uso |
|---|---|---|
| Inter | `font-sans` | Corpo, labels, descrições |
| JetBrains Mono | `font-mono` | Números, pesos, dados |
| Nanum Myeongjo | `font-serif` | Títulos épicos, battle report |

Tamanhos frequentes: `text-[9px]` labels · `text-xs` secundário · `text-sm` corpo · `text-3xl font-mono` dados grandes
