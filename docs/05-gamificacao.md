# 05 — Gamificação · ForjaFit

## Componentes

| Componente | Onde | O que faz |
|---|---|---|
| Achievements | `state.achievements[]` | IDs conquistados — verificados em WorkoutController e CardioController |
| PRs (Personal Records) | `state.prs[exId]` | Melhor resultado por exercício — Epley 1RM |
| Battle Report | `#showBattleReport()` AppController | Tela de resultado pós-treino |
| Streak | calculado de `state.history` | Dias consecutivos com treino |
| Progression Chips | `progressionChips[]` no stats | Exercícios prontos para subir carga |
| Stagnation Badge | `detectStagnation()` WorkoutView | 3+ sessões com mesmo peso |

## Achievements

Definidos em `src/data/achievements.js` como `ACHIEVEMENT_MAP`:

```js
ACHIEVEMENT_MAP['first_workout'] = {
  id:    'first_workout',
  name:  'Primeiro Sangue',
  desc:  'Completou o primeiro treino',
  icon:  'zap',          // Lucide — apenas safe-list
  color: 'text-yellow-400',
}
```

### Onde adicionar check

| Tipo | Função |
|---|---|
| Treino/volume/PR | `checkWorkoutAchievements()` WorkoutController |
| Streak de dias | `checkStreakAchievements()` WorkoutController |
| Ciclo completo | `checkCycleAchievements()` WorkoutController |
| Cardio/distância | `checkAchievementsAfterEntry()` CardioController |

```js
// Padrão obrigatório — guard de dedup:
if (!earned.includes('id') && /* condição */) newAchievements.push('id');
```

## PRs (Personal Records)

```js
// state.prs[exId] = { weight, reps, date }
```

- PR usa **Epley 1RM** para comparar séries de reps diferentes: `w * (1 + r/30)`
- Warmup (`set.warmup = true`) excluído do cálculo
- Badge de PR exibido no card durante treino ativo

## Battle Report

Gerado em `AppController.#showBattleReport(stats)` onde `stats` vem de `WorkoutController.finishWorkout()`.

### Hierarquia visual (de cima para baixo)

1. Hero — troféu + título + **pill de duração** (`⏱ X min · de treino`)
2. Carga Total — col-span-2, font 5xl
3. Repetições + Séries — dois cards iguais
4. Locomoção — condicional (se havia `activeCommute`)
5. Exercício MVP — maior Epley 1RM da sessão
6. vs. Sessão Anterior — delta vol/reps/carga por exercício
7. Pronto para subir carga — progressionChips
8. Volume por Exercício — breakdown detalhado
9. Achievements desbloqueados — toasts de conquistas
10. Quote motivacional

### Progression Chips

Aparecem quando **todas** as séries non-warmup de um exercício atingiram o limite superior do range de reps:

```js
// Ex: reps: '8-12' → hi = 12
// Se todas as séries done && !warmup tiverem r >= 12 → chip
const match = String(ex.reps ?? '').match(/(\d+)\s*[-–]\s*(\d+)/);
const hi = parseInt(match[2]);
if (doneSets.every(s => parseFloat(s.r) >= hi)) → chip
```

## Timer de treino (vs descanso)

| Timer | Mecanismo | Display |
|---|---|---|
| Treino (elapsed) | `workoutStartTime` + `#elapsedInterval` | `· treino X min` no header |
| Descanso (countdown) | `TimerService` + badge flutuante | `MM:SS` regressivo |

`duration` no battle report = `Math.round((Date.now() - workoutStartTime) / 60000)`.
