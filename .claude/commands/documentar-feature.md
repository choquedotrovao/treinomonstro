Documente a feature: $ARGUMENTS

## O que fazer

1. Leia todos os arquivos relacionados à feature usando Grep e Read
2. Leia `docs/ARCHITECTURE.md` para contexto geral
3. Gere ou atualize `docs/features/[nome].md`

## Formato do documento gerado

```markdown
# [Nome da Feature]

> v{X.Y} · {data}

## O que faz
[2-3 linhas: o que entrega para o Cláudio, não como funciona]

## Arquivos
| Arquivo | Responsabilidade |
|---|---|
| `src/controllers/...` | [o que faz neste módulo] |
| `src/views/...` | [o que renderiza] |
| `src/data/...` | [estrutura dos dados] |

## Fluxo de dados
```
trigger (data-action="x") 
  → delegate() em mountXxx()
    → handler('x', payload)
      → AppController.#handleAction()
        → controller.método()
          → store.setState(patch)
            → subscriber → patchXxx() / re-render
```

## Estado adicionado
```js
// app.js DEFAULT_STATE
novoCampo: tipo,  // default: valor

// persistedKeys.js (se persistido)
'novoCampo',
```

## Actions
| Action | View | Controller | Descrição |
|---|---|---|---|
| `toggle-x` | `data-action` em XxxView | `xCtrl.método()` | [o que faz] |

## Decisões técnicas
- **Por quê patch cirúrgico em vez de re-render**: [motivo]
- **Por quê o campo é efêmero / persistido**: [motivo]
- [outras decisões não óbvias]

## Edge cases
- [situação especial 1] → [como é tratada]
- [situação especial 2] → [como é tratada]
```

## Regras

- Descrever o PORQUÊ das decisões, não o QUE o código faz
- Nunca repetir o que os nomes das funções já comunicam
- Manter compacto: um arquivo por feature, máximo 80 linhas
- Se a feature já tem doc, atualizar o existente — não criar duplicata
