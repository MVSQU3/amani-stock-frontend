import type { RegulatoryCategory } from "../types/stock.interface";

export const REGULATORY_CATEGORIES: { value: RegulatoryCategory; label: string }[] = [
  { value: "libre", label: "Vente libre" },
  { value: "ordonnance", label: "Sur ordonnance" },
  { value: "tableau_a", label: "Tableau A" },
  { value: "tableau_b", label: "Tableau B" },
  { value: "stupefiant", label: "Stupéfiant" },
];

export const regulatoryLabel = (c: RegulatoryCategory | undefined): string =>
  REGULATORY_CATEGORIES.find((r) => r.value === c)?.label ?? "Vente libre";

// Style d'accent pour les catégories nécessitant une vigilance particulière
export const regulatoryAccent = (c: RegulatoryCategory | undefined): string =>
  c === "stupefiant" || c === "tableau_b"
    ? "text-red-300 bg-red-950/60"
    : c === "tableau_a" || c === "ordonnance"
      ? "text-amber-300 bg-amber-950/40"
      : "text-neutral-400 bg-neutral-900";
