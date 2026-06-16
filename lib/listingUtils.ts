export function isRecentListing(
  dateStr: string | undefined,
  maxDays = 14,
): boolean {
  if (!dateStr?.trim()) return false;
  const d = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return false;
  return Date.now() - d.getTime() < maxDays * 86_400_000;
}
