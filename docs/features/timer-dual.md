# Feature — Timer Dual (Treino + Descanso)

**Versão:** v6.6 (separação visual)
**Status:** Implementado

## Dois timers distintos

### 1. Tempo de treino (elapsed)

Mede o tempo total desde que o usuário clicou em "Iniciar Treino".

```
workoutStartTime = Date.now()  ← setado em WorkoutController.startWorkout()
                                 persiste em localStorage
```

**Display no WorkoutView:** `· treino 0 min` (atualiza a cada 60s via setInterval)

```html
<span class="text-zinc-600">· treino</span>
<span id="elapsed-workout" class="font-mono">${formatDuration(elapsed)}</span>
```

**Display no Battle Report:** pill badge no hero `⏱ 47 min · de treino`

### 2. Descanso entre séries (countdown)

Countdown regressivo do descanso configurado entre séries. Gerenciado pelo `TimerService`.

```
TimerService.start(seconds)
  → tick a cada 1s
    → store.setState({ timer: { remaining, ... } })
      → subscriber → patchTimedSetCountdown() ou badge no header
```

**Display:** Badge flutuante no topo com o tempo restante e anel animado.

## Separação visual

| Timer | Onde aparece | Formato |
|---|---|---|
| Tempo de treino | Header do WorkoutView, Battle Report | `· treino X min` |
| Descanso | Badge flutuante (TimerBadge) | `MM:SS` regressivo |

Os dois timers não interagem. `#elapsedInterval` (treino) e `TimerService` (descanso) são completamente independentes.

## Implementação

```js
// AppController
#elapsedInterval = null;

#startElapsedTicker(startTime) {
  this.#stopElapsedTicker();
  const update = () => {
    const el = document.getElementById("elapsed-workout");
    if (!el) { this.#stopElapsedTicker(); return; }
    el.textContent = formatDuration(Math.round((Date.now() - startTime) / 60000));
  };
  update();                                    // imediato (não aguarda 60s)
  this.#elapsedInterval = setInterval(update, 60000);
}
```

Ticker é iniciado no subscriber quando `state.workoutStartTime` é detectado.
