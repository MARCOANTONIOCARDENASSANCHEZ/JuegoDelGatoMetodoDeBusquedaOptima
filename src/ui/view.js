import { difficultyLevels, firstPlayerOptions, gamePhases, playerSymbols } from '../core/constants.js';
import shipOUrl from '../assets/ship-o.png';
import shipXUrl from '../assets/ship-x.png';

/*
Sección: Control de transición visual.
Qué hace: recuerda si la interfaz principal ya fue mostrada después de la presentación.
Qué recibe: no recibe parámetros.
Qué procesa: cambia a true tras el primer renderizado del juego.
Qué devuelve: no devuelve datos; evita repetir el barrido en cada movimiento.
Dónde se usa: renderGame decide si agrega la clase screenLoad.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
let hasRenderedGame = false;

/*
Sección: Escape de texto.
Qué hace: transforma caracteres especiales antes de insertarlos en HTML.
Qué recibe: value, cualquier valor que se mostrará como texto.
Qué procesa: sustituye &, <, >, comillas dobles y comillas simples.
Qué devuelve: cadena segura para plantillas HTML.
Dónde se usa: mensajes dinámicos de estado y resultado.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]);
}

/*
Sección: Texto de fase.
Qué hace: convierte el estado técnico de la ronda en una instrucción comprensible.
Qué recibe: state completo.
Qué procesa: compara phase y result para elegir el mensaje correspondiente.
Qué devuelve: texto en español para el lector visual y aria-live.
Dónde se usa: encabezado central de la vista.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
function getStatusText(state) {
  if (state.phase === gamePhases.configuring) return 'Elige tu ficha, ajusta la CPU y presiona START.';
  if (state.phase === gamePhases.playingHuman) return 'JUGADOR — elige una casilla.';
  if (state.phase === gamePhases.playingAi) return 'CPU THINKING — calculando el siguiente ataque…';
  if (state.result === 'human') return 'JUGADOR GANA — ¡gran combate!';
  if (state.result === 'ai') return 'CPU WINS — inserta otra moneda.';
  return 'DRAW GAME — combate igualado.';
}

/*
Sección: Control segmentado.
Qué hace: genera botones accesibles para seleccionar una opción de configuración.
Qué recibe: name del control, options visibles/valores y selectedValue actual.
Qué procesa: crea un botón por opción y marca el seleccionado con aria-pressed.
Qué devuelve: cadena HTML lista para la vista.
Dónde se usa: símbolo, primer turno y dificultad.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
function renderOptionButtons(name, options, selectedValue) {
  return options.map(({ value, label }) => `
    <button
      class="optionButton ${selectedValue === value ? 'isSelected' : ''}"
      type="button"
      data-action="configure"
      data-name="${name}"
      data-value="${value}"
      aria-pressed="${selectedValue === value}"
    >${label}</button>
  `).join('');
}

/*
Sección: Tablero interactivo.
Qué hace: representa las nueve posiciones y sus símbolos góticos.
Qué recibe: state con board, phase, símbolos y winningLine.
Qué procesa: bloquea jugadas ilegales, identifica ganadores y asigna etiquetas accesibles.
Qué devuelve: cadena HTML con nueve botones.
Dónde se usa: zona principal de renderGame.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
function renderBoard(state) {
  return state.board.map((symbol, index) => {
    const isWinningCell = state.winningLine?.includes(index) ?? false;
    const losingSymbol = state.result === 'human'
      ? state.aiSymbol
      : state.result === 'ai' ? state.humanSymbol : null;
    const isLosingCell = state.phase === gamePhases.finished && symbol === losingSymbol;
    const isDisabled = state.phase !== gamePhases.playingHuman || symbol !== null;
    const symbolClass = symbol === playerSymbols.cross ? 'cross' : 'circle';
    const symbolLabel = symbol === playerSymbols.cross ? 'luchador X' : 'robot bomba O';
    const accessibleLabel = symbol ? `Casilla ${index + 1}: ${symbolLabel}` : `Casilla ${index + 1}: vacía`;

    return `
      <button
        class="boardCell ${symbol ? symbolClass : ''} ${isWinningCell ? 'isWinner' : ''} ${isLosingCell ? 'isLoser' : ''}"
        type="button"
        data-action="play"
        data-index="${index}"
        aria-label="${accessibleLabel}"
        ${isDisabled ? 'disabled' : ''}
      >
        ${symbol ? `
          <img
            class="tokenSprite"
            src="${symbol === playerSymbols.cross ? shipXUrl : shipOUrl}"
            alt=""
            aria-hidden="true"
          />
        ` : ''}
      </button>
    `;
  }).join('');
}

/*
Sección: Vista completa.
Qué hace: convierte el estado único en toda la interfaz visible del juego.
Qué recibe: rootElement donde se dibuja y state actual.
Qué procesa: genera configuración, tablero, Oráculo, marcadores y controles.
Qué devuelve: no devuelve valor; reemplaza el contenido del nodo raíz.
Dónde se usa: main.js al iniciar y después de cada cambio del store.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export function renderGame(rootElement, state) {
  if (state.introVisible) {
    rootElement.innerHTML = `
      <main class="gameShell ${state.preferences.reducedMotion ? 'reduceMotion' : ''}">
        <section class="crtScreen introScreen" aria-label="Presentación de Tres Golpes">
          <div class="matrixCode" aria-hidden="true">
            01001 10110 00101 11100 01010 10011 01101 00110<br>
            READY  PLAYER  CPU  MINIMAX  NODES  SCORE  READY<br>
            11010 00111 10100 01001 11101 00011 10110 01100<br>
            LOADING ARCADE SYSTEM ······················ 100%
          </div>
          <div class="scanBeam" aria-hidden="true"></div>
          <p class="introBoot">ARCADE SYSTEM // 199X</p>
          <h1 class="introTitle" data-text="TRES GOLPES">TRES GOLPES</h1>
          <p class="introSubtitle">TACTICAL TIC-TAC-TOE</p>
          <p class="introLoading">CARGANDO COMBATE<span>...</span></p>
        </section>
      </main>
    `;
    return;
  }

  const isConfiguring = state.phase === gamePhases.configuring;
  const primaryAction = state.phase === gamePhases.finished ? 'OTRO ROUND' : 'START GAME';
  const analysisScore = state.analysis.score === null ? '—' : state.analysis.score;
  const analysisStrategy = state.analysis.strategy === 'random' ? 'Azar' : 'Minimax';
  const loadClass = hasRenderedGame ? '' : 'screenLoad';
  hasRenderedGame = true;

  rootElement.innerHTML = `
    <main class="gameShell ${state.preferences.reducedMotion ? 'reduceMotion' : ''}">
      <section class="crtScreen gameInterface ${loadClass}">
        <header class="arcadeTopbar">
          <div class="miniLogo">TRES GOLPES</div>
          <p class="status" aria-live="polite">${escapeHtml(getStatusText(state))}</p>
          <div class="compactScore" aria-label="Marcador">
            <span>JUGADOR <strong>${state.score.human}</strong></span>
            <span>EMPATES <strong>${state.score.draws}</strong></span>
            <span>CPU <strong>${state.score.ai}</strong></span>
          </div>
          <button class="soundButton" type="button" data-action="toggleSound" aria-pressed="${state.preferences.sound}">
            ${state.preferences.sound ? '♫ ON' : '♫ OFF'}
          </button>
        </header>

        <section class="gameLayout">
        <aside class="stonePanel settingsPanel" aria-label="Configuración de la partida">
          <h2>Game Setup</h2>
          <fieldset ${isConfiguring ? '' : 'disabled'}>
            <legend>Tu símbolo</legend>
            <div class="optionGrid twoColumns">
              ${renderOptionButtons('humanSymbol', [
                { value: playerSymbols.cross, label: 'Nave X' },
                { value: playerSymbols.circle, label: 'Alien O' },
              ], state.humanSymbol)}
            </div>
          </fieldset>
          <fieldset ${isConfiguring ? '' : 'disabled'}>
            <legend>Primer turno</legend>
            <div class="optionGrid">
              ${renderOptionButtons('firstPlayer', [
                { value: firstPlayerOptions.human, label: 'Jugador' },
                { value: firstPlayerOptions.ai, label: 'CPU' },
                { value: firstPlayerOptions.random, label: 'Random' },
              ], state.firstPlayer)}
            </div>
          </fieldset>
          <fieldset ${isConfiguring ? '' : 'disabled'}>
            <legend>Dificultad</legend>
            <div class="optionGrid">
              ${renderOptionButtons('difficulty', [
                { value: difficultyLevels.acolyte, label: 'Recluta' },
                { value: difficultyLevels.hunter, label: 'Peleador' },
                { value: difficultyLevels.torment, label: 'Jefe final' },
              ], state.difficulty)}
            </div>
          </fieldset>
          <div class="menuSprites" aria-hidden="true">
            <i class="pixelGhost cyanGhost"></i>
            <i class="pixelGhost yellowGhost"></i>
          </div>
        </aside>

        <section class="ritualArea" aria-label="Tablero del juego">
          <div class="boardFrame">
            <div class="gameBoard">${renderBoard(state)}</div>
          </div>
          ${(isConfiguring || state.phase === gamePhases.finished) ? `
            <button class="ritualButton" type="button" data-action="start">${primaryAction}</button>
          ` : `
            <button class="secondaryButton" type="button" data-action="cancel">SALIR DEL ROUND</button>
          `}
        </section>

        <aside class="oraclePanel" aria-label="Análisis de la inteligencia artificial">
          <h2>CPU Tactics</h2>
          <dl class="metrics">
            <div><dt>Estrategia</dt><dd>${state.analysis.strategy ? analysisStrategy : '—'}</dd></div>
            <div><dt>Nodos</dt><dd>${state.analysis.nodes.toLocaleString('es-MX')}</dd></div>
            <div><dt>Profundidad</dt><dd>${state.analysis.maxDepth}</dd></div>
            <div><dt>Tiempo</dt><dd>${state.analysis.durationMs} ms</dd></div>
            <div><dt>Valor</dt><dd>${analysisScore}</dd></div>
          </dl>
          <div class="decisionTree" aria-hidden="true">
            <span>◉</span><i></i><span>×</span><span>◉</span><span>×</span>
          </div>
          <p class="oracleText">${state.analysis.strategy
            ? `La CPU eligió la casilla ${(state.analysis.move ?? 0) + 1} mediante ${analysisStrategy.toLowerCase()}.`
            : 'La CPU mostrará aquí cómo decidió su ataque.'}</p>
          <div class="menuSprites oracleSprites" aria-hidden="true">
            <i class="pixelGhost pinkGhost"></i>
            <i class="pixelGhost cyanGhost"></i>
          </div>
        </aside>
        </section>

        <button class="resetButton" type="button" data-action="resetScore">RESET SCORE</button>
      </section>
    </main>
  `;
}
