# Objeto — Workout

Representa um treino (built-in ou custom). Definido em `src/data/workouts.js`.

## Estrutura

```js
{
  id: '1',                          // '1'–'6' built-in | 'custom_${Date.now()}' custom
  name: 'Push A',
  description: 'Peito · Ombro · Tríceps',
  muscles: ['peitoral', 'ombro', 'tríceps'],
  exercises: Exercise[],            // ver docs/objetos/exercise.md
}
```

## IDs built-in

| ID | Treino | Posição no ciclo |
|---|---|---|
| `'1'` | Push A | 0 |
| `'2'` | Legs A | 1 |
| `'3'` | Pull A | 2 |
| `null` | OFF | 3 |
| `'4'` | Push B | 4 |
| `'5'` | Legs B | 5 |
| `'6'` | Pull B | 6 |
| `null` | OFF | 7 |
| `'cardio'` | Cardio | (fora do ciclo) |

## Onde é usado

- `src/data/workouts.js` — definição estática
- `state.logs[wId]` — logs do treino
- `state.history[].workoutId` — referência no histórico
- `cycleOrder[]` — posição no ciclo PPL
