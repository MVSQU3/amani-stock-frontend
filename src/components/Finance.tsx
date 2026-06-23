import { useState, useEffect } from "react";
import {
  Loader2,
  ArrowDownToLine,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";
import { StatTile } from "../utils/DashboardWidgets";
import { fcfa } from "../utils/Formatage_fcfa";
import { useFinanceStore } from "../stores/useFinanceStore";

export default function FinanceTab(): React.JSX.Element {
  const [tab, setTab] = useState<"in" | "out" | "loss">("in");
  const { financeData: data, loading, error, loadFinance } = useFinanceStore();

  useEffect(() => {
    loadFinance();
  }, [loadFinance]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">
        {error}
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex justify-center py-16 text-neutral-500">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  const tabCls = (t: string) =>
    `flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
      tab === t
        ? "bg-neutral-800 text-neutral-100"
        : "text-neutral-400 hover:text-neutral-200"
    }`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* 3 Sous-onglets */}
      <div className="mb-5 grid grid-cols-3 gap-1 rounded-xl bg-neutral-900 p-1">
        <button onClick={() => setTab("in")} className={tabCls("in")}>
          <ArrowDownToLine size={15} /> Entrées
        </button>
        <button onClick={() => setTab("out")} className={tabCls("out")}>
          <ShoppingCart size={15} /> Sorties
        </button>
        <button onClick={() => setTab("loss")} className={tabCls("loss")}>
          <TriangleAlert size={15} /> Pertes
        </button>
      </div>

      {tab === "in" && (
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Aujourd'hui" value={data.in.today} tone="emerald" />
          <StatTile
            label="Derniers 7 jours"
            value={data.in["7d"]}
            tone="emerald"
          />
          <StatTile
            label="Derniers 14 jours"
            value={data.in["14d"]}
            tone="emerald"
          />
          <StatTile
            label="Derniers 21 jours"
            value={data.in["21d"]}
            tone="emerald"
          />
          <div className="col-span-2">
            <StatTile
              label="Derniers 30 jours"
              value={data.in["30d"]}
              tone="emerald"
            />
          </div>
        </div>
      )}

      {tab === "out" && (
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Aujourd'hui" value={data.out.today} tone="amber" />
          <StatTile
            label="Derniers 7 jours"
            value={data.out["7d"]}
            tone="amber"
          />
          <StatTile
            label="Derniers 14 jours"
            value={data.out["14d"]}
            tone="amber"
          />
          <StatTile
            label="Derniers 21 jours"
            value={data.out["21d"]}
            tone="amber"
          />
          <div className="col-span-2">
            <StatTile
              label="Derniers 30 jours"
              value={data.out["30d"]}
              tone="amber"
            />
          </div>
        </div>
      )}

      {tab === "loss" && (
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Périmés" value={data.loss.perime} tone="red" />
          <StatTile label="Casse" value={data.loss.casse} tone="red" />
          <StatTile label="Vol" value={data.loss.vole} tone="red" />
          <StatTile label="Autre" value={data.loss.autre} tone="red" />
          <div className="col-span-2 rounded-xl border border-red-900 bg-red-950/20 p-4 text-center">
            <div className="text-xs text-red-400 uppercase tracking-wide">
              Total Pertes (30j)
            </div>
            <div className="mt-1 text-2xl font-bold text-red-300">
              {fcfa(
                data.loss.perime +
                  data.loss.casse +
                  data.loss.vole +
                  data.loss.autre,
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
