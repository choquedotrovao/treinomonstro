# TREINO MONSTRO — Documento Mestre de Contexto

> Versão: 3.6 | Gerado em: 10/07/2026 | Auditor: Claude Sonnet 4.6
> Este documento descreve o código REAL do projeto. Sem resumos. Sem omissões.

---

## 1. VISÃO GERAL DO PRODUTO

**Nome:** Monstro Uchiha: Battle System
**Short name:** MONSTRO
**Usuário:** Cláudio Santana
**Projeto:** NINJINHA BOM DE BRIGA
**Plataforma alvo:** Mobile-first (portrait) via browser
**Ambiente:** XAMPP htdocs → `http://localhost/treino-monstro/`
**Tema visual:** Uchiha/anime/cyber com paleta escura e embers animados

O app é um workout tracker gamificado que funciona como PWA instalável. Roda completamente no lado do cliente — sem backend, sem build step, sem Node.js necessário. Toda a persistência é via `localStorage`. A instalação se dá via Service Worker + manifest.json.

**Abas principais (5):**
1. `home` — saudação, chakra, streak, missão do dia, resumo semanal
2. `treinar` — lista de treinos, ciclo adaptativo, sessão ativa
3. `evoluir` — analytics: heatmap, sparklines, histórico, cardio stats
4. `cardio` — protocolo guiado de corrida/cardio com timer
5. `corpo` — biometria, TDEE, CyberBody SVG, peso corporal

**Abas de sub-tela (sem nav):**
- `workout` — execução ativa de treino
- `workout-editor` — criar/editar treinos
- `settings` — configurações completas

---

## 2. STACK TECNOLÓGICA

| Tecnologia | Versão/URL | Motivo |
|---|---|---|
| HTML5 | estático | shell do app, zero build |
| Tailwind CSS | CDN JIT runtime | sem compilação, ambiente local |
| Lucide Icons | `0.460.0` fixado | ícones SVG inline sem build |
| Vanilla JS | ES Modules nativos | sem framework, sem bundler |
| Service Worker | Workbox manual | cache offline, PWA |
| localStorage | nativo | única persistência, sem backend |

**URL do Tailwind CDN:**
```
https://cdn.tailwindcss.com
```

**URL do Lucide CDN (fixada em 0.460.0):**
```
https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js
```

**Configuração Tailwind customizada no index.html:**
```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'theme-primary': 'var(--theme-primary)',
        'theme-accent':  'var(--theme-accent)',
        'theme-dim':     'var(--theme-dim)',
        'theme-dark':    'var(--theme-dark)',
      }
    }
  }
}
```

---

## 3. ESTRUTURA DE PASTAS COMPLETA

```
treino-monstro/
├── index.html                          ← shell HTML, Tailwind config, ember particles, SW registration
├── manifest.json                       ← PWA manifest (nome, ícones, display, orientation)
├── sw.js                               ← Service Worker (cache monstro-v3, 3 estratégias)
├── icons/
│   └── icon.svg                        ← único ícone (Sharingan SVG)
└── src/
    ├── app.js                          ← entry point: defaults 43 campos, migração v1→v2, bootstrap
    ├── store/
    │   ├── store.js                    ← Observable Store (Zustand-like, Object.freeze)
    │   └── persistedKeys.js            ← 38 chaves que persistem no localStorage
    ├── data/
    │   ├── workouts.js                 ← 7 treinos built-in (IDs: '1'-'6', 'cardio')
    │   ├── quotes.js                   ← frases motivacionais para citação diária
    │   ├── achievements.js             ← 9 conquistas de musculação + ACHIEVEMENT_MAP
    │   ├── exerciseLibrary.js          ← ~70 exercícios para autocomplete do editor
    │   └── cardioProtocols.js          ← 5 protocolos de cardio guiado com blocos
    ├── services/
    │   ├── StorageService.js           ← abstração localStorage com prefixo monstro_v2_
    │   ├── TimerService.js             ← countdown event emitter (tick, complete), drift-corrected
    │   ├── ThemeService.js             ← 6 temas + light mode, CSS vars
    │   └── ExportService.js            ← export JSON (18 campos) + CSV (8 colunas)
    ├── components/
    │   ├── Sharingan.js                ← SVG logo animado (tomoe), ID aleatório anti-colisão
    │   └── CyberBody.js                ← SVG corpo humano com scores por grupo muscular
    ├── controllers/
    │   ├── AppController.js            ← orquestração principal: DOM, routing, modais, header, nav
    │   ├── WorkoutController.js        ← lógica de treino: logs, PR Epley, finalizações, ciclo
    │   └── CardioController.js         ← lógica cardio: blocos, GPS, pace, achievements
    ├── views/
    │   ├── HomeView.js                 ← HOME: saudação, missão, streak, stats, widget cardio
    │   ├── DashboardView.js            ← TREINOS: ciclo adaptativo, cards, cardio section
    │   ├── WorkoutView.js              ← EXECUÇÃO: cards, séries, patches cirúrgicos
    │   ├── WorkoutEditorView.js        ← EDITOR: criar/editar treinos com autocomplete
    │   ├── AnalyticsView.js            ← EVOLUÇÃO: heatmap, sparklines, cardio stats, histórico
    │   ├── ProfileView.js              ← STATUS: biometria, TDEE, CyberBody, peso corporal
    │   ├── CardioView.js               ← CARDIO: protocolo guiado, timer, GPS
    │   └── SettingsView.js             ← CONFIGURAÇÕES: tema, metas, plano, notificações, dados
    └── utils/
        ├── dom.js                      ← $, setHTML, show, hide, delegate, createRipple
        ├── format.js                   ← formatTime, formatDate, formatDateFull, formatVolume, formatDuration, getRank
        └── labels.js                   ← i18n: NINJA (padrão) | NORMAL
```

---

## 4. ARQUITETURA DO SISTEMA

### Padrão Arquitetural

```
Store (imutável, Object.freeze)
     ↑ setState(patch | fn)
     ↓ subscribe(fn)
AppController
  ├── orquestra DOM (header, main, nav, modals)
  ├── detecta diffs precisos no subscriber
  └── delega para:
       ├── WorkoutController (lógica treino)
       ├── CardioController (lógica cardio)
       └── Views (render puro → string HTML)
            └── mount* (event delegation)
```

### Regras de Ouro (não quebrar)

1. **Views são puras**: `renderXxx(state, data) → string HTML`. Zero efeitos colaterais.
2. **Mount registra eventos via delegation** — nunca `addEventListener` em elementos individualmente dentro de views.
3. **WorkoutController não toca o DOM** — só chama `store.setState()`.
4. **CardioController não toca o DOM** — só chama `store.setState()`.
5. **Patches cirúrgicos** durante treino ativo: `patchSetRow`, `patchExerciseCardState`, `patchSetsContainer`, `patchProgressionBadge`, `patchCardioTimer`. Re-render total apenas na entrada/saída da view.
6. **Um subscriber único** no AppController detecta diffs precisos e decide o que re-renderizar.
7. **cloneNode(false)** em `#renderMain` para prevenir acumulação de listeners (bug crítico Android corrigido).
8. **`setHTML(el, html)`** sempre chama `lucide.createIcons()` após injetar HTML.

### Fluxo de Dados

```
Usuário clica → event delegation → #handleAction(action, payload, el)
  → WorkoutController.método() ou CardioController.método() ou store.setState()
    → subscriber dispara → diff de estado
      → patch cirúrgico OU re-render da view
```

### Inicialização (app.js → AppController)

```
DOMContentLoaded
  → StorageService.loadState(PERSISTED_KEYS, DEFAULTS)
  → new Store(loadedState)
  → new AppController({ store, workouts, protocols, timer, theme, storage, exportService })
  → app.attachGlobalRipple()
  → app.init()
    → themeService.apply(state.theme)
    → themeService.applyLightMode(state.lightMode)
    → render(state)
    → bindStore()
    → checkAutoReset()
    → detectStaleSession (>8h → abandon)
    → resumeCardioSession (se activeCardioSession)
    → scheduleNotificationCheck()
  → nav button delegation
```

---

## 5. ESTADO GLOBAL — TODOS OS 43 CAMPOS

O estado é inicializado em `src/app.js` com os seguintes defaults:

```js
{
  // ─── Navegação ──────────────────────────────────────────────────────
  tab:                   'home',          // aba ativa: 'home'|'treinar'|'evoluir'|'cardio'|'corpo'|'workout'|'workout-editor'|'settings'
  activeModal:           null,            // modal ativo: string ou null
  modalData:             null,            // payload do modal: objeto ou null

  // ─── Treino ─────────────────────────────────────────────────────────
  workoutId:             null,            // ID do treino em execução: string ou null
  workoutStartTime:      null,            // timestamp início da sessão: number ou null
  logs:                  {},              // { [wId]: { [exId]: { [idx]: { w, r, done, warmup? } } } }
  history:               [],              // array de entradas de histórico de musculação
  week:                  [],              // IDs de treinos feitos no ciclo atual
  weekStart:             null,            // timestamp início do ciclo: number ou null
  prs:                   {},              // { [exId]: { weight, reps, vol, date } }

  // ─── Ciclo Adaptativo ───────────────────────────────────────────────
  cycleOrder:            ['1','2','3',null,'4','5','6',null], // ordem do ciclo (null = descanso)
  cyclePosition:         0,              // posição atual no ciclo: number

  // ─── Metas ──────────────────────────────────────────────────────────
  weekGoal:              6,              // meta de treinos por ciclo: number 2-7
  weekResetDays:         0,              // auto-reset: 0=OFF, 7, 10, 14 dias

  // ─── Usuário / Perfil ───────────────────────────────────────────────
  userName:              'CLÁUDIO SANTANA',
  projectName:           'NINJINHA BOM DE BRIGA',
  appMode:               'ninja',        // 'ninja' | 'normal'
  theme:                 'default',      // 'default'|'raiton'|'emerald'|'violet'|'amber'|'rose'
  lightMode:             false,

  // ─── Biometria ──────────────────────────────────────────────────────
  biometrics:            null,           // objeto com 30+ campos biométricos
  bioHistory:            [],             // cap 20 snapshots anteriores
  bodyWeights:           [],             // array { date, weight } cap 365
  circumHistory:         [],             // array de medições de circunferência cap 24
  activityLevel:         1.55,           // fator TDEE: 1.2 | 1.375 | 1.55 | 1.725 | 1.9

  // ─── Treinos Customizados ────────────────────────────────────────────
  customWorkouts:        [],             // array de treinos criados pelo usuário
  workoutExercises:      {},             // { [wId]: [exercícios] } overrides de exercícios
  workoutMeta:           {},             // { [wId]: { name, icon } } overrides de meta
  editorWorkout:         null,           // treino sendo editado no WorkoutEditorView

  // ─── Configurações de Treino ─────────────────────────────────────────
  defaultRestTime:       60,             // descanso padrão em segundos: 30|45|60|90|120
  weekPlan:              {0:'6',1:'1',2:'2',3:'3',4:null,5:'4',6:'5'}, // plano semanal por dia (0=dom)
  hiddenSections:        [],             // seções colapsadas no app

  // ─── Conquistas ─────────────────────────────────────────────────────
  achievements:          [],             // array de IDs de conquistas desbloqueadas

  // ─── Cardio ─────────────────────────────────────────────────────────
  cardioHistory:         [],             // array de sessões de cardio, cap 100
  activeCardioSession:   null,           // sessão cardio em andamento ou null
  cardioCountsStreak:    false,          // cardio conta para streak de treino
  weeklyCardioKmGoal:    null,           // meta semanal de km (number ou null)
  weeklyCardioMinGoal:   null,           // meta semanal de minutos (number ou null)
  defaultCardioProtocol: 'zona2-30',    // protocolo padrão no modal cardio

  // ─── Analytics ──────────────────────────────────────────────────────
  analyticsTab:          'musculacao',   // aba ativa no EVOLUÇÃO: 'musculacao'|'cardio'
  historyPage:           0,             // página atual no histórico paginado

  // ─── Notificações ───────────────────────────────────────────────────
  notificationsEnabled:  false,          // Push Notifications habilitadas
  notificationTime:      '08:00',        // horário do lembrete (HH:MM)
  notifLastDate:         null,           // última data que notificação foi disparada
}
```

---

## 6. PERSISTÊNCIA — 38 CHAVES DO localStorage

Arquivo: `src/store/persistedKeys.js`

**Prefixo:** `monstro_v2_` (aplicado pelo StorageService)

Todas as 38 chaves persistidas:

```js
export const PERSISTED_KEYS = [
  'logs',
  'history',
  'week',
  'weekStart',
  'prs',
  'theme',
  'workoutStartTime',
  'bodyWeights',
  'weekGoal',
  'biometrics',
  'bioHistory',
  'customWorkouts',
  'workoutExercises',
  'workoutMeta',
  'appMode',
  'userName',
  'projectName',
  'lightMode',
  'activityLevel',
  'hiddenSections',
  'weekPlan',
  'circumHistory',
  'cycleOrder',
  'cyclePosition',
  'weekResetDays',
  'achievements',
  'cardioHistory',
  'defaultRestTime',
  'activeCardioSession',
  'cardioCountsStreak',
  'weeklyCardioKmGoal',
  'weeklyCardioMinGoal',
  'defaultCardioProtocol',
  'analyticsTab',
  'notificationsEnabled',
  'notificationTime',
  'notifLastDate',
];
```

**Chaves NÃO persistidas** (estado transitório):
- `tab`, `activeModal`, `modalData`, `workoutId`, `editorWorkout`, `historyPage`

**StorageService.loadState(persistedKeys, defaults)**:
- Itera PERSISTED_KEYS
- Para cada key: `storage.get(key, defaults[key])`
- Retorna objeto merged com defaults

**StorageService.saveState(state, persistedKeys)**:
- Itera PERSISTED_KEYS
- Para cada key: `storage.set(key, state[key])`

---

## 7. STORE — OBSERVABLE STORE

Arquivo: `src/store/store.js`

```js
class Store {
  #state;        // objeto frozen (imutável)
  #subscribers;  // Set de funções

  constructor(initialState) {
    this.#state = Object.freeze({ ...initialState });
    this.#subscribers = new Set();
  }

  getState() { return this.#state; }

  setState(updater) {
    const prev = this.#state;
    const patch = typeof updater === 'function' ? updater(prev) : updater;
    this.#state = Object.freeze({ ...prev, ...patch });
    this.#subscribers.forEach(fn => {
      try { fn(this.#state, prev); }
      catch (e) { console.error(e); }
    });
  }

  subscribe(fn) {
    this.#subscribers.add(fn);
    return () => this.#subscribers.delete(fn);  // retorna unsubscribe
  }
}
```

**Características:**
- Estado sempre frozen (Object.freeze) — mutações acidentais lançam erros em strict mode
- `setState` aceita objeto parcial OU função `(prevState) => patch`
- Erros nos subscribers são capturados silenciosamente (console.error)
- Subscriber recebe `(newState, prevState)` para comparação de diffs

---

## 8. SERVICE WORKER

Arquivo: `sw.js`

**Nome do cache:** `monstro-v3`

**35 arquivos em LOCAL_ASSETS:**
```js
'./', './index.html', './manifest.json', './icons/icon.svg',
'./src/app.js',
'./src/store/store.js', './src/store/persistedKeys.js',
'./src/utils/dom.js', './src/utils/format.js', './src/utils/labels.js',
'./src/services/StorageService.js', './src/services/TimerService.js',
'./src/services/ExportService.js', './src/services/ThemeService.js',
'./src/components/Sharingan.js', './src/components/CyberBody.js',
'./src/data/quotes.js', './src/data/workouts.js',
'./src/data/achievements.js', './src/data/exerciseLibrary.js',
'./src/views/HomeView.js', './src/views/DashboardView.js',
'./src/views/WorkoutView.js', './src/views/WorkoutEditorView.js',
'./src/views/AnalyticsView.js', './src/views/ProfileView.js',
'./src/views/SettingsView.js', './src/views/CardioView.js',
'./src/controllers/AppController.js', './src/controllers/WorkoutController.js',
'./src/controllers/CardioController.js',
```

**Três estratégias de cache:**

1. **Recursos externos (CDN)** — Network-first + cache como fallback:
   ```js
   if (url.origin !== self.location.origin) {
     fetch(request)
       .then(res => { caches.open(CACHE).then(c => c.put(request, res.clone())); return res; })
       .catch(() => caches.match(request))
   }
   ```

2. **localhost / ngrok** — Sempre rede (evita JS stale em dev/mobile):
   ```js
   const isDevHost = hostname === 'localhost'
     || hostname.endsWith('.ngrok-free.app')
     || hostname.endsWith('.ngrok-free.dev')
     || hostname.endsWith('.ngrok.app')
     || hostname.endsWith('.ngrok.io');
   if (isDevHost) { fetch(request).catch(() => caches.match(request)) }
   ```

3. **Recursos locais (produção)** — Cache-first:
   ```js
   caches.match(request).then(cached => {
     if (cached) return cached;
     return fetch(request).then(res => {
       caches.open(CACHE).then(c => c.put(request, res.clone()));
       return res;
     });
   });
   ```

**Ciclo de vida:**
- `install`: `caches.open(CACHE).then(c => c.addAll(LOCAL_ASSETS))` + `skipWaiting()`
- `activate`: deleta caches antigos (keys !== CACHE) + `clients.claim()`

---

## 9. PWA / MANIFEST

Arquivo: `manifest.json`

```json
{
  "name": "Monstro Uchiha: Battle System",
  "short_name": "MONSTRO",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "icons/icon.svg", "sizes": "any",     "type": "image/svg+xml" },
    { "src": "icons/icon.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "maskable" },
    { "src": "icons/icon.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "maskable" }
  ]
}
```

**Nota:** Apenas SVG como ícone. Para iOS Safari e some Android launchers, PNG seria necessário em produção.

**Registro do SW no index.html:**
```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}
```

---

## 10. CONTROLLERS

### 10.1 AppController (src/controllers/AppController.js)

O controller principal. Orquestra todo o DOM, routing, modais e delegação para sub-controllers.

**Campos privados:**
```js
#store          // referência ao Store
#workouts       // array de treinos built-in
#cardioProtocols // array de protocolos cardio
#timer          // TimerService instance
#theme          // ThemeService instance
#storage        // StorageService instance
#exportService  // ExportService instance
#workoutCtrl    // WorkoutController instance
#cardioCtrl     // CardioController instance
#header         // elemento DOM do header
#main           // elemento DOM do main-content
#nav            // elemento DOM do mobile-nav
#timerBadge     // elemento DOM do badge do timer
#timerText      // elemento DOM do texto do timer
#timerRing      // elemento SVG do anel do timer
#modalLayer     // elemento DOM do modal-layer
#reportLayer    // elemento DOM do report-layer
#elapsedInterval // setInterval para tempo decorrido no treino
#cardioInterval  // setInterval para tick do cardio (1s)
#cardioGpsWatchId    // ID do watchPosition GPS
#cardioLastGpsPos    // última posição GPS { lat, lng }
#cardioWakeLock      // WakeLock para manter tela acesa no cardio
```

**Método init():**
1. Aplica tema e light mode
2. Chama `#render(state)`
3. Chama `#bindStore()`
4. `#checkAutoReset()` — verifica se deve resetar ciclo automaticamente
5. Detecta sessão fantasma de cardio (>8h → `#cardioCtrl.abandon()`)
6. Retoma cardioInterval se `activeCardioSession` existe
7. Agenda `#checkReminderNotification()`

**Método #bindStore():**
- Subscribe único que recebe `(newState, prevState)`
- Salva estado no localStorage: `#storage.saveState(state, PERSISTED_KEYS)`
- Detecta mudanças e executa:
  - `tab` mudou → `#renderMain(state)`
  - `theme` mudou → `themeService.apply(theme)` + re-render nav
  - `lightMode` mudou → `themeService.applyLightMode(lightMode)`
  - `workoutId` mudou → `#renderMain(state)`
  - `activeModal` mudou → `#renderModal(state)`
  - `logs` mudou durante workout → patches cirúrgicos
  - `activeCardioSession` mudou → patch cardio timer
  - `analyticsTab` mudou → re-render analytics
  - Outros campos → re-render seletivo

**Método #renderMain(state):**
```js
const clone = this.#main.cloneNode(false);  // cloneNode(false) = sem filhos, sem listeners
// switch(state.tab):
case 'home':           setHTML(clone, renderHome(...));  mountHome(...);   break;
case 'treinar':        setHTML(clone, renderDashboard(...)); mountDashboard(...); break;
case 'workout':        setHTML(clone, renderWorkout(...)); mountWorkout(...); break;
case 'workout-editor': setHTML(clone, renderEditor(...)); mountEditor(...); break;
case 'evoluir':        setHTML(clone, renderAnalytics(...)); mountAnalytics(...); break;
case 'corpo':          setHTML(clone, renderProfile(...)); mountProfile(...); break;
case 'cardio':         setHTML(clone, renderCardio(...)); mountCardio(...); break;
case 'settings':       setHTML(clone, renderSettings(...)); mountSettings(...); break;
this.#main.replaceWith(clone);
this.#main = clone;
```

**Método #renderHeader(state):**
5 layouts distintos por tab:
- `home`: logo Sharingan + nome do projeto + botão tema
- `treinar`: título "PROTOCOLOS" + botão reiniciar ciclo
- `workout`: botão voltar + nome do treino + botão finalizar
- `evoluir`: título "EVOLUÇÃO"
- `corpo`: título "STATUS" + botão export PDF
- `cardio`: título "CARDIO" (com sub-info do protocolo ativo)
- `workout-editor`: botão voltar + título "EDITOR"
- `settings`: botão voltar + título "CONFIGURAÇÕES"

**Método #allWorkouts():**
```js
// Retorna WORKOUTS (built-in) + customWorkouts
// Aplica overrides de workoutExercises[id] e workoutMeta[id]
return [...WORKOUTS, ...customWorkouts].map(w => {
  const exercises = workoutExercises[w.id] || w.exercises;
  const meta      = workoutMeta[w.id]      || {};
  return { ...w, ...meta, exercises };
});
```

**Método #handleAction(action, payload, el):**
65+ cases. Listagem completa:

```
// Navegação
'nav-home'         → store.setState({ tab: 'home' })
'nav-treinar'      → store.setState({ tab: 'treinar' })
'nav-evoluir'      → store.setState({ tab: 'evoluir' })
'nav-cardio'       → store.setState({ tab: 'cardio' })
'nav-corpo'        → store.setState({ tab: 'corpo' })
'goto-workouts'    → store.setState({ tab: 'treinar' })
'goto-profile'     → store.setState({ tab: 'corpo' })
'open-settings'    → store.setState({ tab: 'settings' })

// Treino
'start-workout'    → workoutCtrl.startWorkout(wId)
'resume-workout'   → store.setState({ tab: 'workout' })
'finish-workout'   → abre modal 'notes'
'back-from-workout' → store.setState({ tab: 'treinar', workoutId: null })
'toggle-set'       → workoutCtrl.toggleSet(wId, exId, idx, defaultRest)
'save-log'         → workoutCtrl.saveLog(wId, exId, idx, field, value)
'mod-sets'         → workoutCtrl.modSets(wId, exId, delta)
'toggle-warmup'    → workoutCtrl.toggleWarmup(wId, exId, idx)
'auto-fill'        → workoutCtrl.autoFill(wId, exId)
'reset-workout'    → workoutCtrl.resetWorkout(wId) após confirm

// Timer
'open-timer'       → abre modal 'timer' com duration
'start-timer'      → timer.start(seconds)
'stop-timer'       → timer.stop() + fecha modal
'skip-timer'       → fecha modal 'timer'

// Ciclo / Semana
'reset-week'       → workoutCtrl.resetWeek()
'reset-cycle'      → workoutCtrl.resetWeek() (mesma ação)
'start-new-week'   → workoutCtrl.startNewWeek()
'undo-mission'     → workoutCtrl.undoMission(wId)
'discard-workout'  → workoutCtrl.discardLastWorkout(entryId, wId)

// Battle Report
'close-report'     → store.setState({ activeModal: null })
'encerrar-operacao' → fecha report + navega para treinar

// Modais
'notes-submit'     → workoutCtrl.finishWorkout(notes)
'close-modal'      → store.setState({ activeModal: null, modalData: null })

// Cardio
'start-cardio-protocol' → abre modal 'cardio-protocol'
'open-cardio-log'       → abre modal 'cardio-log'
'open-run-tracker'      → abre modal 'run-tracker'
'save-cardio-log'       → salva entrada manual de cardio
'cardio-protocol-select' → cardioCtrl.startProtocol(protocolId)
'cardio-pause'          → cardioCtrl.pause()
'cardio-resume'         → cardioCtrl.resume()
'cardio-skip-block'     → cardioCtrl.skipBlock()
'cardio-finish'         → abre modal 'cardio-finish'
'cardio-abandon'        → cardioCtrl.abandon()
'save-cardio-finish'    → cardioCtrl.finish({ local, effort, notes })
'delete-cardio'         → filtra cardioHistory

// Biometria
'save-biometrics'   → salva state.biometrics + bioHistory (cap 20)
'log-weight'        → adiciona entrada em bodyWeights (cap 365)
'delete-weight'     → filtra bodyWeights
'delete-bio-snap'   → filtra bioHistory

// Treino / Editor
'new-workout'       → store.setState({ tab: 'workout-editor', editorWorkout: novo })
'edit-workout'      → store.setState({ tab: 'workout-editor', editorWorkout: cópia })
'save-workout'      → salva em customWorkouts ou workoutExercises/workoutMeta
'delete-workout'    → filtra customWorkouts ou remove overrides
'add-exercise'      → adiciona exercício ao editorWorkout
'remove-exercise'   → remove exercício do editorWorkout
'move-exercise-up'  → reordena exercícios
'move-exercise-down' → reordena exercícios
'edit-exercise'     → expande form de edição inline
'save-exercise'     → salva campos do exercício no editorWorkout
'back-from-editor'  → store.setState({ tab: 'treinar', editorWorkout: null })

// Configurações
'set-theme'         → themeService.apply(theme) + store.setState({ theme })
'toggle-light-mode' → store.setState({ lightMode: !lightMode })
'toggle-app-mode'   → store.setState({ appMode: modo })
'save-user-name'    → store.setState({ userName })
'save-project-name' → store.setState({ projectName })
'set-week-goal'     → store.setState({ weekGoal: n })
'set-rest-time'     → store.setState({ defaultRestTime: n })
'set-activity-level' → store.setState({ activityLevel: n })
'set-week-plan'     → store.setState({ weekPlan: { ...weekPlan, [day]: wId } })
'set-week-reset'    → store.setState({ weekResetDays: n })
'toggle-cardio-streak' → store.setState({ cardioCountsStreak: !cardioCountsStreak })
'set-cardio-km-goal'  → store.setState({ weeklyCardioKmGoal: n })
'set-cardio-min-goal' → store.setState({ weeklyCardioMinGoal: n })
'set-default-protocol' → store.setState({ defaultCardioProtocol: protocolId })
'toggle-notifications' → solicita permissão + store.setState({ notificationsEnabled })
'set-notification-time' → store.setState({ notificationTime: hhmm })

// Dados
'export-json'       → exportService.exportJSON(state)
'export-csv'        → exportService.exportCSV(state.history)
'import-json'       → confirm + importJSON(file)
'export-pdf'        → window.print()

// Histórico musculação
'load-more-history' → store.setState({ historyPage: historyPage + 1 })
'delete-workout-history' → filtra history[] + filtra week[]
'show-workout-history' → abre modal workout-history
'toggle-analytics-tab' → store.setState({ analyticsTab })

// Seções
'toggle-section'    → adiciona/remove de hiddenSections[]
```

**Método #renderModal(state):**
Switch em `state.activeModal`:
- `'timer'` → `#showTimerModal(state.modalData)`
- `'confirm'` → `#showConfirmModal(state.modalData)`
- `'battle-report'` → `#showBattleReport(state.modalData)`
- `'notes'` → `#showNotesModal()`
- `'cardio-log'` → `#showCardioLogModal(state)`
- `null` → fecha modal (display:none)

Modais chamados diretamente (não via #renderModal):
- `#showStaleSessionModal()`
- `#showWorkoutHistoryModal(wId)`
- `#showCardioProtocolModal(state)`
- `#showCardioFinishModal(state)`
- `#showRunTrackerModal()`

**Notificações PWA:**
```js
#checkReminderNotification() {
  // Só dispara se:
  // - notificationsEnabled === true
  // - Notification.permission === 'granted'
  // - Horário atual >= notificationTime configurado
  // - notifLastDate !== hoje (evita repetição)
  // - Usuário não treinou hoje (history + cardio)
  // Cria: new Notification('MONSTRO', { body: 'Hora de treinar!', icon: '...' })
  // Salva: store.setState({ notifLastDate: hoje })
}
```

### 10.2 WorkoutController (src/controllers/WorkoutController.js)

**Constructor:** `({ store, workouts, timer })`

**Métodos públicos:**

`startWorkout(wId)`:
- Se `workoutId !== wId` → reseta `workoutStartTime: Date.now()`
- `store.setState({ tab: 'workout', workoutId: wId, workoutStartTime })`

`saveLog(wId, exId, idx, field, value)`:
- Atualização imutável aninhada de `logs[wId][exId][idx][field]`
- Preserva todos os outros campos no mesmo nível

`toggleSet(wId, exId, idx, defaultRest)`:
- Inverte `done` da série
- Se passou para `done: true`:
  - Chama `#checkPR(wId, exId, log)`
  - `navigator.vibrate(50)` (mobile haptic)
  - `store.setState({ activeModal: 'timer', modalData: { duration: defaultRest } })`
- Atualização imutável de logs

`modSets(wId, exId, delta)`:
- Lê contagem atual via `_c` ou keys numéricas
- Aplica `delta` (+1 ou -1), mínimo 1
- Salva `_c: novaContagem` em logs[wId][exId]
- Adiciona/remove entradas numéricas preservando dados existentes

`finishWorkout(notes)`:
- Calcula volume total (exclui warmup: `!log.warmup`)
- Calcula total de reps
- Identifica MVP (exercício com maior volume)
- Cria breakdown por exercício
- Calcula duração em minutos
- Cria `entry: { id, workoutId, workoutName, date, duration, volume, reps, notes, sets, mvp, breakdown, achievements }`
- Adiciona ao `history[]`
- Remove `workoutId` do `week[]` (evita duplicata) + adiciona de volta
- `cyclePosition = (cyclePosition + 1) % cycleOrder.length`
- `checkWorkoutAchievements(history, achievements)` + `#checkPR` rewards
- `store.setState({ history, week, cyclePosition, achievements, activeModal: 'battle-report', modalData: entry, workoutId: null, workoutStartTime: null, logs: logsLimpos })`

`toggleWarmup(wId, exId, idx)`:
- Inverte `warmup` flag na série idx

`autoFill(wId, exId)`:
- Busca última sessão no `history[]` com `workoutId === wId`
- Copia `w` e `r` (peso e reps) para cada série com `done: false`

`resetWorkout(wId)`:
- `store.setState({ logs: { ...logs, [wId]: {} } })`

`resetWeek()`:
- `store.setState({ week: [], weekStart: null, cyclePosition: 0 })`

`startNewWeek()`:
- `store.setState({ week: [], weekStart: Date.now() })`

`undoMission(wId)`:
- Remove última ocorrência de `wId` em `week[]`
- Remove último entry no `history[]` com `workoutId === wId`

`discardLastWorkout(entryId, wId)`:
- Filtra `history[]` removendo entry com `id === entryId`
- Remove `wId` de `week[]`

`#checkPR(wId, exId, log)`:
```js
// Guard: reps < 1 ou peso/reps inválidos → return
const w = parseFloat(log.w);
const r = parseInt(log.r);
if (!w || !r || r < 1) return;
const epley = w * (1 + r / 30);  // Fórmula Epley 1RM
const current = prs[exId];
if (!current || epley > current.vol) {
  // Novo PR!
  prs[exId] = { weight: w, reps: r, vol: epley, date: new Date().toISOString() };
  // Conquista first_pr se for o primeiro PR de qualquer exercício
  if (Object.keys(prs).length === 1) {
    achievements = [...achievements, 'first_pr'];
  }
  store.setState({ prs, achievements });
}
```

### 10.3 CardioController (src/controllers/CardioController.js)

**Constructor:** `({ store, protocols })`

`startProtocol(protocolId)`:
```js
const session = {
  protocolId,
  startTime:    Date.now(),
  blockIndex:   0,
  blockElapsed: 0,
  totalElapsed: 0,
  paused:       false,
  pausedAt:     null,
  gpsPoints:    [],
  distanceM:    0,
};
store.setState({ activeCardioSession: session });
```

`tick()`:
- Se `!s || s.paused` → return
- Protocolo `'livre'`: só incrementa blockElapsed e totalElapsed (nunca avança bloco)
- Outros protocolos:
  - Se `newBlock >= block.duration` → avança bloco
  - Se `nextIndex >= protocol.blocks.length` → `completed: true`
  - Senão → `blockIndex: nextIndex, blockElapsed: 0`

`pause()` / `resume()`:
- `pause`: `{ paused: true, pausedAt: Date.now() }`
- `resume`: `{ paused: false, pausedAt: null }`

`skipBlock()`:
- Avança `blockIndex + 1` se não for o último bloco

`addGpsPoint(lat, lng, distanceDelta)`:
- Acumula `distanceM += distanceDelta`
- Push `{ lat, lng, t: Date.now() }` em `gpsPoints[]`

`finish({ local, effort, notes })`:
```js
const durationMin = s.totalElapsed / 60;
const distanceKm  = (s.distanceM || 0) / 1000;
// Pace: se distanceKm >= 0.1 e durationMin > 0
//   paceDecimal = durationMin / distanceKm
//   pace = `${mins}:${secs}` (formato MM:SS por km)
const entry = {
  date:         new Date().toISOString(),
  type:         'corrida',
  local:        local || 'rua',
  distance:     Math.round(distanceKm * 100) / 100,
  duration:     Math.round(durationMin * 100) / 100,
  pace,
  effort:       effort || (protocolId === 'zona2-30' || 'zona2-45' ? 'moderado' : 'forte'),
  notes,
  protocolId:   s.protocolId,
  protocolName: protocol?.name ?? 'Livre',
  gpsTracked:   (s.gpsPoints || []).length > 0,
};
const cardioHistory = [entry, ...prev].slice(0, 100);
```

`abandon()`:
- `store.setState({ activeCardioSession: null })`

**Achievements de cardio verificados em `#checkAchievements`:**

| ID | Critério |
|---|---|
| `cardio_first` | sessions >= 1 |
| `cardio_5` | sessions >= 5 |
| `cardio_10` | sessions >= 10 |
| `cardio_25` | sessions >= 25 |
| `cardio_50` | sessions >= 50 |
| `cardio_10km` | totalKm >= 10 |
| `cardio_50km` | totalKm >= 50 |
| `cardio_100km` | totalKm >= 100 |
| `cardio_250km` | totalKm >= 250 |
| `cardio_vo2_first` | tem sessão com protocolId === 'vo2max-4x4' |
| `cardio_pace_sub5` | bestPace <= 5.0 min/km |
| `cardio_pace_sub4_5` | bestPace <= 4.5 min/km |

`#bestPaceKm(cardioHistory)`:
- Filtra entradas com pace string e distance >= 1 km
- Parseia `"MM:SS"` → decimal (ex: "5:30" → 5.5)
- Retorna Math.min(...paces) ou null

---

## 11. VIEWS

Todas as views são funções puras: `renderXxx(state, data) → string HTML`.
O AppController chama `setHTML(container, html)` + `mountXxx(container, handler)`.

### 11.1 HomeView (src/views/HomeView.js)

**getStreak(history, cardioHistory, cardioCountsStreak):**
- Merge de datas únicas: `history[]` + (se `cardioCountsStreak`) `cardioHistory[]`
- Conta dias consecutivos de hoje para trás (para no primeiro dia sem treino)
- Retorna número

**renderHome(state, workouts, protocols):**
Seções renderizadas:
1. **Hero** — saudação por período (bom dia/tarde/noite), nome do usuário, rank, quote diária
2. **Banner de resumo** — se workoutId ativo: "Sessão em andamento"
3. **Banner stale week** — se weekStart há mais de weekResetDays → alerta
4. **Missão do Dia** — próximo treino do cycleOrder[cyclePosition] ou weekPlan[today]
   - Badge "FEITO" se wId já está em week[]
5. **Streak risk** — se streak > 0 e não treinou hoje
6. **Bio overdue** — se biometrics.date < 30 dias atrás
7. **Stats grid** — total de treinos, semana, streak, peso atual
8. **Weekly progress** — barra de progresso week.length / weekGoal
9. **Cardio widget** — última corrida (pace, distância, esforço) + stats 7 dias + CTA quick-log
10. **Goal Gauge** — visualização circular da meta semanal

**mountHome(container, handler):**
Delega: `resume-workout`, `start-workout`, `goto-workouts`, `goto-profile`, `start-new-week`, `start-cardio-protocol`, `open-cardio-log`

### 11.2 DashboardView (src/views/DashboardView.js)

**renderDashboard(state, workouts, protocols):**
Seções:
1. **Banner resumo** — se workout ativo
2. **Ciclo adaptativo tracker** — 8 slots visuais mostrando cycleOrder + posição atual
3. **Cards de treino** — para cada workout em allWorkouts():
   - Badge `HOJE` — se weekPlan[today] === wId
   - Badge `PRÓXIMO` — se cycleOrder[cyclePosition] === wId (e não está em week[])
   - Badge `FEITO` — se week[] inclui wId
   - Botões: Iniciar, Editar, Histórico, Desfazer
4. **Seção cardio** — progress bars se weeklyCardioKmGoal ou weeklyCardioMinGoal definidos
5. **Botão "Novo Treino"** — abre WorkoutEditorView

**mountDashboard(container, handler):**
Delega: `start-workout`, `resume-workout`, `undo-mission`, `reset-week`, `reset-cycle`, `new-workout`, `edit-workout`, `show-workout-history`, `open-cardio-log`, `start-cardio-protocol`

### 11.3 WorkoutView (src/views/WorkoutView.js)

**Funções auxiliares:**

`countSets(exLogs, defaultSets)`:
- Verifica `_c` override primeiro
- Depois conta keys numéricas em exLogs
- Retorna número de séries

`computeLoadTarget(workoutHistory, exId)`:
- Analisa até 3 sessões anteriores do mesmo treino
- Para cada sessão: coleta sets com w e r não-warmup
- Calcula volume médio por sessão
- Calcula delta entre sessões
- Sugere alvo arredondado para 0.5kg
- Retorna `{ target, direction }` ou null

`suggestWeight(pr, repsStr)`:
- Extrai min reps do repsStr (ex: "8-10" → 8)
- Calcula 1RM Epley do PR: `pr.weight * (1 + pr.reps / 30)`
- Inverte Epley para targetReps: `1RM / (1 + targetReps / 30)`
- Arredonda para 0.5kg
- Retorna número

`getProgressionBadge(exLogs, lastExSets)`:
- Compara série atual com última sessão
- Retorna `{ text, color, bg }` ou null

**Patches cirúrgicos exportados:**

`patchSetRow(container, wId, exId, idx, log, pr)`:
- Substitui o elemento `[data-set-row="${wId}-${exId}-${idx}"]`
- Atualiza: done state, 1RM display, estilos

`patchExerciseCardState(container, wId, exId, logs, workout)`:
- Atualiza o card inteiro do exercício (header, contador de séries completas)

`patchSetsContainer(container, wId, exId, logs, workout)`:
- Re-renderiza apenas o container de séries do exercício

`patchProgressionBadge(container, wId, exId, state)`:
- Atualiza apenas o badge de progressão de carga

**Render do set row:**
- Botão W (warmup toggle)
- Input de peso (kg)
- Input de reps
- Botão check (marcar série)
- Display de 1RM calculado (se série feita)

### 11.4 WorkoutEditorView (src/views/WorkoutEditorView.js)

**renderExerciseRow(ex, idx, total):**
- Ícone grip (drag visual)
- Botões: editar, mover up, mover down, remover
- Nome e configuração resumida

**renderExerciseEditForm(ex, idx):**
- Input nome (com `list` para autocomplete da exerciseLibrary)
- Sets picker (1-6 botões)
- Input reps (text, ex: "8-12")
- Input rest (number, segundos)
- Input note (texto livre)

**renderExercisesListHTML(exercises):**
- Exportada para patch cirúrgico após reordenação

### 11.5 AnalyticsView (src/views/AnalyticsView.js)

**renderCalendarHeatmap(history, hiddenSections):**
- Grid de 91 dias (13 semanas)
- Opacidade variável baseada em volume do dia
- Dias com treino: cor temática; sem treino: zinc escuro

**renderSparkline(values, w, h):**
- SVG polyline simples
- Normaliza valores para height
- Retorna string SVG

**Seção Cardio:**
- Stats semanais: km, sessões, ritmo médio ponderado
- Pace trend chart: SVG com últimas 8 corridas
- PRs: melhor ritmo geral, melhor pace 5km, maior distância
- Lista recente com: data, distância, pace, esforço, local, tipo

**Histórico paginado:**
- 20 entradas por página
- Botão "Carregar mais" (`load-more-history`)
- `historyPage` controla quantas páginas foram carregadas

### 11.6 ProfileView (src/views/ProfileView.js)

**getBestStreak(history):**
- Extrai datas únicas do histórico
- Ordena cronologicamente
- Encontra sequência consecutiva mais longa
- Retorna número de dias

**Campos biométricos (30+):**
```
weight, height, bodyFat, leanMass, muscleMass, boneMass,
targetWeight, targetBodyFat,
// Circunferências (15):
ombro, torax, escapular, cintura, abdome, quadril,
bracoDirContraido, bracoEsqContraido,
antebraçoDireito, antebraçoEsquerdo,
coxaDireita, coxaEsquerda,
joelhoDireito, joelhoEsquerdo,
panturrilhaDireita, panturrilhaEsquerda,
// Dobras cutâneas (7):
dobraAbdominal, dobraTorax, dobraCoxa,
dobraTricipal, dobraSuprailiaca,
dobraSubscapular, dobraAxilarMedia
```

**Cálculo TDEE (Katch-McArdle):**
```
leanMass = weight × (1 - bodyFat/100)
BMR = 370 + 21.6 × leanMass
TDEE = BMR × activityLevel
proteina = leanMass × 2.0  (gramas)
gordura  = TDEE × 0.25 / 9  (gramas)
carbo    = (TDEE - proteina×4 - gordura×9) / 4  (gramas)
```

**renderBiometricsSection** — form com todos os campos + detecção de assimetrias:
- Braços/antebraços: ≥0.5cm → alerta
- Coxas: ≥1.0cm → alerta
- Panturrilhas: ≥0.5cm → alerta

**bioHistory**: cap 20; ao salvar nova biometria, push do snapshot anterior.

### 11.7 CardioView (src/views/CardioView.js)

**renderCardio(state, protocols):**
- Se `!activeCardioSession` → tela idle: seletor de protocolo + CTA
- Se `activeCardioSession` → tela ativa:
  - Nome do bloco atual
  - Timer visual (blockElapsed / block.duration)
  - Total elapsed
  - Distância GPS (se gpsTracked)
  - Instrução do bloco
  - Botões: Pausar/Retomar, Pular Bloco, Finalizar, Abandonar

**patchCardioTimer(state, protocols):**
- Atualiza apenas os elementos de tempo e instrução
- Não re-renderiza o layout todo

**mountCardio(container, handler):**
Delega: `cardio-protocol-select`, `cardio-pause`, `cardio-resume`, `cardio-skip-block`, `cardio-finish`, `cardio-abandon`, `open-run-tracker`

### 11.8 SettingsView (src/views/SettingsView.js)

**ACTIVITY_LEVELS:**
```js
{ value: 1.2,   label: 'Sedentário',  sub: 'sem exercício' }
{ value: 1.375, label: 'Leve',        sub: '1–3× / semana' }
{ value: 1.55,  label: 'Moderado',    sub: '3–5× / semana' }
{ value: 1.725, label: 'Ativo',       sub: '6–7× / semana' }
{ value: 1.9,   label: 'Muito Ativo', sub: '2× / dia' }
```

**Seções:**
1. **Perfil** — input nome, input nome do projeto
2. **Aparência** — 6 swatches de tema, toggle light mode, toggle ninja/normal
3. **Meta** — weekGoal slider/buttons (2-7), weekResetDays (OFF/7/10/14)
4. **Descanso** — defaultRestTime buttons (30/45/60/90/120s)
5. **Plano Semanal** — selects por dia (Dom-Sáb), cada um com lista de treinos
6. **Cardio** — cardioCountsStreak toggle, weeklyCardioKmGoal, weeklyCardioMinGoal, defaultCardioProtocol select, activityLevel select
7. **Notificações** — toggle permissão, input horário (HH:MM)
8. **Dados** — Export JSON, Export CSV, Import JSON (com confirm), Reset total (com confirm duplo)

---

## 12. COMPONENTES

### 12.1 Sharingan (src/components/Sharingan.js)

```js
export function renderSharingan(cls = 'w-6 h-6', spin = false, theme = 'default')
```

- Gera ID aleatório para `radialGradient` (evita colisão quando múltiplos Sharingans na página)
- Dois temas de cor:
  - `raiton`: `#22d3ee` (ciano) e `#0891b2`
  - todos os outros: vermelho (`#ef4444`) e `#b91c1c`
- SVG com: círculo externo, círculo iris, 3 tomoe (cada tomoe = círculo + path curvado)
- `spin = true` → adiciona classe `animate-spin`

### 12.2 CyberBody (src/components/CyberBody.js)

**REFS (medidas masculinas de referência em cm):**
```js
Ombros:       94
Peito:        98
Costas:       112
Braços:       35
Abs:          82
Pernas:       54
Panturrilhas: 37
```

**scoresFromCircumferences(c):**
- `norm(val, ref) = val > 0 ? Math.min(1, val / ref) : 0`
- `bi(d, e) = [d || e || 0, e || d || 0]` (bilateral fallback)
- Mapeia:
  ```
  Ombros  → norm(c.escapular, REFS.Costas)
  Peito   → norm(c.torax, REFS.Peito)
  Costas  → norm(c.escapular, REFS.Costas)
  BraçoD  → norm(bracoDirContraido || bracoEsqContraido, REFS.Braços)
  BraçoE  → norm(bracoEsqContraido || bracoDirContraido, REFS.Braços)
  Abs     → norm(c.abdome, REFS.Abs)
  PernasD → norm(coxaDireita || coxaEsquerda, REFS.Pernas)
  PernasE → norm(coxaEsquerda || coxaDireita, REFS.Pernas)
  PanturD → norm(panturrilhaDireita || panturrilhaEsquerda, REFS.Panturrilhas)
  PanturE → norm(panturrilhaEsquerda || panturrilhaDireita, REFS.Panturrilhas)
  ```

**renderCyberBody(scores, height=260, theme='default', circumferences=null):**
- Lê CSS var `--theme-rgb` para cor temática
- Se `circumferences` passadas E `bracoDirContraido` existe → usa `scoresFromCircumferences`
- Senão usa `scores` diretamente (frequência de treino por grupo)
- `fill(…keys)`: cor de preenchimento baseada no score (0.1 a 1.0 de opacidade)
- `stroke(…keys)`: cor do stroke (0.25 a 0.80 de opacidade)
- `glow(…keys)`: adiciona `filter="url(#cglow)"` se score > 0.5
- `scoreLabel(x, y, …keys)`: texto percentual se score > 0
- **Camada de gordura (bodyFat)**:
  - `fatAlpha = min(0.50, max(0, (bodyFat - 8) / 22 * 0.50))`
  - Invisível em ≤8% BF; máxima opacidade (0.50) em ≥30% BF
  - Renderiza ellipse âmbar radial sobre o abdômen
- **Partes do corpo SVG renderizadas:**
  - Head (circle + detalhes faciais)
  - Neck (path)
  - Torso base (path)
  - Shoulders bilateral (2 paths)
  - Chest bilateral (2 paths)
  - Back/Lats bilateral (2 paths)
  - Abs (path + linhas horizontais)
  - Body fat overlay (ellipse condicional)
  - Upper Arms bilateral (2 paths)
  - Forearms bilateral (2 paths, opacity 0.75)
  - Hip bridge (path)
  - Quads bilateral (2 paths)
  - Calves bilateral (2 paths, opacity 0.78)
  - Feet bilateral (2 ellipses)
  - Spine (linha tracejada vertical)
  - Circuit detail lines (4 linhas decorativas)
  - Border frame (rect rx=6)

---

## 13. SERVICES

### 13.1 StorageService (src/services/StorageService.js)

**Prefixo:** `monstro_v2_`

```js
get(name, fallback)     → JSON.parse(localStorage.getItem(prefix + name)) ?? fallback
set(name, value)        → localStorage.setItem(prefix + name, JSON.stringify(value))
remove(name)            → localStorage.removeItem(prefix + name)
clearAll()              → remove todas as keys com prefixo
loadState(keys, defaults) → { chave: get(chave, defaults[chave]) para cada key }
saveState(state, keys)  → keys.forEach(k => set(k, state[k]))
```

Todos os métodos em try/catch com `console.warn` em caso de erro (ex: localStorage cheio).

### 13.2 TimerService (src/services/TimerService.js)

**Estado interno:**
```js
#interval   // setInterval handle
#endTime    // Date.now() + seconds * 1000
#total      // duração total em segundos
#listeners  // { tick: Set, complete: Set }
```

`start(seconds)`:
- `this.#endTime = Date.now() + seconds * 1000`
- `this.#total = seconds`
- `setInterval(() => { remaining = Math.max(0, Math.ceil((#endTime - Date.now()) / 1000)); emit('tick', remaining); if (remaining <= 0) { emit('complete'); stop(); } }, 500)`

`stop()`:
- `clearInterval(#interval); #interval = null; #endTime = null; #total = null`

`on(event, fn)`:
- Adiciona fn ao Set de listeners do evento
- Retorna função de unsubscribe

**Correção de drift:** usa `Date.now()` em vez de contador — o timer é preciso mesmo em background.

### 13.3 ThemeService (src/services/ThemeService.js)

**6 temas disponíveis:**

| Key | Nome | primary | accent | dim | dark | rgb |
|---|---|---|---|---|---|---|
| `default` | AMATERASU | `#ef4444` | `#dc2626` | `rgba(239,68,68,0.1)` | `rgba(239,68,68,0.05)` | `220,38,38` |
| `raiton` | RAITON | `#22d3ee` | `#0891b2` | `rgba(34,211,238,0.1)` | `rgba(34,211,238,0.05)` | `34,211,238` |
| `emerald` | SAGE MODE | `#4ade80` | `#16a34a` | `rgba(74,222,128,0.1)` | `rgba(74,222,128,0.05)` | `74,222,128` |
| `violet` | SUSANOO | `#a78bfa` | `#7c3aed` | `rgba(167,139,250,0.1)` | `rgba(167,139,250,0.05)` | `167,139,250` |
| `amber` | KURAMA | `#fbbf24` | `#d97706` | `rgba(251,191,36,0.1)` | `rgba(251,191,36,0.05)` | `251,191,36` |
| `rose` | SAKURA | `#fb7185` | `#e11d48` | `rgba(251,113,133,0.1)` | `rgba(251,113,133,0.05)` | `251,113,133` |

`apply(theme)`:
- `document.documentElement.style.setProperty('--theme-primary', cfg.primary)`
- `document.documentElement.style.setProperty('--theme-accent', cfg.accent)`
- `document.documentElement.style.setProperty('--theme-dim', cfg.dim)`
- `document.documentElement.style.setProperty('--theme-dark', cfg.dark)`
- `document.documentElement.style.setProperty('--theme-rgb', cfg.rgb)`
- `document.body.setAttribute('data-theme', theme)`

`applyLightMode(enabled)`:
- `document.body.toggleAttribute('data-light-mode', enabled)` (ou setAttribute/removeAttribute)

`toggle()`:
- Pega a próxima key no array de keys do THEMES
- Chama `apply(nextKey)`

### 13.4 ExportService (src/services/ExportService.js)

`exportJSON(state)`:
- Cria objeto com 18 campos:
  ```
  history, logs, prs, week, weekStart, weekGoal, biometrics, bioHistory,
  bodyWeights, customWorkouts, workoutExercises, workoutMeta, circumHistory,
  achievements, cardioHistory, weekPlan, cycleOrder, cyclePosition
  ```
- `JSON.stringify(data, null, 2)`
- Cria Blob + link download
- Filename: `monstro_backup_YYYY-MM-DD.json`

`exportCSV(history)`:
- BOM UTF-8 (`﻿`) para compatibilidade Excel
- 8 colunas: `Data,Treino,Volume(kg),Reps,Duração(min),MVP,Nota,Conquistas`
- Filename: `monstro_historico_YYYY-MM-DD.csv`

---

## 14. UTILS

### 14.1 dom.js (src/utils/dom.js)

```js
// Seleciona elemento
$(selector, context = document) → context.querySelector(selector)

// Injeta HTML e atualiza ícones Lucide
setHTML(el, html) {
  el.innerHTML = html;
  if (window.lucide) lucide.createIcons({ el });
}

// Delegation de eventos
delegate(container, selector, eventType, handler) {
  container.addEventListener(eventType, e => {
    const target = e.target.closest(selector);
    if (target && container.contains(target)) handler(e, target);
  });
}

// Ripple effect
createRipple(e, element) {
  // Cria div.ripple posicionada, anima e remove após 600ms
}

// Show/hide com CSS
show(el) { el.style.display = ''; el.removeAttribute('hidden'); }
hide(el) { el.style.display = 'none'; }

// Botão de ocultar seção
sectionHideBtn(id, hiddenSections) → HTML button com data-action="toggle-section"

// Substitui elemento no DOM
replaceElement(el, newHtml) {
  const temp = document.createElement('div');
  temp.innerHTML = newHtml;
  el.replaceWith(temp.firstElementChild);
}
```

### 14.2 format.js (src/utils/format.js)

```js
// Formata segundos para MM:SS (nunca negativo)
formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

// Formata ISO string para dd/mm/yy
formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'2-digit' });
}

// Formata ISO string para dd/mm/yy HH:MM
formatDateFull(isoString) {
  return new Date(isoString).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' });
}

// Formata volume em kg ou toneladas
formatVolume(kg) {
  return kg >= 1000 ? `${(kg/1000).toFixed(1)}t` : `${kg}kg`;
}

// Formata duração em minutos
formatDuration(minutes) {
  if (minutes < 60) return `${Math.round(minutes)}min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// Retorna rank baseado em contagem de treinos
getRank(workoutCount) {
  if (workoutCount >= 100) return 'JONIN';
  if (workoutCount >= 50)  return 'CHUNIN';
  if (workoutCount >= 10)  return 'GENIN';
  return 'ATLETA';
}
```

### 14.3 labels.js (src/utils/labels.js)

```js
export function getLabels(appMode) {
  return appMode === 'normal' ? NORMAL : NINJA;
}
```

**NINJA labels (padrão):**
```
mode: 'ninja'
workoutSingular: 'Protocolo'
workoutPlural: 'Protocolos'
historyLabel: 'Missões'
streakLabel: 'Sequência de Batalhas'
weekLabel: 'Ciclo'
weekUnit: 'missões'
startBtn: 'INICIAR PROTOCOLO'
finishBtn: 'FINALIZAR MISSÃO'
closeReport: 'ENCERRAR OPERAÇÃO'
reportTitle: 'BATTLE REPORT'
doneTile: 'MISSÃO CONCLUÍDA'
doneSub: 'Guerreiro, você entregou tudo hoje.'
emptyHistory: 'Nenhuma missão registrada'
emptyHistorySub: 'Sua primeira batalha aguarda.'
lastWorkout: 'Última missão'
todayMission: 'Missão de Hoje'
progressLabel: 'Progresso do Ciclo'
resetWeekBtn: 'Reiniciar Ciclo'
chakra{label,none,low,mid,high,full}: valores temáticos Naruto
greeting{morning,afternoon,night}: saudações ninja
```

**NORMAL labels:**
```
mode: 'normal'
workoutSingular: 'Treino'
workoutPlural: 'Treinos'
historyLabel: 'Histórico'
streakLabel: 'Sequência'
weekLabel: 'Semana'
weekUnit: 'treinos'
startBtn: 'INICIAR TREINO'
finishBtn: 'FINALIZAR TREINO'
closeReport: 'FECHAR RELATÓRIO'
reportTitle: 'RELATÓRIO DE TREINO'
doneTile: 'TREINO CONCLUÍDO'
doneSub: 'Bom trabalho hoje!'
emptyHistory: 'Nenhum treino registrado'
emptyHistorySub: 'Comece agora!'
lastWorkout: 'Último treino'
todayMission: 'Treino de Hoje'
progressLabel: 'Progresso Semanal'
resetWeekBtn: 'Reiniciar Semana'
chakra{...}: equivalentes sem tema ninja
greeting{morning,afternoon,night}: saudações normais
```

---

## 15. ESTRUTURAS DE DADOS

### 15.1 History Entry (musculação)

```js
{
  id:          string,          // `${Date.now()}_${workoutId}`
  workoutId:   string,          // '1'-'6' | 'cardio' | 'custom_...'
  workoutName: string,          // nome do treino no momento
  date:        string,          // ISO 8601
  duration:    number,          // minutos decimais
  volume:      number,          // kg totais (excl. warmup)
  reps:        number,          // total de repetições (excl. warmup)
  notes:       string,          // nota do usuário (pode ser '')
  sets:        number,          // total de séries completadas (excl. warmup)
  mvp:         string | null,   // nome do exercício com maior volume
  breakdown:   object,          // { [exName]: { sets, reps, volume } }
  achievements: string[],       // IDs de conquistas desbloqueadas nesta sessão
}
```

### 15.2 Cardio History Entry

```js
{
  date:         string,    // ISO 8601
  type:         string,    // 'corrida' | 'bike' | 'outro'
  local:        string,    // 'rua' | 'esteira' | null
  distance:     number,    // km (2 casas decimais)
  duration:     number,    // minutos decimais (ex: 28.25 = 28min15s)
  pace:         string,    // "MM:SS" por km (ex: "5:36"), '' se sem distância
  effort:       string,    // 'fácil' | 'moderado' | 'forte'
  notes:        string,    // nota livre
  protocolId:   string,    // 'zona2-30' | 'zona2-45' | 'vo2max-4x4' | 'sprint-30-30' | 'livre' | 'manual'
  protocolName: string,    // nome legível do protocolo
  gpsTracked:   boolean,   // se GPS foi usado
}
```

### 15.3 Active Cardio Session

```js
{
  protocolId:   string,
  startTime:    number,    // Date.now()
  blockIndex:   number,    // índice do bloco atual
  blockElapsed: number,    // segundos decorridos no bloco atual
  totalElapsed: number,    // segundos totais decorridos
  paused:       boolean,
  pausedAt:     number | null,
  gpsPoints:    Array<{ lat, lng, t }>,
  distanceM:    number,    // metros acumulados
  completed?:   boolean,   // true quando último bloco termina
}
```

### 15.4 Log Entry (série)

```js
logs[workoutId][exerciseId][setIndex] = {
  w:      string,    // peso (ex: "80" ou "80.5")
  r:      string,    // reps (ex: "10" ou "8-10")
  done:   boolean,
  warmup: boolean,   // opcional, default false
}
// Chave especial:
logs[workoutId][exerciseId]['_c'] = number  // override de contagem de séries
```

### 15.5 PR Entry

```js
prs[exerciseId] = {
  weight: number,   // peso em kg
  reps:   number,   // reps realizadas
  vol:    number,   // 1RM Epley: weight * (1 + reps/30)
  date:   string,   // ISO 8601
}
```

### 15.6 Biometrics Object

```js
biometrics = {
  date:            string,   // ISO 8601 da última avaliação
  // Composição corporal
  weight:          number,   // kg
  height:          number,   // cm
  bodyFat:         number,   // %
  leanMass:        number,   // kg
  muscleMass:      number,   // kg
  boneMass:        number,   // kg
  targetWeight:    number,   // kg
  targetBodyFat:   number,   // %
  // Circunferências (cm)
  ombro:                 number,
  torax:                 number,
  escapular:             number,
  cintura:               number,
  abdome:                number,
  quadril:               number,
  bracoDirContraido:     number,
  bracoEsqContraido:     number,
  antebraçoDireito:      number,
  antebraçoEsquerdo:     number,
  coxaDireita:           number,
  coxaEsquerda:          number,
  joelhoDireito:         number,
  joelhoEsquerdo:        number,
  panturrilhaDireita:    number,
  panturrilhaEsquerda:   number,
  // Dobras cutâneas (mm)
  dobraAbdominal:        number,
  dobraTorax:            number,
  dobraCoxa:             number,
  dobraTricipal:         number,
  dobraSuprailiaca:      number,
  dobraSubscapular:      number,
  dobraAxilarMedia:      number,
}
```

### 15.7 Workout Object (built-in + custom)

```js
{
  id:        string,     // '1'-'6', 'cardio', ou 'custom_${Date.now()}'
  name:      string,     // nome do treino
  icon:      string,     // nome do ícone Lucide
  isCardio?: boolean,    // true apenas no treino 'cardio' built-in
  isCustom?: boolean,    // true em treinos criados pelo usuário
  exercises: Exercise[],
}

// Exercise:
{
  id:    string,    // 't{wId}_{n}' (built-in) ou 'cex_${Date.now()}_${random}' (custom)
  icon:  string,    // nome do ícone Lucide
  name:  string,    // nome em português
  sets:  number,    // número de séries
  reps:  string,    // ex: "8-12" ou "10" ou "AMRAP"
  note?: string,    // instrução opcional
  rest:  number,    // segundos de descanso
}
```

### 15.8 Cardio Protocol Object

```js
{
  id:     string,    // 'zona2-30' | 'zona2-45' | 'vo2max-4x4' | 'sprint-30-30' | 'livre'
  name:   string,    // nome legível
  blocks: Block[],
}

// Block:
{
  name:        string,   // nome da fase
  duration:    number,   // segundos (0 = livre/infinito)
  effort:      string,   // 'leve' | 'moderado' | 'forte' | 'máximo'
  instruction: string,   // texto instrucional
}
```

### 15.9 Circumference History Entry

```js
circumHistory[i] = {
  date:              string,   // ISO 8601
  bracoD:            number,   // cm
  bracoE:            number,
  torax:             number,
  cintura:           number,
  coxaD:             number,
  coxaE:             number,
  panturrilhaD:      number,
}
```

### 15.10 Achievement ID Format

Todos os IDs são strings simples armazenadas em `achievements[]`:

**Musculação (checkWorkoutAchievements):**
```
'session_1'     → 1 treino completado
'session_10'    → 10 treinos
'session_25'    → 25 treinos
'session_50'    → 50 treinos
'session_100'   → 100 treinos
'vol_1t'        → 1 tonelada total movida
'vol_10t'       → 10 toneladas
'vol_100t'      → 100 toneladas
'first_pr'      → primeiro PR registrado
```

**Cardio (CardioController.#checkAchievements):**
```
'cardio_first'       → primeira sessão de cardio
'cardio_5'           → 5 sessões
'cardio_10'          → 10 sessões
'cardio_25'          → 25 sessões
'cardio_50'          → 50 sessões
'cardio_10km'        → 10 km totais acumulados
'cardio_50km'        → 50 km
'cardio_100km'       → 100 km
'cardio_250km'       → 250 km
'cardio_vo2_first'   → primeira sessão com protocolo vo2max-4x4
'cardio_pace_sub5'   → pace melhor que 5:00 min/km
'cardio_pace_sub4_5' → pace melhor que 4:30 min/km
```

---

## 16. DADOS BUILT-IN

### 16.1 7 Treinos Built-in (src/data/workouts.js)

**Treino '1' — Push A (10 exercícios):**
```
t1_1     Supino Inclinado (Halter)
t1_2     Crucifixo Inclinado Articulado
t1_3     Desenvolvimento com Halteres
t1_4     Elevação Lateral (Halter)
t1_5     Elevação Lateral na Polia
t1_6     Crucifixo Inverso Máquina
t1_7     Tríceps Testa no Cabo
t1_8     Tríceps Pulley
t1_9     Tríceps Corda
t1_calf  Panturrilha em Pé (Máquina)
```

**Treino '2' — Legs A (9 exercícios):**
```
t2_1     Agachamento Pendular
t2_2     Leg Press 45°
t2_3     Extensora Unilateral
t2_4     Stiff (Halter)
t2_5     Mesa Flexora
t2_6     Hip Thrust
t2_7     Elevação Pélvica
t2_8     Panturrilha em Pé (Máquina)
t2_calf_s Panturrilha Sentado (Máquina)
```

**Treino '3' — Pull A (10 exercícios):**
```
t3_1     Puxada Frente Pronada
t3_2     Remada Curvada Pronada
t3_3     Remada Articulada Pronada
t3_4     Remada Unilateral (Halter)
t3_5     Pullover na Polia
t3_6     Rosca Direta (Barra W)
t3_7     Rosca Alternada (Halter)
t3_8     Rosca Martelo
```

**Treino '4' — Push B (11 exercícios):**
```
t4_1     Supino Reto (Halter)
t4_2     Cross Over
t4_3     Supino Declinado Articulado
t4_4     Desenvolvimento Arnold
t4_5     Elevação Frontal
t4_6     Elevação Lateral na Máquina
t4_7     Face Pull
t4_8     Tríceps Francês (Halter)
t4_9     Tríceps Coice
t4_10    Tríceps Testa (Halter)
t4_calf  Panturrilha em Pé (Máquina)
```

**Treino '5' — Legs B (9 exercícios):**
```
t5_1     Hack Squat
t5_2     Afundo Smith
t5_3     Extensora Bilateral
t5_4     Flexora Sentada
t5_5     Stiff (Barra)
t5_6     Glúteo no Cabo
t5_7     Coice Gluteal na Máquina
t5_8     Panturrilha em Pé (Máquina)
t5_calf_s Panturrilha Sentado (Máquina)
```

**Treino '6' — Pull B (10 exercícios):**
```
t6_1     Puxada Frente Supinada
t6_2     Remada Curvada Supinada
t6_3     Remada Unilateral Articulada
t6_4     Remada Baixa c/ Triângulo
t6_5     Barra Fixa Pronada
t6_6     Rosca Martelo Banco 60°
t6_7     Rosca Scott Máquina
t6_8     Rosca Concentrada
```

**Treino 'cardio' — Cardio (6 exercícios, isCardio: true):**
```
tcardio_1  Corrida Contínua
tcardio_2  Intervalado
tcardio_3  HIIT
tcardio_4  Ciclismo
tcardio_5  Elíptico
tcardio_6  Pular Corda
```

### 16.2 5 Protocolos de Cardio (src/data/cardioProtocols.js)

**'zona2-30' — Zona 2 (30min), 3 blocos:**
```
Aquecimento  5min   leve    → "Caminhada rápida ou trote muito leve"
Zona 2       20min  moderado → "Ritmo confortável, consegue conversar"
Desaquecimento 5min leve    → "Trote leve reduzindo gradualmente"
Total: 1800s
```

**'zona2-45' — Zona 2 (45min), 3 blocos:**
```
Aquecimento  5min   leve
Zona 2       35min  moderado
Desaquecimento 5min leve
Total: 2700s
```

**'vo2max-4x4' — VO2Max 4x4, 9 blocos:**
```
Aquecimento     10min  leve
Intervalo 1      4min  forte
Recuperação 1    3min  leve
Intervalo 2      4min  forte
Recuperação 2    3min  leve
Intervalo 3      4min  forte
Recuperação 3    3min  leve
Intervalo 4      4min  forte
Desaquecimento  10min  leve
Total: 2880s (48min)
```

**'sprint-30-30' — Sprint 30/30 (HIIT), 21 blocos:**
```
Aquecimento     5min   leve
Sprint 1        30s    máximo
Recuperação 1   30s    leve
Sprint 2        30s    máximo
...             (10x sprint + recuperação)
Desaquecimento  5min   leve
Total: ~1500s
```

**'livre' — Livre, 1 bloco:**
```
Livre  0 (infinito)  → nunca avança bloco automaticamente
```

### 16.3 Biblioteca de Exercícios (src/data/exerciseLibrary.js)

~70 exercícios em português organizados por grupo muscular para autocomplete no editor:

```
PEITO (13):     Supino Reto (Halter), Supino Reto (Barra), Supino Reto Articulado,
                Supino Inclinado (Halter), Supino Inclinado (Barra), Supino Inclinado Articulado,
                Supino Declinado Articulado, Crucifixo Reto, Crucifixo Inclinado Articulado,
                Peck Deck, Cross Over, Pullover na Polia, Flexão de Braço

OMBROS (13):    Desenvolvimento com Halteres, Desenvolvimento com Barra, Desenvolvimento Arnold,
                Elevação Lateral (Halter), Elevação Lateral na Polia, Elevação Lateral na Máquina,
                Elevação Frontal, Elevação Frontal Alternada, Face Pull,
                Crucifixo Inverso Máquina, Crucifixo Inverso (Halter),
                Encolhimento com Halteres, Encolhimento com Barra

COSTAS (14):    Puxada Frente Pronada, Puxada Frente Supinada, Puxada com Triângulo,
                Remada Curvada Pronada, Remada Curvada Supinada, Remada Articulada Pronada,
                Remada Unilateral Articulada, Remada Unilateral (Halter),
                Remada Baixa c/ Triângulo, Remada Alta (Barra),
                Pullover na Polia, Barra Fixa Pronada, Barra Fixa Supinada,
                Levantamento Terra

BÍCEPS (8):     Rosca Direta (Barra W), Rosca Direta (Barra Reta), Rosca Alternada (Halter),
                Rosca Martelo, Rosca Martelo Banco 60°, Rosca Concentrada,
                Rosca Scott Máquina, Rosca Unilateral Polia Alta

TRÍCEPS (8):    Tríceps Testa no Cabo, Tríceps Testa (Halter), Tríceps Pulley,
                Tríceps Corda, Tríceps Francês (Halter), Tríceps Francês (Barra),
                Mergulho no Banco, Tríceps Coice

QUADRÍCEPS (11): Agachamento Livre, Agachamento Pendular, Agachamento Smith,
                 Leg Press 45°, Leg Press Horizontal, Extensora Unilateral,
                 Extensora Bilateral, Afundo Smith, Afundo (Halter),
                 Afundo Búlgaro, Hack Squat

POSTERIOR/GLÚTEO (10): Stiff (Halter), Stiff (Barra), Mesa Flexora, Flexora Unilateral,
                        Flexora Sentada, Cadeira Extensora, Hip Thrust, Elevação Pélvica,
                        Glúteo no Cabo, Coice Gluteal na Máquina

PANTURRILHA:    Panturrilha em Pé (Máquina), Panturrilha em Pé (Halter),
                Panturrilha Sentado (Máquina)
```

---

## 17. SISTEMA DE MODAIS

### Modais renderizados via #renderModal (no modal-layer z-60):

**'timer'** — Cronômetro de descanso
- Payload: `{ duration: number }` (segundos)
- Exibe: anel SVG circular, tempo restante formatado, botão pular
- Trigger: `toggleSet()` quando série é marcada como feita

**'confirm'** — Confirmação genérica
- Payload: `{ title, message, action, payload }`
- Botões: Cancelar / Confirmar
- Confirmar dispara: `#handleAction(action, payload)`

**'battle-report'** — Relatório pós-treino
- Payload: `history entry completo`
- Exibe: nome do treino, duração, volume, reps, MVP, breakdown, conquistas
- Ocupa report-layer (z-95), não o modal-layer
- Botão: ENCERRAR OPERAÇÃO → fecha + navega para 'treinar'

**'notes'** — Nota pós-treino (antes do battle report)
- Sem payload (usa workoutId do estado)
- Input textarea para nota livre
- Submit: `workoutCtrl.finishWorkout(notes)`

**'cardio-log'** — Log manual de cardio
- Sem payload específico
- Campos: tipo (corrida/bike/outro), local (rua/esteira), distância, duração MM:SS, pace auto-calculado, esforço, notas
- Submit: salva entrada em cardioHistory

### Modais invocados diretamente (no modal-layer):

**stale-session** — Sessão fantasma detectada (>8h)
- Aparece no `init()` se `activeCardioSession` tem `startTime` > 8 horas atrás
- Opções: Retomar / Descartar
- Descartar: `cardioCtrl.abandon()`

**workout-history** — Histórico de um treino específico
- Trigger: botão "Hist." no card do treino
- Exibe últimas sessões com volume, reps, data, notas
- mountWorkoutHistory: delegate `delete-workout-history`

**cardio-protocol** — Seletor de protocolo guiado
- Exibe os 5 protocolos com descrição e duração
- Botão de seleção: `cardio-protocol-select` com protocolId

**cardio-finish** — Tela de finalização do cardio
- Exibe: distância, duração, pace calculado
- Inputs: local (select), esforço (select), notas
- Submit: `cardioCtrl.finish({ local, effort, notes })`

**run-tracker** — Tracker de corrida com GPS
- Usa Geolocation API: `navigator.geolocation.watchPosition`
- Calcula haversine distance entre pontos GPS
- Atualiza: `cardioCtrl.addGpsPoint(lat, lng, delta)`
- Wake Lock: `navigator.wakeLock.request('screen')` para manter tela acesa

---

## 18. SISTEMA DE NAVEGAÇÃO

### Nav Tabs (mobile-nav, z-30)

5 botões com `data-tab`:
```
home     → ícone: home
treinar  → ícone: dumbbell
evoluir  → ícone: activity
cardio   → ícone: wind
corpo    → ícone: circle-user
```

**Estado ativo:** classe adicional nos botões quando `tab === data-tab`.

**Sub-telas sem nav** (nav fica oculto durante):
- `workout` — execução de treino
- `workout-editor` — editor de treino
- `settings` — configurações

### Routing

Sem URL routing. Todo o estado de navegação está em `store.state.tab`.

```js
// Navegação
store.setState({ tab: 'treinar' })

// Subscriber detecta:
if (newState.tab !== prevState.tab) {
  this.#renderMain(newState);
  this.#updateNav(newState.tab);
}
```

---

## 19. SISTEMA DE EVENTOS

### Event Delegation

Todos os eventos são registrados via `delegate(container, selector, eventType, handler)` nas funções `mountXxx()`.

**Padrão de data-attributes:**
```html
<button data-action="start-workout" data-wid="1">
<button data-action="toggle-set" data-wid="1" data-exid="t1_1" data-idx="0">
<button data-action="save-log" data-wid="1" data-exid="t1_1" data-idx="0" data-field="w">
```

**No mountXxx:**
```js
delegate(container, '[data-action]', 'click', (e, el) => {
  createRipple(e, el);
  const { action, ...payload } = el.dataset;
  handler(action, payload, el);
});
```

### Handlers Globais

**Ripple global** (attachGlobalRipple):
```js
document.addEventListener('click', e => {
  const el = e.target.closest('.ripple-target');
  if (el) createRipple(e, el);
});
```

**Nav delegation** (app.js):
```js
delegate(document.getElementById('mobile-nav'), '[data-tab]', 'click', (e, el) => {
  app.handleNavClick(el.dataset.tab);
});
```

### Timer Events

```js
timer.on('tick', remaining => {
  // Atualiza badge de timer no header
  // Atualiza anel SVG circular
  // Atualiza texto
});
timer.on('complete', () => {
  // Fecha modal timer
  // Vibra: navigator.vibrate([100, 50, 100])
});
```

### Cardio Interval

```js
// No AppController, quando activeCardioSession existe:
this.#cardioInterval = setInterval(() => {
  this.#cardioCtrl.tick();
}, 1000);

// Stopa quando: activeCardioSession === null ou completed === true
```

---

## 20. INDEX.HTML — ESTRUTURA DO SHELL

**Elementos principais:**

```html
<body data-theme="default">
  <!-- Ember particles container -->
  <div id="embers" aria-hidden="true"></div>

  <!-- Header -->
  <header class="fixed top-0 ...">
    <div id="header-content"></div>
  </header>

  <!-- Main content area -->
  <main id="app-container">
    <div id="main-content" class="pt-14 pb-20 px-4"></div>
  </main>

  <!-- Modal layer (z-60) -->
  <div id="modal-layer" class="fixed inset-0 z-60 hidden"></div>

  <!-- Battle report layer (z-95) -->
  <div id="report-layer" class="fixed inset-0 z-95 hidden"></div>

  <!-- Bottom nav -->
  <nav id="mobile-nav" class="fixed bottom-0 ...">
    <button data-tab="home">...</button>
    <button data-tab="treinar">...</button>
    <button data-tab="evoluir">...</button>
    <button data-tab="cardio">...</button>
    <button data-tab="corpo">...</button>
  </nav>
</body>
```

**Ember particles (JS inline):**
- 22 embers criados via JS no DOMContentLoaded
- MutationObserver no `data-theme` do body → recria embers com cor temática
- Cada ember: posição aleatória, duração aleatória (3-8s), tamanho aleatório (2-6px)
- Animação CSS: float up + fade

**Timer badge no header:**
- Visível apenas durante treino ativo com timer rodando
- `id="timer-badge"` com `id="timer-text"` e SVG `id="timer-ring"`
- Anel SVG: `stroke-dashoffset` animado proporcionalmente ao tempo restante

---

## 21. REGRAS DE NEGÓCIO

### Séries e Warmup
- Série com `warmup: true` NÃO conta para: volume, reps, PRs, breakdown
- `done: true` em warmup → não abre timer de descanso
- `_c` override: quando `modSets` é usado, salva `logs[wId][exId]['_c']` com a nova contagem
- Auto-fill: busca histórico mais recente com `workoutId === wId` e copia `{w, r}` com `done: false`

### PR (Personal Record)
- Usa Epley 1RM: `weight * (1 + reps / 30)`
- Guard: ignora se `reps < 1`, peso ou reps inválidos
- Compara `epley > current.vol` (não apenas peso bruto)
- Salva: `{ weight, reps, vol, date }`

### Ciclo Adaptativo
- `cycleOrder`: array de 8 slots com IDs ou `null` (descanso)
- `cyclePosition`: avança +1 em `finishWorkout()`, com wrap: `% cycleOrder.length`
- Badge PRÓXIMO: mostra o próximo treino non-null na ordem do ciclo a partir de `cyclePosition`
- Badge FEITO: `week[]` inclui o workoutId

### Streak
- `getStreak()` em HomeView: merge de datas únicas de history + (se `cardioCountsStreak`) cardioHistory
- Conta dias consecutivos de hoje para trás
- "Streak em risco" → streak > 0 E não treinou hoje

### Auto-reset Semanal
- `weekResetDays`: 0 (OFF), 7, 10, ou 14 dias
- `checkAutoReset()` em init(): se `weekStart` existe e `(Date.now() - weekStart) > weekResetDays * 86400000` → `resetWeek()`

### Cardio Pace
- `pace = ""` se `distanceKm < 0.1` ou `durationMin === 0`
- Pace decimal: `durationMin / distanceKm`
- Formatado: `${mins}:${secs.padStart(2,'0')}`

### Paginação do Histórico
- 20 entradas por página
- `historyPage` = número de páginas carregadas adicionalmente
- Total mostrado: `(historyPage + 1) * 20`
- Botão "Carregar mais" → `historyPage + 1`

### Caps de Arrays
- `bodyWeights`: cap 365 entradas (aviso visual após 300)
- `bioHistory`: cap 20 snapshots
- `cardioHistory`: cap 100 sessões
- `circumHistory`: cap 24 medições

### TDEE (Katch-McArdle)
```
leanMass = weight × (1 - bodyFat/100)
BMR      = 370 + 21.6 × leanMass
TDEE     = BMR × activityLevel
```
ActivityLevel: 1.2 / 1.375 / 1.55 / 1.725 / 1.9

### Macros (default do ProfileView)
```
proteina (g) = leanMass × 2.0
gordura  (g) = TDEE × 0.25 / 9
carbo    (g) = (TDEE - proteina×4 - gordura×9) / 4
```

---

## 22. ÍCONES LUCIDE — SEGUROS vs EVITAR

**Versão fixada:** `0.460.0`
**URL:** `https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js`
**Uso:** `<i data-lucide="nome-do-icone"></i>` + `lucide.createIcons()`

**Ícones seguros (verificados em 0.460.0):**
```
home, dumbbell, activity, zap, trophy, calendar, clock, trending-up,
circle-user, check, check-circle, x, chevron-left, chevron-right,
chevron-down, chevron-up, history, pencil, settings, database, download,
upload, file-text, trash-2, plus, plus-circle, rotate-ccw, refresh-cw,
info, alert-triangle, quote, list, layers, bar-chart-2, file-down,
moon, sun, leaf, eye, heart, flame, copy, repeat, crosshair, ruler,
timer, wind, grip-vertical, target, move, palette, cpu, calendar-days,
calendar-check, calendar-x, eye-off
```

**Ícones instáveis (não usar):**
```
scan-line      → usar: ruler
weight         → sem substituto direto, usar dumbbell
swords         → não disponível em 0.460.0
user-circle    → usar: circle-user
```

---

## 23. TEMAS VISUAIS

| Key | Nome | Cor Principal | CSS var --theme-rgb |
|---|---|---|---|
| `default` | AMATERASU | `#ef4444` (vermelho) | `220,38,38` |
| `raiton` | RAITON | `#22d3ee` (ciano) | `34,211,238` |
| `emerald` | SAGE MODE | `#4ade80` (verde) | `74,222,128` |
| `violet` | SUSANOO | `#a78bfa` (violeta) | `167,139,250` |
| `amber` | KURAMA | `#fbbf24` (âmbar) | `251,191,36` |
| `rose` | SAKURA | `#fb7185` (rosa) | `251,113,133` |

**CSS vars aplicadas pelo ThemeService.apply():**
- `--theme-primary`: cor sólida principal
- `--theme-accent`: cor de accent (variante mais escura)
- `--theme-dim`: cor com 10% de opacidade (backgrounds subtis)
- `--theme-dark`: cor com 5% de opacidade (backgrounds muito subtis)
- `--theme-rgb`: valores RGB separados por vírgula (para uso em rgba())

**Ember particles**: mudam de cor com o tema via MutationObserver no `data-theme`.

**CyberBody SVG**: lê `--theme-rgb` via `getComputedStyle`.

---

## 24. CONVENÇÕES DE CÓDIGO

### IDs de Treinos
- Built-in: strings numéricas `'1'` a `'6'`, `'cardio'`
- Custom: `custom_${Date.now()}`

### IDs de Exercícios
- Built-in: `t{wId}_{n}` (ex: `t1_1`, `t2_calf`)
- Custom: `cex_${Date.now()}_${Math.random().toString(36).slice(2)}`

### Chaves localStorage
- Prefixo: `monstro_v2_`
- Ex: `monstro_v2_logs`, `monstro_v2_history`

### Nomenclatura de Funções
- Views: `render{Nome}(state, data) → string`
- Mount: `mount{Nome}(container, handler)`
- Controllers: verbo + substantivo (ex: `startWorkout`, `toggleSet`, `finishWorkout`)
- Patches: `patch{ParteDaView}(...args)`

### Padrão de Modal
```js
// 1. Abrir
store.setState({ activeModal: 'nome-modal', modalData: { payload } });
// 2. AppController.#renderModal() → case 'nome-modal'
// 3. Fechar
store.setState({ activeModal: null, modalData: null });
```

### Padrão de Action
```html
<!-- View: data-action no elemento -->
<button data-action="minha-action" data-payload="${value}">
```
```js
// Mount: delegate no container
delegate(container, '[data-action="minha-action"]', 'click', (e, el) => {
  handler('minha-action', el.dataset.payload);
});
// AppController.#handleAction():
case 'minha-action': /* lógica */; break;
```

### Adicionando Campo Persistido
```
1. Adicionar default em app.js (DEFAULTS)
2. Adicionar key em src/store/persistedKeys.js (PERSISTED_KEYS)
3. StorageService cuida do resto automaticamente
```

---

## 25. DECISÕES ARQUITETURAIS

| Decisão | Motivo |
|---|---|
| Vanilla JS sem framework | Roda direto no XAMPP sem Node.js ou build step |
| ES Modules sem bundler | Suporte nativo nos browsers modernos; desenvolvimento direto |
| Tailwind CDN | Sem build; aceito pois é ambiente local |
| localStorage only | Sem backend; dados pessoais; simplicidade |
| Patches cirúrgicos no WorkoutView | Re-render total durante treino causaria perda de foco nos inputs |
| Delegate events | Sem acumulação de listeners; manutenção simples |
| Store imutável com freeze | Evita mutações acidentais; diffs por referência |
| Lucide via CDN fixado | Ícones sem SVG inline; versão fixada evita quebras |
| cloneNode(false) em #renderMain | Previne acumulação de listeners em re-renders (bug crítico Android) |
| PERSISTED_KEYS em módulo separado | Fonte única de verdade; evita dessincronização |
| Epley 1RM para PRs | Comparação justa independente do esquema de reps |
| Katch-McArdle para TDEE | Mais preciso que Harris-Benedict quando % BF é conhecido |
| cardioProtocols.js separado | Protocolos de cardio independentes dos treinos de musculação |
| patchCardioTimer | Timer de cardio atualiza a cada 1s; re-render total causaria layout shift |

---

## 26. DÉBITO TÉCNICO E BUGS CORRIGIDOS

| Item | Status | Versão |
|---|---|---|
| PERSISTED_KEYS duplicado | ✅ Corrigido | v3.1 |
| Bug decremento duplo/triplo de séries (Android) | ✅ Corrigido | v3.2 |
| Delete de entradas de peso corporal | ✅ Corrigido | v3.0 |
| Paginação no histórico EVOLUÇÃO | ✅ Corrigido | v3.0 |
| Auto-reset semanal configurável | ✅ Implementado | v3.0 |
| formatDate missing import | ✅ Corrigido | v2.3 |
| Export JSON incompleto | ✅ Corrigido | v2.3 |
| Lucide sem versão fixa | ✅ Corrigido (0.460.0) | v2.3 |
| scan-line icon instável | ✅ Corrigido (→ ruler) | v2.3 |
| SW cache name v1 | ✅ Corrigido (→ monstro-v2) | v2.3 |
| bodyWeights sem cap | ✅ Cap 365 | v2.3 |
| PR baseado em peso bruto | ✅ Corrigido (Epley) | v2.3 |
| Import sem confirmação | ✅ Confirm + alert de erro | v2.3 |
| TimerService drift no background | ✅ Corrigido (Date.now) | v2.3 |
| formatTime negativo crash | ✅ Corrigido (max 0) | v2.3 |
| WorkoutEditorView NaN no estado | ✅ Corrigido (parseInt guard) | v2.3 |
| StorageService silencioso em erro | ✅ Corrigido (console.warn) | v2.3 |
| Botões touch < 32px | ✅ Corrigido (mínimo 32px) | v2.3 |
| same workout twice blocked | ✅ Corrigido (remove guard) | v2.3 |
| Sessão fantasma de cardio >8h | ✅ Auto-descartada no init | v3.5 |
| Delete de entrada musculação no histórico | ✅ Corrigido | v3.5 |
| Delete de avaliação física no bioHistory | ✅ Corrigido | v3.5 |
| mountCardio pause/resume sem payload | ✅ Corrigido | v3.6 |
| delete-workout-history não limpava week | ✅ Corrigido | v3.6 |
| SW não incluía arquivos novos | ✅ Corrigido (monstro-v3) | v3.6 |

**Problemas conhecidos ativos:**
- `bodyWeights` tem cap de 365 entradas (aviso visual após 300)
- `bioHistory` tem cap de 20 snapshots
- Ícones PNG não existem (apenas SVG) — necessário para iOS Safari maskable

---

## 27. CHECKLIST DE QA

Antes de qualquer mudança relevante:

- [ ] Abrir modal "Hist." em qualquer treino no Dashboard (testa formatDate)
- [ ] Executar treino completo (marcar séries, timer, finalizar)
- [ ] Battle Report aparece e fecha corretamente
- [ ] Export JSON → Import JSON → dados restaurados completamente
- [ ] Mudar tema → ícones atualizam, embers mudam de cor
- [ ] Toggle light mode → UI legível
- [ ] Planejamento semanal → Missão de Hoje aparece na Home
- [ ] Criar treino custom → aparece no dashboard → pode ser iniciado
- [ ] Editar treino built-in → customizações persistem após reload
- [ ] Export PDF da avaliação física → popup abre → impressão
- [ ] CyberBody SVG renderiza com e sem circunferências
- [ ] PWA installable: manifest válido, SW registrado, ícone aparece
- [ ] Iniciar protocolo de cardio → timer conta → bloco avança → finalizar salva
- [ ] Delete de entrada de peso → lista atualiza
- [ ] Delete de histórico de musculação → lista atualiza
- [ ] Delete de avaliação biométrica → lista atualiza
- [ ] Notifications toggle → solicita permissão → badge aparece nas settings
- [ ] modSets (+/-) → contagem persiste após re-render
- [ ] autoFill → copia dados da última sessão
- [ ] PR → badge aparece no battle report + galeria no ProfileView
- [ ] Ciclo adaptativo → posição avança após treino → wrap correto no índice 8

---

## 28. CHECKLIST DE DEPLOY

Ao migrar do XAMPP para hospedagem:

- [ ] Compilar Tailwind (remover CDN JIT)
- [ ] Manter Lucide fixado em 0.460.0 (ou testar nova versão explicitamente)
- [ ] Atualizar `CACHE` no sw.js para novo nome de versão
- [ ] Testar HTTPS (obrigatório para Service Worker, PWA e Notifications API)
- [ ] Testar instalação como PWA no iOS Safari e Android Chrome
- [ ] Validar manifest.json (adicionar ícones PNG para maskable no iOS)
- [ ] Verificar que todos os 35 arquivos estão em LOCAL_ASSETS no sw.js
- [ ] Testar geolocation em HTTPS (necessário para GPS no run-tracker)
- [ ] Testar Wake Lock API (HTTPS obrigatório)
- [ ] Testar Push Notifications API (HTTPS obrigatório)
- [ ] Verificar que `isDevHost` não captura o domínio de produção

---

## 29. HISTÓRICO DE VERSÕES

| Data | Versão | Principais mudanças |
|---|---|---|
| 16/06/2026 | v2.0 | Arquitetura ES Modules, Store Zustand-like, 5 views iniciais |
| 16/06/2026 | v2.3 | 18 bugs/melhorias: Epley PR, TimerService drift-corrected, Lucide 0.460.0, bodyWeights cap 365 |
| 16/06/2026 | v2.4 | GoalGauge, BodyCompChart melhorado, CircumHistory, ExercícioEmFoco colapso, SuggestWeight badge |
| 17/06/2026 | v2.5 | Programa V-Taper 90kg: Leg Press 45°, Flexora Sentada, panturrilha 4x/semana |
| 17/06/2026 | v3.0 | Ciclo Adaptativo (cycleOrder + cyclePosition), delete bodyWeight, paginação histórico (20/pág), auto-reset semanal |
| 17/06/2026 | v3.1 | PERSISTED_KEYS extraído para módulo separado, sistema de achievements (9 conquistas musculação), badge HOJE persiste, badge PRÓXIMO cycle-based |
| 17/06/2026 | v3.2 | Bug fix crítico: cloneNode(false) em #renderMain. Módulo Cardio: HomeView widget, modal com zonas, protocolos salvos |
| 17/06/2026 | v3.3 | Cardio redesign: 3 tipos (Corrida/Bike/Outro), local Rua/Esteira, presets km, pace live preview, AnalyticsView cardio section completa |
| 17/06/2026 | v3.4 | Correções pós-auditoria, Push Notifications, weekly cardio goals com barras de progresso, default protocol nas Settings |
| 17/06/2026 | v3.5 | Delete histórico musculação, sessão fantasma cardio auto-descartada >8h, delete bioHistory snapshots |
| 17/06/2026 | v3.6 | SW cache monstro-v3 com todos os 35 arquivos, mountCardio pause/resume corrigido, delete-workout-history limpa week[] |

---

## 30. REGRAS IMUTÁVEIS DO PROJETO

> Estas regras NÃO devem ser quebradas sem discussão explícita:

1. **Views são puras** — `renderXxx()` nunca tem efeitos colaterais. Zero DOM access.
2. **Controllers não tocam o DOM** — WorkoutController e CardioController só chamam `store.setState()`.
3. **Sem addEventListener em elementos renderizados** — sempre usar `delegate()` nos mounts.
4. **cloneNode(false) obrigatório em #renderMain** — previne listener accumulation.
5. **setHTML() é o único método de injetar HTML** — garante que `lucide.createIcons()` seja sempre chamado.
6. **PERSISTED_KEYS é fonte única** — não duplicar a lista. Importar de `src/store/persistedKeys.js`.
7. **Lucide fixado em 0.460.0** — não atualizar sem testar todos os ícones.
8. **SW cache name** deve ser atualizado (monstro-v4, etc.) quando arquivos novos são adicionados.
9. **Epley 1RM** é a única fórmula de PR. Não usar peso bruto.
10. **localStorage prefix `monstro_v2_`** não muda. Migração v1→v2 já foi feita.
11. **Sem backend, sem Node.js, sem build step** — o projeto roda direto no XAMPP.
12. **Patches cirúrgicos** durante workout ativo — nunca `#renderMain()` para atualizar uma série.

---

*Documento gerado automaticamente a partir da leitura integral de todos os 30 arquivos do projeto.*
*Total de seções: 30 | Versão do projeto: 3.6*
