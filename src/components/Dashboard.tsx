import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
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
  ArrowUpRight,
  ShoppingCart,
  Download,
  Box,
} from "lucide-react";
import { axiosClient } from "../api/axiosClient";
import type { ApiResponse, DashboardData } from "../types/stock.interface";

// Montants en francs CFA (Afrique de l'Ouest)
const fcfa = (n: number): string =>
  `${Math.round(n).toLocaleString("fr-FR")} FCFA`;

export default function Dashboard(): React.JSX.Element {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res =
        await axiosClient.get<ApiResponse<DashboardData>>("/stock/dashboard");
      setData(res.data.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Impossible de charger le tableau de bord.",
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
          <h1 className="text-lg font-semibold tracking-tight">
            Tableau de bord
          </h1>
          <button
            onClick={load}
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
          </>
        )}
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
      <div className="flex items-center gap-1.5 text-neutral-500">{icon}</div>
      <div className="mt-1 text-xl font-semibold">
        {value.toLocaleString("fr-FR")}
      </div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}

const TONES: Record<string, { ring: string; text: string }> = {
  amber: { ring: "border-l-amber-500", text: "text-amber-300" },
  red: { ring: "border-l-red-600", text: "text-red-300" },
  emerald: { ring: "border-l-emerald-500", text: "text-emerald-300" },
  neutral: { ring: "border-l-neutral-600", text: "text-neutral-300" },
  sky: { ring: "border-l-sky-500", text: "text-sky-300" },
};

function AlertTile({
  to,
  icon,
  tone,
  count,
  label,
  sub,
}: {
  to: string;
  icon: React.ReactNode;
  tone: "amber" | "red" | "emerald" | "neutral" | "sky";
  count: number;
  label: string;
  sub?: string;
}) {
  const t = TONES[tone];
  return (
    <Link
      to={to}
      className={`group rounded-xl border border-neutral-800 border-l-4 ${t.ring} bg-neutral-900/60 p-3.5 transition hover:bg-neutral-900`}
    >
      <div className="flex items-center justify-between">
        <span className={t.text}>{icon}</span>
        <ArrowUpRight
          size={14}
          className="text-neutral-600 group-hover:text-neutral-400"
        />
      </div>
      <div className="mt-2 text-2xl font-semibold">
        {(count ?? 0).toLocaleString("fr-FR")}
      </div>
      <div className="text-xs text-neutral-400">{label}</div>
      {sub && <div className={`mt-0.5 text-xs ${t.text}`}>{sub}</div>}
    </Link>
  );
}
