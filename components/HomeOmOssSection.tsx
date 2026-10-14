import Image from "next/image";

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
            <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-navy/75 md:mt-8">
              <p>
                Sunrise Homes er et norsk selskap som bistår nordmenn med å
                finne den perfekte boligen i Spania gjennom trygg, etablert og
                anerkjent samarbeidspartner i Costa Blanca Nord, spesielt i
                områder rundt Albir, Alfaz del Pi, Altea, Benidorm, Finestrat,
                La Nucia, Polop og nærliggende kyst- og innlandsbyer.
              </p>
              <p>
                Likeledes hjelper vi nordmenn med å finne den perfekte boligen
                gjennom trygg, etablert og anerkjent samarbeidspartner som
                opererer hovedsakelig langs kysten av Almeria i Sørøst- Spania
                blant annet i områder rundt Mojacar Playa, San Juan de los
                Terreros, Vera Playa, samt nærliggende kystnære soner i
                Mojacar-området.
              </p>
              <p>
                Sunrise Homes er registrert som foretak i Brønnøysundregistrene,
                og vår rolle er å være din norske kontaktperson gjennom hele
                prosessen. Innehaver av Sunrise Homes har hatt egen bolig i
                Mojácar siden 2003 og kjenner derfor dette området spesielt
                godt.
              </p>
              <p className="mt-3 text-lg font-medium text-navy/90 sm:text-xl">
                Formidling av eiendom på solens kyst
              </p>
              <p>
                Med rundt 320 soldager i året velger vi å kalle våre kystområder
                i Spania nettopp dette.
              </p>
              <p>
                Vi samarbeider som anført med lokale eiendomsmeglerbyråer i
                Spania som har lang erfaring og solide internasjonale
                porteføljer. Når vi formidler en bolig som blir solgt, mottar
                Sunrise Homes en andel av den lokale eiendomsmeglerbyråets
                provisjon.
              </p>
              <p className="mt-3 text-lg font-medium text-navy/90 sm:text-xl">
                Vårt mål
              </p>
              <p>
                Å gjøre boligkjøp i Spania trygt, enkelt og oversiktlig for
                norske kjøpere – uansett om du ser etter feriebolig, investering
                eller et sted å bo store deler av året. Vi kan også formidle
                utleieavtale for hel eller delvis finansiering av investeringen
                din.
              </p>
              <p className="mt-3 text-lg font-medium text-navy/90 sm:text-xl">
                Hvorfor velge oss?
              </p>
              <ul>
                <li>- Norsk kontaktperson</li>
                <li>- Ingen ekstra kostnader</li>
                <li>- Tilgang til lokal ekspertise</li>
                <li>- Personlig oppfølging</li>
                <li>- Trygg og ryddig prosess</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
