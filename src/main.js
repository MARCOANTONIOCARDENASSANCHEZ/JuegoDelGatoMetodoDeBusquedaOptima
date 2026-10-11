import './styles/tokens.css';
import './styles/base.css';
import './styles/game.css';
import './styles/effects.css';
import { createSoundService } from './audio/sound.js';
import { createGameController } from './controller/gameController.js';
import { createInitialState, createStore } from './state/store.js';
import { renderGame } from './ui/view.js';

/*
Sección: Composición de la aplicación.
Qué hace: crea las piezas MVC, conecta las actualizaciones y realiza el primer renderizado.
Qué recibe: obtiene #app del documento HTML.
Qué procesa: Model = store y reglas; View = renderGame; Controller = gameController.
Qué devuelve: no exporta valores; deja la aplicación lista para interacción.
APIs: usa document.querySelector del DOM local; no realiza solicitudes externas.
Dónde se usa: index.html carga este módulo como punto de entrada de Vite.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
const rootElement = document.querySelector('#app');
const store = createStore(createInitialState());
const soundService = createSoundService(store.getState().preferences.sound);
const controller = createGameController({ store, rootElement, soundService });

store.subscribe((state) => renderGame(rootElement, state));
controller.bindEvents();
renderGame(rootElement, store.getState());

/*
Sección: Presentación temporizada.
Qué hace: mantiene el título arcade durante tres segundos y después revela el juego.
Qué recibe: no recibe parámetros; usa introVisible del store.
Qué procesa: programa un único cambio de estado al completar 3000 milisegundos.
Qué devuelve: no devuelve datos; provoca el renderizado de la vista principal.
APIs: usa setTimeout del navegador; no realiza solicitudes externas.
Dónde se usa: solamente durante la carga inicial de la aplicación.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
window.setTimeout(() => {
  store.setState({ introVisible: false });
}, 3000);
