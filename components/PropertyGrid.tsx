import type { Property } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";

export function PropertyGrid({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-navy/15 bg-card/80 px-6 py-14 text-center text-sm text-navy/60">
        Ingen boliger matcher filtrene. Prøv å tilbakestille eller velge andre
        kriterier.
      </p>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Boliger"
    >
      {properties.map((p) => (
        <li key={p.compositeId} className="min-h-0 min-w-0">
          <PropertyCard property={p} />
        </li>
      ))}
    </ul>
  );
}
