export const GITHUB_PAGES_BASE = "/un-jardin-para-pilar/";

export function publicAssetPath(path: string, base = import.meta.env.BASE_URL) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}