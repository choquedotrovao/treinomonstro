# skill:design-system — v6.6
> Não repete: paleta completa → docs/03-design-system.md · Temas → docs/03-design-system.md
> Este skill adiciona: HTML pronto para copiar, ícones safe-list completa

## CSS vars de tema (sempre usar — nunca hardcode)
`--theme-primary` · `--theme-accent` · `--theme-dim` · `--theme-dark` · `--theme-rgb`
Classes: `text-theme-primary` · `bg-theme-dim` · `border-theme-accent` · `bg-theme-dark`

## Paleta semântica

| Classe | Uso |
|---|---|
| `text-green-400` | PR, sucesso, progressão ↑ |
| `text-red-400` | perigo, skip, regressão |
| `text-yellow-400` | achievement, aviso |
| `text-orange-400` | streak |
| `text-blue-400` | volume, dados |
| `text-cyan-400` | cardio |
| `text-purple-400` | raro |
| `text-zinc-400/500/600` | secundário, inativo |

## Componentes — HTML pronto

```html
<!-- Card base -->
<div class="glass-card p-4 rounded-2xl border border-zinc-800/70">

<!-- Btn primário -->
<button class="btn-akatsuki ripple-target w-full py-3 rounded-xl font-black tracking-widest text-sm">

<!-- Btn ativo (selecionado) -->
<button class="bg-theme-dim border border-theme-accent text-theme-primary rounded-xl px-3 py-2 ripple-target active:scale-95 transition-all">

<!-- Btn inativo -->
<button class="bg-zinc-800/40 border border-zinc-700/40 text-zinc-500 rounded-xl px-3 py-2 ripple-target active:scale-95 transition-all">

<!-- Btn ícone pequeno (touch target mínimo: 32px) -->
<button class="ripple-target w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-all">
  <i data-lucide="x" class="w-4 h-4"></i>
</button>

<!-- Input numérico -->
<input class="input-ninja w-full px-3 py-2 rounded-xl text-center" type="number">

<!-- Label de seção -->
<h2 class="text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase mb-3">
```

## Regras UX

- Touch target mínimo: `min-w-[32px] min-h-[32px]` — todo botão
- Ripple: classe `ripple-target` em todo clicável
- Feedback tátil: `active:scale-95 transition-all` (botões) / `active:scale-90` (ícones)
- Ícones: `<i data-lucide="nome">` — chamar `lucide.createIcons()` após injetar HTML

## Ícones Lucide 0.460.0 — safe-list completa

```
home dumbbell activity zap trophy calendar clock trending-up circle-user
check check-circle x chevron-up chevron-down chevron-left chevron-right
history pencil settings database download upload file-text trash-2
plus plus-circle rotate-ccw refresh-cw info alert-triangle timer target
flame heart eye ruler cpu palette moon sun wind minus equal bar-chart-2
award star shield lock unlock bell volume-2 map-pin navigation bike
footprints layers list grid search filter pie-chart move repeat
```

**EVITAR:** `scan-line` · `weight` · `swords` · `user-circle`

## Tipografia

| Fonte | Classe | Uso |
|---|---|---|
| Inter | `font-sans` | Corpo, labels |
| JetBrains Mono | `font-mono` | Números, dados |
| Nanum Myeongjo | `font-serif` | Títulos épicos |

Tamanhos: `text-[9px]` labels · `text-xs` sec · `text-sm` corpo · `text-3xl font-mono` dados grandes
