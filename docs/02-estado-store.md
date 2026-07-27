# 02 — Estado e Store · ForjaFit

## Store

Store imutável estilo Zustand, implementado em `src/store/store.js`.

```js
store.setState(patch)      // merge shallow + Object.freeze
store.getState()           // snapshot atual (frozen)
store.subscribe(fn)        // subscriber único — AppController
```

**Regra:** somente AppController assina o store. Controllers apenas chamam `store.setState()`.

## Forma do estado global

```js
// src/app.js — DEFAULT_STATE
{
  // ── Navegação ──────────────────────────────
  tab: 'home',                  // 'home'|'treinar'|'evoluir'|'cardio'|'corpo'|'workout'
  workoutId: null,              // string — treino em andamento
  workoutStartTime: null,       // timestamp ms

  // ── Logs do treino ativo ───────────────────
  logs: {},                     // { [wId]: { [exId]: ExLogs } }

  // ── Histórico e PRs ───────────────────────
  history: [],                  // HistoryEntry[] — mais recente primeiro
  prs: {},                      // { [exId]: { weight, reps, date } }

  // ── Ciclo PPL ─────────────────────────────
  cycleOrder: ['1','2','3',null,'4','5','6',null],
  cyclePosition: 0,             // índice atual
  cycleDone: [],                // IDs de treinos feitos no ciclo atual
  cycleGoal: 6,                 // meta (padrão 6)
  cycleStart: null,             // ISO date do início do ciclo

  // ── Conquistas ────────────────────────────
  achievements: [],             // string[] — IDs conquistados

  // ── Configurações ─────────────────────────
  defaultRestTime: 60,
  vibrationEnabled: true,
  theme: 'default',
  soundEnabled: false,

  // ── Biometria ─────────────────────────────
  biometrics: { weight: 80, height: 175, age: 30 },

  // ── Cardio ────────────────────────────────
  cardioLog: [],
  activeCommute: null,
  commuteReturnOverride: null,

  // ── Modal ativo (efêmero — não persiste) ──
  activeModal: null,
  modalData: null,
}
```

## Campos persistidos

Definidos em `src/store/persistedKeys.js` — **fonte única de verdade**.

Exemplos de campos persistidos: `logs`, `history`, `prs`, `cycleOrder`, `cyclePosition`, `cycleDone`, `cycleStart`, `workoutStartTime`, `achievements`, `exerciseNotes`, `biometrics`, `theme`...

Campos efêmeros (NÃO persistidos): `activeModal`, `modalData`, `tab`, `workoutId`.

**Regra:** campo novo persistido → obrigatório adicionar nos dois lugares (`app.js` DEFAULT_STATE + `persistedKeys.js`).

## Estrutura de ExLogs

```js
// state.logs[wId][exId] = ExLogs
{
  0: { w: 60, r: 10, done: true, warmup: false, rpe: 8 },
  1: { w: 60, r: 10, done: false },
  _c: 3,        // override de contagem (opcional — omitir se igual a ex.sets)
  _skip: true,  // exercício pulado (opcional — omitir se false)
}
```

## Migrações

Ficam em `src/app.js`, executadas na inicialização antes de montar o app.

| Migração | O que faz |
|---|---|
| `migrateLegacyLogs` | Converte formato de logs v1 → v2 |
| `migrateCycleOrder` | Garante `['1','2','3',null,'4','5','6',null]` — cobre todos os formatos legados |

**Padrão para nova migração:**
```js
function migrateXxx(state) {
  if (/* condição que detecta formato antigo */) {
    // transforma state
  }
  return state;
}
```
