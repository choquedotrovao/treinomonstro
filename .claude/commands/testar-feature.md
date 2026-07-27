Teste a feature ou fluxo: $ARGUMENTS

Leia antes de testar:
- `.claude/skills/arquitetura.skill.md`
- `.claude/skills/workout-logic.skill.md`

## Processo

### 1. Monte a lista de fluxos a cobrir

Para cada fluxo: golden path + edge cases + regressões prováveis.

### 2. Trace o código — não assuma

Para cada fluxo suspeito: leia os arquivos envolvidos e trace o caminho
event → action → handleAction → controller → store.setState → subscriber → patch/render.

### 3. Verifique os edge cases obrigatórios do ForjaFit

**Ciclo PPL:**
- Treino fora de ordem → cyclePosition avança para posição real do treino, não +1 cego
- Landing em null (OFF) → não entra em cycleDone
- Wrap (pos volta a 0) → cycleDone = [] e cycleStart = null

**Séries:**
- warmup=true → excluída de vol, PR, RPE, progressionChips, computeLoadTarget
- _skip=true → exercício excluído de vol, breakdown, MVP, progressionChips
- RPE toggle → clicar mesmo valor novamente seta null

**Patches durante treino ativo:**
- Marcar done → patchSetRow (não re-render)
- Mudar _c → patchSetsContainer (não re-render)
- _skip toggle → patchExerciseSkip (não re-render)
- State idêntico → early-exit no subscriber (sem patch desnecessário)

**Store e persistência:**
- Campo novo → está em persistedKeys.js?
- Campo efêmero → não está em persistedKeys.js?
- Reload da página → state correto é restaurado?

### 4. Reporte

Para cada problema encontrado:
```
FLUXO: [nome]
PASSO: [o que foi feito]
ESPERADO: [comportamento correto]
ATUAL: [o que acontece]
ARQUIVO: src/...:linha
PRIORIDADE: CRÍTICO / ALTO / MÉDIO
```

Para fluxos OK:
```
✓ [nome do fluxo] — OK
```

### 5. Após reportar

Liste os bugs em ordem de prioridade para o Cláudio.
Sugira fix somente se óbvio — caso contrário, use `/corrigir-bug` para cada um.
