"use client";

import { useId, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function HomeContactCta() {
  const formId = useId();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setStatus("submitting");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const website = String(fd.get("website") ?? "").trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const data: unknown = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Noe gikk galt. Prøv igjen.";
        setErrorMessage(msg);
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Nettverksfeil. Sjekk tilkoblingen og prøv igjen.");
      setStatus("error");
    }
  }

  return (
    <section
      id="kontakt"
      className="bg-hero text-navy"
      aria-labelledby={`${formId}-kontakt-heading`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:max-w-7xl">
        <div className="mx-auto max-w-lg lg:mx-0">
          <h2
            id={`${formId}-kontakt-heading`}
            className="font-serif text-2xl font-medium tracking-tight sm:text-3xl"
          >
            Ta kontakt
          </h2>
          <p className="mt-3 text-base leading-relaxed text-navy/80 sm:text-lg">
            Interesert i en bolig, har du spørsmål eller er du rett og slett
            bare litt nysgjerrig? Ikke nøl med å ta kontakt – helt uforpliktende
            så klart.
          </p>

          {status === "success" ? (
            <div className="mt-8 space-y-4">
              <p
                className="rounded-xl border border-navy/10 bg-card/90 px-4 py-4 text-sm font-medium text-navy shadow-sm"
                role="status"
              >
                Takk – meldingen er sendt. Vi tar kontakt så snart vi kan.
              </p>
              <button
                type="button"
                className="text-sm font-semibold text-navy underline-offset-2 hover:underline"
                onClick={() => {
                  setStatus("idle");
                  setErrorMessage(null);
                }}
              >
                Send en ny melding
              </button>
            </div>
          ) : (
            <>
              <p className="mt-6 text-sm leading-relaxed text-navy/75 sm:text-[0.95rem]">
                Fyll ut skjemaet eller send en e-post til{" "}
                <a
                  href="mailto:post@sunrisehomes.no"
                  className="font-semibold text-gold-mid underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-hero"
                >
                  post@sunrisehomes.no
                </a>
                .
              </p>
              <form
                className="relative mt-6 space-y-4"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="pointer-events-none absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden opacity-0">
                  <label htmlFor={`${formId}-website`}>Nettsted</label>
                  <input
                    id={`${formId}-website`}
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-name`}
                    className="mb-1.5 block text-xs font-medium text-navy/50"
                  >
                    Navn
                  </label>
                  <input
                    id={`${formId}-name`}
                    name="name"
                    type="text"
                    required
                    maxLength={120}
                    autoComplete="name"
                    className="w-full rounded-xl border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy outline-none transition placeholder:text-navy/40 focus:border-gold/50 focus:ring-2 focus:ring-gold/25"
                    placeholder="Ditt navn"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-email`}
                    className="mb-1.5 block text-xs font-medium text-navy/50"
                  >
                    E-post
                  </label>
                  <input
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    className="w-full rounded-xl border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy outline-none transition placeholder:text-navy/40 focus:border-gold/50 focus:ring-2 focus:ring-gold/25"
                    placeholder="din@epost.no"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-message`}
                    className="mb-1.5 block text-xs font-medium text-navy/50"
                  >
                    Melding
                  </label>
                  <textarea
                    id={`${formId}-message`}
                    name="message"
                    required
                    maxLength={5000}
                    rows={4}
                    className="w-full resize-y rounded-xl border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy outline-none transition placeholder:text-navy/40 focus:border-gold/50 focus:ring-2 focus:ring-gold/25"
                    placeholder="Skriv gjerne kort hva du lurer på …"
                  />
                </div>

                {status === "error" && errorMessage ? (
                  <p className="text-sm font-medium text-red-800" role="alert">
                    {errorMessage}
                  </p>
                ) : null}

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex min-h-[2.875rem] w-full items-center justify-center rounded-xl bg-navy px-6 text-sm font-semibold text-off-white shadow-sm transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {status === "submitting" ? "Sender …" : "Send melding"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
