# ForjaFit — Claude Code Infrastructure

> PWA Vanilla JS · Cláudio Santana · v6.6
> Abrir o projeto → `claude` no terminal → commands disponíveis imediatamente.

---

## Commands

| Command | Quando usar |
|---|---|
| `/nova-feature [descrição]` | **Começar aqui.** Gera plano em 9 seções, aguarda aprovação antes de implementar |
| `/sprint` | Início de sessão — prioriza backlog por impacto real |
| `/corrigir-bug [erro ou sintoma]` | Cola o erro ou descreve o comportamento errado |
| `/testar-feature [feature/fluxo]` | QA end-to-end + edge cases do ciclo PPL |
| `/audit-view [NomeView.js]` | Antes de refatorar ou ao suspeitar de bug em view |
| `/revisar-codigo [arquivo]` | Antes de commitar — checklist BLOCK/WARN/NOTE |
| `/add-achievement [id]` | Garante estrutura correta do achievement |
| `/add-exercise [nome] no treino [X]` | Respeita ordem de ativação muscular |
| `/bump-sw` | Antes de deploy ou ao criar arquivo novo |
| `/documentar-feature [nome]` | Gera `docs/features/[nome].md` após implementar |

---

## Agents

Selecionados por contexto. Para acionar explicitamente: mencione pelo nome.

| Agent | Especialidade | Carrega |
|---|---|---|
| `feature-planner` | Planeja features em 9 seções antes de qualquer código | skills relevantes |
| `bug-hunter` | Rastreia fluxo completo, entrega fix mínimo sem refatoração | arquitetura.skill + arquivo suspeito |
| `view-auditor` | Conformidade com as 8 Regras — BLOCK/WARN/NOTE | arquitetura + design-system skills |
| `workout-data` | workouts.js, IDs, ordem de ativação muscular | workout-logic.skill + workouts.js |
| `sprint-planner` | Prioriza backlog por impacto real para o Cláudio | CLAUDE.md + HISTORY.md |
| `qa-tester` | Testa fluxos end-to-end, ciclo PPL edge cases, regressões | arquitetura + workout-logic skills |

---

## Skills

Carregadas pelos commands e agents — referências compactas, não tutoriais.

| Skill | Cobre | Não repete |
|---|---|---|
| `arquitetura.skill.md` | Assinaturas de patch, padrões state/action/modal em código | 8 Regras (CLAUDE.md), file tree (01-arquitetura.md) |
| `design-system.skill.md` | HTML de componentes, safe-list Lucide completa, tipografia | Paleta detalhada (03-design-system.md) |
| `workout-logic.skill.md` | Ciclo PPL, ExLogs, guards finishWorkout, RPE, achievements | DEFAULT_STATE (02-estado-store.md), ADR-003 |
| `pwa-storage.skill.md` | When-to-bump SW, persistedKeys regra, padrão migração | DEFAULT_STATE completo (02-estado-store.md) |

---

## Docs de referência

```
docs/
├── 00-visao-geral.md       ← ler primeiro — o que é, quem usa, links
├── 01-arquitetura.md       ← mapa técnico, patches, decisões
├── 02-estado-store.md      ← shape do state, persistedKeys, ExLogs, migrações
├── 03-design-system.md     ← tokens, componentes, ícones, temas
├── 04-ciclo-ppl.md         ← mecânica completa do ciclo PPL com código
├── 05-gamificacao.md       ← achievements, PRs, battle report, timers
├── claude-doc-sample.md    ← template para qualquer doc novo
├── features/               ← uma entrada por feature (/documentar-feature)
│   ├── skip-exercise.md
│   ├── cycle-overview.md
│   ├── battle-report.md
│   └── timer-dual.md
├── objetos/                ← workout.md · exercise.md · setlog.md · history-entry.md
├── decisoes/               ← ADR-001 (Vanilla JS) · ADR-002 (Patches) · ADR-003 (Ciclo)
└── HISTORY.md              ← histórico de sprints (v2.0 → v6.6)
```

---

## Cadeia de execução

```
Você digita /nova-feature X
  → Command carrega skills relevantes
    → feature-planner responde 9 seções
      → Para e pergunta "Posso implementar?"
        → Você aprova → Implementa no padrão ForjaFit
```

Skills e agents são internos. A interface é sempre o command.

---

## Princípio de eficiência de token

Cada skill tem `> Não repete:` indicando onde a informação detalhada vive. Agents têm `## Carregar antes de responder` com lista mínima necessária. Não carregar o que não é relevante para a tarefa atual.
