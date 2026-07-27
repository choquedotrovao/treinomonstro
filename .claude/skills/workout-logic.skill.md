# skill:workout-logic — v6.6
> Não repete: ExLogs structure → docs/02-estado-store.md · Ciclo ADR → docs/decisoes/ADR-003
> Este skill adiciona: lógica de negócio, guards obrigatórios, padrões de código

## Ciclo PPL

```js
cycleOrder = ['1','2','3',null,'4','5','6',null]
//            Push A·LegsA·PullA·OFF·PushB·LegsB·PullB·OFF
```

| Campo | Tipo | Papel |
|---|---|---|
| `cyclePosition` | 0-7 | Sugestão de próximo slot — avança +1 sequencialmente |
| `cycleDone` | string[] | Fonte real de o que foi feito — dedup com `.includes()` |
| `cycleStart` | timestamp | Início do ciclo atual — null após wrap |
| `cycleGoal` | number | Meta de treinos por ciclo (padrão 6) |

**Avanço:** `nextPos = (cyclePosition + 1) % cycleOrder.length` — sempre +1 sequencial.
**Wrap:** `nextPos === 0` → `cycleDone = []`, `cycleStart = null`.
**OFF (null):** avança automaticamente via `#advanceOffDay()` no init — não por finishWorkout.

## ExLogs (state.logs[wId][exId])

```js
{
  0: { w: 60, r: 10, done: true, warmup: false, rpe: 8 },
  1: { w: 60, r: 10, done: false },
  _c: 3,       // override de contagem (omitir se igual a ex.sets)
  _skip: true, // exercício pulado (omitir se false — nunca setar false)
}
```

## Guards obrigatórios em finishWorkout

```js
// VOL + REPS + MVP — excluir warmup e _skip
Object.values(exLogs).forEach(s => {
  if (!s.done || !s.w || !s.r || s.warmup) return; // warmup guard
});
// BREAKDOWN — excluir _skip
.map(ex => { if (exLogs._skip) return null; ... })
// PROGRESSION CHIPS — excluir warmup e _skip
if (exLogs._skip) return;
const doneSets = sets.filter(s => s.done && !s.warmup && s.r);
```

## PRs

```js
// state.prs[exId] = { weight, reps, date }
// PR batido quando: Epley(weight, reps) > Epley(pr.weight, pr.reps)
// warmup excluído — guard: if (set.warmup) return
```

## Achievements — onde adicionar check

| Tipo | Função |
|---|---|
| Treino/volume/PR | `checkWorkoutAchievements()` em WorkoutController |
| Streak | `checkStreakAchievements()` em WorkoutController |
| Ciclo | `checkCycleAchievements()` em WorkoutController |
| Cardio | `checkAchievementsAfterEntry()` em CardioController |

```js
// Padrão de check (sempre com guard de dedup):
if (!earned.includes('meu_id') && /* condição */) newAchievements.push('meu_id');
```

## RPE

- Escala 6-10 por série · aparece após `done: true` · não aparece em warmup
- Toggle: clicar mesmo valor → `null`
- `WorkoutController.saveRPE(wId, exId, idx, rpe)`

## Ordem de ativação muscular prescrita pelo personal

### Push A — Peito Superior + Deltoide Lateral
`Inclinado → Reto → Declinado → Lateral Halter → Lateral Máquina → Tríceps Francês → Tríceps Pulley → Core → Panturrilha`

### Push B — Ombro prioritário (V-taper)
`Desenvolvimento → Lateral Polia → Lateral Máquina → Supino Reto → Crucifixo Inclinado → Peck Deck → Tríceps → Core → Panturrilha`

### Legs A — Quadríceps + Posterior Alto Volume
`Panturrilha Ativação → Agachamento → Stiff → Leg Press → Extensora → Flexora → Adutora → Abdutora → Panturrilha Sentada → Panturrilha Final`

### Legs B — Terra + Glúteo (Deadlift day)
`Panturrilha → Extensora Pré-ativação → Terra → Elevação Pélvica → Afundo Smith → Mesa Flexora → Flexora Sentada → Adu/Abdu → Panturrilha`

### Pull A — Largura de Costas (vertical first)
`Puxada Frente → Remada Curvada → Remada Unilateral → Pullover → Crucifixo Inverso → Face Pull → Rosca Scott → Rosca Martelo → Core → Panturrilha`

### Pull B — Espessura de Costas (horizontal first)
`Remada Articulada → Puxada Triângulo → Remada Baixa → Face Pull → Encolhimento → Rosca Barra W → Rosca Unilateral → Core → Panturrilha`

> Pull A = largura (puxada vertical first) · Pull B = espessura (remada horizontal first) — diferenciação intencional
