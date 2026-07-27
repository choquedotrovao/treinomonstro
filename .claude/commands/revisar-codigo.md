Revise o código: $ARGUMENTS

Leia `.claude/skills/arquitetura.skill.md` e `.claude/skills/design-system.skill.md` antes de revisar.

Leia o arquivo indicado completo e execute o checklist abaixo.

## [BLOCK] — Violações críticas das Regras de Ouro

- [ ] View com efeito colateral no render (DOM manipulation, querySelector, addEventListener dentro de renderXxx)
- [ ] `addEventListener` individual em vez de `delegate()` em `mountXxx()`
- [ ] Controller tocando DOM diretamente (querySelector, innerHTML, classList fora de patch)
- [ ] Campo persistido sem estar em `src/store/persistedKeys.js`
- [ ] Re-render total durante treino ativo (deve ser patch cirúrgico)
- [ ] Action órfã: `data-action="x"` no HTML sem `delegate()` correspondente
- [ ] Action órfã: `delegate()` sem `case 'x'` em `AppController.#handleAction()`
- [ ] Ícone Lucide instável: `scan-line`, `weight`, `swords`, `user-circle`

## [WARN] — Riscos de UX e manutenção

- [ ] Touch target < 32px (botão com w/h menor que 8 em Tailwind = 32px)
- [ ] Botão clicável sem `ripple-target`
- [ ] Botão sem `active:scale-95 transition-all`
- [ ] Campo de state lido sem guard de undefined (`state.campo` sem `?? default`)
- [ ] Cor hardcoded (#ef4444, etc.) que deveria usar variável de tema
- [ ] Cor semântica incorreta (ex: blue-400 para sucesso em vez de green-400)
- [ ] `lucide.createIcons()` não chamado após injeção de HTML com ícones

## [NOTE] — Qualidade de código

- [ ] Comentário que repete o que o código já diz
- [ ] Lógica duplicada que existe em outro lugar (utils/format.js, utils/dom.js)

## Formato de saída

```
[BLOCK] arquivo.js:linha — descrição do problema.
        Como corrigir: ...

[WARN]  arquivo.js:linha — descrição.
        Como corrigir: ...

[NOTE]  arquivo.js:linha — descrição.

RESUMO: X bloqueios · Y avisos · Z notas
```
