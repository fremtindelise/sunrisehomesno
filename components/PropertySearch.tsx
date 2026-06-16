"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Property } from "@/lib/types";
import { HERO_LISTING_CAROUSEL_OVERLAP_NEG } from "@/lib/constants";
import { FilterBar, usePropertyFilterOptions } from "./FilterBar";
import { PropertyCarousel } from "./PropertyCarousel";

export function PropertySearchFilters({ properties }: { properties: Property[] }) {
  const [omrade, setOmrade] = useState<string | null>(null);
  const [sted, setSted] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const { townOptions, typeOptions } = usePropertyFilterOptions(properties, omrade);
  const router = useRouter();

  const goToObjekter = () => {
    const sp = new URLSearchParams();
    if (omrade) sp.set("omrade", omrade);
    if (sted) sp.set("sted", sted);
    if (type) sp.set("type", type);
    const qs = sp.toString();
    router.push(qs ? `/objekter?${qs}` : "/objekter");
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 pt-2 sm:px-6 lg:max-w-7xl">
        <div className="max-w-4xl">
          <FilterBar
            omrade={omrade}
            setOmrade={setOmrade}
            sted={sted}
            setSted={setSted}
            type={type}
            setType={setType}
            townOptions={townOptions}
            typeOptions={typeOptions}
            onCtaClick={goToObjekter}
          />
        </div>
      </div>
    </section>
  );
}

export function PropertySearchListing({ properties }: { properties: Property[] }) {
  return (
    <section
      id="boliger"
      className={`relative scroll-mt-24 w-full bg-transparent pb-10 pt-0 sm:pb-12 lg:pb-14 ${HERO_LISTING_CAROUSEL_OVERLAP_NEG}`}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:max-w-7xl">
        <PropertyCarousel properties={properties} />
      </div>
    </section>
  );
}
