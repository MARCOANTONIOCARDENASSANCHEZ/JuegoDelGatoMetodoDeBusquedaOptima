# Juego clásico con búsqueda óptima

**Tres Golpes** es un tres en raya con estética de maquinita arcade noventera contra una IA basada en el algoritmo **Minimax**.

La estructura, las reglas y los criterios de aceptación están definidos en [`docs/ESPECIFICACION.md`](docs/ESPECIFICACION.md).

## Arquitectura

El proyecto usa MVC modular sin framework:

- `src/core` y `src/state`: Model, reglas y datos.
- `src/ui`: View generada desde el estado.
- `src/controller`: Controller de eventos y turnos.
- `src/audio`: servicio para Web Audio API.
- `src/styles`: diseño, adaptación y movimiento.
- `src/assets`: tablero y fichas pixel art originales integradas por Vite.

Las variables y funciones usan `camelCase`. Cada módulo y función contiene comentarios de bloque con su responsabilidad, entradas, proceso, salida, dependencias, reutilización, fecha y autor.

Los recursos visuales toman como referencia géneros clásicos de pelea, acción caricaturesca y laberintos con bombas. No contienen personajes, logotipos ni sprites oficiales de otras franquicias.

La interfaz ocupa toda la pantalla como un CRT espacial. Al cargar, muestra una presentación de tres segundos con barrido vertical; después revela el menú verde y un tablero pixelado de combate espacial. La música chiptune original y pausada comienza tras pulsar `START GAME`, respetando el bloqueo de reproducción automática de los navegadores.

Los paneles incluyen pequeños alienígenas decorativos y glitches ocasionales. Al terminar una ronda, las fichas perdedoras caen fuera de la pantalla y la línea ganadora realiza una animación de celebración.

La distribución es responsive: en pantallas pequeñas prioriza el tablero, apila los paneles de configuración y tácticas, mantiene controles táctiles de al menos 44 px y evita el desplazamiento horizontal.

## Versión en línea

La versión publicada se encuentra en [GitHub Pages](https://marcoantoniocardenassanchez.github.io/JuegoDelGatoMetodoDeBusquedaOptima/).

Cada envío a la rama `main` ejecuta automáticamente validación, pruebas, compilación y despliegue mediante GitHub Actions.

## Comandos

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera la versión para entregar.
- `npm test`: ejecuta las pruebas una vez.
- `npm run test:watch`: ejecuta las pruebas mientras se programa.
- `npm run lint`: revisa la calidad del código.

## Requisitos de la actividad

- Interfaz y lógica del juego.
- IA con Minimax (búsqueda óptima).
- Pruebas de la lógica y de las decisiones de la IA.
- Video donde se vea el juego funcionando y se explique el código.
