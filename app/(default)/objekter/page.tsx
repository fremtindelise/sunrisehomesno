import type { Metadata } from "next";
import { Suspense } from "react";
import { ObjekterClient } from "@/components/ObjekterClient";
import { getProperties } from "@/lib/getProperties";

export const metadata: Metadata = {
  title: "Boliger",
  description:
    "Se boliger til salgs med filter for område, sted, boligtype og pris.",
};

export default async function ObjekterPage() {
  const properties = await getProperties();

  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[16rem] w-full flex-1 flex-col items-center justify-center px-4 text-sm text-navy/50"
          aria-busy
        >
          Laster …
        </div>
      }
    >
      <ObjekterClient properties={properties} />
    </Suspense>
  );
}
