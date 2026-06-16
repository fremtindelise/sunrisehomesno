import type { Property, PropertySource } from "@/lib/types";

export const PROPERTY_AREAS = [
  {
    id: "almeria",
    label: "Costa de Almería",
    source: "mojacar" satisfies PropertySource,
  },
  {
    id: "blanca-nord",
    label: "Costa Blanca Nord",
    source: "alphashare" satisfies PropertySource,
  },
] as const;

export type PropertyAreaId = (typeof PROPERTY_AREAS)[number]["id"];

export function objekterHrefForArea(areaId: PropertyAreaId): string {
  return `/objekter?omrade=${areaId}`;
}

export const PRICE_LEVELS = [
  {
    id: "under-200",
    label: "Under €200,000",
    matches: (price: number) => price < 200_000,
  },
  {
    id: "200-300",
    label: "€200,000–€300,000",
    matches: (price: number) => price >= 200_000 && price < 300_000,
  },
  {
    id: "300-500",
    label: "€300,000–€500,000",
    matches: (price: number) => price >= 300_000 && price < 500_000,
  },
  {
    id: "500-750",
    label: "€500,000–€750,000",
    matches: (price: number) => price >= 500_000 && price < 750_000,
  },
  {
    id: "750-plus",
    label: "€750,000+",
    matches: (price: number) => price >= 750_000,
  },
] as const;

export type PriceLevelId = (typeof PRICE_LEVELS)[number]["id"];

export function propertyMatchesArea(
  property: Property,
  areaId: string | null,
): boolean {
  if (!areaId) return true;
  const area = PROPERTY_AREAS.find((a) => a.id === areaId);
  if (!area) return true;
  return property.source === area.source;
}

export function matchesPropertyFilters(
  property: Property,
  filters: {
    areaId: string | null;
    town: string | null;
    type: string | null;
    minSoverom: number | null;
    minBad: number | null;
    priceLevelId: string | null;
  },
): boolean {
  if (!propertyMatchesArea(property, filters.areaId)) return false;

  const townQ = (filters.town ?? "").trim().toLowerCase();
  if (townQ && property.town.toLowerCase() !== townQ) return false;

  const typeQ = (filters.type ?? "").trim().toLowerCase();
  if (typeQ && property.type.toLowerCase() !== typeQ) return false;

  if (filters.minSoverom != null && property.beds < filters.minSoverom) {
    return false;
  }
  if (filters.minBad != null && property.baths < filters.minBad) {
    return false;
  }

  if (filters.priceLevelId) {
    const level = PRICE_LEVELS.find((p) => p.id === filters.priceLevelId);
    if (level && !level.matches(property.price)) return false;
  }

  return true;
}
