import type { Property } from "@/lib/types";

export const PROPERTY_SORT_OPTIONS = [
  { id: "pris-stigende", label: "Pris lav til høy" },
  { id: "pris-fallende", label: "Pris høy til lav" },
  { id: "nyeste", label: "Nyeste" },
] as const;

export type PropertySortId = (typeof PROPERTY_SORT_OPTIONS)[number]["id"];

export const DEFAULT_PROPERTY_SORT: PropertySortId = "pris-stigende";

function updatedAtMs(dateStr: string | undefined): number {
  if (!dateStr?.trim()) return 0;
  const d = new Date(dateStr.replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

export function sortProperties(
  properties: Property[],
  sortId: PropertySortId,
): Property[] {
  const copy = [...properties];
  switch (sortId) {
    case "pris-stigende":
      return copy.sort((a, b) => a.price - b.price);
    case "pris-fallende":
      return copy.sort((a, b) => b.price - a.price);
    case "nyeste":
      return copy.sort(
        (a, b) => updatedAtMs(b.updatedAt) - updatedAtMs(a.updatedAt),
      );
  }
}
