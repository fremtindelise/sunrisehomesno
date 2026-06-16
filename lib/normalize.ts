import he from "he";
import type { Property } from "./types";
import { buildPropertySlug } from "./slug";

export function ensureArray<T>(x: T | T[] | undefined | null): T[] {
  if (x == null) return [];
  return Array.isArray(x) ? x : [x];
}

function asString(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  return undefined;
}

export function titleCaseWords(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function parseIntLoose(v: unknown): number {
  const s = asString(v);
  if (!s) return 0;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : 0;
}

function parsePrice(v: unknown): number {
  const s = asString(v);
  if (!s) return 0;
  const n = Number(s.replace(/\s/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function pickUrl(url: unknown): string | undefined {
  if (typeof url === "string" && url.startsWith("http")) return url;
  if (url && typeof url === "object") {
    const u = url as Record<string, unknown>;
    const en = u.en;
    if (typeof en === "string" && en.startsWith("http")) return en;
    for (const v of Object.values(u)) {
      if (typeof v === "string" && v.startsWith("http")) return v;
    }
  }
  return undefined;
}

function decodeHtmlText(value: string): string {
  let decoded = value;
  for (let i = 0; i < 3; i += 1) {
    const next = he.decode(decoded);
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}

function mojacarImageUrls(images: unknown): string[] {
  if (!images || typeof images !== "object") return [];
  const img = (images as { image?: unknown }).image;
  return ensureArray(img)
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const url = (item as { url?: unknown }).url;
      return typeof url === "string" ? url : "";
    })
    .filter(Boolean);
}

function alphashareImageUrls(images: unknown): string[] {
  if (!images || typeof images !== "object") return [];
  const img = (images as { image?: unknown }).image;
  return ensureArray(img)
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const o = item as { url?: unknown };
      return typeof o.url === "string" ? o.url : "";
    })
    .filter(Boolean);
}

function pickMojacarDescription(desc: unknown): string {
  if (!desc || typeof desc !== "object") return "";
  const d = desc as Record<string, unknown>;
  const keys = ["no", "en", "es", "de", "fr", "nl", "sv", "pt"] as const;
  for (const k of keys) {
    const t = d[k];
    if (typeof t === "string" && t.trim()) return decodeHtmlText(t);
  }
  return "";
}

function pickAlphashareDescription(desc: unknown): string {
  if (!desc || typeof desc !== "object") return "";
  const d = desc as Record<string, unknown>;
  const keys = ["no", "en", "es", "de", "fr", "nl", "sv", "pt"] as const;
  for (const k of keys) {
    const t = d[k];
    if (typeof t === "string" && t.trim()) return decodeHtmlText(t);
  }
  return "";
}

function alphashareFeatures(features: unknown): string[] {
  if (!features || typeof features !== "object") return [];
  const f = (features as { feature?: unknown }).feature;
  return ensureArray(f)
    .map((x) => decodeHtmlText(String(x)).trim())
    .filter(Boolean);
}

function readLatLng(location: unknown): { lat?: number; lng?: number } {
  if (!location || typeof location !== "object") return {};
  const loc = location as Record<string, unknown>;
  const latS = asString(loc.latitude);
  const lngS = asString(loc.longitude);
  const lat = latS ? Number(latS) : NaN;
  const lng = lngS ? Number(lngS) : NaN;
  return {
    lat: Number.isFinite(lat) ? lat : undefined,
    lng: Number.isFinite(lng) ? lng : undefined,
  };
}

export function normalizeMojacarProperty(raw: Record<string, unknown>): Property | null {
  const externalId = asString(raw.id)?.trim();
  if (!externalId) return null;

  const provinceRaw = asString(raw.province)?.trim() ?? "";
  const typeRaw = asString(raw.type)?.trim() ?? "";
  const townRaw = asString(raw.town)?.trim() ?? "";

  const province = titleCaseWords(provinceRaw);
  const type = typeRaw;
  const town = townRaw;

  const source = "mojacar" as const;
  const compositeId = `${source}-${externalId}`;
  const slug = buildPropertySlug(source, externalId, type, town);

  const surface = raw.surface_area;
  let builtM2: number | undefined;
  let plotM2: number | undefined;
  if (surface && typeof surface === "object") {
    const s = surface as Record<string, unknown>;
    const b = parseIntLoose(s.built);
    const p = parseIntLoose(s.plot);
    if (b > 0) builtM2 = b;
    if (p > 0) plotM2 = p;
  }

  const { lat, lng } = readLatLng(raw.location);

  return {
    compositeId,
    source,
    externalId,
    slug,
    ref: asString(raw.ref)?.trim() ?? externalId,
    province,
    type,
    town,
    country: asString(raw.country)?.trim(),
    price: parsePrice(raw.price),
    currency: asString(raw.currency)?.trim() || "EUR",
    beds: parseIntLoose(raw.beds),
    baths: parseIntLoose(raw.baths),
    pool: asString(raw.pool) === "1",
    builtM2,
    plotM2,
    lat,
    lng,
    imageUrls: mojacarImageUrls(raw.images),
    description: pickMojacarDescription(raw.desc),
    sourceUrl: pickUrl(raw.url),
    features: [],
    videoUrl: asString(raw.video_url)?.trim() || undefined,
    virtualTourUrl: asString(raw.virtual_tour_url)?.trim() || undefined,
    updatedAt: asString(raw.date)?.trim(),
  };
}

export function normalizeAlphashareProperty(raw: Record<string, unknown>): Property | null {
  const externalId = asString(raw.id)?.trim();
  if (!externalId) return null;

  const provinceRaw = asString(raw.province)?.trim() ?? "";
  const typeRaw = asString(raw.type)?.trim() ?? "";
  const townRaw = asString(raw.town)?.trim() ?? "";

  const province = titleCaseWords(provinceRaw);
  const type = typeRaw;
  const town = townRaw;

  const source = "alphashare" as const;
  const compositeId = `${source}-${externalId}`;
  const slug = buildPropertySlug(source, externalId, type, town);

  const surface = raw.surface_area;
  let builtM2: number | undefined;
  let plotM2: number | undefined;
  if (surface && typeof surface === "object") {
    const s = surface as Record<string, unknown>;
    const b = parseIntLoose(s.built);
    const p = parseIntLoose(s.plot);
    if (b > 0) builtM2 = b;
    if (p > 0) plotM2 = p;
  }

  const { lat, lng } = readLatLng(raw.location);

  const videoUrl = asString(raw.video_url)?.trim();
  const virtualTourUrl = asString(raw.virtual_tour_url)?.trim();

  return {
    compositeId,
    source,
    externalId,
    slug,
    ref: asString(raw.ref)?.trim() ?? externalId,
    province,
    type,
    town,
    country: asString(raw.country)?.trim(),
    price: parsePrice(raw.price),
    currency: asString(raw.currency)?.trim() || "EUR",
    beds: parseIntLoose(raw.beds),
    baths: parseIntLoose(raw.baths),
    pool: asString(raw.pool) === "1",
    builtM2,
    plotM2,
    lat,
    lng,
    imageUrls: alphashareImageUrls(raw.images),
    description: pickAlphashareDescription(raw.desc),
    sourceUrl: pickUrl(raw.url),
    features: alphashareFeatures(raw.features),
    videoUrl: videoUrl || undefined,
    virtualTourUrl: virtualTourUrl || undefined,
    updatedAt: asString(raw.date)?.trim(),
  };
}
