import { describe, expect, it } from "vitest";
import { GITHUB_PAGES_BASE, publicAssetPath, TAB_ICON_PATH } from "@/lib/public-assets";

describe("Public audio paths", () => {
  it("serves the original audio under the GitHub repository base", () => {
    expect(publicAssetPath("audio/natsunokiri.mp3", GITHUB_PAGES_BASE)).toBe("/talos-para-pilar/audio/natsunokiri.mp3");
  });
  it("keeps the Lovable preview audio at the origin root", () => {
    expect(publicAssetPath("audio/natsunokiri.mp3", "/")).toBe("/audio/natsunokiri.mp3");
  });
});

describe("Botanical favicon paths", () => {
  it("uses a fresh botanical icon URL on Lovable", () => {
    expect(publicAssetPath(TAB_ICON_PATH, "/")).toBe("/favicon.png?v=botanica-2");
  });
  it("keeps the icon version under the GitHub repository base", () => {
    expect(publicAssetPath(TAB_ICON_PATH, GITHUB_PAGES_BASE)).toBe("/talos-para-pilar/favicon.png?v=botanica-2");
  });
  it("serves the favicon under the GitHub Pages base", () => {
    expect(publicAssetPath("favicon.png", GITHUB_PAGES_BASE)).toBe("/talos-para-pilar/favicon.png");
  });
  it("serves the favicon at the Lovable origin root", () => {
    expect(publicAssetPath("favicon.png", "/")).toBe("/favicon.png");
  });
});