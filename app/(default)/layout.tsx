import { SiteHeader } from "@/components/SiteHeader";

export default function DefaultLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader surface="hero" />
      <main className="flex min-h-0 w-full flex-1 flex-col bg-page">
        {children}
      </main>
    </>
  );
}
