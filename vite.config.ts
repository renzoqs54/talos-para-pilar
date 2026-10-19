// @lovable.dev/vite-tanstack-config already includes tanstackStart, viteReact, tailwindcss,
// tsConfigPaths, nitro, @ alias, etc. — do NOT add them manually.
// GITHUB_PAGES=true switches to a fully static build served under /talos-para-pilar/.
// Without it (Lovable preview/publish) the config is unchanged.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const pages = process.env.GITHUB_PAGES === "true";
const PAGES_BASE = "/talos-para-pilar/";

export default defineConfig({
  ...(pages ? { nitro: false, vite: { base: PAGES_BASE } } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    ...(pages
      ? {
          router: { basepath: "/talos-para-pilar" },
          pages: [{ path: "/" }],
          prerender: { enabled: true, autoStaticPathsDiscovery: false, crawlLinks: false },
        }
      : {}),
  },
});
