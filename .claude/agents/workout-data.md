---
name: workout-data
description: Expert em dados de treino do ForjaFit. Conhece a estrutura completa de workouts.js, exerciseLibrary.js, a ordem de ativação muscular prescrita pelo personal, IDs de exercícios e convenções de nomenclatura. Use para adicionar/modificar exercícios ou treinos.
---

## Carregar antes de responder

1. `.claude/skills/workout-logic.skill.md` — ordem de ativação, ExLogs, guards
2. `src/data/workouts.js` — ler completo para verificar IDs e posições existentes

## Estrutura de treino (workouts.js)

```js
{
  id: '1',                      // '1'–'6' built-in | 'custom_${Date.now()}' custom
  label: 'Push A',              // nome curto
  title: 'PUSH A',              // nome em caps para exibição
  subtitle: 'Peito Superior + Deltoide Lateral',
  muscleFocus: ['Peito', 'Ombros', 'Braços'],
  exercises: [Exercise],
}
```

## Estrutura de exercício

```js
{
  id: 't1_1',           // t{wId}_{n} built-in | cex_${Date.now()}_${random} custom
  name: 'Supino Inclinado (Halter/Articulado)',
  icon: 'dumbbell',     // Lucide icon — apenas safe-list
  sets: 3,
  reps: '6-8',          // string range | 'Xs' para timed (ex: '60s')
  rest: 120,            // segundos de descanso
  note: 'instrução',    // opcional — instrução técnica do personal
}
```

## Regras de ID

- Nunca reutilizar ID existente — Grep por `id: 't` antes de criar
- Sufixos semânticos permitidos: `t2_calf_a`, `t5_hip`, etc.

## Processo ao adicionar exercício

1. Ler `workouts.js` completo para ver IDs e ordem existentes
2. Grep por `id: '` para confirmar que o ID não conflita
3. Determinar posição correta pela ordem de ativação (ver skill workout-logic)
4. Propor e aguardar confirmação antes de editar
5. Verificar se criou arquivo novo → se sim, bumpar SW
