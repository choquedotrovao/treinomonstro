# UI Reference — Treino Monstro v6.1

Referência técnica de cada view, seus componentes, ações disponíveis e estados.

---

## HOME (`tab: 'home'`)

**Objetivo:** Orientação do dia — missão, streak, ciclo, insight, próxima conquista.

### Componentes

| Componente | ID / Classe | Descrição |
|---|---|---|
| Header + Sharingan | `.header` | Logo animado, muda por tema |
| Saudação contextual | — | Hora do dia + nome do projeto |
| Citação do dia | — | `getTimedQuote()` — muda por período |
| Banner de resumo de cardio | `#resume-cardio` | Aparece se sessão cardio ativa |
| Banner de ciclo completo | — | Quando `cycleDone.length >= cycleGoal` |
| Banner de streak em risco | — | Streak ativo + sem treino hoje |
| Banner de ciclo parado | — | Último treino > inactivityResetDays |
| Banner de onboarding | — | Quando `history.length === 0` |
| Missão de Hoje | — | Próximo treino no cycleOrder |
| Widget de streak | — | Contador em dias (hint: `streak`) |
| Barra de ciclo | — | `weekCount/cycleGoal` (hint: `cycles`) |
| Próxima conquista | — | Barra de progresso para o próximo milestone |
| Motor de Insights | — | 1 insight contextual (8 sinais priorizados) |
| Widget de Cardio | — | Último cardio + stats 7 dias + CTA |

### Ações (`data-action`)

| Action | Payload | Efeito |
|---|---|---|
| `start-workout` | `workoutId` | Navega para WorkoutView |
| `start-cardio` | `protocolId` | Inicia sessão de cardio |
| `goto-tab` | `'treinar'` | Navega para DashboardView |
| `goto-tab` | `'cardio'` | Navega para CardioView |
| `reset-week` | — | Reinicia ciclo atual |
| `show-hint` | `'streak'` | Abre modal explicativo |
| `show-hint` | `'cycles'` | Abre modal explicativo |
| `open-cardio-log` | — | Abre modal de log rápido |
| `open-calendar` | — | Abre calendário de atividades |

### Estados

- **Onboarding:** nenhum treino no histórico — mostra banner de boas-vindas
- **Normal:** missão do dia + streak + ciclo
- **Ciclo completo:** banner de parabéns sobrepõe streak/stale banners
- **Cardio ativo:** banner de retomada no topo

---

## TREINOS / DASHBOARD (`tab: 'treinar'`)

**Objetivo:** Lista de treinos disponíveis, estado do ciclo, navegação para execução.

### Componentes

| Componente | Descrição |
|---|---|
| Ciclo tracker (8 slots) | Slots preenchidos = `cycleDone.length`, meta = `cycleGoal` |
| Lista de treinos | Cards clicáveis com badges HOJE / FEITO / PRÓXIMO |
| Card de treino custom | Com botão "Editar" e "Excluir" |
| Botão "Novo Treino" | Abre WorkoutEditorView |
| Widget de cardio | Resumo semanal + atalho para CardioView |

### Badges de treino

| Badge | Condição |
|---|---|
| **HOJE** | `cycleOrder[cyclePosition] === w.id` + não feito no ciclo |
| **FEITO** | `cycleDone.includes(w.id)` (no ciclo atual) |
| **PRÓXIMO** | Próximo no cycleOrder após o HOJE |

### Ações

| Action | Payload | Efeito |
|---|---|---|
| `start-workout` | `workoutId` | Inicia treino |
| `open-workout-editor` | `workoutId?` | Cria ou edita treino |
| `delete-custom-workout` | `workoutId` | Remove treino custom (com confirm) |
| `reset-week` | — | Reinicia ciclo |
| `start-cardio` | `protocolId` | Inicia cardio direto do dashboard |

---

## EXECUÇÃO DE TREINO (`tab: 'workout'`)

**Objetivo:** Interface de execução série a série com patches cirúrgicos no DOM.

### Componentes

| Componente | ID | Descrição |
|---|---|---|
| Header ativo | `.header` | Progresso, timer badge, botão finalizar |
| Barra de progresso | `#workout-progress-bar` | % de séries concluídas |
| Volume ao vivo | `#workout-live-vol` | Volume acumulado + delta vs anterior |
| Exercise cards | `.exercise-card` | Um por exercício no treino |
| Séries (SetRow) | `.set-row` | Inputs de peso/reps + botão OK |
| Contexto de progressão | — | Última sessão série a série + hint recovery |
| Meta de carga | — | `loadTarget` ou `suggestWeight` + hint overload |
| Timer badge | `#timer-badge` | Ring SVG + contador regressivo |
| Frase motivacional | `.workout-phrase-toast` | Toast flutuante ao completar descanso |
| Drill-down de exercício | `#exercise-drill-modal` | PR + histórico ao tocar no nome |

### Ações

| Action | Payload | Efeito |
|---|---|---|
| `toggle-set` | `{wId, exId, idx}` | Marca/desmarca série, abre timer |
| `save-log` | `{wId, exId, idx, field, value}` | Salva campo (peso ou reps) |
| `mod-sets` | `{wId, exId, delta}` | +/− séries no exercício |
| `toggle-warmup` | `{wId, exId, idx}` | Marca como aquecimento |
| `auto-fill` | `{wId, exId}` | Copia dados da última sessão |
| `auto-fill-all` | `workoutId` | Copia toda a sessão anterior |
| `adjust-weight` | `{wId, exId, idx, sign}` | ±weightIncrement kg no input |
| `finish-workout` | — | Abre modal de notas |
| `reset-workout` | — | Limpa logs com confirm |
| `show-hint` | `'volume'` | Modal de explicação de volume |
| `show-hint` | `'progressive_overload'` | Modal de sobrecarga progressiva |
| `show-hint` | `'recovery'` | Modal de recuperação muscular |
| `open-exercise-drill` | `exId` | Drill-down do exercício |

### Patches cirúrgicos (sem re-render total)

| Função | Quando |
|---|---|
| `patchSetRow(exId, idx)` | Ao marcar/desmarcar série |
| `patchExerciseCardState(exId)` | Ao mudar estado do card |
| `patchSetsContainer(exId)` | Ao adicionar/remover série |
| `patchProgressionBadge(exId)` | Ao detectar novo PR |
| `#patchWorkout(prev, next)` | Ao mudar volume/progresso |

### Máquina de estados

```
IDLE → startWorkout() → EM EXECUÇÃO
EM EXECUÇÃO → toggleSet() → (timer modal) → EM EXECUÇÃO
EM EXECUÇÃO → finish-workout → NOTAS MODAL → BATTLE REPORT
BATTLE REPORT → "ENCERRAR OPERAÇÃO" → IDLE (navega para treinar)
```

---

## CARDIO (`tab: 'cardio'`)

**Objetivo:** Sessão de cardio guiado com protocolos e GPS opcional.

### Componentes

| Componente | ID | Descrição |
|---|---|---|
| Seletor de protocolo | — | Cards/select por tipo |
| Sessão ativa | `.cardio-active` | Timer, bloco atual, controles |
| Bloco display | `#cardio-block-*` | Nome + tipo + tempo restante |
| GPS tracker | — | Distância acumulada em metros |
| Controles | — | Pausar / Retomar / Pular / Sair |
| Hint zonas | — | Botão `(i)` no nome do protocolo |

### Protocolos built-in

| ID | Nome | Blocos | Modo |
|---|---|---|---|
| `livre` | Livre | 1 (∞) | Manual, sem avanço automático |
| `zona2-30` | Zona 2 · 30min | Aquecimento + Zona2 + Desaquecimento | Guiado |
| `zona2-45` | Zona 2 · 45min | Aquecimento + Zona2 + Desaquecimento | Guiado |
| `vo2max-4x4` | VO2Max · 4×4 | 4 intervalos de 4min + recuperação | Guiado |

### Ações

| Action | Efeito |
|---|---|
| `start-cardio` + `protocolId` | Inicia sessão |
| `cardio-pause` | Pausa o tick |
| `cardio-resume` | Retoma |
| `cardio-skip` | Pula bloco atual |
| `cardio-abandon` | Descarta sessão |
| `finish-cardio` | Abre modal de finalização |
| `confirm-finish-cardio` | Salva + mostra battle report |
| `show-hint` + `'cardio_zones'` | Modal explicativo das zonas |

### Contextos de citação (battle report)

| Contexto | Condição |
|---|---|
| `first_cardio` | Primeiro cardio do histórico |
| `new_pace_record` | Pace melhor que o histórico |
| `new_distance_record` | Maior distância registrada |
| `new_duration_record` | Maior duração registrada |
| `zone_master` | Protocolo `vo2max-4x4` |
| `cardio_streak` | Conquista de streak de cardio |
| `fallback` | Qualquer outro caso |

---

## EVOLUÇÃO / ANALYTICS (`tab: 'evolucao'`)

**Objetivo:** Histórico, heatmap, sparklines, PRs, cardio stats.

### Componentes

| Componente | Descrição |
|---|---|
| Heatmap semanal | Grid de 7×N semanas com intensidade de treino |
| Volume por semana | Sparkline de barras |
| PRs por exercício | Tabela de Personal Records com data |
| Histórico de treinos | Lista paginada (20/página) com delete |
| Seção de Cardio | Stats km/min semanais, pace trend, PRs de corrida, histórico |
| Quick log de cardio | Modal de registro manual |

### Ações

| Action | Efeito |
|---|---|
| `delete-workout-history` | Remove entrada do histórico |
| `delete-cardio` | Remove entrada de cardio |
| `open-cardio-log` | Abre modal de log rápido |
| `save-cardio-log` | Salva entrada manual |
| `load-more-history` | Carrega próxima página |

---

## STATUS / PROFILE (`tab: 'status'`)

**Objetivo:** Biometria, peso corporal, CyberBody SVG, metas pessoais, conquistas.

### Seções

| Seção | toggle hiddenSections |
|---|---|
| Avaliação Física | `bio` |
| Histórico de Avaliações | `bio-history` |
| Peso Corporal | `weight` |
| Circunferências | `circum` |
| TDEE / Macros | `tdee` |
| Metas Pessoais | `goals` |
| Conquistas | `achievements` |
| Semanas Ativas | `weekly-streak` |

### Ações

| Action | Efeito |
|---|---|
| `save-biometrics` | Salva snapshot biométrico |
| `save-weight` | Adiciona entrada de peso |
| `delete-weight` | Remove entrada de peso |
| `delete-bio-history` | Remove snapshot de avaliação |
| `set-activity-level` | Atualiza nível de atividade para TDEE |
| `toggle-section` | Colapsa/expande seção |
| `export-bio-pdf` | `window.print()` |
| `add-goal` | Adiciona meta pessoal |
| `achieve-goal` | Marca meta como alcançada |
| `delete-goal` | Remove meta |
| `goto-settings` | Navega para aba settings |

---

## CONFIGURAÇÕES (`tab: 'settings'`)

**Objetivo:** Todas as preferências do app em 8 seções.

### Seções

| Seção | Conteúdo |
|---|---|
| TREINO | Descanso padrão, vibração, som, incremento de carga, auto-fill |
| CICLOS | Meta do ciclo, reset por inatividade |
| PLANEJAMENTO SEMANAL | Selects por dia (Dom–Sáb) |
| CARDIO | Cardio conta para streak, protocolo padrão |
| NOTIFICAÇÕES | Toggle + horário do lembrete |
| APARÊNCIA | Seletor de tema (grid 2 colunas), modo claro |
| PERFIL | Nome do projeto, modo de linguagem |
| DADOS | Export JSON/CSV, import, reset, Sobre |

### Ações

| Action | Efeito |
|---|---|
| `change-theme` | Aplica novo tema |
| `toggle-light-mode` | Modo claro on/off |
| `set-default-rest` | Duração do descanso padrão |
| `toggle-vibration` | Liga/desliga vibração |
| `toggle-timer-sound` | Liga/desliga som do timer |
| `set-weight-increment` | Define incremento de carga (1/2.5/5kg) |
| `set-cycle-goal` | Meta de sessões por ciclo |
| `set-inactivity-reset` | Dias de inatividade para auto-reset |
| `set-weekly-plan` | Treino associado a um dia da semana |
| `toggle-cardio-streak` | Cardio conta para streak |
| `set-default-cardio-protocol` | Protocolo padrão de cardio |
| `toggle-notifications` | Solicita permissão de push |
| `save-notification-time` | Horário do lembrete |
| `set-project-name` | Nome exibido no header |
| `set-app-mode` | NINJA vs NORMAL (linguagem) |
| `export-json` | Download completo do estado |
| `export-csv` | Download CSV do histórico |
| `import-json` | Importa estado (com confirm) |
| `reset-all-data` | Apaga tudo (com confirm duplo) |

---

## WORKOUT EDITOR (`activeModal: 'workout-editor'`)

**Objetivo:** Criar e editar treinos custom.

### Campos

- Nome do treino
- Exercícios: nome, séries, repetições, grupos musculares
- Reordenação por drag (grip-vertical)
- Adicionar da biblioteca de exercícios

### Ações

| Action | Efeito |
|---|---|
| `save-workout-editor` | Salva treino custom no estado |
| `add-exercise-to-editor` | Adiciona exercício ao editor |
| `remove-exercise-from-editor` | Remove exercício |
| `reorder-exercise` | Move exercício na lista |

---

## Padrões de Nomenclatura

| Tipo | Padrão | Exemplo |
|---|---|---|
| IDs built-in | String numérica | `'1'`, `'2'`, `'cardio'` |
| IDs custom | `custom_${Date.now()}` | `custom_1720890000000` |
| IDs de exercício built-in | `t{wId}_{n}` | `t1_1`, `t3_4` |
| IDs de exercício custom | `cex_${Date.now()}_${rand}` | `cex_1720890000000_a3b` |
| Chaves localStorage | `monstro_v2_{key}` | `monstro_v2_history` |
| data-actions | kebab-case | `start-workout`, `show-hint` |
