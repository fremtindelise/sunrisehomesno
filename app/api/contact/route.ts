import { NextResponse } from "next/server";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function singleLine(s: string, max: number): string {
  return s.replace(/[\r\n]+/g, " ").slice(0, max);
}

function temEnv() {
  const secretKey =
    process.env.SCALEWAY_TEM_SECRET_KEY?.trim() ||
    process.env.SCW_SECRET_KEY?.trim();
  const projectId =
    process.env.SCALEWAY_TEM_PROJECT_ID?.trim() ||
    process.env.SCW_PROJECT_ID?.trim();
  const region =
    process.env.SCALEWAY_TEM_REGION?.trim() || "fr-par";
  const fromEmail = process.env.SCALEWAY_TEM_FROM_EMAIL?.trim();
  const fromName = process.env.SCALEWAY_TEM_FROM_NAME?.trim() || "Sunrise Homes";
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  return {
    secretKey,
    projectId,
    region,
    fromEmail,
    fromName,
    toEmail,
  };
}

async function sendViaScalewayTem(params: {
  secretKey: string;
  projectId: string;
  region: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; status: number; detail: string }> {
  const {
    secretKey,
    projectId,
    region,
    fromEmail,
    fromName,
    toEmail,
    name,
    email,
    message,
  } = params;

  const subject = singleLine(
    `Kontaktskjema – henvendelse fra ${name}`,
    200,
  );
  const text = `Navn: ${name}\nE-post: ${email}\n\n${message}`;

  const url = `https://api.scaleway.com/transactional-email/v1alpha1/regions/${encodeURIComponent(region)}/emails`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Auth-Token": secretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: {
        name: singleLine(fromName, 100),
        email: fromEmail,
      },
      to: [
        {
          name: "Sunrise Homes",
          email: toEmail,
        },
      ],
      subject,
      project_id: projectId,
      text,
      additional_headers: [
        {
          key: "Reply-To",
          value: singleLine(email, 254),
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return { ok: false, status: res.status, detail };
  }

  return { ok: true };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const honeypot =
    typeof o.website === "string" ? o.website.trim() : "";
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = typeof o.name === "string" ? o.name.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const message = typeof o.message === "string" ? o.message.trim() : "";

  if (!name || name.length > MAX_NAME) {
    return NextResponse.json(
      { error: "Navn er påkrevd og kan ikke overstige 120 tegn." },
      { status: 400 },
    );
  }
  if (!email || email.length > MAX_EMAIL || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Gyldig e-postadresse er påkrevd." },
      { status: 400 },
    );
  }
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: "Melding er påkrevd og kan ikke overstige 5000 tegn." },
      { status: 400 },
    );
  }

  const {
    secretKey,
    projectId,
    region,
    fromEmail,
    fromName,
    toEmail,
  } = temEnv();

  const configured = Boolean(
    secretKey && projectId && fromEmail && toEmail,
  );

  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Kontaktskjemaet er ikke ferdig konfigurert. Ta kontakt på annen måte inntil videre.",
        },
        { status: 503 },
      );
    }
    console.info("[contact] Utvikling: e-post ikke konfigurert.", {
      name,
      email,
      messagePreview: message.slice(0, 200),
    });
    return NextResponse.json({ ok: true, simulated: true });
  }

  const result = await sendViaScalewayTem({
    secretKey: secretKey!,
    projectId: projectId!,
    region,
    fromEmail: fromEmail!,
    fromName: fromName || "Sunrise Homes",
    toEmail: toEmail!,
    name,
    email,
    message,
  });

  if (!result.ok) {
    console.error("[contact] Scaleway TEM:", result.status, result.detail);
    return NextResponse.json(
      { error: "Meldingen kunne ikke sendes akkurat nå. Prøv igjen litt senere." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
