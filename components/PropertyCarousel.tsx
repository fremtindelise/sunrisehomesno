"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import type { Property } from "@/lib/types";
import { PropertyCard, CAROUSEL_THUMB_SIZES } from "./PropertyCard";

export function PropertyCarousel({ properties }: { properties: Property[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null);

  const scrollNext = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const delta = card ? card.getBoundingClientRect().width + 24 : 320;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (properties.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-navy/15 bg-card/80 px-6 py-14 text-center text-sm text-navy/60">
        Ingen boliger matcher filtrene. Prøv å tilbakestille eller velge andre
        kriterier.
      </p>
    );
  }

  return (
    <div className="relative">
      <ul
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Boliger"
      >
        {properties.map((p) => (
          <li
            key={p.compositeId}
            className="w-[min(100%,18.5rem)] shrink-0 snap-start sm:w-[20rem]"
          >
            <PropertyCard property={p} imageSizes={CAROUSEL_THUMB_SIZES} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-0 top-1/2 z-20 hidden size-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-off-white shadow-md transition hover:bg-navy/90 md:flex"
        aria-label="Scroll til neste boliger"
      >
        <ChevronRight className="size-5" strokeWidth={2.25} />
      </button>
    </div>
  );
}
