# Stremio Native IPTV Fork

Esta es una versión mejorada y modificada autónomamente de Stremio. Su característica principal es que incluye una **Sección Nativa de IPTV (Live TV)**.

## Características
- **Pestaña 'Live TV'**: Añadida directamente en la interfaz (Side/Nav Bar) de Stremio.
- **Carga de Listas M3U**: Parseo en cliente de listas IPTV M3U, agrupando por categorías (`group-title`) e incluyendo soporte para logotipos (`tvg-logo`).
- **Reproducción Integrada**: Transforma iterativamente la lista M3U en Streams compatibles con el reproductor nativo de Stremio Web y Desktop.
- **Sin necesidad de Addons de terceros**: Todo el parseo y validación ocurre nativamente en el front-end y carga en la arquitectura estándar sin proxies externos de addons.

## Descargas
Puedes descargar los instaladores para **Windows (.exe)** y **Android (.apk)** automáticamente generados desde la pestaña de **Releases** en GitHub.

### Desarrollo y Compilación Manual
1. Clona el repositorio.
2. `cd stremio-web`
3. `npm install`
4. `npm run build`
