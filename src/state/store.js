import {
  difficultyLevels,
  firstPlayerOptions,
  gamePhases,
  playerSymbols,
} from '../core/constants.js';
import { createBoard } from '../core/game.js';

/*
Sección: Estado inicial.
Qué hace: construye una copia completa del estado requerido por una sesión nueva.
Qué recibe: no recibe parámetros.
Qué procesa: asigna configuración predeterminada, marcador vacío y tablero limpio.
Qué devuelve: objeto de estado independiente.
Dónde se usa: arranque de la aplicación y pruebas del flujo.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function createInitialState() {
  const prefersReducedMotion = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    introVisible: true,
    board: createBoard(),
    phase: gamePhases.configuring,
    humanSymbol: playerSymbols.cross,
    aiSymbol: playerSymbols.circle,
    currentPlayer: null,
    difficulty: difficultyLevels.torment,
    firstPlayer: firstPlayerOptions.human,
    winner: null,
    winningLine: null,
    result: null,
    score: { human: 0, draws: 0, ai: 0 },
    analysis: {
      move: null,
      nodes: 0,
      maxDepth: 0,
      durationMs: 0,
      score: null,
      strategy: null,
    },
    preferences: {
      sound: true,
      reducedMotion: prefersReducedMotion,
    },
  };
}

/*
Sección: Almacén observable.
Qué hace: conserva una única fuente de verdad y avisa a la vista cuando cambia.
Qué recibe: initialState con la forma definida por createInitialState.
Qué procesa: combina cambios parciales sin exponer una asignación directa de la referencia.
Qué devuelve: métodos getState, setState y subscribe.
Dónde se usa: controlador como Model de estado y main.js para enlazar el renderizado.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function createStore(initialState = createInitialState()) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    setState(update) {
      const partialState = typeof update === 'function' ? update(state) : update;
      state = { ...state, ...partialState };
      listeners.forEach((listener) => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
