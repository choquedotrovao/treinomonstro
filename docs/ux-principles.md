# UX Bible — Treino Monstro

> Este documento define a alma do app. Toda decisão de produto, design e copy deve passar por aqui.

---

## Filosofia Central

**O app nunca pune. O app sempre orienta.**

O usuário que abre o app depois de uma semana sem treinar não precisa sentir culpa — precisa sentir que ainda há um caminho. A interface acolhe onde o usuário está, não onde deveria estar.

O Treino Monstro não é um contador de falhas. É um registro de progresso.

---

## Os Três Princípios

### 1. Presença primeiro
O usuário está aqui agora. Isso já é uma vitória. A interface reconhece esse fato antes de qualquer outra coisa.

- A saudação é contextual (hora do dia, estado atual).
- O primeiro elemento visual positivo aparece antes do primeiro elemento de ação.
- Nunca exibir zero ou ausência como destaque principal.

### 2. Progresso visível
Todo esforço deve deixar uma marca visível. Se o usuário fez algo, o app mostra.

- Streak, ciclo, volume ao vivo — sempre atualizados em tempo real.
- Battle report celebra a sessão completa, não apenas os PRs.
- Histórico nunca some: cada entrada é permanente até exclusão manual.

### 3. Complexidade progressiva
A interface mostra o mínimo necessário para a ação atual. Detalhes avançados estão um toque de distância, não na frente.

- Hints `(i)` revelam profundidade sem poluir a interface base.
- Seções colapsáveis no perfil escondem dados raramente consultados.
- Configurações avançadas ficam ao final da tela de settings.

---

## Tom de Voz

### Adjetivos que definem o tom
**Direto · Técnico · Humano · Sóbrio · Encorajador**

Não somos: motivacionais vazios, militaristas extremos, nem clínicos frios.

### Copy — O que dizer e o que não dizer

| ❌ Não usar | ✓ Usar |
|---|---|
| Você falhou. | Amanhã é uma nova oportunidade. |
| Nenhum treino registrado. | Pronto para começar? |
| Erro ao salvar dados. | Não foi possível salvar. Tente novamente. |
| Parabéns incrível demais! | Missão concluída. |
| Você é o melhor! | Você venceu a versão de ontem. |
| URGENTE: faça seu treino! | Seu streak pode ser quebrado hoje. |

### Regras de copy

1. **Imperativo com propósito**: "Iniciar Protocolo", não "Começar Treino". O vocabulário soa intencional.
2. **Números sempre presentes**: "4/6 treinos" é mais motivador que "4 treinos".
3. **Passado no histórico, futuro nas metas**: "Você fez X" vs "Faltam Y para Z".
4. **Erros sem drama**: explicar o que aconteceu + o que fazer, sem exagerar a gravidade.

---

## Feedback Visual

### Hierarquia de feedback

```
1. Imediato (0–150ms)   → feedback de toque (scale, ripple)
2. Rápido (150–300ms)   → transições de estado (cor, ícone)
3. Confirmação (300–500ms) → animação de sucesso (pop, fade-in)
4. Celebração (500ms+)  → battle report, achievement toast
```

### Tabela de timing

| Duração | Uso |
|---|---|
| 150ms | active:scale, hover transition |
| 250ms | fade in/out de elementos, transições de tab |
| 300ms | modal open/close, card expand |
| 400ms | transição de tema (body-bg, card-bg) |
| 600ms | animações de entrada (stagger) |
| 3000ms | phrase toast (fade in → sustain → fade out) |
| > 600ms | apenas para celebrações (battle report entrada) |

**Regra:** nenhuma animação deve bloquear a interação do usuário.

---

## Cores Semânticas

As cores semânticas são estáveis entre temas. Nunca usar cores do tema para semântica.

| Cor | Uso correto | ❌ Não usar para |
|---|---|---|
| Verde (`#4ade80`) | Progresso, PR, sucesso, streak ativo | Botão primário, destaque de tema |
| Azul (`#60a5fa`) | Informação, dados, cardio stats | Erro, aviso |
| Amarelo (`#fbbf24`) | Atenção, achievement, aviso leve | Erro crítico, streak |
| Laranja (`#fb923c`) | Streak, fogo, energia | Erro, sucesso |
| Vermelho (`#f87171`) | Erro, exclusão, perigo | Progresso, destaque positivo |
| Roxo (`#c084fc`) | Raro, lendário, especial | Status genérico |
| Ciano (`#22d3ee`) | Cardio específico | Treino de força |

**Regra:** vermelho apenas para risco real (exclusão irreversível, erro de sistema). Nunca como cor de ênfase decorativa.

---

## Microinterações

### Toda ação importante gera feedback

| Ação | Feedback esperado |
|---|---|
| Marcar série como feita | Scale 0.95 + bounce + cor muda para tema |
| Completar timer de descanso | Beep triplo + vibração + phrase toast |
| Finalizar treino | Transição suave para battle report |
| Desbloquear conquista | Toast de achievement + ícone animado |
| Trocar tema | Transição de cores em 400ms em todo o app |
| Salvar dado | Confirmação visual (borda verde breve) |
| Erro de validação | Shake + borda vermelha no campo |

### Ripple em botões

Todo elemento clicável que não seja texto deve ter:
- Classe `ripple-target`
- `active:scale-95` ou `active:scale-[0.98]` (cards)
- `transition-all duration-150`

```html
<!-- Padrão correto -->
<button class="btn-akatsuki ripple-target active:scale-95 transition-all">
  Iniciar
</button>
```

### Touch targets

**Mínimo absoluto: 32×32px** em qualquer elemento tocável.

```html
<!-- Correto -->
<button class="min-w-[32px] min-h-[32px] flex items-center justify-center">
```

---

## Banners e Notificações

### Prioridade de banners (do mais ao menos urgente)

1. **Sessão ativa** (workout ou cardio em andamento) — sempre visível
2. **Ciclo completo** — celebração, suprime streak/stale
3. **Streak em risco** — urgência moderada
4. **Ciclo parado** — lembrete suave
5. **Biometria vencida** — lembrete informativo
6. **Onboarding** — aparece somente uma vez

**Regra:** nunca mostrar dois banners conflitantes ao mesmo tempo.

### Push notifications

- Exibir apenas se o usuário não treinou após o horário configurado
- Tom: suave, nunca alarmista
- Exemplo: "Hoje ainda não foi registrado nenhum treino. Que tal em 20 minutos?"

---

## Navigation

### Tabs (nav dock)

5 tabs fixas: Home · Treinos · Evolução · Status · Cardio

- Tab ativa: `text-theme-primary` + ícone sólido
- Tab inativa: `text-zinc-600`
- Sem labels de texto nas tabs (ícones suficientes em mobile)
- Nav some durante treino ativo (para liberar espaço e foco)

### Modais

- Fundo: `rgba(0,0,0,0.7)` — escuro o suficiente para isolamento, transparente o suficiente para contexto
- Fechar: toque fora do modal OU botão X explícito (sempre ambos)
- Animação de entrada: `animate-zoom-in` (scale 0.95 → 1)
- Posição: `items-end` (bottom sheet) para ações, `items-center` para confirmações críticas

### Confirmações destrutivas

Todo delete/reset deve ter:
1. Botão "Não" prominente
2. Botão "Sim" com cor de perigo
3. Texto descritivo do que será apagado
4. Se irreversível: segundo confirm (`window.confirm`)

---

## Tipografia

### Hierarquia

| Nível | Uso | Classe |
|---|---|---|
| Hero | Números grandes, timers, títulos de battle report | `text-4xl font-black font-mono` |
| Título | Nome do exercício, seção principal | `text-sm font-black` ou `text-base font-black` |
| Subtítulo | Label de seção | `text-[10px] font-bold uppercase tracking-widest text-zinc-500` |
| Body | Texto descritivo, notas | `text-sm text-zinc-400` |
| Micro | Badges, timestamps, unidades | `text-[9px]` ou `text-[8px]` |
| Mono | Pesos, reps, timers, dados numéricos | `font-mono` |

### Regras tipográficas

- **Dois pesos** na mesma linha: bold para o valor, light/regular para a label
- **Contraste**: `text-white` (valor) + `text-zinc-500` (label) — nunca dois brancos em sequência
- **Truncate** em flex containers: sempre `min-w-0` no pai + `truncate` no texto

---

## Acessibilidade Prática

Não somos um app de acessibilidade total, mas respeitamos princípios básicos:

- Todo ícone acompanha texto ou aria-label quando é a única informação
- Contraste mínimo: labels 4.5:1, texto primário 7:1
- Hints `(i)` são adicionais — a interface funciona sem eles
- Inputs sempre associados a labels visuais (placeholder não substitui label em campos importantes)

---

## Estados de Vazio

Nunca deixar uma tela completamente vazia. Todo estado vazio tem:

1. Ícone contextual (Lucide, tamanho `w-12 h-12`, cor `text-zinc-700`)
2. Mensagem de 1 linha: o que está vazio
3. CTA opcional: o que fazer (apenas quando há ação óbvia)

```html
<!-- Padrão de empty state -->
<div class="text-center py-12">
  <div class="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3">
    <i data-lucide="dumbbell" class="w-6 h-6 text-zinc-700"></i>
  </div>
  <div class="text-sm font-black text-zinc-500">Nenhum treino registrado</div>
  <div class="text-xs text-zinc-700 mt-1">Inicie seu primeiro protocolo</div>
</div>
```

---

## Convenções de Desenvolvimento

### Adicionar nova tela

1. Criar `renderXxxView(state, data) → string HTML` (função pura, sem efeitos)
2. Criar `mountXxxView(container, dispatch)` (event delegation, nunca addEventListener individual)
3. Registrar no switch do AppController
4. Adicionar ao `docs/ui-reference.md`
5. Adicionar à `docs/preview.html` se tiver componentes visuais novos

### Adicionar novo componente visual

1. Desenvolver no app
2. Documentar no `docs/preview.html` na seção correspondente
3. Registrar classes/variantes no `docs/ui-reference.md`
4. Se houver regra de UX associada, atualizar este documento

### Adicionar novo texto ao usuário

1. Verificar tabela de tom (O que dizer / O que não dizer)
2. Verificar se o contexto exige copy de empty state, erro, sucesso ou celebração
3. Usar `getLabels(appMode)` para textos que variam por modo (NINJA/NORMAL)

---

## Glossário do Projeto

| Termo no app | Significado técnico |
|---|---|
| Protocolo | Um treino ou sessão de cardio específica |
| Ciclo | Sequência de N sessões até atingir a meta (não semanal) |
| Streak | Dias consecutivos com pelo menos uma atividade |
| PR / Personal Record | Melhor desempenho em um exercício (via Epley 1RM) |
| Missão | Próximo treino no ciclo do dia |
| Chakra | Nível de energia visual baseado no progresso do ciclo |
| Battle Report | Tela de resumo pós-treino |
| OPERAÇÃO | Termo narrativo para "sessão de treino" |
| Modo NINJA | Linguagem temática (Naruto/anime) |
| Modo NORMAL | Linguagem técnica de treino |
