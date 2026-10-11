import { defineConfig } from 'vite';

/*
Sección: Configuración de compilación.
Qué hace: establece la subruta pública donde GitHub Pages servirá la aplicación.
Qué recibe: Vite carga este archivo automáticamente al ejecutar dev o build.
Qué procesa: añade el nombre del repositorio como base de recursos en producción.
Qué devuelve: configuración consumida por Vite.
Dónde se usa: desarrollo local, compilación y flujo de GitHub Actions.
Fecha de modificación: 10/10/2026.
Nombre: MCardenas.
*/
export default defineConfig({
  base: '/JuegoDelGatoMetodoDeBusquedaOptima/',
});
