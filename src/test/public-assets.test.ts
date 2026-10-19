import { describe, expect, it } from "vitest";
import { GITHUB_PAGES_BASE, publicAssetPath } from "@/lib/public-assets";

describe("Public audio paths", () => {
  it("serves the original audio under the GitHub repository base", () => {
    expect(publicAssetPath("audio/natsunokiri.mp3", GITHUB_PAGES_BASE)).toBe("/talos-para-pilar/audio/natsunokiri.mp3");
  });
  it("keeps the Lovable preview audio at the origin root", () => {
    expect(publicAssetPath("audio/natsunokiri.mp3", "/")).toBe("/audio/natsunokiri.mp3");
  });
});