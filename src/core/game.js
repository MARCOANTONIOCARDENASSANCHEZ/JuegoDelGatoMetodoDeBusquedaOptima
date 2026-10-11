import { winningLines } from './constants.js';

/*
Sección: Creación del tablero.
Qué hace: crea las nueve posiciones vacías de una ronda nueva.
Qué recibe: no recibe parámetros.
Qué procesa: genera un arreglo nuevo para evitar compartir estado entre partidas.
Qué devuelve: un arreglo de nueve valores null.
Dónde se usa: estado inicial, inicio de ronda y pruebas.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function createBoard() {
  return Array(9).fill(null);
}

/*
Sección: Validación estructural del tablero.
Qué hace: comprueba que un valor represente un tablero válido de tres en raya.
Qué recibe: board, el valor que se desea validar.
Qué procesa: revisa que sea un arreglo de exactamente nueve posiciones.
Qué devuelve: true cuando la estructura es válida; false en otro caso.
Dónde se usa: antes de consultar o modificar el tablero.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function isValidBoard(board) {
  return Array.isArray(board) && board.length === 9;
}

/*
Sección: Casillas disponibles.
Qué hace: obtiene los índices de todas las posiciones todavía vacías.
Qué recibe: board, tablero actual.
Qué procesa: recorre las nueve posiciones y conserva las que contienen null.
Qué devuelve: arreglo numérico con índices legales.
Dónde se usa: validación de turnos, dificultades y algoritmo Minimax.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function getAvailableMoves(board) {
  if (!isValidBoard(board)) return [];

  return board.reduce((moves, cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);
}

/*
Sección: Línea ganadora.
Qué hace: localiza la primera combinación de tres símbolos iguales.
Qué recibe: board, tablero actual.
Qué procesa: compara las ocho combinaciones ganadoras definidas en constants.js.
Qué devuelve: una copia de los tres índices ganadores o null si nadie ganó.
Dónde se usa: resultado de ronda, resaltado visual y evaluación de Minimax.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function getWinningLine(board) {
  if (!isValidBoard(board)) return null;

  const line = winningLines.find(([first, second, third]) => {
    return board[first] !== null
      && board[first] === board[second]
      && board[first] === board[third];
  });

  return line ? [...line] : null;
}

/*
Sección: Ganador de la ronda.
Qué hace: obtiene el símbolo que completó una línea.
Qué recibe: board, tablero actual.
Qué procesa: reutiliza getWinningLine y consulta la primera posición encontrada.
Qué devuelve: X, O o null.
Dónde se usa: controlador, Minimax y pruebas.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function getWinner(board) {
  const winningLine = getWinningLine(board);
  return winningLine ? board[winningLine[0]] : null;
}

/*
Sección: Detección de empate.
Qué hace: determina si la ronda terminó sin ganador.
Qué recibe: board, tablero actual.
Qué procesa: exige cero casillas disponibles y ausencia de línea ganadora.
Qué devuelve: true si existe empate; false si la ronda continúa o alguien ganó.
Dónde se usa: controlador, Minimax y mensajes de la interfaz.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function isDraw(board) {
  return getWinner(board) === null && getAvailableMoves(board).length === 0;
}

/*
Sección: Aplicación inmutable de una jugada.
Qué hace: coloca un símbolo sin modificar el arreglo original.
Qué recibe: board actual, index de la casilla y symbol del participante.
Qué procesa: valida estructura, rango, número entero y disponibilidad de la casilla.
Qué devuelve: un tablero nuevo; lanza Error cuando la jugada no es legal.
Dónde se usa: controlador y pruebas. Minimax usa una copia interna por rendimiento.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function applyMove(board, index, symbol) {
  if (!isValidBoard(board)) throw new Error('El tablero no es válido.');
  if (!Number.isInteger(index) || index < 0 || index > 8) {
    throw new Error('La posición debe estar entre 0 y 8.');
  }
  if (board[index] !== null) throw new Error('La casilla ya está ocupada.');

  const nextBoard = [...board];
  nextBoard[index] = symbol;
  return nextBoard;
}
