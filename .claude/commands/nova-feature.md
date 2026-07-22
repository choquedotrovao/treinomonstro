Planeje e implemente a feature: $ARGUMENTS

## Antes de escrever uma linha de código

Responda cada item abaixo:

**1. Objetivo**
O que exatamente será entregue? Qual problema resolve para o Cláudio?

**2. Arquivos impactados**
Liste os arquivos que serão modificados (views, controllers, store, data, utils).
Use Grep e Glob para confirmar — não assuma.

**3. Estado novo (se houver)**
- Campo novo em `app.js` defaults?
- Chave nova em `src/store/persistedKeys.js`?
- Migração necessária em `app.js`?

**4. Action nova (se houver)**
- `data-action` na view
- `delegate()` no `mountXxx()`
- `case` em `AppController.#handleAction()`

**5. Modal novo (se houver)**
- `store.setState({ activeModal: 'id', modalData: {...} })`
- `case` em `AppController.#renderModal()`
- Método `#showXxx()` no AppController

**6. Riscos**
O que pode quebrar? Quais views/fluxos podem ser afetados indiretamente?

**7. Patch cirúrgico ou re-render total?**
- Se a feature toca WorkoutView durante treino ativo → patch cirúrgico obrigatório.
- Caso contrário → re-render da seção é aceitável.

## Só depois de responder tudo acima: implemente.

## Checklist de validação pós-implementação

- [ ] View é pura (renderXxx retorna string, sem efeitos colaterais)
- [ ] Events via delegation (não addEventListener individual)
- [ ] Controller não toca DOM
- [ ] Campo novo em persistedKeys.js (se aplicável)
- [ ] SW bumped (se arquivo novo foi adicionado ao projeto)
- [ ] Lucide: somente ícones da lista segura em CLAUDE.md
- [ ] Touch targets ≥ 32px em todos os botões novos
- [ ] Ripple em botões clicáveis (classe `ripple-target`)
