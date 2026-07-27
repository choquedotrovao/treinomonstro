Corrija o bug: $ARGUMENTS

Leia `.claude/skills/arquitetura.skill.md` antes de rastrear.

## 1. Identifique o tipo

- **UI visual** — elemento não aparece, estilo errado, ícone sumiu
- **Lógica de negócio** — cálculo errado (vol, ciclo, PR, stagnação)
- **Estado/store** — dado perdido após reload, campo undefined, migração faltando
- **Action órfã** — botão não responde (delegate ausente ou case ausente em #handleAction)
- **Cache/SW** — app serve versão antiga mesmo após mudança no código

## 2. Rastreie o fluxo completo

```
Evento (toque) → delegate() na view → handler(action, payload)
  → AppController.#handleAction() → controller.método()
    → store.setState() → subscriber → patch/render
```

Localize exatamente em qual passo o fluxo quebra.

## 3. Localize

- Arquivo e número de linha
- Use Grep para confirmar — não assuma

## 4. Fix mínimo

Entregue apenas o necessário para corrigir. Não refatorar código vizinho.

## 5. Verifique impacto lateral

O fix pode quebrar outro fluxo? Outra view consome o mesmo estado?

## Formato de saída

```
CAUSA RAIZ: [uma linha]
ARQUIVO: src/...:linha

ANTES:
[código com bug]

DEPOIS:
[código corrigido]

IMPACTO LATERAL: [nenhum / o que pode ser afetado]
SW BUMP: [necessário / não necessário]
```
