# ForjaFit — Treino Monstro

PWA de workout tracker gamificado para treino PPL. Uso pessoal — sem backend, sem build, funciona 100% offline.

## Stack

```
Vanilla JS ES Modules · Tailwind CDN · Lucide 0.460.0 · localStorage · Service Worker
```

Sem framework. Sem Node.js. Sem processo de build. Deploy = copiar arquivos.

## O que faz

- Ciclo PPL (Push/Pull/Legs A/B) com tracker visual de 8 slots
- Registro de séries com peso, reps, RPE e warmup
- PRs automáticos via Epley 1RM
- Battle Report pós-treino: carga total, MVP, progressão vs sessão anterior
- Achievements e streaks gamificados
- Timer de descanso separado do tempo de treino
- Progressão automática de carga (progression chips)
- Skip de exercício sem perder dados
- Cardio tracker com zonas e comutação ativa
- 10 temas visuais
- Instalável como PWA (offline-first)

## Rodar localmente

Serve os arquivos estáticos com qualquer servidor HTTP:

```bash
# XAMPP (Windows)
# Copiar para C:\xampp\htdocs\treino-monstro\
# Acessar: http://localhost/treino-monstro/

# Python
python -m http.server 8080

# Live Server (VS Code)
# Extensão Live Server → Open with Live Server
```

## Estrutura

```
src/
├── app.js                   bootstrap + estado padrão + migrações
├── controllers/
│   ├── AppController.js     orquestrador: subscriber único, routing, modais
│   ├── WorkoutController.js logs, PRs, ciclo, achievements
│   └── CardioController.js  sessão de cardio, comutação
├── views/                   render puro → string HTML (zero side-effects)
├── store/
│   ├── store.js             Store imutável (Object.freeze)
│   └── persistedKeys.js     campos persistidos no localStorage
├── data/
│   ├── workouts.js          treinos PPL built-in
│   ├── achievements.js      sistema de conquistas
│   └── exerciseLibrary.js   banco de exercícios
├── services/
│   ├── StorageService.js    localStorage prefixo monstro_v2_
│   ├── TimerService.js      countdown de descanso
│   └── ThemeService.js      10 temas de cor
└── utils/                   dom · format · labels
docs/                        documentação técnica completa
sw.js                        Service Worker (cache-first prod)
manifest.json                PWA manifest
```

## Arquitetura em uma linha

```
event → delegate() → #handleAction → controller.setState → subscriber → patch|render
```

Regras de ouro: views são puras (string → HTML), controllers não tocam DOM, subscriber único no AppController.
Documentação completa em `docs/`.

## Versão atual

**v6.6** — Cycle Overview, Workout Picker, Battle Report com duração em destaque, Skip Exercise, timer dual (treino vs descanso).

Ver histórico completo em `docs/HISTORY.md`.

## Desenvolvimento com Claude Code

```bash
claude  # abre no diretório do projeto
```

Commands disponíveis:

| Command | Uso |
|---|---|
| `/nova-feature [descrição]` | Planeja feature em 9 seções antes de implementar |
| `/corrigir-bug [erro]` | Fix mínimo rastreando o fluxo completo |
| `/testar-feature [fluxo]` | QA end-to-end com edge cases do ciclo PPL |
| `/audit-view [NomeView.js]` | Auditoria de conformidade com as 8 Regras |
| `/sprint` | Prioriza backlog por impacto real |

Documentação de IA em `.claude/README.md`.
