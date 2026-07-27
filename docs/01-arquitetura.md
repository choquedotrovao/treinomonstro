# 01 — Arquitetura · ForjaFit

## Mapa de módulos

```
index.html (shell estático)
  └─ <script type="module"> src/app.js
       └─ AppController          ← orquestra DOM, routing, modais, header, nav
            ├─ WorkoutController  ← logs, PR, finishWorkout — ZERO acesso ao DOM
            ├─ CardioController   ← sessão, comutação, tick — ZERO acesso ao DOM
            ├─ Store              ← imutável (Object.freeze), merge shallow
            │    └─ StorageService ← localStorage prefixo monstro_v2_
            ├─ TimerService       ← countdown de descanso entre séries
            ├─ ThemeService       ← aplica CSS vars de tema
            └─ ExportService      ← serializa/importa JSON de backup
                 └─ Views/*       ← render puro → string HTML (zero side-effects)
                      ├─ WorkoutView   — patches cirúrgicos durante treino
                      ├─ DashboardView · HomeView · AnalyticsView · ProfileView
                      ├─ CardioView · SettingsView · OnboardingView
                      ├─ WorkoutEditorView
                      └─ utils/ dom · format · labels
```

## Fluxo de dados

```
View HTML (data-action="toggle-set" data-idx="0")
  → clique → AppController.#handleAction(action, payload)
    → WorkoutController.toggleSet(wId, exId, idx, data)
      → store.setState({ logs: ... })        ← Object.freeze
        → subscriber único (AppController)
          ├─ diff pequeno + treino ativo → patch cirúrgico (patchSetRow, etc.)
          └─ diff grande / troca de view  → re-render completo da seção
```

**Regra de ouro:** AppController é o único subscriber. Controllers não tocam o DOM.

## Sequência de bootstrap

```
1. app.js carrega
2. StorageService.loadState(PERSISTED_KEYS, DEFAULT_STATE)
3. Migrações: migrateLegacyLogs · migrateCycleOrder
4. Store.init(initialState)
5. AppController.init()
     ├─ instancia WorkoutController, CardioController, TimerService
     ├─ descarta sessão cardio fantasma (>8h sem atividade)
     ├─ auto-avança slot OFF se app aberto em dia novo
     ├─ store.subscribe(subscriber)
     └─ renderHeader() · renderNav() · renderMain() · mountView()
6. lucide.createIcons()
7. navigator.serviceWorker.register('./sw.js')
```

## Views e responsabilidades

| View | Tab | Responsabilidade |
|---|---|---|
| `HomeView` | `home` | Dashboard do dia — missão, streak, ciclo, insight |
| `DashboardView` | `treinar` | Seleção de treino, Ver Ciclo, Escolher |
| `WorkoutView` | `workout` | Treino ativo — séries, sets, skip, RPE |
| `AnalyticsView` | `evoluir` | Histórico, PRs, progresso por músculo |
| `CardioView` | `cardio` | Sessão de cardio, comutação, zonas |
| `ProfileView` | `corpo` | Biometria, metas pessoais, conquistas |
| `WorkoutEditorView` | — | Edição de treinos customizados |
| `SettingsView` | — | Preferências, export/import, tema |
| `OnboardingView` | — | Primeira vez — nome, objetivo, experiência |

## Patches cirúrgicos (WorkoutView)

Re-render total durante treino ativo perde o foco de input no Android. Por isso toda mudança de estado durante treino usa patches:

| Função | Quando |
|---|---|
| `patchSetRow(wId, exId, idx, setLog)` | Série marcada/desmarcada, peso/reps alterados |
| `patchSetsContainer(wId, exId, exLogs)` | `_c` (contagem de séries) mudou |
| `patchExerciseCardState(wId, exId, exLogs)` | Estado geral do card (progresso, live vol) |
| `patchProgressionBadge(wId, exId, exLogs)` | Chip de progressão de carga |
| `patchExerciseSkip(container, wId, exId, skipped)` | Exercício pulado/retomado |
| `patchExerciseNote(wId, exId, note)` | Nota editada no exercício |
| `patchTimedSetCountdown(wId, exId, idx, remaining)` | Countdown de série cronometrada |

## Decisões técnicas chave

| Decisão | Motivação |
|---|---|
| Vanilla JS sem framework | XAMPP sem Node.js — sem npm/Vite disponível |
| localStorage only | Dados pessoais offline; zero dependência de rede |
| Patches cirúrgicos | Re-render perde foco de input no Android (bug de cursor) |
| `cloneNode(false)` no renderMain | Elimina acúmulo de listeners sem gerenciamento manual |
| Event delegation | Um handler na raiz; sem acúmulo com re-renders frequentes |
| `Object.freeze` no estado | Diffs por referência O(1); evita mutações acidentais |
| Subscriber único | Um breakpoint intercepta toda mudança; 100% do render centralizado |
| Lucide fixado em 0.460.0 | Ícones renomeados em versões futuras quebraram a UI |
| Network-first em localhost | SW nunca serve JS stale durante desenvolvimento |
| Epley 1RM para PRs | Normaliza comparações entre séries de reps diferentes |
| Ciclo sequencial (+1) | Avanço indexado causava salto de posição ao treinar fora de ordem |

## Service Worker

| Cache | Estratégia |
|---|---|
| `localhost` / `ngrok` | Network-first (nunca serve stale em dev) |
| Produção | Cache-first (offline-first) |

Cache atual: `monstro-v21` — bumpar em `sw.js` ao criar arquivo novo.
