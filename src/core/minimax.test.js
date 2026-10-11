import { describe, expect, it } from 'vitest';
import { difficultyLevels } from './constants.js';
import { chooseAiMove } from './difficulty.js';
import { findBestMove } from './minimax.js';

/*
Sección: Pruebas de inteligencia artificial.
Qué hace: comprueba decisiones tácticas, inmutabilidad y diferencias entre dificultades.
Dónde se usa: npm test demuestra que la búsqueda óptima funciona como exige la actividad.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
describe('algoritmo Minimax', () => {
  it('toma una victoria inmediata', () => {
    const board = ['O', 'O', null, 'X', 'X', null, null, null, null];
    expect(findBestMove(board, 'O', 'X').move).toBe(2);
  });

  it('bloquea una derrota inmediata', () => {
    const board = ['X', 'X', null, 'O', null, null, null, 'O', null];
    expect(findBestMove(board, 'O', 'X').move).toBe(2);
  });

  it('prefiere el centro al comenzar y conserva el tablero original', () => {
    const board = Array(9).fill(null);
    const snapshot = [...board];
    expect(findBestMove(board, 'O', 'X').move).toBe(4);
    expect(board).toEqual(snapshot);
  });

  it('usa azar controlable en Acólito', () => {
    const result = chooseAiMove({
      board: Array(9).fill(null),
      aiSymbol: 'O',
      humanSymbol: 'X',
      difficulty: difficultyLevels.acolyte,
      randomSource: () => 0,
    });
    expect(result.move).toBe(0);
    expect(result.strategy).toBe('random');
  });

  it('siempre usa Minimax en Tormento', () => {
    const result = chooseAiMove({
      board: Array(9).fill(null),
      aiSymbol: 'O',
      humanSymbol: 'X',
      difficulty: difficultyLevels.torment,
      randomSource: () => 0.99,
    });
    expect(result.move).toBe(4);
    expect(result.strategy).toBe('minimax');
    expect(result.nodes).toBeGreaterThan(0);
  });
});
