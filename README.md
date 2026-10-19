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
