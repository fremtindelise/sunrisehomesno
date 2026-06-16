"use client";

import Image, { getImageProps } from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";

const COLLAGE_MAX = 4;

/** Marks `<link rel="preload">` nodes we inject for the lightbox (cleanup on close / slide change). */
const LIGHTBOX_PRELOAD_ATTR = "data-sh-lightbox-preload";

function lightboxOptimizedSrc(remoteSrc: string): string {
  try {
    const { props } = getImageProps({
      alt: "",
      src: remoteSrc,
      fill: true,
      sizes: "100vw",
      quality: 75,
    });
    return typeof props.src === "string" ? props.src : "";
  } catch {
    return "";
  }
}

type PropertyImageGalleryProps = {
  imageUrls: string[];
  imageAltBase: string;
};

export function PropertyImageGallery({
  imageUrls,
  imageAltBase,
}: PropertyImageGalleryProps) {
  const labelId = useId();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback(
    (i: number) => {
      setIndex(Math.max(0, Math.min(i, imageUrls.length - 1)));
      setOpen(true);
    },
    [imageUrls.length],
  );

  const close = useCallback(() => setOpen(false), []);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? imageUrls.length - 1 : i - 1));
  }, [imageUrls.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= imageUrls.length - 1 ? 0 : i + 1));
  }, [imageUrls.length]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, goPrev, goNext]);

  useEffect(() => {
    const head = document.head;
    const removePreloads = () => {
      head.querySelectorAll(`link[${LIGHTBOX_PRELOAD_ATTR}]`).forEach((el) => {
        el.remove();
      });
    };

    if (!open || imageUrls.length < 2) {
      removePreloads();
      return;
    }

    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    let idleStart: number | undefined;
    let startFallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let linkNextFallback: ReturnType<typeof setTimeout> | undefined;
    let secondIdle: number | undefined;
    let secondTimer: ReturnType<typeof setTimeout> | undefined;

    const n = imageUrls.length;
    const iNext = (index + 1) % n;
    const iNext2 = (index + 2) % n;
    const hrefNext = lightboxOptimizedSrc(imageUrls[iNext]);
    if (!hrefNext) {
      removePreloads();
      return;
    }

    const appendPreload = (href: string, step: "next" | "next2") => {
      if (cancelled) return null;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      link.setAttribute(LIGHTBOX_PRELOAD_ATTR, step);
      link.setAttribute("fetchpriority", "low");
      head.appendChild(link);
      return link;
    };

    const preloadSecond = () => {
      if (cancelled) return;
      if (iNext2 === index) return;
      if (imageUrls[iNext2] === imageUrls[iNext]) return;
      const href2 = lightboxOptimizedSrc(imageUrls[iNext2]);
      if (!href2) return;
      appendPreload(href2, "next2");
    };

    const scheduleSecond = () => {
      if (cancelled) return;
      if (typeof requestIdleCallback !== "undefined") {
        secondIdle = requestIdleCallback(() => !cancelled && preloadSecond(), {
          timeout: 1200,
        });
      } else {
        secondTimer = setTimeout(() => !cancelled && preloadSecond(), 280);
      }
    };

    const startFirstPreload = () => {
      if (cancelled) return;
      removePreloads();
      const linkNext = appendPreload(hrefNext, "next");
      if (!linkNext) return;

      let secondStarted = false;
      const kickSecond = () => {
        if (secondStarted || cancelled) return;
        secondStarted = true;
        clearTimeout(linkNextFallback);
        scheduleSecond();
      };

      linkNext.addEventListener("load", kickSecond, { once: true });
      linkNext.addEventListener("error", kickSecond, { once: true });
      linkNextFallback = setTimeout(kickSecond, 900);
    };

    const deferStart = () => {
      if (cancelled) return;
      if (typeof requestIdleCallback !== "undefined") {
        idleStart = requestIdleCallback(
          () => !cancelled && startFirstPreload(),
          {
            timeout: 600,
          },
        );
      } else {
        startFallbackTimer = setTimeout(
          () => !cancelled && startFirstPreload(),
          220,
        );
      }
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => deferStart());
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (
        idleStart !== undefined &&
        typeof cancelIdleCallback !== "undefined"
      ) {
        cancelIdleCallback(idleStart);
      }
      clearTimeout(startFallbackTimer);
      clearTimeout(linkNextFallback);
      if (
        secondIdle !== undefined &&
        typeof cancelIdleCallback !== "undefined"
      ) {
        cancelIdleCallback(secondIdle);
      }
      clearTimeout(secondTimer);
      removePreloads();
    };
  }, [open, index, imageUrls]);

  if (imageUrls.length === 0) return null;

  const preview = imageUrls.slice(0, COLLAGE_MAX);
  const extraCount = imageUrls.length - COLLAGE_MAX;
  const showMoreBadge = extraCount > 0;
  const showSeeAllButton = imageUrls.length >= 2;

  return (
    <div className="space-y-3">
      <div
        className={
          preview.length === 1
            ? "relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-navy/5"
            : preview.length === 2
              ? "grid grid-cols-2 gap-2 sm:gap-3"
              : "grid aspect-[4/3] w-full grid-cols-2 grid-rows-2 gap-2 sm:gap-3"
        }
      >
        {preview.length === 1 ? (
          <button
            type="button"
            onClick={() => openAt(0)}
            className="relative block h-full w-full cursor-zoom-in outline-none ring-navy/30 focus-visible:ring-2"
            aria-label="Åpne alle bilder"
          >
            <Image
              src={preview[0]}
              alt={`${imageAltBase} 1`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </button>
        ) : null}

        {preview.length === 2
          ? preview.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => openAt(i)}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy/5 outline-none ring-navy/30 focus-visible:ring-2"
                aria-label={`Åpne bildegalleri, bilde ${i + 1}`}
              >
                <Image
                  src={url}
                  alt={`${imageAltBase} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 448px"
                  priority={i === 0}
                />
              </button>
            ))
          : null}

        {preview.length >= 3
          ? preview.map((url, i) => {
              const isLastInCollage = i === COLLAGE_MAX - 1;
              const showOverlay = showMoreBadge && isLastInCollage;
              const spanTallLeft = preview.length === 3 && i === 0;
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => openAt(i)}
                  className={`relative overflow-hidden rounded-xl bg-navy/5 outline-none ring-navy/30 focus-visible:ring-2 ${
                    spanTallLeft ? "row-span-2" : ""
                  }`}
                  aria-label={`Åpne bildegalleri, bilde ${i + 1}`}
                >
                  <Image
                    src={url}
                    alt={`${imageAltBase} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes={
                      i === 0
                        ? "(max-width: 1024px) 50vw, 448px"
                        : "(max-width: 1024px) 50vw, 224px"
                    }
                    priority={i === 0}
                  />
                  {showOverlay ? (
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-navy/55 text-lg font-semibold text-white backdrop-blur-[2px]"
                      aria-hidden
                    >
                      +{extraCount}
                    </span>
                  ) : null}
                </button>
              );
            })
          : null}
      </div>

      {showSeeAllButton ? (
        <button
          type="button"
          onClick={() => openAt(0)}
          className="w-full rounded-lg border border-navy/15 bg-card px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-off-white/80"
        >
          Se alle bilder ({imageUrls.length})
        </button>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
        >
          <button
            type="button"
            className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[6px]"
            aria-label="Lukk galleri"
            onClick={close}
          />
          <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col">
            <div className="pointer-events-auto flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p id={labelId} className="text-sm font-medium text-navy/85">
                Bilde {index + 1} av {imageUrls.length}
              </p>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-2 text-navy/80 transition hover:bg-navy/8"
                aria-label="Lukk"
              >
                <X className="size-6" strokeWidth={1.75} />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-10">
              <button
                type="button"
                onClick={goPrev}
                className="pointer-events-auto absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/55 p-2.5 text-navy backdrop-blur-sm transition hover:bg-white/75 sm:left-4"
                aria-label="Forrige bilde"
              >
                <ChevronLeft className="size-7" strokeWidth={1.75} />
              </button>

              <div className="pointer-events-auto relative h-full w-full max-h-[min(78vh,900px)] max-w-[min(96vw,1200px)]">
                <Image
                  key={imageUrls[index]}
                  src={imageUrls[index]}
                  alt={`${imageAltBase} ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              <button
                type="button"
                onClick={goNext}
                className="pointer-events-auto absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/55 p-2.5 text-navy backdrop-blur-sm transition hover:bg-white/75 sm:right-4"
                aria-label="Neste bilde"
              >
                <ChevronRight className="size-7" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
