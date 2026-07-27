# skill:pwa-storage — v6.6
> Não repete: DEFAULT_STATE completo → docs/02-estado-store.md · SW estratégia → docs/01-arquitetura.md
> Este skill adiciona: regra de bump, tabela when-to-bump, padrão de migração

## Quando bumpar o SW (cache atual: monstro-v21)

| Situação | Bumpar? |
|---|---|
| Arquivo novo em `src/` | **SIM** |
| Nova view ou controller | **SIM** |
| Nova imagem / ícone | **SIM** |
| Só editou arquivo existente | NÃO |
| Adicionou entry em `data/workouts.js` | NÃO |

Onde bumpar: `sw.js` → `const CACHE = 'monstro-v22'` (incrementar número).
Comando: `/bump-sw` faz auditoria automática.

## Campo persistido vs efêmero

```js
// persistedKeys.js — adicionar se deve sobreviver ao fechar app
'novoCampo',

// NÃO adicionar se efêmero:
// activeModal, modalData, tab, workoutId
```

Regra: campo novo persistido → `app.js DEFAULT_STATE` **E** `persistedKeys.js` (ambos obrigatórios).

## Padrão de migração de estado

```js
// src/app.js — após StorageService.loadState()
function migrateNovoFormato(state) {
  if (state.campoAntigo !== undefined && state.campoNovo === undefined) {
    state.campoNovo = state.campoAntigo;
    delete state.campoAntigo;
  }
  return state;
}
// Chamar antes de Store.init(state)
```

Migrações existentes: `migrateLegacyLogs` (v1→v2) · `migrateCycleOrder` (garante 8 slots com null).

## localStorage

Prefixo automático: `StorageService` prefixa com `monstro_v2_`.
Nunca acessar `localStorage` diretamente — sempre via `store.setState()` ou `StorageService`.
