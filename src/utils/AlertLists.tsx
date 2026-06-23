import { CheckCircle2 } from "lucide-react";
import type {
  ExpirationAlert,
  ExpirationStatus,
  LowStockItem,
} from "../types/stock.interface";

// Échelle de chaleur : ambre (bientôt) -> orange (critique) -> rouge (périmé).
export const HEAT: Record<
  ExpirationStatus,
  { border: string; dot: string; text: string; label: string }
> = {
  warning: {
    border: "border-l-amber-500",
    dot: "bg-amber-500",
    text: "text-amber-300",
    label: "Bientôt",
  },
  critical: {
    border: "border-l-orange-500",
    dot: "bg-orange-500",
    text: "text-orange-300",
    label: "Critique",
  },
  expired: {
    border: "border-l-red-600",
    dot: "bg-red-600",
    text: "text-red-300",
    label: "Périmé",
  },
};

export const expiryLabel = (d: number): string =>
  d < 0
    ? `Périmé depuis ${Math.abs(d)} j`
    : d === 0
      ? "Périme aujourd'hui"
      : `Périme dans ${d} j`;

export function Empty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center text-neutral-500">
      <CheckCircle2 size={28} className="text-emerald-500/70" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

/* ----------------------------- Liste péremption --------------------------- */
export function ExpirationList({ items }: { items: ExpirationAlert[] }) {
  if (!items.length)
    return <Empty label="Aucun produit proche de la péremption." />;
  return (
    <ul className="space-y-2.5">
      {items.map((b) => {
        const heat = HEAT[b.status];
        return (
          <li
            key={b.id}
            className={`rounded-xl border border-neutral-800 border-l-4 ${heat.border} bg-neutral-900/60 p-3.5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-neutral-100">
                  {b.Product?.name ?? "Produit"}
                </p>
                <p className="mt-0.5 font-mono text-xs text-neutral-500">
                  {b.Product?.barcode}
                </p>
              </div>
              <span
                className={`flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-950 px-2 py-1 text-xs font-medium ${heat.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${heat.dot}`} />
                {heat.label}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className={heat.text}>{expiryLabel(b.daysRemaining)}</span>
              <span className="text-neutral-400">
                {b.quantity} {b.Product?.unit ?? ""} · exp. {b.expirationDate}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------ Liste ruptures ---------------------------- */
export function LowStockList({ items }: { items: LowStockItem[] }) {
  if (!items.length)
    return (
      <Empty label="Aucune rupture. Tous les stocks sont au-dessus du seuil." />
    );
  return (
    <ul className="space-y-2.5">
      {items.map((p) => {
        const isOut = p.status === "out_of_stock";
        const accent = isOut ? "text-red-300" : "text-amber-300";
        const border = isOut ? "border-l-red-600" : "border-l-amber-500";
        const dot = isOut ? "bg-red-600" : "bg-amber-500";
        return (
          <li
            key={p.id}
            className={`rounded-xl border border-neutral-800 border-l-4 ${border} bg-neutral-900/60 p-3.5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-neutral-100">
                  {p.name}
                </p>
                <p className="mt-0.5 font-mono text-xs text-neutral-500">
                  {p.barcode}
                </p>
              </div>
              <span
                className={`flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-950 px-2 py-1 text-xs font-medium ${accent}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {isOut ? "Rupture" : "Stock bas"}
              </span>
            </div>
            <div className="mt-2 text-sm text-neutral-400">
              Reste{" "}
              <span className={`font-semibold ${accent}`}>
                {p.totalQuantity}
              </span>{" "}
              {p.unit} · seuil {p.minThreshold}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
