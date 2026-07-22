# TREINO MONSTRO — Análise Técnica Detalhada

> Versão do sistema: **v3.5**  
> Data da análise: **17/06/2026**  
> Analista: Claude Sonnet 4.6

---

## 1. VISÃO GERAL DO PRODUTO

**Treino Monstro** é um aplicativo de rastreamento de treinos gamificado, desenvolvido para uso pessoal pelo usuário Cláudio Santana. Funciona como uma **PWA (Progressive Web App)** instalável, rodando inteiramente no lado do cliente — sem backend, sem banco de dados remoto, sem etapa de build.

### Características gerais
- **Usuário único**: projetado para uso pessoal, não multiusuário
- **Offline-first**: funciona sem internet após primeira carga
- **Mobile-first**: layout em portrait, otimizado para tela de celular
- **Tema gamificado**: estética anime/Uchiha/cyber com suporte a 6 temas de cor e modo dia/noite
- **Dual mode**: interface em modo NINJA (terminologia anime) ou NORMAL (terminologia convencional)
- **Ambiente**: XAMPP local → `http://localhost/treino-monstro/`

---

## 2. STACK TÉCNICA

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Markup | HTML5 estático | Shell do app, sem server-side rendering |
| Estilo | Tailwind CSS CDN (JIT runtime) | Sem etapa de build; aceito em ambiente local |
| Ícones | Lucide Icons 0.460.0 (CDN fixado) | SVG inline sem deploy; versão fixada para estabilidade |
| Fontes | Google Fonts CDN | Inter (UI), JetBrains Mono (números/código), Nanum Myeongjo (decorativo) |
| Lógica | Vanilla JavaScript ES Modules | Suporte nativo no browser; sem Node.js, sem bundler |
| Persistência | localStorage (prefixo `monstro_v2_`) | Sem backend; dados pessoais; simplicidade máxima |
| Instalação | Service Worker + Web Manifest | Permite instalação como PWA no Android/iOS |
| Notificações | Web Notifications API | Lembretes de treino via PWA |
| GPS | Geolocation API | Rastreamento de distância em sessões de cardio externo |
| Wake Lock | Screen Wake Lock API | Mantém tela ativa durante sessão de cardio |

---

## 3. ARQUITETURA

### 3.1 Padrão geral

O sistema segue um padrão **MVC simplificado unidirecional**, inspirado no Zustand (React) mas em Vanilla JS:

```
┌────────────────────────────────────────────────────────┐
│                    STORE (imutável)                     │
│  setState() → freeze(newState) → notify(subscribers)   │
└───────────────────────┬────────────────────────────────┘
                        │ subscribe(prev, next)
                        ▼
┌────────────────────────────────────────────────────────┐
│                  AppController                          │
│  Detecta diffs precisos → decide o que re-renderizar   │
│  Orquestra: routing, modais, header, nav, patches      │
└───┬─────────────────┬──────────────────────────────────┘
    │ delega lógica   │ chama render
    ▼                 ▼
WorkoutController   Views (funções puras)
CardioController    renderXxx(state, data) → string HTML
                    mountXxx(container, handler) → event delegation
```

### 3.2 Regras de ouro da arquitetura

1. **Views são puras**: `renderXxx(state, data) → string HTML`. Sem efeitos colaterais, sem acesso ao DOM.
2. **Mount registra eventos via delegation**: nunca `addEventListener` em elementos individualmente — só no container pai.
3. **WorkoutController e CardioController não tocam o DOM**: só chamam `store.setState()`.
4. **Patches cirúrgicos durante sessão ativa**: em vez de re-render total (que perderia foco dos inputs), funções como `patchSetRow()`, `patchCardioTimer()` atualizam apenas os elementos DOM necessários via `getElementById`.
5. **Um subscriber único** no AppController detecta diffs precisos entre `state` e `prev` e decide o que re-renderizar.
6. **cloneNode(false) em #renderMain**: o container principal é substituído por um clone vazio antes de cada re-render, prevenindo acumulação de event listeners — correção para o bug de decremento duplo/triplo no Android.

### 3.3 Fluxo de uma ação do usuário

```
Usuário clica em botão com data-action="minha-action"
        │
        ▼
mountXxx() → delegate() → handler('minha-action', payload)
        │
        ▼
AppController.#handleAction('minha-action', payload)
        │
        ├── Ação simples → store.setState({ ... })
        │
        └── Ação com lógica → WorkoutController.metodo()
                                        │
                                        ▼
                               store.setState({ ... })
                                        │
                                        ▼
                               subscriber notificado
                                        │
                                        ▼
                        AppController detecta diff → re-render seletivo
```

---

## 4. ESTRUTURA DE PASTAS

```
treino-monstro/
├── index.html                  ← Shell HTML do app (nav, header, main, modal-layer, report-layer)
├── manifest.json               ← PWA manifest (nome, ícones, cores, display standalone)
├── sw.js                       ← Service Worker (cache-first local, network-first CDN)
├── docs/
│   └── analise-tecnica.md      ← Este documento
├── icons/
│   └── icon.svg                ← Ícone PWA
└── src/
    ├── app.js                  ← Entry point: instancia serviços, cria store, migração v1→v2, bootstrap
    ├── store/
    │   ├── store.js            ← Observable Store (imutável, com freeze)
    │   └── persistedKeys.js    ← Lista única de chaves persistidas no localStorage
    ├── data/
    │   ├── workouts.js         ← 7 treinos built-in (IDs: '1'–'6', 'cardio')
    │   ├── cardioProtocols.js  ← Protocolos de cardio predefinidos
    │   ├── achievements.js     ← Definições de conquistas + função checkWorkoutAchievements()
    │   ├── exerciseLibrary.js  ← ~70 exercícios em português para autocomplete do editor
    │   └── quotes.js           ← Frases motivacionais (battle report + citação diária)
    ├── services/
    │   ├── StorageService.js   ← Abstração localStorage com prefixo (monstro_v2_)
    │   ├── TimerService.js     ← Countdown event emitter (tick, complete) com Date.now() anti-drift
    │   ├── ThemeService.js     ← 6 temas + light mode; aplica CSS variables no :root
    │   └── ExportService.js    ← Download JSON (backup completo) + CSV (histórico)
    ├── components/
    │   ├── Sharingan.js        ← SVG logo animado (olho Sharingan) — usado no header e Home
    │   └── CyberBody.js        ← SVG corpo humano com scores por grupo muscular
    ├── controllers/
    │   ├── AppController.js    ← Orquestração principal (routing, modais, header, nav, subscriber)
    │   ├── WorkoutController.js← Lógica de treino (logs, PR, finalizações, resets, ciclo)
    │   └── CardioController.js ← Lógica de cardio (sessão guiada, GPS, blocos, achievements)
    ├── views/
    │   ├── HomeView.js         ← HOME: missão de hoje, streak, chakra, atividade recente
    │   ├── DashboardView.js    ← TREINAR: cards de treino musculação + cards de protocolo cardio
    │   ├── WorkoutView.js      ← EXECUÇÃO DE TREINO: cards de exercício, séries, patches
    │   ├── CardioView.js       ← CARDIO: idle state (seleção) + sessão ativa (tracker)
    │   ├── WorkoutEditorView.js← EDITOR: criar/editar treinos com reordenação drag-style
    │   ├── AnalyticsView.js    ← EVOLUIR: 3 abas (Musculação | Cardio | Conquistas)
    │   ├── ProfileView.js      ← CORPO: biometria, TDEE, CyberBody, peso, circunferências
    │   └── SettingsView.js     ← CONFIGURAÇÕES: tema, modo, metas, plano semanal, dados, notificações
    └── utils/
        ├── dom.js              ← $(), setHTML(), show(), hide(), delegate(), createRipple()
        ├── format.js           ← formatTime(), formatDate(), formatDateFull(), formatVolume(), formatDuration(), getRank()
        └── labels.js           ← i18n: NINJA (padrão) | NORMAL — retorna objeto de labels por modo
```

---

## 5. ESTADO GLOBAL (STORE)

### 5.1 Todos os campos do estado

```javascript
{
  // ── Navegação ───────────────────────────────────────────────
  tab:              'home',            // tab ativa: home | treinar | workout | cardio | evoluir | corpo | settings | workout-editor
  workoutId:        null,             // ID do treino sendo executado
  editorWorkout:    null,             // treino sendo editado no WorkoutEditorView
  activeModal:      null,             // modal aberto: timer | confirm | battle-report | notes | cardio-log
  modalData:        null,             // payload do modal ativo

  // ── Treinos & Logs ──────────────────────────────────────────
  logs:             {},               // { [workoutId]: { [exerciseId]: { [idx]: {w, r, done, warmup?} } } }
  history:          [],               // Array de sessões finalizadas (mais recente primeiro)
  week:             [],               // Array de IDs de treinos feitos no ciclo atual
  weekStart:        null,             // Timestamp (ms) do início do ciclo atual
  prs:              {},               // { [exerciseId]: {weight, reps, vol, date} } — Personal Records
  workoutStartTime: null,             // Timestamp (ms) do início da sessão atual
  workoutExercises: {},               // Override de exercícios built-in: { [workoutId]: exercises[] }
  workoutMeta:      {},               // Override de metadata built-in: { [workoutId]: {title, label, subtitle} }
  customWorkouts:   [],               // Treinos criados pelo usuário (isCustom: true)

  // ── Ciclo Adaptativo ────────────────────────────────────────
  cycleOrder:       ['1','2','3',null,'4','5','6',null], // Sequência do ciclo (null = dia de descanso)
  cyclePosition:    0,                // Posição atual no cycleOrder

  // ── Cardio ──────────────────────────────────────────────────
  activeCardioSession:   null,        // Sessão de cardio em andamento (objeto completo)
  cardioHistory:         [],          // Array de sessões de cardio finalizadas (cap: 100)
  defaultCardioProtocol: 'zona2-30',  // ID do protocolo padrão
  cardioCountsStreak:    false,       // Cardio conta para o streak de treinos?
  weeklyCardioKmGoal:    null,        // Meta semanal de distância (km)
  weeklyCardioMinGoal:   null,        // Meta semanal de tempo (minutos)

  // ── Biometria ───────────────────────────────────────────────
  biometrics:       null,             // Snapshot atual da avaliação física (30+ campos)
  bioHistory:       [],               // Histórico de avaliações (cap: 20)
  bodyWeights:      [],               // Pesagens corporais: [{date, weight}] (cap: 365)
  circumHistory:    [],               // Histórico de circunferências rápidas (cap: 24)

  // ── Configurações Pessoais ──────────────────────────────────
  userName:         'CLÁUDIO SANTANA',
  projectName:      'NINJINHA BOM DE BRIGA',
  appMode:          'ninja',          // 'ninja' | 'normal'
  theme:            'default',        // 'default' | 'raiton' | 'emerald' | 'violet' | 'amber' | 'rose'
  lightMode:        false,
  activityLevel:    1.55,             // Multiplicador TDEE (1.2 = sedentário → 1.9 = muito ativo)
  weekGoal:         6,                // Meta de treinos por ciclo (2–7)
  weekPlan:         { 0:'6', 1:'1', ... }, // Plano semanal: dia da semana → ID do treino
  weekResetDays:    0,                // Auto-reset: 0=off | 7 | 10 | 14 dias
  defaultRestTime:  60,               // Tempo de descanso padrão entre séries (segundos)
  hiddenSections:   [],               // Seções ocultas pelo usuário

  // ── Gamificação ─────────────────────────────────────────────
  achievements:     [],               // IDs de conquistas desbloqueadas

  // ── Analytics ───────────────────────────────────────────────
  analyticsTab:     'musculacao',     // Aba interna do EVOLUIR: 'musculacao' | 'cardio' | 'conquistas'
  historyPage:      0,                // Página atual do histórico paginado (20 por página)

  // ── Notificações ────────────────────────────────────────────
  notificationsEnabled: false,
  notificationTime:     '08:00',      // Horário do lembrete diário
  notifLastDate:        null,         // Data da última notificação enviada
}
```

### 5.2 Persistência

As chaves listadas em `src/store/persistedKeys.js` são salvas/carregadas automaticamente pelo `StorageService`:

```
logs, history, week, weekStart, prs, theme, workoutStartTime,
bodyWeights, weekGoal, biometrics, bioHistory, customWorkouts,
workoutExercises, workoutMeta, appMode, userName, projectName,
lightMode, activityLevel, hiddenSections, weekPlan, circumHistory,
cycleOrder, cyclePosition, weekResetDays, achievements, cardioHistory,
defaultRestTime, activeCardioSession, cardioCountsStreak,
weeklyCardioKmGoal, weeklyCardioMinGoal, defaultCardioProtocol,
analyticsTab, notificationsEnabled, notificationTime, notifLastDate
```

Campos **não** persistidos (estado de UI transitório): `tab`, `workoutId`, `editorWorkout`, `activeModal`, `modalData`, `historyPage`.

---

## 6. ROTEAMENTO DE TABS

O roteamento é baseado em `state.tab`. O `AppController.#renderMain()` usa um switch para renderizar a view correspondente:

| `state.tab` | View renderizada | Condição especial |
|---|---|---|
| `home` | HomeView | — |
| `treinar` | DashboardView | — |
| `workout` | WorkoutView | Requer `state.workoutId` |
| `cardio` | CardioView (ativo) ou CardioView (idle) | Verifica `state.activeCardioSession` |
| `evoluir` | AnalyticsView | Usa `state.analyticsTab` internamente |
| `corpo` | ProfileView | — |
| `settings` | SettingsView | — |
| `workout-editor` | WorkoutEditorView | Usa `state.editorWorkout` |

### Navegação no nav dock

5 botões visíveis no nav (HOME | TREINAR | EVOLUIR | CARDIO | CORPO). O `#syncIcons()` marca o botão ativo comparando `btn.dataset.tab === state.tab`.

O nav **some** (translateY 150%) durante: `workout`, `workout-editor`, `settings`, e `cardio` com sessão ativa.

---

## 7. FUNCIONALIDADES DETALHADAS

### 7.1 HOME

**Arquivo**: `src/views/HomeView.js`  
**Função principal**: `renderHome(state, workouts, protocols)`

#### Componentes renderizados:

**Saudação personalizada**
- Horário-dependente: Bom dia / Boa tarde / Boa noite
- Inclui nome do usuário e sufixo temático por modo (ninja/normal)

**Chakra / Status do sistema**
- Gauge circular SVG calculado a partir do streak atual
- Estados: SEM CHAKRA → CARREGANDO → ATIVO → MÁXIMO → SUSANOO (modo ninja)
- Alerta visual "Streak em Risco" se há streak ativo mas não treinou hoje

**Missão de Hoje (Bloco central)**
- Linha de musculação: próximo treino no ciclo adaptativo (ou plano semanal)
  - Estado FEITO: verde, desabilitado — Estado pendente: botão INICIAR ativo
- Linha de cardio: protocolo padrão configurado
  - `data-action="start-cardio-protocol"` + `data-protocol-id`

**Atividade Recente**
- Card compacto com último treino + última sessão de cardio
- Mostra: data, volume/pace, duração

**Citação motivacional do dia**
- Selecionada por índice do dia do ano (determinística — mesma frase o dia todo)

**GoalGauge — Meta da Semana**
- Barra de progresso: treinos feitos / weekGoal
- Mensagem contextual por nível de completude

---

### 7.2 TREINAR (Dashboard)

**Arquivo**: `src/views/DashboardView.js`  
**Função principal**: `renderDashboard(state, workouts, protocols)`

#### Seção Musculação

**Tracker do Ciclo Adaptativo**
- 8 slots visuais representando a sequência do ciclo (`cycleOrder`)
- Posição atual destacada em cor do tema
- Slots `null` mostrados como "DESCANSO"

**Cards de Treino**
- Um card por treino built-in e custom (excluindo `isCardio`)
- Cada card exibe: título, subtitle, grupo muscular, número de exercícios
- Badge HOJE: treino marcado para o dia atual no plano semanal
- Badge PRÓXIMO: próximo treino no ciclo adaptativo
- Badge de ciclo (quantidade de vezes realizado no ciclo atual)
- Botões: INICIAR | Hist. (histórico) | Editar (apenas custom)

#### Seção Cardio

**Barras de meta semanal**
- Barra km: progresso acumulado / meta km (`weeklyCardioKmGoal`)
- Barra minutos: progresso acumulado / meta minutos (`weeklyCardioMinGoal`)

**Cards de Protocolo**
- Um card por protocolo em `CARDIO_PROTOCOLS`
- Exibe: nome, descrição, esforço, duração total, blocos, última execução
- Badge "Protocolo Padrão" no protocolo selecionado em Configurações
- Botão INICIAR com `data-action="start-cardio-protocol" data-protocol-id`

---

### 7.3 EXECUÇÃO DE TREINO

**Arquivo**: `src/views/WorkoutView.js`  
**Arquivos de lógica**: `src/controllers/WorkoutController.js`

#### Fluxo completo

```
1. INICIAR (DashboardView ou HomeView)
   → WorkoutController.startWorkout(workoutId)
   → store.setState({ tab: 'workout', workoutId, workoutStartTime: Date.now() })
   → WorkoutView renderizada

2. Durante treino:
   - Preencher peso e reps nos inputs
   - Marcar série como feita (data-action="toggle-set")
   - Timer de descanso → modal com countdown
   - Patches cirúrgicos atualizam apenas o DOM necessário

3. Header: botão "Finalizar"
   → modal de notas (opcional)
   → WorkoutController.finishWorkout(notes)
   → Battle Report mostrado

4. Battle Report:
   - Botão "ENCERRAR" → fecha → navega para TREINAR
   - Botão "Descartar sessão" → remove do histórico → fecha → TREINAR
```

#### ExerciseCard
- Cabeçalho: nome do exercício, séries×reps configuradas, badge de progressão
- Badge de sugestão de carga: `suggestWeight(pr, repsStr)` ou `computeLoadTarget()`
- Séries: linhas com inputs de peso + reps + botão OK
- Séries de aquecimento (warmup): marcadas visualmente, não contam para volume
- Botão expandir/colapsar para exercícios concluídos (colapso automático)
- Controle de adição/remoção de séries extras

#### Patches cirúrgicos (sem re-render)
- `patchSetRow(wId, exId, idx, log)` — atualiza linha de série
- `patchExerciseCardState(wId, exId, logs)` — atualiza status do card
- `patchSetsContainer(wId, exId, logs, sets)` — atualiza container de séries
- `patchProgressionBadge(wId, exId)` — atualiza badge de carga sugerida

---

### 7.4 CARDIO

**Arquivo**: `src/views/CardioView.js`  
**Lógica**: `src/controllers/CardioController.js`

#### Idle State (sem sessão ativa)

Renderizado quando `state.activeCardioSession === null`:
- Última sessão registrada (resumo rápido)
- Cards de protocolo com botão INICIAR
- Protocolo padrão destacado
- Botão "Registrar Sessão Manual"

#### Active State (sessão em andamento)

Renderizado quando há `state.activeCardioSession`:

**Header**: botão "Sair" (abandonar) | nome do protocolo | tempo total

**Bloco atual (centro)**: nome do bloco, badge de esforço, timer animado com anel SVG (ou contador para modo livre)

**Instrução**: texto da instrução do bloco atual

**Stats GPS**: Distância | Pace/km | Progresso de blocos

**Controles**: Pausar | Pular Bloco | Finalizar (ou Retomar | Finalizar quando pausado)

**Lista de blocos colapsável**: todos os blocos com estado (feito/atual/pendente)

#### Patches cirúrgicos durante tick

`patchCardioTimer(state, protocols)` atualiza via `getElementById`:
- `cardio-total-elapsed`, `cardio-block-remaining`, `cardio-block-elapsed`
- `cardio-ring` (SVG stroke-dashoffset)
- `cardio-block-prog`, `cardio-next-block`
- `cardio-gps-dist`, `cardio-gps-pace`
- `cardio-block-name`, `cardio-instruction`, `cardio-effort-badge`

#### Tela de protocolo concluído

Quando `session.completed === true`: tela de parabéns com stats + botão "Ver Relatório" → abre modal de finalização (local, esforço, notas) → salva no histórico.

#### Dados salvos por sessão de cardio

```javascript
{
  date:     ISO string,
  type:     'corrida' | 'bike' | 'outro',
  local:    'rua' | 'esteira' | null,
  distance: number (km),
  duration: number (minutos decimais, ex: 28.25 = 28min15s),
  pace:     string (ex: "5:36" = min:seg/km),
  effort:   'fácil' | 'moderado' | 'forte',
  notes:    string,
}
```

#### Protocolos predefinidos (CARDIO_PROTOCOLS)

| ID | Nome | Esforço | Duração |
|---|---|---|---|
| `zona2-30` | Zona 2 · 30min | Fácil | 30min |
| `zona2-45` | Zona 2 · 45min | Fácil | 45min |
| `vo2max-4x4` | VO2 Max · 4×4 | Forte | ~48min |
| `livre` | Livre | Variável | Ilimitado |
| *(outros)* | ... | ... | ... |

#### GPS e Wake Lock

- `Geolocation.watchPosition()` durante sessão outdoor
- `navigator.wakeLock.request('screen')` para manter tela ativa
- Distância acumulada por delta entre pontos consecutivos

---

### 7.5 EVOLUIR (Analytics)

**Arquivo**: `src/views/AnalyticsView.js`  
**Estado**: `state.analyticsTab` determina a aba ativa

#### Aba Musculação

**Métricas principais** (grid 2×2):
- Total de missões | Total de tonelagem
- Média de volume/treino | Melhor mês (número de treinos)

**Calendário de consistência (heatmap)**
- 90 dias retroativos em grade de células coloridas
- Intensidade da cor proporcional ao número de treinos no dia

**Volume por Semana** (gráfico de barras)
- Últimas 10 semanas, semana atual destacada

**Evolução de Carga** (sparklines por exercício)
- Até 6 exercícios com mais sessões registradas
- Sparkline SVG com cor verde/vermelha por tendência
- Mostra: carga máxima atual, delta desde o início

**Volume por Músculo — 30 dias** (barras horizontais)
- Volume proporcional por grupo muscular

**Foco Muscular** (barras com percentual)
- Frequência de estímulo por grupo muscular no histórico completo

**Personal Records** (agrupados por músculo)
- Peso × reps | 1RM estimado (Epley) | Data

**Histórico Unificado** (musculação + cardio por data)
- Paginado: 20 datas por página, botão "Carregar mais"
- Cada entrada de dia pode ter treinos de força e/ou cardio

#### Aba Cardio

**Stats da semana**: sessões | km | ritmo médio ponderado (corridas)

**Tendência de Ritmo** (gráfico de barras): últimas 8 corridas, barra = velocidade relativa (barra mais alta = mais rápido)

**PRs de corrida**: Melhor 5km | Melhor ritmo | Maior distância

**Acumulado geral**: total km | total tempo | sessões | últimos 30 dias

**Distribuição por tipo**: corrida / bike / outro (com percentuais)

**Últimas 8 sessões**: data, tipo, local, ritmo, esforço, botão deletar

#### Aba Conquistas

- Progresso geral: X/9 conquistas desbloqueadas
- Grupos: Sessões | Tonelagem | Recordes
- Cada conquista: ícone colorido, nome, descrição, estado (desbloqueada/bloqueada)

---

### 7.6 CORPO (Status/Perfil)

**Arquivo**: `src/views/ProfileView.js`

#### Seções

**Avatar + Rank**
- Sharingan SVG animado
- Nome do usuário + rank baseado no número de treinos
  - `getRank()`: ATLETA (0) → GENIN (1+) → CHUNIN (10+) → JONIN (50+)

**Stats Strip** (4 cards horizontais)
- Total de treinos | Total de tonelagem | Média por sessão | Melhor streak

**Peso Corporal**
- Input de pesagem com log imediato
- Gráfico de linha das últimas 30 entradas
- Lista das 5 mais recentes com botão deletar
- Aviso visual ao passar de 300 entradas (cap: 365)

**Composição Corporal**
- Gráfico de linha: peso total vs massa magra ao longo do tempo

**Circunferências Rápidas**
- Form para 7 medidas: braço D, braço E, tórax, cintura, coxa D, coxa E, panturrilha D
- Histórico das 5 últimas medições (cap: 24)

**Evolução Biométrica**
- Gráfico de linha: peso + % gordura ao longo das avaliações

**TDEE (Gasto Calórico Estimado)**
- Fórmula Katch-McArdle: `BMR = 370 + 21.6 × massaMagra`
- `TDEE = BMR × activityLevel`
- 3 cards: Deficit (-300 kcal) | Manutenção | Hipertrofia (+300 kcal)
- Macros para cada cenário: proteína (2.0g/kg magro), gordura (25%), carboidrato (restante)
- Selector de nível de atividade (5 opções)

**Avaliação Física Completa**
- Formulário de ~30 campos: composição, circunferências, dobras cutâneas
- Métricas calculadas: IMC, % gordura estimada, massa magra, massa gorda
- Score de simetria: % de assimetrias detectadas
- Alertas automáticos de assimetria:
  - Braços/antebraços/panturrilha: alerta se diferença ≥ 0.5cm
  - Coxas: alerta se diferença ≥ 1.0cm
- Gráfico de radar de dobras cutâneas

**CyberBody SVG**
- SVG animado de corpo humano com scores por região
- Se `bracoDirContraido` existe: usa circunferências reais
- Caso contrário: usa frequência de treino por grupo muscular

**Conquistas** (galeria simplificada)

---

### 7.7 CONFIGURAÇÕES

**Arquivo**: `src/views/SettingsView.js`  
**Acesso**: ícone de engrenagem no header (disponível em qualquer tab principal)

#### Seções

**Perfil**: Nome do usuário | Nome do projeto

**Aparência**:
- 6 swatches de tema (AMATERASU/vermelho, RAITON/ciano, SAGE MODE/verde, SUSANOO/violeta, KURAMA/âmbar, SAKURA/rosa)
- Toggle modo NINJA / NORMAL
- Toggle Light Mode

**Metas**:
- Meta semanal (2–7 treinos) com botões ±
- Tempo de descanso padrão (30/45/60/90/120s)
- Auto-reset do ciclo (OFF / 7 / 10 / 14 dias)
- Nível de atividade (5 opções para cálculo TDEE)

**Planejamento Semanal**:
- Select por dia da semana (Dom–Sáb) → treino planejado
- Treinos isCardio são filtrados da lista

**Dados**:
- Exportar backup (JSON completo)
- Exportar histórico (CSV)
- Importar JSON (com confirmação de sobreposição)
- Resetar todos os dados (com confirmação)

**Cardio**:
- Toggle "Cardio conta para streak"
- Meta semanal de distância (km)
- Meta semanal de tempo (minutos)
- Selector de protocolo padrão (cards visuais)

**Notificações**:
- Toggle de permissão (solicita Notification.permission)
- Seletor de horário do lembrete
- Lógica de disparo: verifica se não treinou hoje após o horário configurado

---

### 7.8 EDITOR DE TREINOS

**Arquivo**: `src/views/WorkoutEditorView.js`

- Título, label e subtítulo do treino
- Lista de exercícios com reordenação (botões ↑ ↓)
- Adicionar exercício com autocomplete da biblioteca (~70 exercícios)
- Configurar por exercício: séries, reps (string, ex: "8-12"), descanso, warmup sets
- Salvar cria treino custom ou atualiza existente
- Delete com confirmação (apenas treinos custom)

---

## 8. CONTROLLERS DETALHADOS

### 8.1 AppController

Classe central do app. Responsabilidades:

- **Bootstrap**: inicializa DOM refs, timer listeners, subscriber do store
- **Subscriber único**: detecta 20+ tipos de diffs e decide o que re-renderizar
- **#renderMain(state)**: switch de tabs, cloneNode(false) anti-listener-accumulation
- **#renderHeader(state)**: header contextual por tab (treino ativo, editor, settings, padrão)
- **#syncIcons()**: atualiza estado visual dos botões do nav dock
- **#handleAction(action, payload)**: 40+ cases para todas as ações do app
- **Modais**: timer, confirm, notes, battle-report, cardio-log, workout-history
- **Battle Report**: `#showBattleReport()` — tela completa pós-treino (report-layer z-index 100)
- **Notificações**: `#toggleNotifications()`, `#checkReminderNotification()`
- **Embers**: renderEmbers() + MutationObserver para re-renderizar ao trocar tema
- **Ripple**: `attachGlobalRipple()` — efeito de toque em todos os `.ripple-target`

### 8.2 WorkoutController

Responsabilidades exclusivas de treino de musculação:

- `startWorkout(wId)` — inicializa logs com auto-fill da última sessão
- `saveLog(wId, exId, idx, field, value)` — salva input de peso/reps
- `toggleSet(wId, exId, idx)` — marca/desmarca série como feita, dispara timer se configurado
- `modSets(wId, exId, delta)` — adiciona/remove séries (campo `_c`)
- `toggleWarmup(wId, exId, idx)` — marca série como aquecimento
- `resetWorkout(wId)` — limpa logs da sessão atual
- `finishWorkout(notes)` — calcula volume/reps/MVP/breakdown, salva histórico, verifica achievements, avança cyclePosition, abre battle-report
- `discardLastWorkout(entryId, wId)` — remove do histórico e do ciclo
- `undoMission(wId)` — remove do ciclo E do histórico (mais recente)
- `resetWeek()` / `startNewWeek()` — gerenciamento do ciclo semanal
- `#checkPR(wId, exId, log)` — verifica e atualiza Personal Record via Epley 1RM
- `computeLoadTarget(wId, exId)` — sugere carga com base em 3 últimas sessões
- `suggestWeight(pr, repsStr)` — fallback de sugestão baseado em PR existente

### 8.3 CardioController

Responsabilidades exclusivas de cardio:

- `startProtocol(protocolId)` — cria sessão com blockIndex, elapsed times, GPS state
- `tick()` — avança 1 segundo; auto-progride bloco quando duration atingida
- `pause()` / `resume()` — toggle de pausa com timestamp
- `skipBlock()` — pula para próximo bloco
- `addGpsPoint(lat, lng, distanceDelta)` — acumula distância GPS
- `finish({local, effort, notes})` — calcula pace final, salva em cardioHistory, verifica achievements, limpa sessão
- `abandon()` — descarta sessão sem salvar
- `#checkAchievements(cardioHistory, earned)` — verifica conquistas de cardio (sessões 1/5/10/25/50, km 10/50/100/250, pace sub-5:00/sub-4:30, VO2Max first)

---

## 9. SERVIÇOS

### StorageService
```javascript
const storage = new StorageService('monstro_v2');
// Todas as chaves: monstro_v2_{key}
storage.get('theme', 'default')     // → valor ou fallback
storage.set('theme', 'raiton')      // → void
storage.loadState(PERSISTED_KEYS, defaults)  // → objeto com todos os valores
storage.saveState(state, PERSISTED_KEYS)     // → salva apenas chaves na lista
storage.clearAll()                  // → remove todas as chaves com o prefixo
```

O subscriber do AppController chama `storage.saveState(state, PERSISTED_KEYS)` a cada mudança de estado.

### TimerService
```javascript
timer.start(60)        // inicia countdown de 60 segundos
timer.stop()           // para o countdown
timer.remaining        // segundos restantes (0 mínimo)
timer.isRunning        // boolean
timer.progress         // 0.0 a 1.0 (ratio)
timer.on('tick', fn)   // callback a cada 500ms
timer.on('complete', fn) // callback ao zerar
```

Usa `Date.now()` para calcular `remaining`, prevenindo drift quando o app vai para background.

### ThemeService
```javascript
theme.apply('raiton')      // muda tema, aplica CSS variables no :root
theme.toggle()             // cicla para o próximo tema
theme.applyLightMode(true) // seta data-light-mode no body
theme.current              // string ID do tema atual
theme.config               // objeto com name, icon, primary, accent, dim, dark, rgb
```

CSS variables aplicadas: `--theme-primary`, `--theme-accent`, `--theme-dim`, `--theme-dark`, `--theme-rgb`.

### ExportService
```javascript
exportSvc.exportJSON(state)     // download de arquivo JSON com snapshot completo
exportSvc.exportCSV(history)    // download de CSV com histórico de treinos
```

O JSON inclui: `version: '2.0'`, `exportedAt`, e todos os arrays de dados do usuário. O import JSON valida a versão e sobrescreve o estado com confirmação.

---

## 10. SISTEMA DE ACHIEVEMENTS (CONQUISTAS)

### Conquistas de Musculação (9 total)

| ID | Nome | Critério | Ícone |
|---|---|---|---|
| `session_1` | Primeira Missão | 1º treino completo | zap |
| `session_10` | Veterano | 10 treinos | trophy |
| `session_25` | Guerreiro | 25 treinos | flame |
| `session_50` | Elite | 50 treinos | flame |
| `session_100` | Lendário | 100 treinos | trophy |
| `vol_1t` | 1 Tonelada | 1.000kg acumulados | dumbbell |
| `vol_10t` | 10 Toneladas | 10.000kg acumulados | dumbbell |
| `vol_100t` | 100 Toneladas | 100.000kg acumulados | dumbbell |
| `first_pr` | Novo Recorde | Primeiro PR registrado | trending-up |

### Conquistas de Cardio (via CardioController)

| Critério | Tipo |
|---|---|
| 1ª, 5ª, 10ª, 25ª, 50ª sessão | Sessões |
| 10km, 50km, 100km, 250km acumulados | Distância |
| Primeira sessão VO2Max | Intensidade |
| Pace sub-5:00/km | Velocidade |
| Pace sub-4:30/km | Velocidade |

### Verificação
- Musculação: verificada em `WorkoutController.finishWorkout()` via `checkWorkoutAchievements()`
- Cardio: verificada em `CardioController.finish()` via `#checkAchievements()`
- Exibição: no Battle Report (novas conquistas desbloqueadas na sessão) e na aba Conquistas do EVOLUIR

---

## 11. REGRAS DE NEGÓCIO CRÍTICAS

### Personal Record (PR)
- Fórmula Epley: `1RM = weight × (1 + reps / 30)`
- PR é atualizado apenas se o novo 1RM > 1RM atual
- Guard: ignora séries com `reps < 1` ou peso/reps inválidos
- Armazena: `{ weight, reps, vol, date }` — não apenas peso bruto

### Streak
- Calculado contando datas únicas no `history` (+ `cardioHistory` se `cardioCountsStreak`)
- "Streak em Risco": aparece na Home se há streak ativo e não treinou hoje
- `getBestStreak()`: varre o histórico completo para encontrar a maior sequência consecutiva

### Ciclo Adaptativo
- `cycleOrder`: array de IDs de treino ou null (descanso), ex: `['1','2','3',null,'4','5','6',null]`
- `cyclePosition`: índice atual no cycleOrder
- Ao finalizar treino: `nextPos = (cyclePosition + 1) % cycleOrder.length`, pula nulos
- Reset manual via "Reiniciar Ciclo" ou auto-reset por número de dias configurado

### Auto-fill de Logs
- Ao iniciar treino, `startWorkout()` busca a sessão anterior do mesmo treino no histórico
- Preenche peso e reps nos inputs com `done: false` (série não marcada)

### Sugestão de Carga
- `computeLoadTarget(wId, exId)`: analisa últimas 3 sessões, sugere incremento arredondado para 0.5kg
- `suggestWeight(pr, repsStr)`: converte o PR (1RM estimado) para a faixa de reps do exercício
- Badge aparece no ExerciseCard apenas quando `loadTarget` é nulo

### Séries de Aquecimento
- Campo `warmup: true` no log da série
- **Não contam** para volume, PR, reps totais ou breakdown do battle report
- Marcadas visualmente com ícone/cor diferente no WorkoutView

---

## 12. PWA (PROGRESSIVE WEB APP)

### Service Worker (`sw.js`)
- Cache name: `monstro-v2`
- Estratégia: cache-first para assets locais, network-first para CDN (Tailwind, Lucide, Google Fonts)
- Cache dos assets principais na instalação (shell, CSS, JS modules)

### Web Manifest (`manifest.json`)
- `name`: "MONSTRO UCHIHA: BATTLE SYSTEM"
- `display`: standalone
- `orientation`: portrait
- `theme_color`: #000000
- `background_color`: #000000
- Ícones: SVG

### Push Notifications
- API: `Notification.requestPermission()` + `new Notification()`
- Verificação ao abrir app e ao navegar entre tabs
- Condições de disparo: `notificationsEnabled`, permissão concedida, hora atual ≥ `notificationTime`, não treinou hoje, não enviou notificação hoje ainda

---

## 13. CONVENÇÕES DE CÓDIGO

### IDs
- Treinos built-in: strings numéricas `'1'` – `'6'`, `'cardio'`
- Treinos custom: `custom_${Date.now()}`
- Exercícios built-in: `t{wId}_{n}` (ex: `t1_1`, `t2_3`)
- Exercícios custom: `cex_${Date.now()}_${random}`

### Ícones Lucide (versão 0.460.0)
**Seguros**: home, dumbbell, activity, zap, trophy, calendar, clock, trending-up, circle-user, check, check-circle, x, chevron-*, history, pencil, settings, database, download, upload, file-text, trash-2, plus, plus-circle, rotate-ccw, refresh-cw, info, alert-triangle, quote, list, layers, bar-chart-2, file-down, moon, sun, leaf, eye, heart, flame, copy, repeat, crosshair, ruler, timer, wind, grip-vertical, target, move, palette, cpu, calendar-days, calendar-check, calendar-x, eye-off, play, pause

**Evitar** (instáveis nesta versão): scan-line, weight, swords, user-circle

### Padrão de Ação

```html
<!-- View: declara a ação no HTML -->
<button data-action="minha-action" data-payload="valor">
```

```javascript
// mountXxx(): registra via delegation
delegate(container, '[data-action="minha-action"]', 'click', (e, el) => {
  handler('minha-action', el.dataset.payload);
});
```

```javascript
// AppController.#handleAction():
case 'minha-action':
  this.#store.setState({ ... });
  break;
```

---

## 14. PONTOS DE ATENÇÃO E DÉBITO TÉCNICO

### Resolvidos ✅
- Bug decremento duplo/triplo de séries no Android (fix: cloneNode)
- PR baseado em peso bruto (fix: Epley 1RM)
- Timer drift no background (fix: Date.now())
- Export JSON incompleto
- Botões touch < 32px
- formatTime com valores negativos
- NaN no WorkoutEditor
- PERSISTED_KEYS duplicado

### Em aberto

| Item | Impacto | Prioridade |
|---|---|---|
| AnalyticsView sem tab na subscriber list (`evoluir` não re-renderiza quando `historyPage` muda via cardio) | UX | Baixo |
| `cyclePosition` não retrocede ao descartar sessão | Lógica | Baixo |
| Sem validação de campos vazios no WorkoutEditor | UX | Baixo |
| Export PDF não é gerado (usa print da janela) | Feature | Médio |
| GPS desativado em ambiente esteira (não há fallback automático) | UX | Baixo |

### Limitações por design
- Sem multiusuário
- Sem sync entre dispositivos
- Sem undo de operações de configuração (reset de dados é irreversível)
- localStorage tem cap ~5-10MB; com uso intenso de anos pode aproximar limite

---

## 15. HISTÓRICO DE VERSÕES

| Versão | Data | Principais mudanças |
|---|---|---|
| v2.0 | 16/06/2026 | Migração v1→v2, ES Modules, Store imutável |
| v2.3 | 16/06/2026 | 18 bugs corrigidos (Epley PR, TimerService, bodyWeights cap) |
| v2.4 | 16/06/2026 | GoalGauge, BodyCompChart, CircumHistory, SuggestWeight |
| v2.5 | 17/06/2026 | Dados biométricos reais, programa V-Taper finalizado |
| v3.0 | 17/06/2026 | Ciclo Adaptativo, delete bodyWeight, paginação histórico, auto-reset |
| v3.1 | 17/06/2026 | PERSISTED_KEYS extraído, sistema de achievements (9 conquistas) |
| v3.2 | 17/06/2026 | Fix bug decremento (cloneNode), Módulo Cardio completo |
| v3.3 | 17/06/2026 | Cardio redesign: corrida/bike/outro, pace, protocolos |
| v3.4 | 17/06/2026 | Metas semanais cardio, selector protocolo, Push Notifications |
| v3.5 | 17/06/2026 | Tab CARDIO no nav, CardioView idle state, Descartar sessão, AnalyticsView com 3 abas |

---

*Documento gerado em 17/06/2026 — Treino Monstro v3.5*
