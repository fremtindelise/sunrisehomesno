"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { Property } from "@/lib/types";
import { FilterBar, useFilteredProperties } from "@/components/FilterBar";
import { PropertyGrid } from "@/components/PropertyGrid";
import { rememberSearchUrl } from "@/components/BackToSearchLink";

export function ObjekterClient({
  properties,
  title = "Boligobjekter",
  description = "",
  searchBasePath = "/objekter",
}: {
  properties: Property[];
  title?: string;
  description?: string;
  searchBasePath?: string;
}) {
  const {
    omrade,
    setOmrade,
    sted,
    setSted,
    type,
    setType,
    minSoverom,
    setMinSoverom,
    minBad,
    setMinBad,
    pris,
    setPris,
    bedPlusOptions,
    bathPlusOptions,
    sorted,
    sorter,
    setSorter,
    townOptions,
    typeOptions,
  } = useFilteredProperties(properties);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname !== searchBasePath) return;
    const qs = searchParams.toString();
    rememberSearchUrl(qs ? `${searchBasePath}?${qs}` : searchBasePath);
  }, [pathname, searchBasePath, searchParams]);

  return (
    <>
      <div className="bg-hero">
        <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:max-w-7xl">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-navy sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-[1.05rem] text-navy/80">
            {description}
          </p>
          <div className="mt-8 w-full">
            <FilterBar
              omrade={omrade}
              setOmrade={setOmrade}
              sted={sted}
              setSted={setSted}
              type={type}
              setType={setType}
              townOptions={townOptions}
              typeOptions={typeOptions}
              showCta={false}
              minSoverom={minSoverom}
              setMinSoverom={setMinSoverom}
              minBad={minBad}
              setMinBad={setMinBad}
              pris={pris}
              setPris={setPris}
              sorter={sorter}
              setSorter={(value) => void setSorter(value)}
              bedPlusOptions={bedPlusOptions}
              bathPlusOptions={bathPlusOptions}
            />
          </div>
          {omrade === "blanca-nord" ? (
            <p className="mx-auto mt-6 w-full max-w-7xl px-4 text-navy sm:px-6">
              Costa Blanca, som betyr «den hvite kysten», strekker seg fra Denia
              i nord, til Orihuela Costa i sør og har et av Europas beste klima,
              som er ideelt for utendørsaktiviteter året rundt. I et område på
              Costa Blanca Nord er vi heldige som er omgitt av svært vakre
              fjell, noe som resulterer i et enda bedre klima som vi kaller et
              «mikroklima». Sommertemperaturene varierer mellom 25 °C og 35 °C,
              mens vintertemperaturene er fra 5 °C til 20 °C, og det er omtrent
              320 soldager per år.
            </p>
          ) : null}

        </section>

        <section
          id="boliger"
          className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pb-14 pt-10 sm:px-6 lg:max-w-7xl"
        >
          <PropertyGrid properties={sorted} />
        </section>
      </div>
    </>
  );
}
