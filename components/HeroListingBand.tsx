import type { ReactNode } from "react";

type HeroListingBandProps = {
  children: ReactNode;
  className?: string;
};

export function HeroListingBand({ children, className = "" }: HeroListingBandProps) {
  return (
    <div className={`hero-listing-band ${className}`.trim()}>
      <div className="hero-listing-band__inner">{children}</div>
    </div>
  );
}
