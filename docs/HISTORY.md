# TREINO MONSTRO — Histórico de Sprints

> Registro imutável de o que foi feito e por quê. Não editar entradas antigas.

---

## v2.0 — v3.7 (junho/2026)

| Versão | Data | Principais entregas |
|---|---|---|
| v2.0 | 16/06 | Mapeamento inicial: 70 funcionalidades, 10 bugs críticos encontrados |
| v2.3 | 16/06 | 18 fixes: Epley PR, TimerService drift, importJSON confirm, bodyWeights cap, formatTime negativo, NaN editor, touch targets, Lucide 0.460.0, SW v2 |
| v2.4 | 16/06 | GoalGauge, BodyCompChart donut, CircumHistory, SuggestWeight badge, ExercícioEmFoco collapse, programa V-Taper |
| v2.5 | 17/06 | Dados biométricos reais seeded; V-Taper com foco em pernas (Leg Press 45°, Flexora, panturrilha 4x/semana) |
| v3.0 | 17/06 | Ciclo Adaptativo: cycleOrder+cyclePosition, tracker 8 slots, delete bodyWeight, paginação histórico (20/página), auto-reset semanal |
| v3.1 | 17/06 | PERSISTED_KEYS extraído para módulo único; achievements (9 conquistas); badge HOJE persiste; badge PRÓXIMO cycle-based |
| v3.2 | 17/06 | Fix crítico: decremento duplo/triplo (cloneNode false); Cardio: widget HomeView, modal com zonas, protocolos salvos |
| v3.3 | 17/06 | Cardio redesign: modal com 3 tipos + local + presets + pace ao vivo; AnalyticsView reescrita (stats semanais, pace trend, PRs cardio) |
| v3.4 | 17/06 | Push Notifications API; weekly cardio goals (barras de progresso); protocol selector; remoção de dead state |
| v3.5 | 17/06 | Delete de musculação no histórico; sessão fantasma descartada (>8h); delete de avaliação física |
| v3.6 | 17/06 | SW v3 com novos arquivos no cache; fix mountCardio payload; delete-workout-history limpa cycleDone |
| v3.7 | 18/06 | Documentação elevada a ADR + Tech Spec profissional |

---

## v4.0 (11/07/2026) — Sprint Arquitetural

**Grupo A — Domínio de ciclo:**
- cyclePosition em startNewWeek/undoMission/auto-reset corrigidos
- workoutDoneToday por history.some (não por cycleDone)
- nextWorkout cycle-only
- auto-reset mede inatividade real
- save-biometrics sincroniza bodyWeights com guard same-day
- navigate intercepta saída do treino
- staleWeekBanner usa última atividade

**Grupo B1 — Renomeação semântica (9 arquivos):**
- `week → cycleDone` · `weekGoal → cycleGoal` · `weekStart → cycleStart` · `weekResetDays → inactivityResetDays`
- Migração v2→v3 do localStorage + backward-compat no import-json

**Grupo B2:**
- activityLevel removido de SettingsView (duplicata do ProfileView)
- Sparklines de circunferência no ProfileView
- Persistência parcial no subscriber (só salva chaves que mudaram)

**Grupo C:**
- Banner de ciclo completo na HomeView
- Empty state de onboarding
- Achievement toast no battle report + detecção first_pr no subscriber

**Grupo D:**
- 12 IDs de cardio achievement formalizados no ACHIEVEMENT_MAP
- 9 novos achievements: streak_7/30/100, cycle_1/5, session_200, vol_500t
- getWeeklyStreak + card Semanas Ativas no ProfileView
- Metas Pessoais (add/achieve/delete)
- completedCycles no estado
- SW → monstro-v4; export v3.0 com novos campos

---

## v5.1 (12/07/2026) — Estabilização

- **BUG-001**: `startedAt → startTime` em AppController init (cardio sempre descartado no reload)
- **BUG-004**: log rápido de cardio executa pipeline completo de achievements (`checkAchievementsAfterEntry()`)
- **BUG-005**: `delete-workout-history` usa `lastIndexOf` (remove UMA ocorrência)
- **BUG-006**: `delete-workout-history` e `discardLastWorkout` decrementam `cyclePosition` corretamente
- `undoMission` também usa `lastIndexOf`
- HomeView: `cycleComplete` suprime `streakRisk` e `staleWeek`; botão "Novo Ciclo" padronizado

## v5.2 (12/07/2026) — Contexto de Progressão no WorkoutView

- `renderLastSessionContext(exSets, lastDate)` — exibe série a série da sessão anterior por exercício
- Botão "repetir" (auto-fill) movido para junto do label "Última"
- `renderExerciseCard` recebe `lastDate` como 8º parâmetro

## v5.3 (12/07/2026) — Battle Report vs. Sessão Anterior

- Badges globais: Volume ▲/▼/= % e Reps ▲/▼ vs sessão anterior
- Por exercício: carga ▲/▼/= kg + volume %
- Exercícios novos: label "Novo" discreta
- Seção condicional (só renderiza quando existe sessão anterior)

---

## v6.0 (13/07/2026) — Inteligência + Fluidez

- Motor de Insights na Home: 8 sinais priorizados (ciclo quase completo, PRs, streak recorde, negligência muscular, deload, volume ±15%, cardio >5 dias, fato motivacional)
- Próxima Conquista permanente na Home (24 milestones, barra de progresso)
- Volume ao vivo durante treino (`#workout-live-vol` patch cirúrgico + delta vs sessão anterior)
- Som no timer (AudioContext — 3 beeps ascendentes 660→880→1100Hz)
- Exercise drill-down: nome do exercício abre modal PR/histórico sem sair do treino
- Deload detector como insight #5

**Auditoria das Configurações (v6.0):**
- SettingsView reestruturado em 8 seções: TREINO / CICLOS / PLANEJAMENTO / CARDIO / NOTIFICAÇÕES / APARÊNCIA / PERFIL / DADOS
- `vibrationEnabled` · `timerSoundEnabled` · `weightIncrement` (1/2.5/5kg) · descanso movido para TREINO

## v6.1 (13/07/2026) — Temas + Design System

- 4 novos temas: PERFORMANCE · GYM · IRON · NIGHT (total 10)
- Semantic color tokens: `--color-success/danger/warning/info/cardio/streak/rare`
- Sistema de superfícies por tema: 7 CSS vars (`--body-bg`, `--card-bg`, `--card-border`, `--nav-bg`, `--nav-border`, `--header-bg`, `--header-border`)
- Sharingan SVG distinto por tema (radar / hexágono / circuit board / lua)
- Swatch grid 2 colunas no SettingsView
- APP_VERSION → '6.1'

## v6.2 (13/07/2026) — Deslocamento Ativo

- `activeCommute: { enabled, oneWayDistanceKm, mode, estimatedSpeed }` como objeto de domínio
- `Mission: { training, commute, totals }` — objeto raiz em cada WorkoutHistoryEntry
- Seção DESLOCAMENTO ATIVO no SettingsView com preview em tempo real
- Battle Report: bloco Locomoção + totais da missão
- Share text inclui deslocamento e missão total
- Insight I7: compara km deslocamento vs km cardio no ciclo
- ProfileView TDEE: anotação "+X kcal/dia deslocamento ativo (média 7 dias)"
- SW → monstro-v15

---

## v6.3 (15/07/2026) — Ciclo PPL + Slot Off

**Bug root cause identificado e corrigido:**
- Guard loop em `WorkoutController.finishWorkout()` pulava slots `null`, fazendo nextPos saltar o Dia Off e aparentemente "completar" o ciclo ao finalizar Legs B.
- Fix: loop removido. `nextPos = (cyclePosition + 1) % cycleOrder.length` puro.

**Slot Off nativo no ciclo:**
- `cycleOrder` padrão: `['1','3','2','4','6','5',null]` (7 slots)
- Migração `migrateOffSlot`: adiciona null a quem tinha `['1','3','2','4','6','5']`
- `#advanceOffDay()` e auto-advance no init resetam `cycleDone/cycleStart` ao fazer wrap

**DashboardView:**
- Layout A/B: condição `muscleSlots.length === 6` (independente do total de slots)
- `half = Math.floor(muscleSlots.length / 2) = 3`: linha A = Push/Pull/Legs A; linha B = Push/Pull/Legs B + OFF

**SW → monstro-v16**

---

## v6.4 (15/07/2026) — Notas por Exercício + RPE

- Campo `exerciseNotes[wId][exId]` no estado (persistido)
- Botão nota (pencil) em cada card de exercício → modal inline
- `patchExerciseNote(wId, exId, note)` — patch cirúrgico, não re-render
- RPE (Rate of Perceived Exertion) por série: chips 6–10, toggle (clicar mesmo valor = null)
- Warmup sets excluídos de RPE display e cálculo
- Nota aparece no breakdown do battle report e no histórico

## v6.5 (15/07/2026) — QA + Auditoria

- QA de 8 fluxos críticos: ciclo, PRs, skip, patches, persistedKeys
- `computeLoadTarget` exclui warmup sets
- `progressionChips` excluídos para warmup sets
- Correção da ordem muscular Legs A: Extensora antes de Flexora
- SW → monstro-v20

## v6.5.1 (15/07/2026) — Hotfixes

- Syntax error AppController.js:1330 corrigido
- Skip exercise: botão X no card → oculta séries → exclui do finishWorkout (vol/breakdown/MVP/progressionChips)
- `cycleDone` deduplication: `includes(w.id)` antes de `push`
- Ícone `rotate-ccw` quando pulado, `x` quando ativo
- SW → monstro-v21

## v6.6 (27/07/2026) — Ciclo Livre + Timer Dual + Battle Report

- **Modal `cycle-overview`**: 8 slots PPL com estado visual (feito/atual/off/futuro) + botões Treinar
- **Modal `workout-picker`**: lista todos os treinos com badges PRÓXIMO/✓FEITO
- Botões "Ver Ciclo" + "Escolher" no DashboardView (substituem "Novo Ciclo" único)
- **Timer dual**: elapsed de treino (`· treino X min`) separado visualmente do countdown de descanso
- **Battle Report**: duração em destaque como pill badge no hero `⏱ X min · de treino`
- Stats do battle report: Carga Total + Repetições + Séries (duração saiu dos cards para o hero)
- `workoutStartTime` sempre mostra `0 min` ao iniciar (não fica vazio no primeiro minuto)
- ADR-003: ciclo sequencial (+1) vs indexOf — decisão documentada

---

## Débito Técnico — Concluído

Todos os itens listados abaixo foram corrigidos. Mantidos aqui apenas para referência de arqueologia.

| Item | Versão | Fix |
|---|---|---|
| formatDate missing import | v2.3 | Importado corretamente |
| Export JSON incompleto | v2.3 | Todos os campos incluídos |
| Lucide sem versão fixa | v2.3 | Fixado em 0.460.0 |
| Bug decremento duplo séries (Android) | v3.2 | cloneNode(false) em #renderMain |
| PERSISTED_KEYS duplicado | v3.1 | Extraído para persistedKeys.js |
| PR baseado em peso bruto | v2.3 | Epley 1RM |
| TimerService drift no background | v2.3 | Date.now() |
| SW cache name confuso | v3.6 | Versão semântica (monstro-vN) |
| activeCardioSession.startedAt | v5.1 | Renomeado para startTime |
| Guard loop skipava Off day | v6.3 | Loop removido |
| cycleOrder sem slot Off | v6.3 | null como 7º slot |
