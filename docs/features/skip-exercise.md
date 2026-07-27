# Feature — Skip Exercise

**Versão:** v6.5.1
**Status:** Implementado

## O que faz

Permite pular um exercício durante o treino ativo. O exercício pulado:
- Fica visualmente oculto (séries escondidas, badge "PULADO")
- É excluído de vol, totalReps, breakdown, MVP e progressionChips no `finishWorkout`

## Fluxo

```
[botão X no card] data-action="toggle-skip-exercise" data-wid data-exid
  → AppController case "toggle-skip-exercise"
    → WorkoutController.toggleSkipExercise(wId, exId)
      → store.setState({ logs: { [wId]: { [exId]: { _skip: true } } } })
        → subscriber → #patchWorkout()
          → patchExerciseSkip(container, wId, exId, true)
```

## Estado

```js
// state.logs[wId][exId]._skip
true  → exercício pulado   (icon: rotate-ccw, badge PULADO, sets hidden)
undefined → exercício ativo (icon: x)
```

`_skip` nunca é `false` — omite a chave para desativar.

## Exclusões em finishWorkout

```js
// WorkoutController.finishWorkout()
w.exercises.forEach(ex => {
  if (exLogs._skip) return;          // exclui de vol + totalReps + MVP
});
const breakdown = w.exercises
  .map(ex => {
    if (exLogs._skip) return null;   // exclui de breakdown
  });
w.exercises.forEach(ex => {
  if (exLogs._skip) return;          // exclui de progressionChips
});
```

## Patch cirúrgico

`patchExerciseSkip(container, wId, exId, skipped)` atualiza:
1. Ícone do botão (`x` → `rotate-ccw` e vice-versa)
2. Badge "PULADO" (show/hide)
3. Seção de séries `[data-sets-section]` (hidden/visible)
4. Re-inicializa Lucide no botão
