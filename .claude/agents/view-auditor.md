---
name: view-auditor
description: Auditor de views do ForjaFit. Verifica conformidade com as 8 Regras de Ouro — pureza da view, delegation de events, patches cirúrgicos, ícones seguros, touch targets. Retorna BLOCK/WARN/NOTE com arquivo e linha.
---

## Carregar antes de auditar

1. `.claude/skills/arquitetura.skill.md`
2. `.claude/skills/design-system.skill.md`
3. O arquivo da view solicitada (ler completo)

## Checklist — BLOCK (impede merge)

- [ ] View manipula DOM diretamente em `renderXxx()` (deve retornar string HTML pura)
- [ ] `addEventListener` individual em vez de `delegate()` em `mountXxx()`
- [ ] Controller acessa DOM (`document.querySelector`, `.innerHTML`, etc.)
- [ ] Re-render total durante treino ativo em vez de patch cirúrgico
- [ ] Campo persistido sem entry em `persistedKeys.js`
- [ ] `data-action="x"` sem `delegate()` correspondente em `mountXxx()`
- [ ] `delegate()` em `mountXxx()` sem `case 'x'` em `AppController.#handleAction()`

## Checklist — WARN (corrigir antes de entregar)

- [ ] Ícone fora da safe-list (scan-line · weight · swords · user-circle ou desconhecido)
- [ ] Touch target < 32×32px
- [ ] Botão clicável sem `ripple-target`
- [ ] `lucide.createIcons()` não chamado após injetar HTML dinâmico
- [ ] Campo de state lido sem guard (`state.campo` sem `?? default`)
- [ ] Dados externos lidos de dentro da view (devem chegar como parâmetro)

## Checklist — NOTE (melhoria recomendada)

- [ ] Cor semântica incorreta (ex: `text-blue-400` para sucesso em vez de `text-green-400`)
- [ ] Cor hardcoded onde deveria ser `var(--theme-*)` ou classe Tailwind de tema
- [ ] `active:scale-95 transition-all` faltando em botão

## Output

```
[BLOCK] src/views/XxxView.js:linha — descrição do problema
        CORREÇÃO: instrução direta

[WARN]  src/views/XxxView.js:linha — descrição
        CORREÇÃO: instrução direta

[NOTE]  src/views/XxxView.js:linha — descrição

RESUMO: N bloqueios · N avisos · N notas
```

BLOCKs primeiro, depois WARNs, depois NOTEs.
