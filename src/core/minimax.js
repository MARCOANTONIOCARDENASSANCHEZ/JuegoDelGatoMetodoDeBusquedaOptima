import { preferredMoveOrder } from './constants.js';
import { getAvailableMoves, getWinner, isDraw } from './game.js';

/*
Sección: Orden de movimientos.
Qué hace: vuelve deterministas los empates de puntuación y prioriza centro, esquinas y bordes.
Qué recibe: board, tablero que se está evaluando.
Qué procesa: filtra el orden preferido conservando únicamente casillas vacías.
Qué devuelve: índices legales en orden estratégico.
Dónde se usa: todos los niveles del árbol Minimax.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
function getOrderedMoves(board) {
  const availableMoves = new Set(getAvailableMoves(board));
  return preferredMoveOrder.filter((index) => availableMoves.has(index));
}

/*
Sección: Evaluación recursiva Minimax.
Qué hace: explora todas las continuaciones posibles alternando maximización y minimización.
Qué recibe: board de trabajo, símbolos de IA/humano, profundidad, turno y métricas acumuladas.
Qué procesa: detecta estados terminales; simula cada movimiento; deshace la simulación; elige
la puntuación mayor para la IA o menor para el humano.
Qué devuelve: puntuación numérica del estado recibido.
Dónde se usa: findBestMove. Es privada para proteger las reglas de recursión.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
function evaluateBranch(board, aiSymbol, humanSymbol, depth, isMaximizing, metrics) {
  metrics.nodes += 1;
  metrics.maxDepth = Math.max(metrics.maxDepth, depth);

  const winner = getWinner(board);
  if (winner === aiSymbol) return 10 - depth;
  if (winner === humanSymbol) return depth - 10;
  if (isDraw(board)) return 0;

  const moves = getOrderedMoves(board);
  let bestScore = isMaximizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

  for (const move of moves) {
    board[move] = isMaximizing ? aiSymbol : humanSymbol;
    const score = evaluateBranch(
      board,
      aiSymbol,
      humanSymbol,
      depth + 1,
      !isMaximizing,
      metrics,
    );
    board[move] = null;
    bestScore = isMaximizing ? Math.max(bestScore, score) : Math.min(bestScore, score);
  }

  return bestScore;
}

/*
Sección: Selección óptima de Minimax.
Qué hace: calcula la mejor jugada posible para la IA y recopila datos explicativos.
Qué recibe: board actual, aiSymbol y humanSymbol.
Qué procesa: copia el tablero, puntúa cada jugada legal y conserva la puntuación máxima.
Qué devuelve: objeto con move, score, nodes, maxDepth y durationMs; move es null si terminó.
APIs: usa performance.now del navegador o Node para medir tiempo; no realiza solicitudes externas.
Dónde se usa: niveles Cazador y Tormento, Oráculo Minimax y pruebas.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function findBestMove(board, aiSymbol, humanSymbol) {
  const startedAt = performance.now();
  const workingBoard = [...board];
  const metrics = { nodes: 0, maxDepth: 0 };
  let bestMove = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  if (getWinner(workingBoard) || isDraw(workingBoard)) {
    return { move: null, score: 0, nodes: 0, maxDepth: 0, durationMs: 0 };
  }

  for (const move of getOrderedMoves(workingBoard)) {
    workingBoard[move] = aiSymbol;
    const score = evaluateBranch(workingBoard, aiSymbol, humanSymbol, 1, false, metrics);
    workingBoard[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return {
    move: bestMove,
    score: bestScore,
    nodes: metrics.nodes,
    maxDepth: metrics.maxDepth,
    durationMs: Number((performance.now() - startedAt).toFixed(2)),
  };
}
