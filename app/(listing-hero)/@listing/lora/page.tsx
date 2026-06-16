import { Suspense } from "react";
import { HomeContactCta } from "@/components/HomeContactCta";
import { HomeOmOssSection } from "@/components/HomeOmOssSection";
import { PropertySearchListing } from "@/components/PropertySearch";
import { getProperties } from "@/lib/getProperties";

export default async function LoraHomeListingParallelPage() {
  const properties = await getProperties();

  return (
    <div className="lora-headings">
      <Suspense
        fallback={
          <div
            className="flex min-h-[12rem] w-full flex-col items-center justify-center bg-page text-sm text-navy/50"
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
    </div>
  );
}
