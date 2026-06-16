import { Suspense } from "react";
import { HomeContactCta } from "@/components/HomeContactCta";
import { HomeOmOssSection } from "@/components/HomeOmOssSection";
import { PropertySearchListing } from "@/components/PropertySearch";
import { getProperties } from "@/lib/getProperties";

export default async function HomeListingParallelPage() {
  const properties = await getProperties();
  return (
    <>
      <Suspense
        fallback={
          <div
            className="flex w-full min-h-[12rem] flex-col items-center justify-center bg-page text-sm text-navy/50"
            aria-busy
          >
            Laster …
          </div>
        }
      >
        <PropertySearchListing properties={properties} />
      </Suspense>
      <HomeOmOssSection />
      <HomeContactCta />
    </>
  );
}
