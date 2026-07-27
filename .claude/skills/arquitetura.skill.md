# skill:arquitetura — v6.6
> Não repete: 8 Regras de Ouro → CLAUDE.md · Mapa de arquivos → docs/01-arquitetura.md
> Este skill adiciona: assinaturas de patch, padrões de código state/action/modal

## Fluxo (memorize)
```
event → delegate() → handler(action,payload) → #handleAction → controller.setState → subscriber → patch|render
```
Re-render total só na entrada/saída de view. **Nunca** durante treino ativo.

## Patches WorkoutView — assinaturas exatas

| Função | Quando chamar |
|---|---|
| `patchSetRow(wId, exId, idx, log, ex, vib, pr)` | done/w/r/rpe/warmup de uma série mudou |
| `patchSetsContainer(wId, workout, exId, wLogs, lastSets, prs)` | `_c` (contagem) mudou |
| `patchExerciseCardState(wId, exId, allDone, done, total)` | progresso do card de exercício |
| `patchProgressionBadge(wId, exId, exLogs, lastExSets)` | chip ↑↓= de progressão |
| `patchExerciseSkip(container, wId, exId, skipped)` | `_skip` toggled |
| `patchTimedSetCountdown(key, remaining, total)` | countdown de série cronometrada |
| `patchExerciseNote(exId, note)` | nota editada no exercício |

## Como adicionar state

```js
// 1. src/app.js — DEFAULT_STATE
campo: valorDefault,

// 2. src/store/persistedKeys.js — se deve sobreviver ao fechar app
'campo',   // omitir se efêmero (activeModal, modalData, tab, workoutId)
```

## Como adicionar action

```js
// View HTML:
<button data-action="kebab-case" data-wid="${wId}" data-payload="${val}">

// mountXxx():
delegate(c, '[data-action="kebab-case"]', 'click', (e, el) => {
  createRipple(e, el);
  handler('kebab-case', { wId: el.dataset.wid, val: el.dataset.payload });
});

// AppController #handleAction():
case 'kebab-case': {
  const { wId, val } = payload;
  this.#workoutCtrl.meuMetodo(wId, val);
  break;
}
```

## Como adicionar modal

```js
// Disparar:
store.setState({ activeModal: 'meu-modal', modalData: { id } });

// AppController #renderModal():
case 'meu-modal': return this.#showMeuModal(state.modalData);

// Método:
#showMeuModal(data) {
  this.#modalLayer.innerHTML = `<div>...</div>`;
  if (window.lucide) lucide.createIcons({ nodes: [this.#modalLayer] });
  $('#fechar', this.#modalLayer)?.addEventListener('click', () => this.#closeModal());
}
```

## Convenções rápidas

| Entidade | Padrão |
|---|---|
| Treino built-in | `'1'`–`'6'`, `'cardio'` |
| Treino custom | `custom_${Date.now()}` |
| Exercício built-in | `t{wId}_{n}` ex: `t1_1` |
| Exercício custom | `cex_${Date.now()}_${random}` |
| chave localStorage | `monstro_v2_{key}` via StorageService |
| action DOM | kebab-case: `toggle-set`, `mod-sets` |
| campo especial exLogs | underscore prefix: `_c`, `_skip` |
