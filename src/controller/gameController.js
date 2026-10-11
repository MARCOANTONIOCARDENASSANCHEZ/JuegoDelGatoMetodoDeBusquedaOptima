import { firstPlayerOptions, gamePhases, playerSymbols } from '../core/constants.js';
import { chooseAiMove } from '../core/difficulty.js';
import { applyMove, createBoard, getWinner, getWinningLine, isDraw } from '../core/game.js';

/*
Sección: Controlador principal MVC.
Qué hace: interpreta eventos de la View, aplica reglas del Model y actualiza el store.
Qué recibe: store observable, rootElement con la interfaz y soundService.
Qué procesa: configuración, inicio, turnos, final de ronda, marcador, sonido y reinicios.
Qué devuelve: objeto con bindEvents; sus operaciones se mantienen privadas dentro del cierre.
Dónde se usa: main.js crea una sola instancia durante el arranque.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function createGameController({ store, rootElement, soundService }) {
  let aiTimer = null;

  /*
  Sección: Resolución del resultado.
  Qué hace: determina si la jugada recién aplicada termina la ronda.
  Qué recibe: board actualizado.
  Qué procesa: identifica ganador o empate y suma exactamente un punto al marcador.
  Qué devuelve: true si terminó la ronda; false si debe continuar.
  Dónde se usa: después de jugadas humanas y de IA.
  Fecha de modificación: 10/10/2026.
  Nombre: MCardenas.
  */
  function finishRoundIfNeeded(board) {
    const state = store.getState();
    const winner = getWinner(board);
    const draw = isDraw(board);
    if (!winner && !draw) return false;

    let result = 'draw';
    const nextScore = { ...state.score };
    if (winner === state.humanSymbol) {
      result = 'human';
      nextScore.human += 1;
      soundService.play('win');
    } else if (winner === state.aiSymbol) {
      result = 'ai';
      nextScore.ai += 1;
      soundService.play('lose');
    } else {
      nextScore.draws += 1;
      soundService.play('draw');
    }

    store.setState({
      board,
      phase: gamePhases.finished,
      currentPlayer: null,
      winner,
      winningLine: getWinningLine(board),
      result,
      score: nextScore,
    });
    return true;
  }

  /*
  Sección: Turno de la IA.
  Qué hace: consulta la dificultad, registra métricas y coloca el símbolo del Abismo.
  Qué recibe: no recibe argumentos; lee el estado vigente del store.
  Qué procesa: evita temporizadores anteriores, espera brevemente para mostrar el turno y decide.
  Qué devuelve: no devuelve datos; actualiza el store al finalizar.
  APIs: usa setTimeout del navegador para una pausa visual; no hace solicitudes externas.
  Dónde se usa: al iniciar con la IA y después de cada turno humano válido.
  Fecha de modificación: 10/10/2026.
  Nombre: MCardenas.
  */
  function scheduleAiTurn() {
    window.clearTimeout(aiTimer);
    aiTimer = window.setTimeout(() => {
      const state = store.getState();
      if (state.phase !== gamePhases.playingAi) return;

      const analysis = chooseAiMove({
        board: state.board,
        aiSymbol: state.aiSymbol,
        humanSymbol: state.humanSymbol,
        difficulty: state.difficulty,
      });
      if (analysis.move === null) return;

      const board = applyMove(state.board, analysis.move, state.aiSymbol);
      soundService.play('ai');
      store.setState({ board, analysis });
      if (!finishRoundIfNeeded(board)) {
        store.setState({ phase: gamePhases.playingHuman, currentPlayer: 'human' });
      }
    }, 520);
  }

  /*
  Sección: Inicio de ronda.
  Qué hace: limpia el tablero y resuelve quién realiza la primera jugada.
  Qué recibe: no recibe argumentos; utiliza firstPlayer de la configuración.
  Qué procesa: para Destino usa Math.random; conserva marcador y preferencias.
  Qué devuelve: no devuelve datos; cambia la fase y puede programar a la IA.
  Dónde se usa: botón Iniciar ritual y Otro ritual.
  Fecha de modificación: 10/10/2026.
  Nombre: MCardenas.
  */
  function startRound() {
    const state = store.getState();
    const aiStarts = state.firstPlayer === firstPlayerOptions.ai
      || (state.firstPlayer === firstPlayerOptions.random && Math.random() >= 0.5);
    const phase = aiStarts ? gamePhases.playingAi : gamePhases.playingHuman;

    store.setState({
      board: createBoard(),
      phase,
      currentPlayer: aiStarts ? 'ai' : 'human',
      winner: null,
      winningLine: null,
      result: null,
      analysis: { move: null, nodes: 0, maxDepth: 0, durationMs: 0, score: null, strategy: null },
    });
    soundService.startMusic();
    if (aiStarts) scheduleAiTurn();
  }

  /*
  Sección: Jugada humana.
  Qué hace: valida el turno y coloca el símbolo del Mortal.
  Qué recibe: index numérico de la casilla seleccionada.
  Qué procesa: ignora entradas fuera de fase u ocupadas; después cede el turno a la IA.
  Qué devuelve: no devuelve datos; actualiza tablero o termina la ronda.
  Dónde se usa: evento click de las nueve casillas.
  Fecha de modificación: 10/10/2026.
  Nombre: MCardenas.
  */
  function playHumanMove(index) {
    const state = store.getState();
    if (state.phase !== gamePhases.playingHuman || state.board[index] !== null) return;

    const board = applyMove(state.board, index, state.humanSymbol);
    soundService.play('human');
    if (finishRoundIfNeeded(board)) return;

    store.setState({ board, phase: gamePhases.playingAi, currentPlayer: 'ai' });
    scheduleAiTurn();
  }

  /*
  Sección: Configuración.
  Qué hace: aplica cambios permitidos antes de comenzar una ronda.
  Qué recibe: name del campo y value seleccionado desde data attributes.
  Qué procesa: al cambiar símbolo calcula automáticamente el símbolo contrario de la IA.
  Qué devuelve: no devuelve datos; actualiza únicamente propiedades conocidas.
  Dónde se usa: controles segmentados de la View.
  Fecha de modificación: 10/10/2026.
  Nombre: MCardenas.
  */
  function configure(name, value) {
    const state = store.getState();
    if (state.phase !== gamePhases.configuring) return;

    if (name === 'humanSymbol') {
      const aiSymbol = value === playerSymbols.cross ? playerSymbols.circle : playerSymbols.cross;
      store.setState({ humanSymbol: value, aiSymbol });
    } else if (name === 'firstPlayer' || name === 'difficulty') {
      store.setState({ [name]: value });
    }
  }

  /*
  Sección: Cancelación de ronda.
  Qué hace: detiene un turno pendiente y devuelve la aplicación a configuración.
  Qué recibe: no recibe parámetros.
  Qué procesa: cancela setTimeout y limpia el tablero sin alterar el marcador.
  Qué devuelve: no devuelve datos; actualiza el store.
  Dónde se usa: botón Abandonar ritual.
  Fecha de modificación: 10/10/2026.
  Nombre: MCardenas.
  */
  function cancelRound() {
    window.clearTimeout(aiTimer);
    store.setState({
      board: createBoard(),
      phase: gamePhases.configuring,
      currentPlayer: null,
      winner: null,
      winningLine: null,
      result: null,
    });
  }

  /*
  Sección: Delegación de eventos.
  Qué hace: conecta todos los botones mediante un solo listener estable en el contenedor.
  Qué recibe: event de click emitido por el navegador.
  Qué procesa: lee data-action y dirige la solicitud a la operación correspondiente.
  Qué devuelve: no devuelve datos.
  Dónde se usa: bindEvents registra esta función una vez.
  Fecha de modificación: 10/10/2026.
  Nombre: MCardenas.
  */
  function handleClick(event) {
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;

    const { action, name, value, index } = actionElement.dataset;
    if (action === 'configure') configure(name, value);
    if (action === 'play') playHumanMove(Number(index));
    if (action === 'start') startRound();
    if (action === 'cancel') cancelRound();
    if (action === 'resetScore') store.setState({ score: { human: 0, draws: 0, ai: 0 } });
    if (action === 'toggleSound') {
      const sound = !store.getState().preferences.sound;
      soundService.setEnabled(sound);
      if (sound && store.getState().phase !== gamePhases.configuring) soundService.startMusic();
      store.setState((state) => ({ preferences: { ...state.preferences, sound } }));
    }
  }

  return {
    bindEvents() {
      rootElement.addEventListener('click', handleClick);
    },
  };
}
