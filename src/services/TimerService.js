/**
 * Timer de contagem regressiva com event emitter.
 * Atualiza o badge DOM diretamente (sem re-render de view).
 */
export class TimerService {
  #interval  = null;
  #endTime   = 0;
  #total     = 0;
  #listeners = { tick: new Set(), complete: new Set() };

  get remaining() { return this.#interval ? Math.max(0, Math.ceil((this.#endTime - Date.now()) / 1000)) : 0; }
  get total()     { return this.#total; }
  get isRunning() { return this.#interval !== null; }
  get progress()  { return this.#total > 0 ? this.remaining / this.#total : 0; }

  start(seconds) {
    this.stop();
    this.#total   = seconds;
    this.#endTime = Date.now() + seconds * 1000;
    this.#emit('tick', seconds);

    this.#interval = setInterval(() => {
      const rem = Math.max(0, Math.ceil((this.#endTime - Date.now()) / 1000));
      this.#emit('tick', rem);
      if (rem <= 0) {
        this.stop();
        this.#emit('complete');
      }
    }, 500);
  }

  stop() {
    clearInterval(this.#interval);
    this.#interval = null;
    this.#endTime  = 0;
    this.#total    = 0;
  }

  adjustBy(secs) {
    if (!this.#interval) return;
    this.#endTime += secs * 1000;
    const rem = Math.max(0, Math.ceil((this.#endTime - Date.now()) / 1000));
    if (rem <= 0) { this.stop(); this.#emit('complete'); return; }
    this.#emit('tick', rem);
  }

  on(event, fn) {
    this.#listeners[event]?.add(fn);
    return () => this.#listeners[event]?.delete(fn);
  }

  #emit(event, ...args) {
    this.#listeners[event]?.forEach(fn => fn(...args));
  }
}
