Adicione o exercício ao treino: $ARGUMENTS

Leia `.claude/skills/workout-logic.skill.md` antes de fazer qualquer edição.

## 1. Leia o arquivo completo

Leia `src/data/workouts.js` inteiro para entender:
- IDs existentes no treino de destino
- Ordem atual dos exercícios
- Próximo número disponível para o ID

## 2. Confirme o ID

Use Grep para confirmar que o novo ID não existe:
```
Grep: id: 't{wId}_{n}'
```

O ID deve seguir o padrão `t{wId}_{n}` sequencial.
Se o exercício for para Legs A (wId=2) e o último ID existente for `t2_6`, o novo é `t2_7`.

## 3. Determine a posição correta

Baseado na ordem de ativação muscular obrigatória (ver skill):

- **Push**: compostos de peito → isolados ombro → tríceps
- **Legs**: panturrilha → compostos quad (agachamento) → posterior composto (stiff) → leg press → flexora → extensora
- **Pull**: puxada → remada → bíceps → posterior ombro

O exercício deve ser inserido na posição que respeita essa ordem — nunca só ao final.

## 4. Estrutura obrigatória

```js
{
  id: 't{wId}_{n}',
  name: 'Nome do Exercício',
  sets: 3,
  reps: '8-12',              // use 'Xs' para timed (ex: '30s')
  rest: 90,
  note: 'Instrução de execução',  // opcional mas recomendado
  muscles: ['grupo principal', 'grupo secundário'],  // opcional
}
```

## 5. Proponha antes de editar

Mostre:
- O exercício completo em formato JSON
- A posição exata no array (entre qual exercício e qual)
- Por quê essa posição respeita a ordem de ativação

Aguarde confirmação antes de editar o arquivo.

## 6. Após editar

- Arquivo `workouts.js` já está no cache do SW → **NÃO é necessário bumpar SW**
- Verifique: o novo `exId` segue o padrão correto?
- Verifique: a ordem do array está correta?
