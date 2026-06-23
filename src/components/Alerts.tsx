import { useState, useEffect } from "react";
import {
  Loader2,
  CalendarClock,
  PackageX,
  RefreshCw,
} from "lucide-react";
import { ExpirationList, LowStockList } from "../utils/AlertLists";
import { useAlertsStore } from "../stores/useAlertsStore";

type Tab = "expiration" | "low";

export default function Alerts(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>("expiration");
  
  const { expiration, lowStock, loading, error, loadAlerts } = useAlertsStore();

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-5 text-neutral-100">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Alertes</h1>
          <button
            onClick={loadAlerts}
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


