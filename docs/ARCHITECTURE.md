# TREINO MONSTRO — Arquitetura Completa

> Referência técnica detalhada. O CLAUDE.md tem o resumo operacional; este arquivo tem o porquê.

---

## Mapa da Arquitetura

```
index.html (shell estático)
  └─ <script type="module"> src/app.js
       └─ AppController (orquestra DOM, routing, modais, header, nav)
            ├─ WorkoutController  (logs, PR, finalizações — sem acesso ao DOM)
            ├─ CardioController   (sessão, GPS, tick — sem acesso ao DOM)
            ├─ Store              (Zustand-like, imutável, Object.freeze)
            │    └─ StorageService (localStorage prefixo monstro_v2_)
            ├─ TimerService · ThemeService · ExportService
            └─ Views/* (render puro → string HTML)
                 ├─ Sharingan.js · CyberBody.js (SVG generators)
                 └─ utils/ dom · format · labels
```

## Fluxo de Dados

```
View HTML (data-action="x" data-payload="y")
  → clique → AppController.#handleAction(action, payload)
    → Controller.method()          ← sem DOM
      → store.setState(patch)      ← Object.freeze
        → subscriber único (AppController)
          ├─ diff pequeno → patch cirúrgico
          └─ diff grande  → re-render completo da seção
```

## Sequência de Bootstrap

```
1. app.js carrega
2. StorageService.loadState(PERSISTED_KEYS, defaults)
3. Migrações: v1→v2 · v2→v3 · PPL order · off slot
4. Store.init(initialState)
5. AppController.init()
     ├─ instancia WorkoutController, CardioController, TimerService
     ├─ descarta sessão fantasma de cardio (>8h)
     ├─ auto-avança slot Off se app aberto em dia novo
     ├─ store.subscribe(subscriber)
     ├─ renderHeader() · renderNav() · renderMain() · mountView()
6. lucide.createIcons()
7. navigator.serviceWorker.register('./sw.js')
```

---

## Decisões Arquiteturais

| Decisão | Motivação |
|---|---|
| Vanilla JS sem framework | XAMPP sem Node.js — qualquer framework exige npm/Vite incompatível com htdocs |
| localStorage only | Dados pessoais offline; zero dependência de rede para o core |
| Patches cirúrgicos (WorkoutView) | Re-render total perde foco de input no Android (cursor some) |
| `cloneNode(false)` no `#renderMain` | Elimina acúmulo de listeners sem gerenciamento manual — fix do bug de decremento duplo |
| Event delegation | Um handler na raiz; sem acúmulo mesmo com re-renders frequentes |
| `Object.freeze` no estado | Diffs por referência em O(1); evita mutações acidentais |
| Subscriber único | Um breakpoint intercepta toda mudança de estado; 100% do render centralizado |
| Lucide CDN fixado em 0.460.0 | Ícones removidos/renomeados em versões futuras quebraram a UI anteriormente |
| Network-first em localhost/ngrok | SW nunca serve JS stale durante desenvolvimento |
| Epley 1RM para PRs | Peso bruto não compara séries de reps diferentes; Epley normaliza para 1RM teórico |
| Guard loop REMOVIDO de finishWorkout() | O loop pulava slots null (Off day) fazendo o ciclo "completar" sozinho ao finalizar Legs B |

---

## Tipos de Dados

### WorkoutHistoryEntry
```js
{
  id:        number,          // Date.now()
  date:      string,          // ISO 8601
  title:     string,
  workoutId: string,          // '1'–'6', 'custom_xxx'
  muscles:   string[],
  vol:       number,          // kg (peso × reps)
  reps:      number,
  duration:  number | null,   // minutos
  notes:     string,
  sets:      { [exId]: SetLog[] },
  mvp:       { name, weight, reps },
  breakdown: { exId, name, vol, maxWeight }[],
  mission:   Mission,
}
```

### Mission
```js
{
  training: { duration, volume, reps, calories },   // MET 5.5
  commute:  { distance, duration, calories, mode } | null,  // walk MET=3.5, bike MET=6.0
  totals:   { duration, calories },
}
// Computado em WorkoutController.finishWorkout() — nunca derivado em runtime
// Rotulado como "Estimativa fisiológica (MET)" — nunca "calorias reais"
```

### SetLog
```js
{ w: string, r: string, done: boolean, warmup?: boolean }
// warmup:true → ignorado em vol/PR/breakdown
```

### PR
```js
{ [exId]: { weight, reps, vol, date } }
// Comparação via Epley 1RM: weight * (1 + reps / 30)
```

### CardioHistoryEntry
```js
{
  date, type, local, distance, duration,   // duration em minutos decimais
  pace,   // "5:36" min:seg/km
  effort, notes, protocolId?, protocolName?, gpsTracked?,
}
```

### ActiveCardioSession
```js
{
  protocolId, startTime,   // Date.now() — campo era "startedAt", renomeado em BUG-001
  blockIndex, blockElapsed, totalElapsed,
  paused, pausedAt,
  gpsPoints: { lat, lng, t }[],
  distanceM, completed?,
}
```

### ActiveCommute
```js
{
  enabled: boolean,
  oneWayDistanceKm: number,
  mode: 'walk' | 'bike',
  estimatedSpeed: number,   // km/h
}
```

### Biometrics (snapshot)
```js
{
  date, weight, height, bodyFat, leanMass, muscleMass, boneMass,
  targetWeight, targetBodyFat,
  // Circunferências (cm): torax cintura abdome quadril escapular
  //   bracoDirContraido bracoEsqContraido bracoDirRelaxado bracoEsqRelaxado
  //   antebracoDireito antebracoEsquerdo coxaDireita coxaEsquerda
  //   panturrilhaDireita panturrilhaEsquerda
  // Pollock 7 (mm): dobraSubescapular dobraTricipital dobraPeitoral
  //   dobraAxilarMedia dobraSupraIliaca dobraAbdominal dobraCoxa
}
```

---

## Regras de Negócio

### Treinos e Logs
- 7 built-in (IDs `'1'`–`'6'`, `'cardio'`). Exercícios sobrescrevíveis em `workoutExercises[id]`. Títulos em `workoutMeta[id]`.
- Custom em `customWorkouts[]` com `isCustom: true`. `#allWorkouts()` = built-in + custom + overrides.
- `logs[wId][exId][idx]` = SetLog. `_c` = override manual de contagem de séries.
- Auto-fill copia `w` e `r` da última sessão com `done: false`.

### Ciclo
- `cycleOrder = ['1','3','2','4','6','5',null]` — 6 treinos + 1 slot Off.
- `cyclePosition` avança 1 ao finalizar treino ou registrar Off/Flex. Slot `null` = Dia Off (não entra em `cycleDone`).
- Reset `cycleDone: [], cycleStart: null` ao fazer wrap (pos volta a 0).
- Reset **manual** via "Reiniciar Ciclo" no Dashboard.

### Progressão de Carga
- `computeLoadTarget()` — analisa até 3 sessões anteriores; resultado arredondado para 0.5kg.
- `suggestWeight(pr, repsStr)` — fallback via Epley quando sem histórico suficiente.

### TDEE
- Katch-McArdle: `BMR = 370 + 21.6 × leanMass`. `TDEE = BMR × activityLevel`.
- Macros: `P = leanMass × 2.0g`, `G = kcal × 25% / 9`, `C = resto`.
- Anotação de deslocamento: média das calorias de `mission.commute` nos últimos 7 dias.

### Streak
- Calculado por datas únicas no histórico. Alerta "Streak em Risco" se não treinou hoje.
- `cardioCountsStreak` — cardio pode contar como dia de streak (configurável).

### Biometria
- `bioHistory` cap 20 · `circumHistory` cap 24 · `cardioHistory` cap 100 · `bodyWeights` cap 365.
- Assimetrias detectadas: braços/antebraços/panturrilha ≥ 0.5cm, coxas ≥ 1.0cm.

---

## Máquinas de Estado

### WorkoutView
```
IDLE → [startWorkout] → EM EXECUÇÃO
  → [toggleSet] → SÉRIE CONCLUÍDA → TimerModal
  → [todas done] → NotesModal → BattleReport → IDLE (navega para TREINOS)
```

### CardioView
```
IDLE → [startProtocol] → RUNNING
  ↔ [pause/resume] ↔ PAUSED
  → [skipBlock] → próximo bloco
  → [completed | abandon] → FinishModal → IDLE (salva cardioHistory)
```

### DashboardView — badges
```
HOJE    = treino do dia no weekPlan, não feito hoje
FEITO   = workoutId está em cycleDone do ciclo atual
PRÓXIMO = cycleOrder[cyclePosition]
OFF     = cycleOrder[cyclePosition] === null
```

---

## Actions Globais (data-action)

| Action | Efeito |
|---|---|
| `start-workout` | Inicia treino → WorkoutView |
| `finish-workout` | Abre NotesModal |
| `confirm-finish-workout` | WorkoutController.finishWorkout() |
| `toggle-set` | Marca série, abre TimerModal |
| `save-log` | WorkoutController.saveLog() |
| `mod-sets` | +/− séries |
| `toggle-warmup` | Marca série como aquecimento |
| `auto-fill` | Copia última sessão |
| `reset-workout` | Limpa logs |
| `start-cardio / start-cardio-protocol` | CardioController.startProtocol() |
| `cardio-pause/resume/skip/abandon` | CardioController methods |
| `finish-cardio / confirm-finish-cardio` | CardioController.finish() |
| `open-cardio-log / save-cardio-log` | Log manual de cardio |
| `save-biometrics / save-weight / delete-weight` | ProfileView biometria |
| `delete-bio-history / delete-workout-history / delete-cardio` | Remove entradas |
| `export-json / export-csv / import-json / reset-data` | Dados |
| `change-theme / toggle-light-mode` | ThemeService |
| `toggle-vibration / toggle-timer-sound / set-weight-increment` | Config treino |
| `toggle-active-commute / set-commute-mode / set-commute-speed / commute-km-live` | Deslocamento |
| `register-off-day / skip-flex-day` | Avança ciclo sem treino |
| `set-cycle-position` | Edita slot do ciclo nas Configurações |
| `reset-week` | Reinicia ciclo |
| `open-workout-editor / save-workout-editor / delete-custom-workout` | Editor |
| `toggle-notifications / save-notification-time` | Push notifications |

---

## Performance — Estratégias

| Técnica | Onde | Por quê |
|---|---|---|
| `cloneNode(false)` | `AppController.#renderMain` | Elimina listener accumulation |
| Event delegation | Todas as views (`mountXxx`) | Um listener por view |
| Patch DOM cirúrgico | WorkoutView | Preserva foco de input no Android |
| `Object.freeze` no estado | Store | Diffs por referência O(1) |
| Subscriber único | AppController | Centraliza decisão de render |
| SVG inline | Sharingan, CyberBody | Zero request extra |
| SW cache-first | sw.js (produção) | Offline + zero latência |

**Intencionalmente ausente:** debounce em inputs de treino · lazy loading de views · memoização de renders.
