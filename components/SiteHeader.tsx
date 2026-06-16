"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useSyncExternalStore, type ComponentProps } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { objekterHrefForArea, PROPERTY_AREAS } from "@/lib/propertyFilters";

const nav = [
  {
    href: "/",
    label: "Hjem",
    match: (p: string, hash: string) => p === "/" && hash !== "#om-oss",
  },
  {
    href: "/#om-oss",
    label: "Om",
    match: (p: string, hash: string) => p === "/" && hash === "#om-oss",
  },
  {
    href: "/objekter",
    label: "Boligobjekter",
    match: (p: string) => p === "/objekter" || p.startsWith("/objekter/"),
    children: PROPERTY_AREAS.map((area) => ({
      href: objekterHrefForArea(area.id),
      label: area.label,
      areaId: area.id,
    })),
  },
] as const;

function subscribeToLocationHash(onStoreChange: () => void): () => void {
  const notify = () => onStoreChange();

  window.addEventListener("hashchange", notify);
  window.addEventListener("popstate", notify);

  const onDocumentClick = (event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest("a");
    if (!anchor?.href) return;
    try {
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;
      requestAnimationFrame(notify);
    } catch {}
  };
  document.addEventListener("click", onDocumentClick, true);

  const { pushState, replaceState } = history;
  history.pushState = function (...args) {
    pushState.apply(this, args);
    notify();
  };
  history.replaceState = function (...args) {
    replaceState.apply(this, args);
    notify();
  };

  return () => {
    window.removeEventListener("hashchange", notify);
    window.removeEventListener("popstate", notify);
    document.removeEventListener("click", onDocumentClick, true);
    history.pushState = pushState;
    history.replaceState = replaceState;
  };
}

function getHashSnapshot(): string {
  return window.location.hash;
}

function getServerHashSnapshot(): string {
  return "";
}

function useCurrentHash(): string {
  return useSyncExternalStore(
    subscribeToLocationHash,
    getHashSnapshot,
    getServerHashSnapshot,
  );
}

function NavLink({
  href,
  label,
  active,
  hasChildren = false,
}: {
  href: string;
  label: string;
  active: boolean;
  hasChildren?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative inline-flex items-center gap-1 pb-0.5 text-xs font-medium transition-colors sm:text-sm ${
        active ? "text-navy" : "text-navy/60 hover:text-navy"
      }`}
    >
      {label}
      {hasChildren ? <ChevronDown className="size-3" aria-hidden /> : null}
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gold" />
      ) : null}
    </Link>
  );
}

function isObjekterAreaActive(
  pathname: string,
  omrade: string | null,
  areaId: string,
): boolean {
  return pathname === "/objekter" && omrade === areaId;
}

function NavItem({
  item,
  pathname,
  hash,
  omrade,
}: {
  item: (typeof nav)[number];
  pathname: string;
  hash: string;
  omrade: string | null;
}) {
  const children = "children" in item ? item.children : undefined;

  if (!children) {
    return (
      <NavLink
        href={item.href}
        label={item.label}
        active={item.match(pathname, hash)}
      />
    );
  }

  return (
    <div className="group relative">
      <NavLink
        href={item.href}
        label={item.label}
        active={item.match(pathname, hash)}
        hasChildren
      />
      <div className="pointer-events-none absolute right-0 top-full z-30 w-44 max-w-[calc(100vw-1.5rem)] pt-3 opacity-0 transition group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="rounded-2xl bg-white p-2 shadow-lg ring-1 ring-navy/10">
          {children.map((child) => {
            const childActive =
              "areaId" in child &&
              isObjekterAreaActive(pathname, omrade, child.areaId);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                  childActive
                    ? "bg-gold/15 text-navy"
                    : "text-navy/65 hover:bg-navy/5 hover:text-navy"
                }`}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileNav({
  pathname,
  hash,
  omrade,
}: {
  pathname: string;
  hash: string;
  omrade: string | null;
}) {
  return (
    <nav className="flex min-w-0 shrink items-center justify-end gap-3 text-[0.72rem] min-[380px]:gap-4 min-[1100px]:hidden">
      {nav.map((item) => {
        const children = "children" in item ? item.children : undefined;

        if (!children) {
          return (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={item.match(pathname, hash)}
            />
          );
        }

        const active = item.match(pathname, hash);

        return (
          <details key={item.href} className="group relative">
            <summary
              className={`relative flex cursor-pointer list-none items-center gap-0.5 pb-0.5 font-medium transition-colors [&::-webkit-details-marker]:hidden ${
                active ? "text-navy" : "text-navy/60 hover:text-navy"
              }`}
            >
              {item.label}
              <ChevronDown
                className="size-3 transition group-open:rotate-180"
                aria-hidden
              />
              {active ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gold" />
              ) : null}
            </summary>
            <div className="absolute right-0 top-full z-30 w-44 max-w-[calc(100vw-1.5rem)] pt-3">
              <div className="rounded-2xl bg-white p-2 shadow-lg ring-1 ring-navy/10">
                <Link
                  href={item.href}
                  className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                    pathname === item.href && !omrade
                      ? "bg-gold/15 text-navy"
                      : "text-navy/65 hover:bg-navy/5 hover:text-navy"
                  }`}
                >
                  Alle boligobjekter
                </Link>
                {children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                      "areaId" in child &&
                      isObjekterAreaActive(pathname, omrade, child.areaId)
                        ? "bg-gold/15 text-navy"
                        : "text-navy/65 hover:bg-navy/5 hover:text-navy"
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          </details>
        );
      })}
    </nav>
  );
}

function SiteHeaderBody({
  className = "",
  surface = "hero",
  omrade,
}: {
  className?: string;
  surface?: "hero" | "white";
  omrade: string | null;
}) {
  const pathname = usePathname();
  const hash = useCurrentHash();
  const headerBg = surface === "white" ? "bg-white" : "bg-hero";
  const logoRingOffset =
    surface === "white"
      ? "focus-visible:ring-offset-white"
      : "focus-visible:ring-offset-hero";

  return (
    <header className={`w-full ${headerBg} ${className}`.trim()}>
      <div className="flex w-full items-center justify-between gap-3 px-4 pb-3 pt-5 sm:px-4 sm:pt-7 lg:gap-6 lg:pb-2 min-[1700px]:gap-8 min-[1700px]:px-16 min-[1700px]:pt-8">
        <Link
          href="/"
          className={`relative inline-flex shrink-0 self-start pl-1 outline-none ring-gold/40 focus-visible:ring-2 focus-visible:ring-offset-2 min-[1300px]:pl-5 ${logoRingOffset}`}
        >
          <Image
            src="/logo-sunrise-homes.png"
            alt="Sunrise Homes"
            width={777}
            height={321}
            className="h-7 w-auto sm:h-10 lg:h-11 xl:h-12"
            priority
          />
        </Link>
        <nav className="hidden min-w-0 shrink-0 items-center min-[1100px]:flex min-[1100px]:gap-8 min-[1700px]:-translate-x-[150px] min-[1700px]:gap-10">
          {nav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              pathname={pathname}
              hash={hash}
              omrade={omrade}
            />
          ))}
        </nav>
        <MobileNav pathname={pathname} hash={hash} omrade={omrade} />
      </div>
    </header>
  );
}

function SiteHeaderWithOmrade(
  props: Omit<ComponentProps<typeof SiteHeaderBody>, "omrade">,
) {
  const omrade = useSearchParams().get("omrade");
  return <SiteHeaderBody {...props} omrade={omrade} />;
}

export function SiteHeader(
  props: Omit<ComponentProps<typeof SiteHeaderBody>, "omrade">,
) {
  return (
    <Suspense fallback={<SiteHeaderBody {...props} omrade={null} />}>
      <SiteHeaderWithOmrade {...props} />
    </Suspense>
  );
}
