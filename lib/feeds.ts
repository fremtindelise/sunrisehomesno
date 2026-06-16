import { XMLParser } from "fast-xml-parser";
import {
  ALPHASHARE_XML_URL,
  FEED_REVALIDATE_SECONDS,
  MOJACAR_JSON_URL,
} from "./constants";
import { ensureArray, normalizeAlphashareProperty, normalizeMojacarProperty } from "./normalize";
import type { Property } from "./types";

const fetchOptsRevalidate = { next: { revalidate: FEED_REVALIDATE_SECONDS } } as const;

const fetchOptsLargeFeed = {} as const;

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: false,
});

function sortByPriceDesc(a: Property, b: Property): number {
  return b.price - a.price;
}

export async function loadMojacarProperties(): Promise<Property[]> {
  const res = await fetch(MOJACAR_JSON_URL, fetchOptsLargeFeed);
  if (!res.ok) {
    console.error("Mojacar JSON fetch failed", res.status, res.statusText);
    return [];
  }
  const data: unknown = await res.json();
  if (!data || typeof data !== "object") return [];
  const prop = (data as { property?: unknown }).property;
  const list = ensureArray(prop as Record<string, unknown> | Record<string, unknown>[]);
  const out: Property[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const p = normalizeMojacarProperty(raw as Record<string, unknown>);
    if (p) out.push(p);
  }
  return out;
}

export async function loadAlphashareProperties(): Promise<Property[]> {
  const res = await fetch(ALPHASHARE_XML_URL, fetchOptsRevalidate);
  if (!res.ok) {
    console.error("Alphashare XML fetch failed", res.status, res.statusText);
    return [];
  }
  const xml = await res.text();
  let parsed: unknown;
  try {
    parsed = xmlParser.parse(xml);
  } catch (e) {
    console.error("Alphashare XML parse error", e);
    return [];
  }
  if (!parsed || typeof parsed !== "object") return [];
  const root = (parsed as { root?: unknown }).root;
  if (!root || typeof root !== "object") return [];
  const prop = (root as { property?: unknown }).property;
  const list = ensureArray(prop as Record<string, unknown> | Record<string, unknown>[]);
  const out: Property[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const p = normalizeAlphashareProperty(raw as Record<string, unknown>);
    if (p) out.push(p);
  }
  return out;
}

export async function loadAllProperties(): Promise<Property[]> {
  const [mojacar, alphashare] = await Promise.all([
    loadMojacarProperties(),
    loadAlphashareProperties(),
  ]);
  return [...mojacar, ...alphashare].sort(sortByPriceDesc);
}
