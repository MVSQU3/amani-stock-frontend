import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  CalendarClock,
  PackageX,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { axiosClient } from "../api/axiosClient";
import type {
  ApiResponse,
  ExpirationAlert,
  ExpirationStatus,
  LowStockItem,
} from "../types/stock.interface";

type Tab = "expiration" | "low";

// Échelle de chaleur : ambre (bientôt) -> orange (critique) -> rouge (périmé).
const HEAT: Record<
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

const expiryLabel = (d: number): string =>
  d < 0
    ? `Périmé depuis ${Math.abs(d)} j`
    : d === 0
      ? "Périme aujourd'hui"
      : `Périme dans ${d} j`;

export default function Alerts(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>("expiration");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expiration, setExpiration] = useState<ExpirationAlert[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [exp, low] = await Promise.all([
        axiosClient.get<ApiResponse<ExpirationAlert[]>>(
          "/stock/alerts/expiration",
        ),
        axiosClient.get<ApiResponse<LowStockItem[]>>("/stock/alerts/low-stock"),
      ]);
      setExpiration(exp.data.data);
      setLowStock(low.data.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Impossible de charger les alertes.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-5 text-neutral-100">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Alertes</h1>
          <button
            onClick={load}
            className="rounded-lg bg-neutral-900 p-2 text-neutral-400 hover:text-neutral-200"
            aria-label="Rafraîchir"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Onglets */}
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-neutral-900 p-1">
          <button
            onClick={() => setTab("expiration")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
              tab === "expiration"
                ? "bg-neutral-800 text-neutral-100"
                : "text-neutral-400"
            }`}
          >
            <CalendarClock size={16} /> Péremption
            {expiration.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-xs font-semibold text-neutral-950">
                {expiration.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("low")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
              tab === "low"
                ? "bg-neutral-800 text-neutral-100"
                : "text-neutral-400"
            }`}
          >
            <PackageX size={16} /> Ruptures
            {lowStock.length > 0 && (
              <span className="ml-1 rounded-full bg-red-600 px-1.5 text-xs font-semibold text-neutral-100">
                {lowStock.length}
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16 text-neutral-500">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : tab === "expiration" ? (
          <ExpirationList items={expiration} />
        ) : (
          <LowStockList items={lowStock} />
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Liste péremption --------------------------- */
function ExpirationList({ items }: { items: ExpirationAlert[] }) {
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
function LowStockList({ items }: { items: LowStockItem[] }) {
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

function Empty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center text-neutral-500">
      <CheckCircle2 size={28} className="text-emerald-500/70" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
