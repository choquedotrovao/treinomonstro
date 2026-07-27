# Objeto — Exercise

Representa um exercício dentro de um treino. Definido em `src/data/workouts.js` (built-in) ou `src/data/exerciseLibrary.js` (banco de exercícios).

## Estrutura

```js
{
  id:   't1_1',                              // ver convenção abaixo
  name: 'Supino Inclinado (Halter/Articulado)',
  icon: 'dumbbell',                          // Lucide icon — apenas ícones seguros
  sets: 3,                                   // número de séries padrão
  reps: '6-8',                               // string range OU number (ex: '60s' para timed)
  rest: 120,                                 // segundos de descanso após a série
  note: '1ª Série leve 15x',               // (opcional) instrução do personal
}
```

## Convenção de IDs

| Tipo | Formato | Exemplo |
|---|---|---|
| Built-in | `t{wId}_{n}` | `t1_1` (1º exercício do treino 1) |
| Custom | `cex_${Date.now()}_${random}` | `cex_1718123456789_4892` |

IDs com sufixo semântico também existem: `t1_calf`, `t2_legp`, `t2_calf_a` — criados quando o índice numérico seria ambíguo.

## Ícones permitidos (Lucide 0.460.0)

Usar apenas ícones do safe-list em CLAUDE.md. Mais comuns em exercícios:
`dumbbell` · `activity` · `target` · `layers` · `zap` · `heart` · `flame` · `move`

## Onde é usado

- `src/data/workouts.js` — exercícios built-in de cada treino
- `src/data/exerciseLibrary.js` — banco para adicionar a treinos customizados
- `state.logs[wId][exId]` — chave para logs da sessão
- `state.prs[exId]` — PR por exercício
- `history[].breakdown[].exId` — referência no histórico
