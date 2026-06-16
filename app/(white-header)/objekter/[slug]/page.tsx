import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/getProperties";
import { propertyTypeLabelNb } from "@/lib/propertyTypeNb";
import { BackToSearchLink } from "@/components/BackToSearchLink";
import { PropertyImageGallery } from "@/components/PropertyImageGallery";

// Cache generated property detail pages for 30 days on Vercel.
export const revalidate = 2592000;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return { title: "Bolig ikke funnet" };
  }
  const typeLabel = propertyTypeLabelNb(property.type);
  const title = `${typeLabel} i ${property.town} — ${new Intl.NumberFormat(
    "nb-NO",
    {
      style: "currency",
      currency: property.currency || "EUR",
      maximumFractionDigits: 0,
    },
  ).format(property.price)}`;
  const description = (property.description || "")
    .slice(0, 160)
    .replace(/\s+/g, " ")
    .trim();
  const og = property.imageUrls[0];
  return {
    title,
    description: description ? `${description}…` : title,
    openGraph: og ? { images: [{ url: og }] } : undefined,
  };
}

function formatPrice(n: number, currency: string): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function ObjekterDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const typeLabel = propertyTypeLabelNb(property.type);

  return (
    <article className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:max-w-5xl">
      <BackToSearchLink />

      <header className="space-y-2">
        <p className="text-sm text-navy/55">
          {property.ref} ·{" "}
          {property.source === "mojacar" ? "Costa de Almería" : "Costa Blanca Nord"}
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="text-3xl font-semibold text-navy">
            {typeLabel} i {property.town}
          </h1>
          <p className="shrink-0 text-2xl font-medium tabular-nums text-navy">
            {formatPrice(property.price, property.currency)}
          </p>
        </div>
        <p className="text-navy/70">
          {property.province}
          {property.country ? `, ${property.country}` : ""}
        </p>
        <ul className="flex flex-wrap gap-3 text-sm text-navy/65">
          <li>{property.beds} soverom</li>
          <li>{property.baths} bad</li>
          {property.builtM2 ? <li>{property.builtM2} m² bygd</li> : null}
          {property.plotM2 ? <li>{property.plotM2} m² tomt</li> : null}
          <li>{property.pool ? "Basseng" : "Uten basseng"}</li>
        </ul>
      </header>

      <PropertyImageGallery
        imageUrls={property.imageUrls}
        imageAltBase={typeLabel}
      />

      {property.description ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-navy">Beskrivelse</h2>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-navy/75">
            {property.description}
          </div>
        </section>
      ) : null}

      {property.features.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-navy">Fasiliteter</h2>
          <ul className="columns-1 gap-x-8 text-sm text-navy/75 sm:columns-2">
            {property.features.map((f) => (
              <li key={f} className="break-inside-avoid py-0.5">
                {f}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(property.videoUrl || property.virtualTourUrl) && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-navy">Media</h2>
          {property.videoUrl ? (
            <p>
              <a
                href={property.videoUrl}
                className="font-semibold text-gold-mid hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Video
              </a>
            </p>
          ) : null}
          {property.virtualTourUrl ? (
            <p>
              <a
                href={property.virtualTourUrl}
                className="font-semibold text-gold-mid hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Virtuell omvisning
              </a>
            </p>
          ) : null}
        </section>
      )}
    </article>
  );
}
