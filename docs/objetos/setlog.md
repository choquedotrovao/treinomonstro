# Objeto — SetLog e ExLogs

Representa os dados registrados de uma série e de um exercício durante o treino.
Vive em `state.logs[wId][exId]`.

## ExLogs (nível exercício)

```js
// state.logs['1']['t1_1'] = ExLogs
{
  0: SetLog,          // série 0
  1: SetLog,          // série 1
  2: SetLog,          // série 2
  _c: 4,             // override de contagem (omitido se igual a ex.sets)
  _skip: true,       // exercício pulado (omitido se false/undefined)
}
```

Campos especiais com prefixo `_` são excluídos de iterações numéricas:
```js
Object.entries(exLogs).filter(([k]) => !k.startsWith('_'))
```

## SetLog (nível série)

```js
{
  w: 60,            // number | '' — peso em kg
  r: 10,            // number | '' — repetições (ou segundos se timed)
  done: true,       // boolean — série concluída
  warmup: false,    // boolean — série de aquecimento (excluída de vol/PR/RPE)
  rpe: 8,           // number | null — Rate of Perceived Exertion (6-10)
}
```

## Regras de negócio

- `warmup: true` → excluído de: volume, PR, RPE chips, computeLoadTarget, progressionChips
- `_skip: true` → exercício excluído de: vol, breakdown, MVP, progressionChips no finishWorkout
- `_c` → override da contagem de séries (`countSets(exLogs, ex.sets)` em WorkoutView)
- `rpe` → toggle: clicar mesmo valor novamente seta `null` (remove)

## Onde é persistido

`state.logs` → `persistedKeys.js` → `StorageService` → `localStorage['monstro_v2_logs']`

Limpo ao finalizar o treino? **Não** — logs persistem para contexto de próxima sessão.
Reset manual: via "Resetar Treino" no WorkoutView.
