import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  RefreshCw,
  Boxes,
  Search,
  ArrowDownToLine,
  ShoppingCart,
  X,
} from "lucide-react";
import { StockList, MovementList } from "../utils/InventoryLists";
import { useInventoryStore } from "../stores/useInventoryStore";

// ----------- Types locaux -----------
type Tab = "stock" | "entrees" | "sorties";
type DayFilter = 1 | 7 | 14 | 21 | 30;
const DAY_FILTERS: DayFilter[] = [1, 7, 14, 21, 30];

// =========================================================================
export default function Inventory(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>("stock");
  const [dayFilter, setDayFilter] = useState<DayFilter>(7);

  const {
    items, entrees, sorties, loading: storeLoading, error: storeError,
    loadStock, loadMovements
  } = useInventoryStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openLossId, setOpenLossId] = useState<string | null>(null);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadStock(), loadMovements(dayFilter)]);
    } catch (err: any) {
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, [loadStock, loadMovements, dayFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // Quand le filtre de jours change (onglets Entrées/Sorties), on recharge les mouvements
  const handleDayFilter = async (d: DayFilter) => {
    setDayFilter(d);
    setLoading(true);
    try {
      await loadMovements(d);
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  };

  // --- Filtrage local par recherche ---
  const q = search.toLowerCase().trim();
  const filteredStock = q
    ? items.filter(
        (b) =>
          b.Product?.name?.toLowerCase().includes(q) ||
          b.Product?.barcode?.includes(q) ||
          b.id.toLowerCase().includes(q),
      )
    : items;
  const filteredEntrees = q
    ? entrees.filter(
        (m) =>
          m.Product?.name?.toLowerCase().includes(q) ||
          m.Product?.barcode?.includes(q) ||
          m.batchId?.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q),
      )
    : entrees;
  const filteredSorties = q
    ? sorties.filter(
        (m) =>
          m.Product?.name?.toLowerCase().includes(q) ||
          m.Product?.barcode?.includes(q) ||
          m.batchId?.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q),
      )
    : sorties;

  // Classe du bouton d'onglet
  const tabCls = (t: Tab) =>
    `flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
      tab === t
        ? "bg-neutral-800 text-neutral-100"
        : "text-neutral-400 hover:text-neutral-200"
    }`;

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-5 text-neutral-100">
      <div className="mx-auto w-full max-w-md">
        {/* En-tête */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            Inventaire
            {!loading && tab === "stock" && (
              <span className="ml-2 text-sm font-normal text-neutral-500">
                {filteredStock.length} lot{filteredStock.length > 1 ? "s" : ""}
              </span>
            )}
          </h1>
          <button
            onClick={load}
            className="rounded-lg bg-neutral-900 p-2 text-neutral-400 hover:text-neutral-200"
            aria-label="Rafraîchir"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit ou un code-barres..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 pl-9 pr-9 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-amber-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* 3 Onglets */}
        <div className="mb-5 grid grid-cols-3 gap-1 rounded-xl bg-neutral-900 p-1">
          <button onClick={() => setTab("stock")} className={tabCls("stock")}>
            <Boxes size={15} /> Stock
          </button>
          <button
            onClick={() => setTab("entrees")}
            className={tabCls("entrees")}
          >
            <ArrowDownToLine size={15} /> Entrées
            {entrees.length > 0 && tab !== "entrees" && (
              <span className="ml-1 rounded-full bg-emerald-600 px-1.5 text-xs font-semibold text-white">
                {entrees.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("sorties")}
            className={tabCls("sorties")}
          >
            <ShoppingCart size={15} /> Sorties
            {sorties.length > 0 && tab !== "sorties" && (
              <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-xs font-semibold text-neutral-950">
                {sorties.length}
              </span>
            )}
          </button>
        </div>

        {/* Filtre de jours (Entrées & Sorties uniquement) */}
        {(tab === "entrees" || tab === "sorties") && (
          <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
            {DAY_FILTERS.map((d) => (
              <button
                key={d}
                onClick={() => handleDayFilter(d)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  dayFilter === d
                    ? "bg-amber-500 text-neutral-950"
                    : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {d === 1 ? "Aujourd'hui" : `${d} jrs`}
              </button>
            ))}
          </div>
        )}

        {(error || storeError) && (
          <div className="mb-4 rounded-xl border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">
            {error || storeError}
          </div>
        )}

        {loading || storeLoading ? (
          <div className="flex justify-center py-16 text-neutral-500">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : tab === "stock" ? (
          <StockList
            items={filteredStock}
            openLossId={openLossId}
            setOpenLossId={setOpenLossId}
            openEditId={openEditId}
            setOpenEditId={setOpenEditId}
            onDone={load}
          />
        ) : tab === "entrees" ? (
          <MovementList
            movements={filteredEntrees}
            type="IN"
            emptyLabel="Aucune entrée sur cette période."
          />
        ) : (
          <MovementList
            movements={filteredSorties}
            type="OUT"
            emptyLabel="Aucune sortie sur cette période."
          />
        )}
      </div>
    </div>
  );
}

