// Montants en francs CFA (Afrique de l'Ouest)
export const fcfa = (n: number): string =>
  `${Math.round(n).toLocaleString("fr-FR")} FCFA`;