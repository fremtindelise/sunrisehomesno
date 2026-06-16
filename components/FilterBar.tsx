"use client";

import { useEffect, useMemo } from "react";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import {
  ArrowUpDown,
  Bath,
  BedSingle,
  ChevronDown,
  Euro,
  Home,
  MapPin,
} from "lucide-react";
import type { Property } from "@/lib/types";
import {
  matchesPropertyFilters,
  PRICE_LEVELS,
  PROPERTY_AREAS,
  propertyMatchesArea,
} from "@/lib/propertyFilters";
import { propertyTypeLabelNb } from "@/lib/propertyTypeNb";
import {
  DEFAULT_PROPERTY_SORT,
  PROPERTY_SORT_OPTIONS,
  sortProperties,
  type PropertySortId,
} from "@/lib/sortProperties";

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "nb"));
}

function plusOptionsFromMax(max: number): number[] {
  if (max < 1) return [];
  return Array.from({ length: max }, (_, i) => i + 1);
}

export function usePropertyFilterOptions(
  properties: Property[],
  areaId: string | null,
) {
  const townOptions = useMemo(() => {
    const scoped = areaId
      ? properties.filter((p) => propertyMatchesArea(p, areaId))
      : properties;
    return uniqueSorted(scoped.map((p) => p.town));
  }, [properties, areaId]);

  const typeOptions = useMemo(() => {
    const types = [...new Set(properties.map((p) => p.type).filter(Boolean))];
    types.sort((a, b) =>
      propertyTypeLabelNb(a).localeCompare(propertyTypeLabelNb(b), "nb"),
    );
    return types;
  }, [properties]);

  return { townOptions, typeOptions };
}

const urlIntReplace = parseAsInteger.withOptions({ history: "replace" });

const sortParser = parseAsStringLiteral([
  "pris-stigende",
  "pris-fallende",
  "nyeste",
] as const)
  .withDefault(DEFAULT_PROPERTY_SORT)
  .withOptions({ history: "replace" });

export function useFilteredProperties(properties: Property[]) {
  const [omrade, setOmrade] = useQueryState("omrade");
  const [sted, setSted] = useQueryState("sted");
  const [type, setType] = useQueryState("type");
  const [minSoverom, setMinSoverom] = useQueryState("soverom", urlIntReplace);
  const [minBad, setMinBad] = useQueryState("bad", urlIntReplace);
  const [pris, setPris] = useQueryState("pris");
  const [sorter, setSorter] = useQueryState("sorter", sortParser);

  const { townOptions, typeOptions } = usePropertyFilterOptions(properties, omrade);

  useEffect(() => {
    if (!sted) return;
    const ok = townOptions.some((t) => t.toLowerCase() === sted.toLowerCase());
    if (!ok) void setSted(null);
  }, [townOptions, sted, setSted]);

  const bedPlusOptions = useMemo(
    () => plusOptionsFromMax(Math.max(0, ...properties.map((p) => p.beds))),
    [properties],
  );
  const bathPlusOptions = useMemo(
    () => plusOptionsFromMax(Math.max(0, ...properties.map((p) => p.baths))),
    [properties],
  );

  const filtered = useMemo(
    () =>
      properties.filter((p) =>
        matchesPropertyFilters(p, {
          areaId: omrade,
          town: sted,
          type,
          minSoverom,
          minBad,
          priceLevelId: pris,
        }),
      ),
    [properties, omrade, sted, type, minSoverom, minBad, pris],
  );

  const sorted = useMemo(
    () => sortProperties(filtered, sorter),
    [filtered, sorter],
  );

  return {
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
    filtered,
    sorted,
    sorter,
    setSorter,
    townOptions,
    typeOptions,
  };
}

function SelectShell({
  children,
  icon: Icon,
  compact = false,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  compact?: boolean;
}) {
  return (
    <div className="relative min-h-[2.875rem] min-w-0 flex-1">
      <Icon
        className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-navy/45 ${compact ? "left-2 size-4" : "left-3"}`}
        size={compact ? 16 : 18}
        aria-hidden
      />
      <ChevronDown
        className={`pointer-events-none absolute top-1/2 z-10 size-4 -translate-y-1/2 text-navy/40 ${compact ? "right-2" : "right-3"}`}
        aria-hidden
      />
      {children}
    </div>
  );
}

function FilterField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className ?? "w-full min-w-0"}>
      <span className="mb-1 block text-xs font-medium text-navy/50">
        {label}
      </span>
      {children}
    </div>
  );
}

const selectClass =
  "h-[2.875rem] w-full min-w-0 cursor-pointer appearance-none rounded-xl border border-navy/10 bg-card py-0 text-sm font-medium text-navy outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/25";

const selectClassCompact = `${selectClass} pl-8 pr-7 text-xs sm:text-sm`;

export function FilterBar({
  omrade,
  setOmrade,
  sted,
  setSted,
  type,
  setType,
  townOptions,
  typeOptions,
  onCtaClick,
  showCta = true,
  minSoverom,
  setMinSoverom,
  minBad,
  setMinBad,
  pris,
  setPris,
  sorter,
  setSorter,
  bedPlusOptions,
  bathPlusOptions,
}: {
  omrade: string | null;
  setOmrade: (v: string | null) => void;
  sted: string | null;
  setSted: (v: string | null) => void;
  type: string | null;
  setType: (v: string | null) => void;
  townOptions: string[];
  typeOptions: string[];
  onCtaClick?: () => void;
  showCta?: boolean;
  minSoverom?: number | null;
  setMinSoverom?: (v: number | null) => void;
  minBad?: number | null;
  setMinBad?: (v: number | null) => void;
  pris?: string | null;
  setPris?: (v: string | null) => void;
  sorter?: PropertySortId;
  setSorter?: (v: PropertySortId) => void;
  bedPlusOptions?: number[];
  bathPlusOptions?: number[];
}) {
  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }
    document.getElementById("boliger")?.scrollIntoView({ behavior: "smooth" });
  };

  const showBedFilter =
    bedPlusOptions != null &&
    bedPlusOptions.length > 0 &&
    setMinSoverom != null;
  const showBathFilter =
    bathPlusOptions != null &&
    bathPlusOptions.length > 0 &&
    setMinBad != null;
  const showPriceFilter = setPris != null;
  const showSortFilter = sorter != null && setSorter != null;

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col items-stretch gap-3 pb-0.5 sm:gap-3 lg:flex-row lg:flex-nowrap lg:items-end lg:gap-2">
        <FilterField
          label="Område"
          className="w-full min-w-0 lg:min-w-0 lg:flex-[1.15]"
        >
          <SelectShell icon={MapPin}>
            <label className="sr-only" htmlFor="filter-omrade">
              Område
            </label>
            <select
              id="filter-omrade"
              className={`${selectClass} pl-10 pr-10`}
              value={omrade ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                void setOmrade(v ? v : null);
              }}
            >
              <option value="">Velg område</option>
              {PROPERTY_AREAS.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.label}
                </option>
              ))}
            </select>
          </SelectShell>
        </FilterField>

        <FilterField
          label="Sted"
          className="w-full min-w-0 lg:min-w-0 lg:flex-[1]"
        >
          <SelectShell icon={MapPin}>
            <label className="sr-only" htmlFor="filter-sted">
              Sted
            </label>
            <select
              id="filter-sted"
              className={`${selectClass} pl-10 pr-10`}
              value={sted ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                void setSted(v ? v : null);
              }}
            >
              <option value="">Velg sted</option>
              {townOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </SelectShell>
        </FilterField>

        <FilterField
          label="Boligtype"
          className="w-full min-w-0 lg:min-w-0 lg:flex-[1.1]"
        >
          <SelectShell icon={Home}>
            <label className="sr-only" htmlFor="filter-type">
              Boligtype
            </label>
            <select
              id="filter-type"
              className={`${selectClass} pl-10 pr-10`}
              value={type ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                void setType(v ? v : null);
              }}
            >
              <option value="">Velg boligtype</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {propertyTypeLabelNb(t)}
                </option>
              ))}
            </select>
          </SelectShell>
        </FilterField>

        {showBedFilter ? (
          <FilterField
            label="Soverom"
            className="w-full min-w-0 lg:w-[5.75rem] lg:flex-none lg:shrink-0"
          >
            <SelectShell icon={BedSingle} compact>
              <label className="sr-only" htmlFor="filter-soverom">
                Minimum antall soverom
              </label>
              <select
                id="filter-soverom"
                className={selectClassCompact}
                value={minSoverom ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  void setMinSoverom(v ? Number.parseInt(v, 10) : null);
                }}
              >
                <option value="">Alle</option>
                {bedPlusOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </SelectShell>
          </FilterField>
        ) : null}

        {showBathFilter ? (
          <FilterField
            label="Bad"
            className="w-full min-w-0 lg:w-[5.75rem] lg:flex-none lg:shrink-0"
          >
            <SelectShell icon={Bath} compact>
              <label className="sr-only" htmlFor="filter-bad">
                Minimum antall bad
              </label>
              <select
                id="filter-bad"
                className={selectClassCompact}
                value={minBad ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  void setMinBad(v ? Number.parseInt(v, 10) : null);
                }}
              >
                <option value="">Alle</option>
                {bathPlusOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </SelectShell>
          </FilterField>
        ) : null}

        {showPriceFilter ? (
          <FilterField
            label="Prisnivå"
            className="w-full min-w-0 lg:min-w-0 lg:flex-[1.2]"
          >
            <SelectShell icon={Euro}>
              <label className="sr-only" htmlFor="filter-pris">
                Prisnivå
              </label>
              <select
                id="filter-pris"
                className={`${selectClass} pl-10 pr-10`}
                value={pris ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  void setPris(v ? v : null);
                }}
              >
                <option value="">Velg prisnivå</option>
                {PRICE_LEVELS.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.label}
                  </option>
                ))}
              </select>
            </SelectShell>
          </FilterField>
        ) : null}

        {showSortFilter ? (
          <FilterField
            label="Sortering"
            className="w-full min-w-0 lg:min-w-0 lg:flex-[1.05]"
          >
            <SelectShell icon={ArrowUpDown}>
              <label className="sr-only" htmlFor="filter-sorter">
                Sorter boliger
              </label>
              <select
                id="filter-sorter"
                className={`${selectClass} pl-10 pr-10`}
                value={sorter}
                onChange={(e) => {
                  setSorter(e.target.value as PropertySortId);
                }}
              >
                {PROPERTY_SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </SelectShell>
          </FilterField>
        ) : null}

        {showCta ? (
          <div className="w-full shrink-0 max-sm:mt-2 max-sm:pb-2 sm:mt-0 sm:pb-0 sm:w-auto lg:flex-none">
            <span
              className="mb-1.5 hidden select-none text-xs font-medium text-transparent sm:block"
              aria-hidden
            >
              Søk
            </span>
            <button
              type="button"
              onClick={handleCta}
              className="flex h-10 w-full min-w-[6rem] items-center justify-center rounded-lg bg-navy px-4 text-[0.8125rem] font-medium leading-none text-off-white shadow-sm transition hover:bg-navy/90 active:scale-[0.99] sm:h-[2.875rem] sm:w-auto sm:rounded-xl sm:px-6 sm:text-sm sm:font-semibold"
            >
              Se boliger
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
