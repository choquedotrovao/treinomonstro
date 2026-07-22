Faça uma auditoria completa da view: $ARGUMENTS

Leia o arquivo completo da view indicada e responda cada seção:

## 1. Assinatura da função render

- Nome da função exportada
- Parâmetros recebidos (quais campos do state usa?)
- Retorna string HTML? (deve retornar apenas string — sem efeitos colaterais)

## 2. Actions declaradas

Liste todos os `data-action="..."` encontrados no HTML gerado.
Para cada um, verifique:
- Está registrado no `mountXxx()` desta view? (delegate)
- Está registrado no `AppController.#handleAction()`? (case)
- Se não: é um bug de action órfã.

## 3. Patches cirúrgicos (se WorkoutView)

Liste todas as funções `patchXxx()` exportadas.
Para cada uma, verifique se o AppController a importa e chama corretamente.

## 4. Estado consumido

Quais campos do `state` esta view lê?
Algum campo pode ser `undefined` sem default guard?

## 5. Dependências de dados

A view recebe dados externos (workouts, achievements, etc.)?
Esses dados são passados como parâmetro ou lidos de outro lugar?

## 6. Problemas encontrados

Liste bugs, inconsistências ou violações das regras de ouro:
- View com efeito colateral?
- addEventListener individual em vez de delegation?
- Ícone Lucide instável (scan-line, weight, swords, user-circle)?
- Touch target < 32px?
- Botão clicável sem `ripple-target`?

## 7. Recomendações

O que corrigir e por qual ordem de prioridade.
