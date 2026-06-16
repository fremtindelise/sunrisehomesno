import { SiteHeader } from "@/components/SiteHeader";

export default function WhiteHeaderLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader surface="white" />
      <main className="flex min-h-0 w-full flex-1 flex-col bg-white">
        {children}
      </main>
    </>
  );
}
