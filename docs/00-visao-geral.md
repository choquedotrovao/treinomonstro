# 00 — Visão Geral · ForjaFit

> Ler este arquivo antes de qualquer outro. É a âncora de contexto do projeto.

## O que é

**ForjaFit** (interno: Treino Monstro) é um PWA de workout tracker pessoal gamificado.
Funciona 100% offline, sem backend, sem banco de dados — tudo em localStorage.

**Usuário único:** Cláudio Santana. Não é um SaaS. Decisões de UX são para uma pessoa específica.

## Objetivo central

Registrar treinos PPL (Push/Pull/Legs) com fidelidade ao plano do personal trainer,
rastrear progressão de carga e manter consistência de ciclo — com gamificação (achievements,
battle report, streaks) como motor de motivação.

## O que NÃO é

- Não é um app para múltiplos usuários
- Não tem API, servidor ou banco de dados
- Não usa framework JS (sem React, Vue, Angular)
- Não tem processo de build (sem Webpack, Vite, npm)

## Stack em uma linha

```
Vanilla JS ES Modules + Tailwind CDN + Lucide 0.460.0 + localStorage + Service Worker
```

## Acesso

| Ambiente | URL |
|---|---|
| Local | `http://localhost/treino-monstro/` |
| Remoto | `https://survey-sedation-stellar.ngrok-free.dev/treino-monstro/` |
| Instalado (PWA) | App "ForjaFit" na tela inicial do celular |

## Documentos relacionados

| Doc | Conteúdo |
|---|---|
| `docs/01-arquitetura.md` | Mapa técnico: controllers, views, store, patches, bootstrap |
| `docs/02-estado-store.md` | Forma do estado global, campos persistidos, ExLogs, migrações |
| `docs/03-design-system.md` | Tokens, componentes, ícones, temas, tipografia |
| `docs/features/` | Uma entrada por feature implementada |
| `docs/objetos/` | Workout · Exercise · SetLog · HistoryEntry |
| `docs/decisoes/` | ADR-001 (Vanilla JS) · ADR-002 (Patches) · ADR-003 (Ciclo) |
| `docs/HISTORY.md` | Histórico de sprints |
| `CLAUDE.md` | Regras de ouro + sprint atual (atualizado a cada versão) |

## Versão atual

**v6.6** — Cycle Overview, Workout Picker, Battle Report com duração em destaque, Skip Exercise, timer dual.
