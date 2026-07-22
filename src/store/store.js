/**
 * Observable store — padrão Zustand/Redux simplificado.
 * Estado é imutável: cada setState cria um novo objeto.
 * Subscribers recebem (newState, prevState) para diffs seletivos.
 */
export class Store {
  #state;
  #subscribers = new Set();

  constructor(initialState) {
    this.#state = Object.freeze({ ...initialState });
  }

  getState() {
    return this.#state;
  }

  /**
   * @param {object | ((prev: object) => object)} updater
   */
  setState(updater) {
    const prev = this.#state;
    const patch = typeof updater === 'function' ? updater(prev) : updater;
    this.#state = Object.freeze({ ...prev, ...patch });
    this.#notify(this.#state, prev);
  }

  /**
   * @param {(state: object, prev: object) => void} fn
   * @returns {() => void} unsubscribe
   */
  subscribe(fn) {
    this.#subscribers.add(fn);
    return () => this.#subscribers.delete(fn);
  }

  #notify(state, prev) {
    this.#subscribers.forEach(fn => {
      try { fn(state, prev); }
      catch (e) { console.error('[Store] Subscriber error:', e); }
    });
  }
}
