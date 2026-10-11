# Tres Golpes — especificación del proyecto

## 1. Objetivo

Construir un juego web de tres en raya para una persona contra una IA. La dificultad máxima utilizará Minimax para elegir una jugada óptima y nunca perder en un tablero 3×3.

La dirección artística será una recreativa espacial de los años ochenta a pantalla completa: CRT verde, estrellas, píxeles visibles, naves X/O y paneles de fósforo. Puede recordar a los shooters espaciales clásicos, pero todos los nombres, personajes, iconos, ilustraciones y sonidos serán originales.

## 2. Identidad del juego

- Nombre: **Tres Golpes**.
- Enfrentamiento: **Player 1 contra CPU**.
- X: nave doble azul con silueta cruzada.
- O: nave alienígena magenta con silueta circular.
- Panel técnico: **CPU Tactics**.

No se usarán logotipos, personajes, música, imágenes ni recursos extraídos de otros juegos.

## 3. Reglas del juego

1. El tablero tiene nueve casillas organizadas en tres filas y tres columnas.
2. Cada casilla comienza vacía y solamente puede ocuparse una vez.
3. Los participantes alternan turnos colocando un símbolo.
4. Gana quien complete primero tres símbolos iguales en línea horizontal, vertical o diagonal.
5. Si se llenan las nueve casillas sin ganador, la ronda termina en empate.
6. Al terminar una ronda no se aceptan más movimientos hasta comenzar otra.
7. La combinación ganadora debe quedar resaltada.
8. El marcador conserva victorias y empates mientras la página permanezca abierta.
9. Reiniciar una ronda limpia el tablero, pero no el marcador.
10. Restablecer la partida limpia tanto el tablero como el marcador.

## 4. Configuración de partida

Antes de comenzar se podrá elegir:

- Símbolo del Mortal: X u O.
- Primer turno: Mortal, Abismo o aleatorio.
- Dificultad.
- Sonido activado o desactivado.
- Animaciones completas o reducidas.

La configuración quedará bloqueada durante una ronda. Cambiarla iniciará una ronda nueva después de una confirmación visual.

## 5. Dificultades

### Acólito

- Elige una casilla disponible al azar.
- Sirve para explicar la diferencia entre azar y búsqueda.

### Cazador

- Calcula la jugada óptima con Minimax.
- Ejecuta la jugada óptima el 65 % de las veces y una jugada legal aleatoria el resto.
- La decisión aleatoria debe poder sustituirse en las pruebas para obtener resultados repetibles.

### Tormento

- Evalúa todas las continuaciones posibles mediante Minimax.
- Siempre elige una jugada con la mejor puntuación.
- Debe ganar cuando el jugador cometa un error y asegurar el empate contra juego perfecto.

## 6. Reglas de Minimax

- La IA es el jugador maximizador y el humano el minimizador.
- Victoria de la IA: `10 - profundidad`.
- Victoria humana: `profundidad - 10`.
- Empate: `0`.
- Se prefieren victorias más rápidas y derrotas más tardías.
- Para decisiones equivalentes se usa este orden: centro, esquinas y después bordes.
- Cada búsqueda registra estados evaluados, profundidad máxima, duración y puntuación elegida.
- Minimax recibe una copia del tablero; nunca debe modificar el estado visible directamente.

## 7. Estados de la aplicación

- `CONFIGURING`: se pueden cambiar opciones; el tablero no acepta movimientos.
- `PLAYING_HUMAN`: el tablero acepta una jugada humana legal.
- `PLAYING_AI`: el tablero queda bloqueado mientras decide la IA.
- `FINISHED`: se muestra victoria, derrota o empate.

Flujo principal:

`CONFIGURING → PLAYING_HUMAN/PLAYING_AI → FINISHED → nueva ronda`

## 8. Interfaz

### Encabezado

- Título y subtítulo del juego.
- Estado actual de la ronda.
- Control de sonido.

### Panel izquierdo

- Elección de símbolo.
- Elección del primer turno.
- Dificultades Acólito, Cazador y Tormento.

### Centro

- Tablero 3×3.
- Indicador de turno.
- Resultado de la ronda.
- Botón **Iniciar ritual** o **Otro ritual**.

### Panel derecho

- Oráculo Minimax.
- Estados evaluados.
- Profundidad alcanzada.
- Tiempo de cálculo.
- Puntuación de la jugada.
- Explicación breve de la decisión.

### Pie

- Marcador del Mortal.
- Número de empates.
- Marcador del Abismo.
- Botón para restablecer el marcador.

## 9. Accesibilidad y adaptación

- Todas las casillas serán botones reales y funcionarán con teclado.
- El estado no dependerá únicamente del color: cada símbolo tendrá forma, texto accesible y contraste.
- El foco del teclado será claramente visible.
- Los mensajes de turno y resultado se anunciarán con `aria-live`.
- Se respetará `prefers-reduced-motion`.
- El diseño tendrá tres composiciones: escritorio, tableta y móvil.
- El tablero seguirá siendo jugable a 320 px de ancho.

## 10. Sonido y movimiento

- Los sonidos serán originales o con licencia compatible.
- Sonidos previstos: colocar símbolo, turno de la IA, victoria, derrota y empate.
- No se reproducirá audio antes de una interacción del usuario.
- Animaciones previstas: aparición de runa, grieta luminosa, línea ganadora, brasas y pulso del turno.
- Los efectos decorativos nunca bloquearán los controles.
- La carga inicial presenta el título durante tres segundos y revela la interfaz por renglones.
- La música será una secuencia chiptune original sintetizada localmente con Web Audio API.
- Los títulos presentan glitches ocasionales y los paneles laterales incluyen alienígenas decorativos.
- Al ganar, la línea vencedora baila; las fichas perdedoras caen fuera de la pantalla.

## 11. Arquitectura

```text
src/
  core/
    constants.js       símbolos, líneas ganadoras y estados
    game.js            reglas puras del tablero
    minimax.js         búsqueda y métricas
    difficulty.js      estrategia por dificultad
  state/
    store.js           estado único y transiciones
  ui/
    view.js            representación de tablero, controles y Oráculo
  controller/
    gameController.js  eventos y coordinación entre Model y View
  audio/
    sound.js           reproducción y preferencia de audio
  styles/
    tokens.css         colores, tamaños y tipografía
    base.css           estilos generales y accesibilidad
    game.css           composición del juego
    effects.css        animaciones y efectos
  main.js              inicialización
```

La lógica de `core/` no accederá al DOM. Esto permite probar las reglas y Minimax sin abrir un navegador. La organización corresponde a MVC modular: `core/` y `state/` forman el Model, `ui/` es la View, `controller/` contiene el Controller y `audio/` funciona como servicio.

## 12. Modelo de estado

```js
{
  board: [null, null, null, null, null, null, null, null, null],
  phase: 'CONFIGURING',
  humanSymbol: 'X',
  aiSymbol: 'O',
  currentPlayer: null,
  difficulty: 'TORMENTO',
  firstPlayer: 'HUMAN',
  winner: null,
  winningLine: null,
  score: { human: 0, draws: 0, ai: 0 },
  analysis: { nodes: 0, depth: 0, durationMs: 0, score: null },
  preferences: { sound: true, reducedMotion: false }
}
```

## 13. Reglas de código

- JavaScript moderno con módulos ES; sin framework para esta primera versión.
- Funciones pequeñas y nombres en inglés; textos visibles en español.
- La lógica debe ser pura siempre que sea posible.
- No se utilizarán variables globales mutables.
- El DOM solo se modifica desde módulos de `ui/`.
- Cada regla nueva requiere una prueba.
- ESLint debe finalizar sin errores.
- No se aceptará una compilación con vulnerabilidades conocidas de npm.
- Los recursos visuales deben comprimirse y tener una licencia documentada.

## 14. Pruebas mínimas

- Detectar las ocho líneas ganadoras.
- No declarar ganador en un tablero incompleto o empatado.
- Detectar empate.
- Rechazar una casilla ocupada y un movimiento fuera de turno.
- No modificar el tablero original durante Minimax.
- Tomar una victoria inmediata.
- Bloquear una derrota inmediata.
- Preferir una victoria más rápida.
- Tormento nunca pierde desde el tablero vacío.
- Cambiar correctamente entre los cuatro estados de la aplicación.
- Actualizar el marcador una sola vez por ronda.

## 15. Criterios de aceptación

La primera versión estará terminada cuando:

1. Se pueda completar una ronda con ratón y teclado.
2. Las tres dificultades se comporten según esta especificación.
3. Tormento no pueda ser derrotado.
4. El Oráculo muestre métricas reales de la última búsqueda.
5. El marcador y el reinicio funcionen correctamente.
6. La interfaz sea usable en escritorio y móvil.
7. Sonido y movimiento se puedan desactivar.
8. `npm run lint`, `npm test` y `npm run build` terminen correctamente.

## 16. Orden de implementación

1. Reglas puras del tablero.
2. Minimax y pruebas exhaustivas.
3. Estado y flujo de una ronda.
4. Interfaz funcional sin decoración.
5. Configuración, marcador y Oráculo.
6. Diseño gótico adaptable.
7. Sonido, animaciones y optimización.
8. Pruebas finales y preparación del video.
