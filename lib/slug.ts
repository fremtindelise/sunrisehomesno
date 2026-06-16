import type { PropertySource } from "./types";

export function slugify(input: string, maxLen = 56): string {
  const s = input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
  return s.slice(0, maxLen).replace(/-+$/g, "") || "bolig";
}

export function buildPropertySlug(
  source: PropertySource,
  externalId: string,
  type: string,
  town: string,
): string {
  const tail = slugify(`${type}-${town}`);
  return `${source}-${externalId}-${tail}`;
}
