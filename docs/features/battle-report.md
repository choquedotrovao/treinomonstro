# Feature — Battle Report

**Versão:** v6.0+ (hero de duração: v6.6)
**Status:** Implementado

## O que faz

Tela de resultado pós-treino com animação, estatísticas e comparação vs sessão anterior.

## Seções (de cima para baixo)

1. **Hero** — troféu + título do treino + pill de duração (`⏱ 47 min · de treino`)
2. **Carga Total** — card col-span-2, número grande em kg
3. **Stats** — Repetições + Séries (2 cards iguais)
4. **Locomoção** — aparece se havia comutação ativa (distância/tempo/calorias)
5. **Exercício MVP** — exercício com maior peso da sessão
6. **vs. Sessão Anterior** — delta de volume/reps por exercício (verde ▲ / vermelho ▼)
7. **Pronto para subir carga** — progressionChips (exercícios no teto do range)
8. **Volume por Exercício** — breakdown detalhado
9. **Achievements** — conquistas desbloqueadas nesta sessão
10. **Quote motivacional** — frase aleatória
11. **Ações** — Compartilhar + Fechar

## Dados de entrada (objeto `stats`)

```js
{
  title:           string,         // nome do treino
  workoutId:       string,
  entryId:         number,         // Date.now() do HistoryEntry
  vol:             number,         // kg total
  reps:            number,
  sets:            object,         // { [exId]: SetLog[] } — sessionSets
  duration:        number | null,  // minutos desde workoutStartTime
  mvp:             { name, weight, reps },
  breakdown:       { exId, name, vol, maxWeight }[],
  mission:         Mission | null,
  progressionChips: { name, increment }[],
  quote:           string,
  quoteAuthor:     string | null,
  exerciseNotes:   { [exId]: string },
}
```

## Duration no hero

```js
// Aparece como pill se duration > 0
${(s.duration ?? 0) > 0 ? `
<div class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full ...">
  <i data-lucide="timer">  ${formatDuration(s.duration)}  de treino
` : ''}
```

`duration` = `Math.round((Date.now() - state.workoutStartTime) / 60000)` — tempo real desde o clique em "Iniciar Treino".
