import { HeroListingBand } from "@/components/HeroListingBand";
import { SiteHeader } from "@/components/SiteHeader";
import { HERO_LISTING_CAROUSEL_OVERLAP_H } from "@/lib/constants";

export default function ListingHeroLayout({
  children,
  listing,
}: Readonly<{
  children: React.ReactNode;
  listing: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-page">
      <HeroListingBand className="flex w-full flex-col">
        <SiteHeader className="relative z-20 bg-transparent shadow-none" />
        <div className="relative z-10 flex w-full flex-col">
          {children}
          <div
            className={`${HERO_LISTING_CAROUSEL_OVERLAP_H} shrink-0`}
            aria-hidden
          />
        </div>
      </HeroListingBand>
      {listing}
    </div>
  );
}
