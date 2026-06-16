import { cache } from "react";
import {
  loadAllProperties,
  loadAlphashareProperties,
  loadMojacarProperties,
} from "./feeds";
import { translatePropertyDetailToNorwegian } from "./translateDescriptions";
import type { Property } from "./types";

export const getProperties = cache(async (): Promise<Property[]> => {
  return loadAllProperties();
});

export const getMojacarProperties = cache(async (): Promise<Property[]> => {
  return loadMojacarProperties();
});

export const getAlphashareProperties = cache(async (): Promise<Property[]> => {
  return loadAlphashareProperties();
});

export const getPropertyBySlug = cache(
  async (slug: string): Promise<Property | undefined> => {
    const all = slug.startsWith("mojacar-")
      ? await getMojacarProperties()
      : slug.startsWith("alphashare-")
        ? await getAlphashareProperties()
        : await getProperties();
    const property = all.find((p) => p.slug === slug);
    if (!property) return property;
    return translatePropertyDetailToNorwegian(property);
  },
);
