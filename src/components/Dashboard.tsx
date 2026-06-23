import { useState, useEffect } from "react";
import {
  Loader2,
  RefreshCw,
  Wallet,
  Boxes,
  Layers,
  Tag,
  CalendarClock,
  TriangleAlert,
  PackageX,
  ShoppingCart,
  Download,
} from "lucide-react";
import FinanceTab from "./Finance";
import { MiniStat, AlertTile } from "../utils/DashboardWidgets";
import { useDashboardStore } from "../stores/useDashboardStore";

// Montants en francs CFA (Afrique de l'Ouest)
const fcfa = (n: number): string =>
  `${Math.round(n).toLocaleString("fr-FR")} FCFA`;

export default function Dashboard(): React.JSX.Element {
  const [mainTab, setMainTab] = useState<"stock" | "finance">("stock");
  
  const { data, loading, error, loadDashboard } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-5 text-neutral-100">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            Tableau de bord
          </h1>
          <button
            onClick={loadDashboard}
            className="rounded-lg bg-neutral-900 p-2 text-neutral-400 hover:text-neutral-200"
            aria-label="Rafraîchir"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading || !data ? (
          <div className="flex justify-center py-16 text-neutral-500">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            {/* 2 Onglets Principaux */}
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-neutral-900 p-1">
              <button
                onClick={() => setMainTab("stock")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
                  mainTab === "stock"
                    ? "bg-neutral-800 text-neutral-100"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Boxes size={15} /> Stock
              </button>
              <button
                onClick={() => setMainTab("finance")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
                  mainTab === "finance"
                    ? "bg-neutral-800 text-neutral-100"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Wallet size={15} /> Finance
              </button>
            </div>

            {mainTab === "stock" ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Valeur du stock — chiffre principal */}
                <div className="mb-3 rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-900/40 p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-500">
                    <Wallet size={14} /> Valeur du stock
                  </div>
                  <div className="mt-1.5 text-3xl font-semibold tracking-tight">
                    {fcfa(data.stockValue)}
                  </div>
                </div>

                {/* Volumes */}
                <div className="mb-3 grid grid-cols-3 gap-3">
                  <MiniStat
                    icon={<Boxes size={15} />}
                    label="Unités"
                    value={data.totalUnits}
                  />
                  <MiniStat
                    icon={<Layers size={15} />}
                    label="Lots"
                    value={data.batchCount}
                  />
                  <MiniStat
                    icon={<Tag size={15} />}
                    label="Produits"
                    value={data.productCount}
                  />
                </div>

                {/* À traiter */}
                <p className="mb-2 mt-5 text-xs uppercase tracking-wide text-neutral-500">
                  À traiter
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <AlertTile
                    to="/alerts"
                    icon={<CalendarClock size={16} />}
                    tone="amber"
                    count={data.expiring.count}
                    label="Périment bientôt"
                    sub={fcfa(data.expiring.value)}
                  />
                  <AlertTile
                    to="/inventory"
                    icon={<TriangleAlert size={16} />}
                    tone="red"
                    count={data.expired.count}
                    label="Périmés à sortir"
                    sub={fcfa(data.expired.value)}
                  />
                  <AlertTile
                    to="/alerts"
                    icon={<PackageX size={16} />}
                    tone={data.lowStockCount > 0 ? "red" : "neutral"}
                    count={data.lowStockCount}
                    label="Ruptures / stock bas"
                  />
                  <AlertTile
                    to="/scan"
                    icon={<Download size={16} />}
                    tone="emerald"
                    count={data.purchasedTodayUnits}
                    label="Entrées aujourd'hui"
                    sub="unités entrées"
                  />
                  <AlertTile
                    to="/scan"
                    icon={<ShoppingCart size={16} />}
                    tone="emerald"
                    count={data.soldTodayUnits}
                    label="Sorties aujourd'hui"
                    sub="unités vendues"
                  />
                </div>

                <p className="mt-5 text-center text-xs text-neutral-600">
                  Seuil d'alerte péremption : {data.warningDays} jours
                </p>
              </div>
            ) : (
              <FinanceTab />
            )}
          </>
        )}
      </div>
      </div>
  );
}
