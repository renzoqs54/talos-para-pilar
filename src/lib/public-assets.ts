export const GITHUB_PAGES_BASE = "/talos-para-pilar/";
export const TAB_ICON_PATH = "favicon.png?v=botanica-2";

export function publicAssetPath(path: string, base = import.meta.env.BASE_URL) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}