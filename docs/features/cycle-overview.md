# Feature — Cycle Overview + Workout Picker

**Versão:** v6.6
**Status:** Implementado

## O que faz

Dois modais no DashboardView que dão liberdade para treinar fora da ordem padrão do ciclo PPL.

### Modal `cycle-overview` (Ver Ciclo)

Exibe os 8 slots do ciclo PPL com estado visual:
- **Feito** (verde, check): `cycleDone.includes(workout.id)`
- **Atual** (tema, seta): slot em `cyclePosition`
- **OFF** (zinc): slot `null`
- **Futuro** (zinc, inativo): slots ainda não feitos

Cada treino tem botão "Treinar" que inicia diretamente — mesmo fora de ordem.

### Modal `workout-picker` (Escolher)

Lista todos os treinos (built-in + custom) com badges de status:
- **PRÓXIMO** (tema): treino no `cyclePosition` atual
- **✓ FEITO** (verde): treino em `cycleDone`
- (nenhum badge): treino não feito no ciclo atual

## Fluxo

```
[btn "Ver Ciclo"] data-action="open-cycle-modal"
  → AppController case "open-cycle-modal"
    → store.setState({ activeModal: 'cycle-overview' })
      → subscriber → #renderModal() → case 'cycle-overview'
        → #showCycleModal()

[btn "Escolher"] data-action="open-workout-picker"
  → AppController case "open-workout-picker"
    → store.setState({ activeModal: 'workout-picker' })
      → subscriber → #renderModal() → case 'workout-picker'
        → #showWorkoutPickerModal()
```

## Botões no DashboardView

```html
<button data-action="open-cycle-modal">Ver Ciclo</button>
<button data-action="open-workout-picker">Escolher</button>
<button data-action="start-new-week">↺</button>   <!-- reset de ciclo -->
```

## Decisão de design

`cyclePosition` avança sequencialmente (+1 da posição atual), independente de qual treino foi feito. Os modais `cycle-overview` e `workout-picker` dão a visibilidade real do ciclo via `cycleDone`, sem depender de `cyclePosition` para saber o que foi feito.
