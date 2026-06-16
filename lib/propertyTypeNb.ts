/** Feed-verdier (engelsk) → norsk visningstekst. Ukjente typer returneres uendret. */
const PROPERTY_TYPE_LABELS_NB = new Map<string, string>([
  ["apartment", "Leilighet"],
  ["commercial", "Næringseiendom"],
  ["country house", "Landsted"],
  ["land", "Tomt"],
  ["ruin", "Ruin"],
  ["town house", "Rekkehus"],
  ["villa", "Villa"],
  ["village house", "Landsbyhus"],
]);

export function propertyTypeLabelNb(type: string): string {
  const key = type.trim().toLowerCase();
  return PROPERTY_TYPE_LABELS_NB.get(key) ?? type;
}
