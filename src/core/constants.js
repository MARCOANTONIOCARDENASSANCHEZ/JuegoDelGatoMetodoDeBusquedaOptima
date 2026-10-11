/*
Sección: Constantes del dominio.
Qué hace: centraliza símbolos, fases, dificultades, orden de búsqueda y líneas ganadoras.
Qué recibe: este módulo no recibe parámetros.
Qué procesa: no ejecuta lógica; solamente define valores inmutables compartidos.
Qué devuelve: exporta objetos y arreglos congelados para impedir cambios accidentales.
Dónde se usa: reglas del tablero, Minimax, controlador, estado e interfaz.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export const playerSymbols = Object.freeze({ cross: 'X', circle: 'O' });

export const gamePhases = Object.freeze({
  configuring: 'configuring',
  playingHuman: 'playingHuman',
  playingAi: 'playingAi',
  finished: 'finished',
});

export const difficultyLevels = Object.freeze({
  acolyte: 'acolyte',
  hunter: 'hunter',
  torment: 'torment',
});

export const firstPlayerOptions = Object.freeze({
  human: 'human',
  ai: 'ai',
  random: 'random',
});

export const winningLines = Object.freeze([
  Object.freeze([0, 1, 2]),
  Object.freeze([3, 4, 5]),
  Object.freeze([6, 7, 8]),
  Object.freeze([0, 3, 6]),
  Object.freeze([1, 4, 7]),
  Object.freeze([2, 5, 8]),
  Object.freeze([0, 4, 8]),
  Object.freeze([2, 4, 6]),
]);

export const preferredMoveOrder = Object.freeze([4, 0, 2, 6, 8, 1, 3, 5, 7]);
