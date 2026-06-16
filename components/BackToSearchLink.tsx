"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowLeft } from "lucide-react";

export const LAST_SEARCH_STORAGE_KEY = "sunrise:last-search-url";

const FALLBACK_HREF = "/objekter";

function isValidSearchHref(value: string | null): value is string {
  return value != null && value.startsWith("/objekter");
}

export function rememberSearchUrl(url: string): void {
  if (typeof window === "undefined") return;
  if (!isValidSearchHref(url)) return;
  try {
    window.sessionStorage.setItem(LAST_SEARCH_STORAGE_KEY, url);
  } catch {}
}

function readSavedHref(): string {
  if (typeof window === "undefined") return FALLBACK_HREF;
  try {
    const saved = window.sessionStorage.getItem(LAST_SEARCH_STORAGE_KEY);
    if (isValidSearchHref(saved)) return saved;
  } catch {}
  return FALLBACK_HREF;
}

function subscribeToSearchHref(): () => void {
  return () => {};
}

function getServerSearchHref(): string {
  return FALLBACK_HREF;
}

export function BackToSearchLink() {
  const href = useSyncExternalStore(
    subscribeToSearchHref,
    readSavedHref,
    getServerSearchHref,
  );

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-mid underline-offset-2 hover:underline"
    >
      <ArrowLeft className="size-4" aria-hidden />
      Tilbake til søk
    </Link>
  );
}
