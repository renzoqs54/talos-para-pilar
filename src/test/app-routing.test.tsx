import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/").at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it("matches the letter page at the GitHub Pages address /talos-para-pilar/", () => {
    const history = createMemoryHistory({ initialEntries: ["/talos-para-pilar/"] });
    const router = createRouter({ routeTree, history, basepath: "/talos-para-pilar/", context: { queryClient: new QueryClient() } });
    const loc = router.parseLocation(history.location);
    expect(router.matchRoutes(loc).at(-1)?.routeId).toBe("/");
  });
});
