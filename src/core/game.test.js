import { describe, expect, it } from 'vitest';
import { applyMove, createBoard, getAvailableMoves, getWinner, getWinningLine, isDraw } from './game.js';

/*
Sección: Pruebas de reglas.
Qué hace: verifica creación, jugadas inmutables, victoria, empate y errores legales.
Dónde se usa: npm test protege el Model antes de compilar la interfaz.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
describe('reglas del tablero', () => {
  it('crea nueve casillas vacías', () => {
    expect(createBoard()).toEqual(Array(9).fill(null));
  });

  it('aplica una jugada sin modificar el tablero original', () => {
    const board = createBoard();
    const nextBoard = applyMove(board, 4, 'X');
    expect(board[4]).toBeNull();
    expect(nextBoard[4]).toBe('X');
  });

  it('rechaza una casilla ocupada', () => {
    expect(() => applyMove(['X', null, null, null, null, null, null, null, null], 0, 'O'))
      .toThrow('La casilla ya está ocupada.');
  });

  it.each([
    [[0, 1, 2]], [[3, 4, 5]], [[6, 7, 8]],
    [[0, 3, 6]], [[1, 4, 7]], [[2, 5, 8]],
    [[0, 4, 8]], [[2, 4, 6]],
  ])('detecta la línea ganadora %j', ([first, second, third]) => {
    const board = createBoard();
    board[first] = 'X';
    board[second] = 'X';
    board[third] = 'X';
    expect(getWinner(board)).toBe('X');
    expect(getWinningLine(board)).toEqual([first, second, third]);
  });

  it('detecta un empate real', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(isDraw(board)).toBe(true);
    expect(getAvailableMoves(board)).toEqual([]);
  });
});
