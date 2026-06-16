export type PropertySource = "mojacar" | "alphashare";

export type Property = {
  compositeId: string;
  source: PropertySource;
  externalId: string;
  slug: string;
  ref: string;
  province: string;
  type: string;
  town: string;
  country?: string;
  price: number;
  currency: string;
  beds: number;
  baths: number;
  pool: boolean;
  builtM2?: number;
  plotM2?: number;
  lat?: number;
  lng?: number;
  imageUrls: string[];
  description: string;
  sourceUrl?: string;
  features: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  updatedAt?: string;
};
