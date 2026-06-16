import Image from "next/image";
import Link from "next/link";
import { Bath, BedSingle, MapPin, Waves } from "lucide-react";
import type { Property } from "@/lib/types";
import { isRecentListing } from "@/lib/listingUtils";
import { propertyTypeLabelNb } from "@/lib/propertyTypeNb";

function formatPriceEUR(n: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace(/\s/g, " ");
}

const GRID_THUMB_SIZES =
  "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" as const;

export const CAROUSEL_THUMB_SIZES =
  "(max-width: 639px) min(100vw, 18.5rem), 20rem" as const;

export function PropertyCard({
  property,
  imageSizes = GRID_THUMB_SIZES,
}: {
  property: Property;
  imageSizes?: string;
}) {
  const thumb = property.imageUrls[0];
  const href = `/objekter/${property.slug}`;
  const showNyhet = isRecentListing(property.updatedAt);
  const typeLabel = propertyTypeLabelNb(property.type);

  return (
    <Link
      href={href}
      className="flex h-full flex-col overflow-hidden rounded-2xl bg-card text-navy no-underline shadow-md ring-1 ring-navy/8 transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      aria-label={`Se ${typeLabel} i ${property.town}`}
    >
      <div className="relative aspect-[7/3] w-full bg-navy/5">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover"
            sizes={imageSizes}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-navy/40">
            Ingen bilde
          </div>
        )}
        {showNyhet ? (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-off-white shadow-sm">
            Nyhet
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2 pb-1">
          <span className="text-[15px] font-semibold leading-snug text-navy">
            {typeLabel}
          </span>
          <span className="shrink-0 text-[15px] font-semibold tabular-nums text-navy">
            {formatPriceEUR(property.price)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pb-2 text-sm text-navy/65">
          <MapPin className="size-4 shrink-0 text-navy/40" aria-hidden />
          <span>
            {property.town}
            {property.province ? `, ${property.province}` : ""}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-navy/8 px-2.5 pt-3 text-sm text-navy/70">
          <span className="flex items-center gap-1.5">
            <BedSingle className="size-4 text-navy/45" aria-hidden />
            <span className="tabular-nums font-medium">{property.beds}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="size-4 text-navy/45" aria-hidden />
            <span className="tabular-nums font-medium">{property.baths}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Waves className="size-4 text-navy/45" aria-hidden />
            <span className="tabular-nums font-medium">
              {property.pool ? "1" : "0"}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
