import { Suspense } from "react";
import { PropertySearchFilters } from "@/components/PropertySearch";
import { getProperties } from "@/lib/getProperties";

export default async function HomePage() {
  const properties = await getProperties();

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pb-0 pt-6 sm:px-6 sm:pt-8 lg:max-w-7xl">
        <div className="max-w-3xl space-y-1">
          <h1 className="font-serif text-4xl font-medium leading-[1.12] tracking-tight text-navy">
            Finn ditt nye hjem i <span className="text-[#D7A95A]">Spania</span>
          </h1>
          <p className="max-w-xl pl-[1px] text-[1.05rem] font-[500] text-navy/80">
            Håndplukkede boliger i solrike omgivelser.
          </p>
        </div>
      </div>
      <Suspense
        fallback={
          <div
            className="flex w-full min-h-[12rem] flex-col items-center justify-center text-sm text-navy/50"
            aria-busy
          >
            Laster …
          </div>
        }
      >
        <PropertySearchFilters properties={properties} />
      </Suspense>
    </>
  );
}
