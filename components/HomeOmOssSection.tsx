import Image from "next/image";

function OmOssFigure({ className }: { className?: string }) {
  return (
    <figure
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-navy/8 ${className ?? ""}`}
    >
      <Image
        src="/om-oss-sunrise.png"
        alt="Soloppgang over fjellandskap"
        fill
        className="object-cover object-center"
        sizes="(max-width: 767px) 360px, 280px"
      />
    </figure>
  );
}

export function HomeOmOssSection() {
  return (
    <section
      id="om-oss"
      className="scroll-mt-28 bg-page"
      aria-labelledby="om-oss-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
          <div className="min-w-0 flex-1 md:max-w-3xl">
            <h2
              id="om-oss-heading"
              className="font-serif text-3xl font-medium tracking-tight text-navy sm:text-[2rem]"
            >
              Om oss
            </h2>
            <p className="mt-3 text-lg font-medium text-navy/90 sm:text-xl">
              Formidling av eiendom på solens kyst
            </p>
            <div className="mx-auto mt-8 max-w-sm md:hidden">
              <OmOssFigure />
            </div>
            <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-navy/75 md:mt-8">
              <p>
                Med 320 soldager i året velger vi å kalle Spanias østkyst
                nettopp dette.
              </p>
              <p>
                Vi er et norsk selskap som samarbeider med seriøse
                eiendomsmeglere i Mojácar som tilbyr boliger, samt småbruk og
                tomter for kjøp. Innehaver av Sunrise Homes har forøvrig hatt
                egen leilighet i Mojácar siden 2003 og kjenner derfor området
                meget godt.
              </p>
              <p>
                Vi ønsker norske kunder hjertelig velkommen til dette
                fantastiske området som omtales som «The Real Spain» og «A Place
                In The Sun».
              </p>
            </div>
          </div>
          <div className="mx-auto hidden w-full max-w-[17.5rem] shrink-0 md:mx-0 md:block md:max-w-[20rem]">
            <OmOssFigure />
          </div>
        </div>
      </div>
    </section>
  );
}
