# 04 — Ciclo PPL · ForjaFit

## Estrutura

```js
cycleOrder = ['1','2','3',null,'4','5','6',null]
//            PushA LegsA PullA OFF  PushB LegsB PullB OFF
```

8 slots (índice 0-7). Slot `null` = Dia Off intencional.

## Campos de estado

| Campo | Tipo | Papel |
|---|---|---|
| `cycleOrder` | string[]\|null[] | Sequência do ciclo (persistido) |
| `cyclePosition` | 0-7 | Sugestão de próximo slot (persistido) |
| `cycleDone` | string[] | IDs feitos no ciclo atual — fonte de verdade (persistido) |
| `cycleGoal` | number | Meta de treinos por ciclo, padrão 6 (persistido) |
| `cycleStart` | timestamp\|null | Início do ciclo — null após wrap (persistido) |
| `completedCycles` | number | Total de ciclos completos (persistido) |

## Avanço de posição (WorkoutController.finishWorkout)

```js
// Sempre +1 sequencial a partir de cyclePosition atual
const nextPos = cycleOrder.length ? (cyclePosition + 1) % cycleOrder.length : 0;

// cycleDone — dedup obrigatório
const newCycleDone = prevCycleDone.includes(w.id) ? prevCycleDone : [...prevCycleDone, w.id];

// Wrap: quando nextPos volta a 0
const wrapping = nextPos === 0 && cycleOrder.length > 0;
store.setState({
  cyclePosition: nextPos,
  cycleDone:  wrapping ? [] : newCycleDone,
  cycleStart: wrapping ? null : cycleStart,
});
```

**Por que +1 sequencial e não indexOf?** Ver ADR-003. Resumo: `indexOf` causava saltos de ciclo ao treinar fora de ordem. `cyclePosition` é sugestão, não rastreador de treinos feitos — isso é papel do `cycleDone`.

## Dia Off (slot null)

Avançado automaticamente por `#advanceOffDay()` no `AppController.init()` quando o app é aberto em dia diferente do último treino e `cycleOrder[cyclePosition] === null`. Não é avançado por `finishWorkout`.

## Ciclo completo

Banner "ciclo completo" disparado quando `cycleDone.length >= cycleGoal` — não depende de `cyclePosition`.

## Modais de ciclo (v6.6)

| Modal | Action | Quando usar |
|---|---|---|
| `cycle-overview` | `open-cycle-modal` | Ver todos os 8 slots com estado visual |
| `workout-picker` | `open-workout-picker` | Escolher qualquer treino livremente |

Esses modais permitem treinar fora de ordem sem comprometer a integridade do `cyclePosition`.

## Migração

`migrateCycleOrder()` em `app.js` garante o formato `['1','2','3',null,'4','5','6',null]` — cobre todos os formatos legados (sem null, com 7 slots, etc.).
