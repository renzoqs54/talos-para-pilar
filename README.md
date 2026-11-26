# Para Pilar — un pequeño jardín

Carta y canción para Pilar (TanStack Start + Vite). Se puede publicar como sitio estático en GitHub Pages:

**https://renzoqs54.github.io/talos-para-pilar/**

## Cómo funciona la versión estática

- `vite.config.ts` solo cambia cuando `GITHUB_PAGES=true`: desactiva el servidor (Nitro), usa la base `/talos-para-pilar/` y prerenderiza `/` a HTML.
- Sin esa variable (vista previa de Lovable) la configuración es la original.
- La salida publicable queda en `dist/client/` (`index.html`, `assets/`, `audio/natsunokiri.mp3`, `favicon.png`).
- El audio se lee de `public/audio/natsunokiri.mp3` con la base correcta. Si falta, el reproductor muestra un mensaje de error.

Build local:

```sh
bun install
bun run test
GITHUB_PAGES=true bun run build   # resultado en dist/client
```

## Publicar en GitHub Pages (pasos manuales)

1. En GitHub, con la cuenta `renzoqs54`, crea el repositorio **`talos-para-pilar`** (el nombre debe coincidir exactamente con la base).
   - Desde Lovable: Project settings → Git → conectar GitHub (crea un repositorio nuevo; renómbralo a `talos-para-pilar` en GitHub si tiene otro nombre), o
   - Descarga el código y súbelo: `git init && git add . && git commit -m "init" && git branch -M main && git remote add origin https://github.com/renzoqs54/talos-para-pilar.git && git push -u origin main`
2. Asegúrate de que `public/audio/natsunokiri.mp3` está incluido en el repositorio.
3. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Haz push a `main` (o ejecuta manualmente *Actions → Deploy to GitHub Pages → Run workflow*).
5. El workflow `.github/workflows/deploy-pages.yml` instala dependencias, ejecuta tests, compila con `GITHUB_PAGES=true`, comprueba que existen `index.html` y el mp3, y despliega `dist/client`.
6. Al terminar, abre https://renzoqs54.github.io/talos-para-pilar/

Si cambias el nombre del repositorio, actualiza la base en `vite.config.ts` y `src/lib/public-assets.ts`.

## Icono de la pestaña: diagnóstico y comprobación

El sitio debe mostrar la misma flor al abrir el jardín, leer la carta o solicitar el icono directamente, sin cambiar el título ni el contenido. La única declaración del icono está en el encabezado compartido de TanStack Start; la página de la carta no añade otra. No hay manifiesto ni service worker en este proyecto.

- Fuente: `public/favicon.png` (64 × 64). El encabezado usa `favicon.png?v=botanica-2` mediante `publicAssetPath`, tanto en Lovable como bajo `/talos-para-pilar/`.
- Respaldo: `public/favicon.ico`, generado a partir de esa misma flor, con tamaños de 16, 32, 48 y 64 píxeles. No es el antiguo archivo de Lovable.
- GitHub Actions comprueba que ambos archivos estén en la salida estática antes de desplegar.

Comprobaciones realizadas el 26 de noviembre de 2026 con Chromium y caché de red deshabilitada:

| Dirección | Resultado observado |
| --- | --- |
| Vista previa local, `http://localhost:8080/` | Una sola etiqueta de icono, `/favicon.png?v=botanica-2`; PNG y respaldo ICO devuelven 200; sin errores de JavaScript. |
| Vista previa externa de Lovable | Redirige al acceso de `lovable.dev`; sus iconos pertenecen a esa pantalla, no al jardín. No se pudo comprobar el jardín detrás de ese acceso. |
| `https://talos-para-pilar.lovable.app/` | La publicación aún declara `/favicon.ico`: el HTML inicial y su archivo JavaScript contienen esa referencia antigua. El ICO devuelve 200 y el PNG 404. Esto no se explica por la caché del navegador y requiere volver a publicar. |
| `https://renzoqs54.github.io/talos-para-pilar/` | La versión ya publicada declara `/talos-para-pilar/favicon.png`; devuelve 200 y coincide byte a byte con la flor local. La URL con `?v=botanica-2` también devuelve esa misma flor. El respaldo ICO todavía devuelve 404 y llegará con el siguiente despliegue. |

Los PNG local y de GitHub Pages tienen SHA-256 `fc40e760e6296e2a` (primeros 16 caracteres). No se observó un icono adicional inyectado en el jardín: en las páginas accesibles coincide la etiqueta del HTML inicial con la del navegador después de cargar. No se ejecutó aquí una nueva compilación estática; la comprobación externa de GitHub corresponde a la versión que ya estaba publicada. Las ocho pruebas de rutas y archivos públicos pasaron y la compilación automática de la vista previa indicó `build OK`.

Para llevar esta corrección a las direcciones públicas, vuelve a publicar en Lovable y ejecuta el despliegue de GitHub Actions con estos cambios. No se ha publicado desde esta revisión.

Si después de publicar aún ves un icono antiguo:

1. Abre directamente `https://talos-para-pilar.lovable.app/favicon.png?v=botanica-2` o `https://renzoqs54.github.io/talos-para-pilar/favicon.png?v=botanica-2`: debe aparecer la flor, no un error ni un logo de Lovable.
2. En las herramientas del navegador, abre **Red / Network**, marca **Deshabilitar caché / Disable cache** y recarga con esas herramientas abiertas. Comprueba la solicitud del icono y su respuesta 200; en **Elementos / Elements**, busca `rel="icon"` y verifica la URL correspondiente de arriba.
3. Si los archivos y la etiqueta son correctos, cierra la pestaña y abre la página en una ventana privada o perfil nuevo: algunos navegadores guardan los iconos de pestaña por separado. Si la página se llama **Login** y está en `lovable.dev`, estás viendo el icono del acceso de Lovable, que este proyecto no modifica.
