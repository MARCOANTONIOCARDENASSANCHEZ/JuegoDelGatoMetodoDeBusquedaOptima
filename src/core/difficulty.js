import { difficultyLevels } from './constants.js';
import { getAvailableMoves } from './game.js';
import { findBestMove } from './minimax.js';

/*
Sección: Movimiento aleatorio.
Qué hace: elige una casilla legal sin analizar el árbol del juego.
Qué recibe: board y randomSource; este último permite reemplazar Math.random en pruebas.
Qué procesa: transforma un número entre 0 y 1 en una posición del arreglo de jugadas legales.
Qué devuelve: índice elegido o null cuando no existen movimientos.
Dónde se usa: dificultad Acólito y margen de error de Cazador.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
function findRandomMove(board, randomSource) {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return null;
  return moves[Math.floor(randomSource() * moves.length)];
}

/*
Sección: Estrategia por dificultad.
Qué hace: decide si la IA juega al azar, mezcla azar con Minimax o juega óptimamente.
Qué recibe: configuración con board, símbolos, difficulty y fuente aleatoria opcional.
Qué procesa: Acólito usa azar; Cazador usa Minimax 65 % del tiempo; Tormento siempre Minimax.
Qué devuelve: resultado normalizado con jugada, métricas y strategy utilizada.
Dónde se usa: controlador durante el turno del Abismo.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function chooseAiMove({
  board,
  aiSymbol,
  humanSymbol,
  difficulty,
  randomSource = Math.random,
}) {
  const shouldUseMinimax = difficulty === difficultyLevels.torment
    || (difficulty === difficultyLevels.hunter && randomSource() < 0.65);

  if (shouldUseMinimax) {
    return { ...findBestMove(board, aiSymbol, humanSymbol), strategy: 'minimax' };
  }

  return {
    move: findRandomMove(board, randomSource),
    score: null,
    nodes: 0,
    maxDepth: 0,
    durationMs: 0,
    strategy: 'random',
  };
}
