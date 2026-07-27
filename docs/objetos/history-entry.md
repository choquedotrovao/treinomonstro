# Objeto — HistoryEntry

Snapshot imutável de uma sessão de treino finalizada.
Vive em `state.history[]` (mais recente primeiro).

## Estrutura

```js
{
  workoutId: '1',                   // ID do treino
  date: '2026-07-15',               // ISO date string
  vol: 4800,                        // kg*reps total (exclui warmup e skipped)
  reps: 156,                        // total de reps (exclui warmup e skipped)
  duration: 68,                     // minutos (null se não rastreado)
  sets: {                           // snapshot dos sets por exercício
    't1_1': [
      { w: 60, r: 10, done: true, warmup: false, rpe: 8 },
    ],
  },
  breakdown: [                      // vol e maxW por exercício (exclui skipped)
    { exId: 't1_1', name: 'Supino Inclinado', vol: 1200, maxWeight: 65 },
  ],
  mission: {                        // missão de calorias
    calories: 320,
    commute: { ... },               // dados de deslocamento (se houver)
  },
  progressionChips: [               // exercícios que bateram teto do range de reps
    { exId: 't1_2', name: 'Supino Reto', increment: 2.5 },
  ],
}
```

## Como é gerado

`WorkoutController.finishWorkout()` → monta o objeto → `store.setState({ history: [entry, ...prev] })`.

## Uso em views

- `DashboardView` — gráficos de volume e frequência
- `AnalyticsView` — análise detalhada por exercício
- `HomeView` — último treino, streak, stale banner
- `AppController.#patchWorkout` — `lastSets` para badge de progressão ↑↓=
- `WorkoutView.computeLoadTarget` — peso alvo baseado em `history[].sets[exId]`
