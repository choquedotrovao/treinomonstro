# claude-doc-sample — Padrão de Documentação ForjaFit

> Use este arquivo como referência ao criar qualquer doc novo. Copie o template da seção correta.

---

## Convenção de nomenclatura

```
docs/
├── 00-visao-geral.md          ← o que é, quem usa, links para o resto
├── 01-arquitetura.md          ← mapa técnico (controllers, views, store, fluxo)
├── 02-estado-store.md         ← forma do state, persistedKeys, migrações
├── 03-design-system.md        ← tokens, componentes, ícones, temas
├── features/
│   └── [kebab-case].md        ← uma entrada por feature (ex: skip-exercise.md)
├── objetos/
│   └── [nome-do-objeto].md    ← estruturas de dados (ex: setlog.md, workout.md)
└── decisoes/
    └── ADR-[NNN]-[titulo].md  ← decisões arquiteturais (ex: ADR-001-vanilla-js.md)
```

**Regras de nomenclatura:**
- Prefixos numéricos `00-` a `05-` para docs raiz (ordem de leitura sugerida)
- `features/` e `objetos/` e `decisoes/` em kebab-case, sem prefixo numérico
- ADRs com número sequencial 3 dígitos: `ADR-001`, `ADR-002`...

---

## Template: Feature

```markdown
# [Nome da Feature]

> v{X.Y} · {data}

## O que faz
[2-3 linhas: o que entrega para o Cláudio, não como funciona internamente]

## Arquivos
| Arquivo | Responsabilidade |
|---|---|
| `src/controllers/XxxController.js` | [o que faz] |
| `src/views/XxxView.js` | [o que renderiza] |

## Fluxo
```
data-action="x" → delegate() em mountXxx()
  → handler('x', payload) → AppController.#handleAction()
    → controller.método() → store.setState()
      → subscriber → patchXxx()
```

## Estado
```js
// app.js DEFAULT_STATE
novoCampo: tipo,  // default: valor, persiste: sim/não
```

## Decisões técnicas
- **Por quê patch cirúrgico:** [motivo não óbvio]
- **Por quê campo efêmero:** [motivo]
```

---

## Template: Objeto

```markdown
# Objeto — [Nome]

[Uma linha: onde vive e para que serve]

## Estrutura
```js
{
  campo: tipo,   // descrição
}
```

## Regras de negócio
- [regra 1]
- [regra 2]

## Onde é usado
- `src/...` — [como é consumido]
```

---

## Template: ADR (Decisão Arquitetural)

```markdown
# ADR-[NNN] — [Título da Decisão]

> {data} · Status: Aceito / Substituído por ADR-XXX

## Contexto
[Qual problema ou trade-off motivou esta decisão]

## Decisão
[O que foi decidido — uma frase direta]

## Consequências
- **Positivo:** [o que fica mais fácil]
- **Negativo:** [o que fica mais difícil ou limitado]
- **Neutro:** [o que muda sem impacto claro]
```

---

## Princípios de escrita

1. **Descreva o PORQUÊ, não o QUÊ** — o código já diz o que faz. Docs explicam por que foi feito assim.
2. **Compacto** — máximo 80 linhas por arquivo. Se ficou grande, quebre em dois.
3. **Incremental** — crie ao finalizar uma feature, não antes. Atualize ao mudar o comportamento.
4. **Sem repetição** — se está no CLAUDE.md ou na skill, não repita aqui. Use link.
5. **Sem doc de tarefa** — "adicionei X por causa do issue Y" não pertence aqui. Vai no commit/PR.
