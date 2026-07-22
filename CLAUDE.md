# TREINO MONSTRO — v6.5.1 (15/07/2026)

PWA workout tracker gamificado. Vanilla JS ES Modules, Tailwind CDN, localStorage, sem build step.
Roda em XAMPP → `http://localhost/treino-monstro/` | ngrok: `https://survey-sedation-stellar.ngrok-free.dev/treino-monstro/`
**Usuário:** Cláudio Santana · **Projeto:** NINJINHA BOM DE BRIGA

> Arquitetura completa: `docs/ARCHITECTURE.md` · Histórico de sprints: `docs/HISTORY.md`

---

## Regras de Ouro (NUNCA violar)

1. **Views são puras**: `renderXxx(state, data) → string HTML`. Zero efeitos colaterais.
2. **Events via delegation**: nunca `addEventListener` em elementos individualmente — um handler na raiz.
3. **Controllers não tocam o DOM**: só chamam `store.setState()`.
4. **Patches cirúrgicos** durante treino ativo: `patchSetRow / patchExerciseCardState / patchSetsContainer / patchProgressionBadge`. Re-render total só na entrada/saída da view.
5. **Subscriber único** no AppController decide tudo que re-renderiza.
6. **Novo campo persistido**: sempre em `app.js defaults` + `src/store/persistedKeys.js` (fonte única).
7. **Novo modal**: `store.setState({ activeModal: 'id', modalData })` → case em `#renderModal()` → `#showXxx()`.
8. **Nova action**: `data-action="x"` na view → `delegate()` no `mountXxx()` → `case 'x'` em `#handleAction()`.

---

## Stack

| Camada | Tecnologia |
|---|---|
| UI | Tailwind CSS CDN (JIT) + Lucide Icons `0.460.0` (fixado) |
| JS | Vanilla ES Modules (sem framework, sem Node.js) |
| Estado | Store imutável (`Object.freeze`) + subscriber único |
| Persistência | localStorage prefixo `monstro_v2_` via StorageService |
| Offline | Service Worker `monstro-v20` — cache-first prod, network-first localhost/ngrok |

---

## Estrutura de Arquivos

```
src/
├── app.js                   bootstrap + migrações (v1→v2, v2→v3, PPL order, off slot)
├── store/ store.js · persistedKeys.js
├── data/  workouts.js · achievements.js · exerciseLibrary.js · quotes.js · cardioProtocols.js · workoutTemplates.js · exerciseMedia.js
├── services/ StorageService · TimerService · ThemeService · ExportService
├── components/ Sharingan.js · CyberBody.js
├── controllers/ AppController.js · WorkoutController.js · CardioController.js
├── views/ HomeView · DashboardView · WorkoutView · WorkoutEditorView
│          AnalyticsView · ProfileView · SettingsView · CardioView · OnboardingView
└── utils/ dom.js · format.js · labels.js
```

---

## Ciclo (domínio central)

- `cycleOrder`: `['1','2','3',null,'4','5','6',null]` — Push A · Legs A · Pull A · OFF · Push B · Legs B · Pull B · OFF
- Ordem prescrita pelo personal trainer. Push→Legs→Pull garante Deadlift (Legs B) após Push B (zero pré-fadiga do ereitor).
- `cyclePosition`: índice atual (int). Avança 1 a cada treino finalizado ou registro de Off/Flex.
- `cycleDone`: array de IDs feitos no ciclo. Reseta ao voltar para posição 0.
- `cycleGoal`: meta configurável (padrão 6). Slot `null` = Dia Off (não entra em `cycleDone`).
- **Guard loop REMOVIDO** de `finishWorkout()` — null slots não são pulados; landing no Off slot é intencional.
- IDs built-in: `'1'`=Push A · `'2'`=Legs A · `'3'`=Pull A · `'4'`=Push B · `'5'`=Legs B · `'6'`=Pull B

---

## Convenções de Nomeação

| Entidade | Padrão |
|---|---|
| Treino built-in | strings `'1'`–`'6'`, `'cardio'` |
| Treino custom | `custom_${Date.now()}` |
| Exercício built-in | `t{wId}_{n}` ex: `t1_1` |
| Exercício custom | `cex_${Date.now()}_${random}` |
| Chave localStorage | `monstro_v2_{key}` (via StorageService) |

---

## Design System (quick ref)

**CSS vars tema:** `--theme-primary` · `--theme-accent` · `--theme-dim` · `--theme-dark` · `--theme-rgb`
**Tailwind:** `text-theme-primary` · `bg-theme-dim` · `border-theme-accent` · `bg-theme-dark`

| Semântica | Classe |
|---|---|
| Sucesso / PR | `text-green-400` |
| Perigo | `text-red-400` |
| Aviso / achievement | `text-yellow-400` |
| Streak | `text-orange-400` |
| Volume | `text-blue-400` |
| Cardio | `text-cyan-400` |
| Raro | `text-purple-400` |

**Componentes:** card = `glass-card p-4 rounded-2xl border border-zinc-800/70` · btn primário = `btn-akatsuki` · btn ativo = `bg-theme-dim border-theme-accent text-theme-primary` · input = `input-ninja`

**Lucide seguros:** `home dumbbell activity zap trophy calendar clock trending-up circle-user check check-circle x chevron-* history pencil settings database download upload file-text trash-2 plus plus-circle rotate-ccw refresh-cw info alert-triangle timer target flame heart eye ruler cpu palette moon sun`
**Lucide evitar:** `scan-line weight swords user-circle`

**UX obrigatório:** touch target mínimo `min-w-[32px] min-h-[32px]` · ripple em todo botão clicável (`ripple-target`) · feedback `active:scale-95 transition-all`

**Temas (10):** `default`=AMATERASU(#ef4444) · `raiton`=RAITON(#22d3ee) · `emerald`=SAGE(#4ade80) · `violet`=SUSANOO(#a78bfa) · `amber`=KURAMA(#fbbf24) · `rose`=SAKURA(#fb7185) · `performance`(#3b82f6) · `gym`(#f97316) · `iron`(#d4d4d8) · `night`(#6366f1)

---

## Sprint Atual — v6.5.1 (15/07/2026)

**v6.4 — Ciclo PPL + Timed Sets:**

- [x] `cycleOrder` corrigido para `['1','2','3',null,'4','5','6',null]` — Push→Legs→Pull conforme prescrição do personal
- [x] Migração `migrateCycleOrder` unificada — cobre todos os formatos legados
- [x] Guard loop removido de `finishWorkout()` — landing no Off slot é intencional
- [x] DashboardView layout A/B: detecta midNullIdx para split simétrico (4+4 slots)
- [x] `#advanceOffDay()` + auto-advance do init: ambos resetam `cycleDone` ao fazer wrap
- [x] HomeView: streak risk e stale banner suprimidos em Off days
- [x] Ordem Push A: Inclinado → Reto → Declinado → Lateral → Lat. Máquina
- [x] Ordem Legs A: Panturrilha → Agachamento → Stiff → Leg Press → Flexora → Extensora
- [x] Timer de série cronometrada (Prancha 60s): botão "Iniciar" → countdown → auto-done → rest timer
- [x] `parseTimedReps(repsStr)` em `format.js` · `patchTimedSetCountdown()` em WorkoutView

**v6.5 — Tracker + Treino Intelligence:**

- [x] `detectStagnation()` em WorkoutView — badge "Carga estagnada" após 3 sessões iguais
- [x] RPE chips por série (6-10) — aparece quando set marcado done, salvo no log
- [x] `saveRPE()` em WorkoutController — toggle: clica mesmo valor para remover
- [x] Banner de assimetria no Afundo Smith — "Foco no lado E · déficit 1,5cm"
- [x] `asymmetryFocus: 'E'` adicionado ao Afundo Smith em workouts.js
- [x] Nota de variação periódica no Tríceps Testa Cabo (Push B)
- [x] Painel frequência por grupo muscular no Dashboard — barras de progresso por ciclo
- [x] `progressionChips` calculados em `finishWorkout` — exercícios que bateram teto de reps
- [x] Battle Report exibe seção "Pronto para subir carga" com chips verdes
- [x] Deload: ciclo alterado de 3→4 completados (mais realista para PPL duplo)

**v6.5.1 — Hotfix auditoria:**

- [x] **CRÍTICO** AppController.js:1330 — syntax error `'` `` ` `` ` derrubava app inteiro; corrigido para `''`
- [x] WorkoutView RPE row — `done && !warmup` em vez de só `done` (chips não aparecem em séries warmup)
- [x] `computeLoadTarget` — exclui séries warmup do cálculo de peso alvo (`!s.warmup` nos dois filtros)
- [x] SW bumped para `monstro-v20`

**Regras para timed exercises:**
- `reps: 'Xs'` (ex: `'60s'`) detectado por `parseTimedReps()` — set row exibe botão "▶ Iniciar"
- Timer roda no AppController (`#setTimerInterval`), sem estado na store
- Timer cancelado automaticamente ao navegar para fora do WorkoutView

**Regra RPE (v6.5):**
- `log.rpe` = número 6–10 salvo junto ao set no `state.logs`
- Campo backward-compatible: nenhuma migração necessária
- Toggle: clicar mesmo RPE novamente remove (seta `null`)

---

## QA Rápido

- [ ] Push A: confirmar ordem Inclinado → Reto → Declinado → Lateral → Lat. Máquina
- [ ] Legs A: confirmar ordem Panturrilha → Agachamento → Stiff → Leg Press → Flexora → Extensora
- [ ] Prancha Ventral: botão "60s — Iniciar" aparece em vez de input de reps
- [ ] RPE chips aparecem após marcar série done (não aparecem em warmup)
- [ ] Battle Report: seção "Pronto para subir carga" aparece se bateu teto de reps
- [ ] Ciclo: Push A → Legs A → Pull A → OFF → Push B → Legs B → Pull B → OFF → pos 0
