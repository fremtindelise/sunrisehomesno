"use client";

import { usePathname } from "next/navigation";

export const SITE_EMAIL = "post@sunrisehomes.no";
export const SITE_PHONE = "+47 405 14 285";
export const SITE_PHONE_HREF = "+4740514285";
export const SITE_ADDRESS = "Haugerudbråtan 17, 3408 Tranby";
export const SITE_ORG_NUMBER = "929380797";

function isWhiteHeaderPath(pathname: string): boolean {
  return /^\/objekter\/.+/.test(pathname);
}

export function SiteFooter() {
  const pathname = usePathname();
  const white = isWhiteHeaderPath(pathname);
  const year = new Date().getFullYear();

  const shell = white
    ? "mt-auto w-full bg-white py-10 text-navy/70"
    : "mt-auto w-full bg-hero py-10 text-navy/70";

  const inner = white
    ? "mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 text-sm sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:max-w-5xl"
    : "mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 text-sm sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:max-w-7xl";

  return (
    <footer className={shell}>
      <div className={inner}>
        <p className="font-medium text-navy">© {year} Sunrise Homes</p>
        <div className="flex flex-col gap-1 sm:text-right">
          <p>
            Epost:{" "}
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="text-navy underline-offset-2 hover:underline"
            >
              {SITE_EMAIL}
            </a>
          </p>
          <p>
            Telefon:{" "}
            <a
              href={`tel:${SITE_PHONE_HREF}`}
              className="tabular-nums text-navy underline-offset-2 hover:underline"
            >
              {SITE_PHONE}
            </a>
          </p>
          <p>
            Adresse: <span className="text-navy">{SITE_ADDRESS}</span>
          </p>
          <p>
            Org.nr:{" "}
            <span className="tabular-nums text-navy">{SITE_ORG_NUMBER}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
