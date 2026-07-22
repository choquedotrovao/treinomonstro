/**
 * Abstração sobre localStorage.
 * Todos os dados são prefixados para evitar colisões.
 */
export class StorageService {
  #prefix;

  constructor(prefix = 'monstro_v2') {
    this.#prefix = prefix;
  }

  #key(name) {
    return `${this.#prefix}_${name}`;
  }

  get(name, fallback = null) {
    try {
      const raw = localStorage.getItem(this.#key(name));
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn(`[Storage] Dado corrompido em "${name}" — usando fallback:`, e);
      return fallback;
    }
  }

  set(name, value) {
    try {
      localStorage.setItem(this.#key(name), JSON.stringify(value));
    } catch (e) {
      console.warn(`[Storage] Falha ao salvar "${name}":`, e);
    }
  }

  remove(name) {
    localStorage.removeItem(this.#key(name));
  }

  /** Apaga apenas as chaves deste prefixo. */
  clearAll() {
    const toRemove = Object.keys(localStorage).filter(k => k.startsWith(`${this.#prefix}_`));
    toRemove.forEach(k => localStorage.removeItem(k));
  }

  /**
   * Carrega o estado persistido e mescla com os defaults.
   * Retorna apenas as chaves definidas em persistedKeys.
   */
  loadState(persistedKeys, defaults) {
    const loaded = {};
    persistedKeys.forEach(key => {
      const val = this.get(key);
      loaded[key] = val !== null ? val : defaults[key];
    });
    return loaded;
  }

  saveState(state, persistedKeys) {
    persistedKeys.forEach(key => {
      if (key in state) this.set(key, state[key]);
    });
  }
}
