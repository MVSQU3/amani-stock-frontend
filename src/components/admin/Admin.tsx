import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Search,
  Store,
  Users,
  Wallet,
  Clock,
  Ban,
  X,
  ShieldCheck,
  ShieldOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  PackageX,
  CalendarClock,
  Download,
  ShoppingCart,
  ArrowDownToLine,
  TriangleAlert,
} from "lucide-react";
import { useAdminStore } from "../../stores/useAdminStore";
import { fcfa } from "../../utils/Formatage_fcfa";
import type { BatchStatus, ShopStatusFilter } from "../../types/admin.interface";

type DetailTab = "apercu" | "produits" | "stock-bas" | "activite";
type BatchStatusFilter = "all" | BatchStatus;
type FinanceTab = "in" | "out" | "loss";

const BATCH_STATUS_LABEL: Record<BatchStatus, { label: string; className: string }> = {
  expired: { label: "Périmé", className: "bg-red-500/10 text-red-400" },
  critical: { label: "Critique", className: "bg-amber-500/10 text-amber-300" },
  warning: { label: "Bientôt", className: "bg-yellow-500/10 text-yellow-300" },
  healthy: { label: "Sain", className: "bg-emerald-500/10 text-emerald-300" },
};

const BATCH_FILTER_OPTIONS: { value: BatchStatusFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "expired", label: "Périmés" },
  { value: "critical", label: "Critiques" },
  { value: "warning", label: "Bientôt" },
  { value: "healthy", label: "Sains" },
];

const STATUS_OPTIONS: { value: ShopStatusFilter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "Actives" },
  { value: "disabled", label: "Désactivées" },
  { value: "trial", label: "Essai en cours" },
  { value: "expired", label: "Essai expiré" },
];

const formatDate = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleDateString("fr-FR") : "—";

function trialBadge(trialEndsAt: string | null): { label: string; className: string } {
  if (!trialEndsAt) {
    return { label: "Illimité", className: "bg-sky-500/10 text-sky-300" };
  }
  const end = new Date(trialEndsAt).getTime();
  const now = Date.now();
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return { label: "Essai expiré", className: "bg-red-500/10 text-red-400" };
  }
  if (daysLeft <= 7) {
    return { label: `Expire dans ${daysLeft} j`, className: "bg-amber-500/10 text-amber-300" };
  }
  return { label: `Essai (${daysLeft} j)`, className: "bg-emerald-500/10 text-emerald-300" };
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
      <div className="flex items-center gap-1.5 text-neutral-500">{icon}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}

const FINANCE_TONES: Record<"emerald" | "amber" | "red", string> = {
  emerald: "border-l-emerald-500 text-emerald-300",
  amber: "border-l-amber-500 text-amber-300",
  red: "border-l-red-600 text-red-300",
};

function FinanceStatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "red";
}) {
  const [ring, text] = FINANCE_TONES[tone].split(" ");
  return (
    <div className={`rounded-xl border border-neutral-800 border-l-4 ${ring} bg-neutral-950/50 p-4`}>
      <div className="text-xs text-neutral-400">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${text}`}>{fcfa(value)}</div>
    </div>
  );
}

export default function Admin(): React.JSX.Element {
  const {
    stats,
    shops,
    page,
    totalPages,
    status,
    selectedShop,
    loading,
    detailLoading,
    actionLoading,
    error,
    inventory,
    inventorySummary,
    inventoryLoading,
    inventoryLoaded,
    lowStock,
    lowStockLoading,
    lowStockLoaded,
    finance,
    financeLoading,
    financeLoaded,
    loadStats,
    loadShops,
    openShop,
    closeShop,
    toggleShopStatus,
    extendTrial,
    removeShop,
    loadShopInventory,
    loadShopLowStock,
    loadShopFinance,
  } = useAdminStore();

  const [searchInput, setSearchInput] = useState("");
  const [trialDays, setTrialDays] = useState("30");
  const [confirmName, setConfirmName] = useState("");
  const [detailTab, setDetailTab] = useState<DetailTab>("apercu");
  const [batchFilter, setBatchFilter] = useState<BatchStatusFilter>("all");
  const [productSearch, setProductSearch] = useState("");
  const [financeTab, setFinanceTab] = useState<FinanceTab>("in");

  useEffect(() => {
    loadStats();
    loadShops({ page: 1 });
  }, [loadStats, loadShops]);

  useEffect(() => {
    setConfirmName("");
    setTrialDays("30");
    setDetailTab("apercu");
    setBatchFilter("all");
    setProductSearch("");
    setFinanceTab("in");
  }, [selectedShop?.shop.id]);

  useEffect(() => {
    if (!selectedShop) return;
    if (detailTab === "produits" && !inventoryLoaded) {
      loadShopInventory(selectedShop.shop.id);
    }
    if (detailTab === "stock-bas" && !lowStockLoaded) {
      loadShopLowStock(selectedShop.shop.id);
    }
    if (detailTab === "activite" && !financeLoaded) {
      loadShopFinance(selectedShop.shop.id);
    }
  }, [
    detailTab,
    selectedShop,
    inventoryLoaded,
    lowStockLoaded,
    financeLoaded,
    loadShopInventory,
    loadShopLowStock,
    loadShopFinance,
  ]);

  const filteredInventory = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    return inventory.filter((b) => {
      if (batchFilter !== "all" && b.status !== batchFilter) return false;
      if (q && !b.Product.name.toLowerCase().includes(q) && !b.Product.barcode.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [inventory, batchFilter, productSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadShops({ page: 1, search: searchInput });
  };

  const handleStatusChange = (value: ShopStatusFilter) => {
    loadShops({ page: 1, status: value });
  };

  const handleDelete = async () => {
    if (!selectedShop) return;
    if (!window.confirm(`Supprimer définitivement "${selectedShop.shop.name}" et toutes ses données ?`)) {
      return;
    }
    try {
      await removeShop(selectedShop.shop.id, confirmName);
    } catch {
      // l'erreur est déjà affichée via le store
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-5 text-neutral-100">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Administration</h1>
            <p className="text-xs text-neutral-500">Gestion des boutiques de la plateforme</p>
          </div>
          <button
            onClick={() => {
              loadStats();
              loadShops();
            }}
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

        {/* Statistiques plateforme */}
        {stats && (
          <div className="mb-5 grid grid-cols-3 gap-3">
            <StatCard icon={<Store size={15} />} label="Boutiques actives" value={stats.activeShopCount} />
            <StatCard icon={<Ban size={15} />} label="Désactivées" value={stats.disabledShopCount} />
            <StatCard icon={<Clock size={15} />} label="Essais expirés" value={stats.trialExpiredCount} />
            <StatCard icon={<Clock size={15} />} label="Expirent bientôt" value={stats.expiringSoonCount} />
            <StatCard icon={<Users size={15} />} label="Utilisateurs" value={stats.userCount} />
            <StatCard icon={<Wallet size={15} />} label="Valeur stock totale" value={fcfa(stats.totalStockValue)} />
          </div>
        )}

        {/* Recherche + filtre statut */}
        <form onSubmit={handleSearchSubmit} className="mb-3 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Rechercher une boutique..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input pl-9"
            />
          </div>
          <button type="submit" className="rounded-lg bg-neutral-800 px-4 text-sm font-medium text-white hover:bg-neutral-700">
            OK
          </button>
        </form>

        <div className="mb-5 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                status === opt.value
                  ? "bg-amber-500 text-neutral-950"
                  : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Liste des boutiques */}
        {loading ? (
          <div className="flex justify-center py-16 text-neutral-500">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : shops.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center text-sm text-neutral-500">
            Aucune boutique ne correspond à ces critères.
          </div>
        ) : (
          <div className="space-y-2">
            {shops.map((shop) => {
              const badge = trialBadge(shop.trialEndsAt);
              return (
                <button
                  key={shop.id}
                  onClick={() => openShop(shop.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 text-left transition hover:bg-neutral-900"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-white">{shop.name}</span>
                      {!shop.isActive && (
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                          Désactivée
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-neutral-500">
                      {shop.notificationEmail || "—"} · {shop.userCount} utilisateur{shop.userCount > 1 ? "s" : ""}
                    </div>
                  </div>
                  <span className={`ml-3 shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && shops.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
            <button
              disabled={page <= 1}
              onClick={() => loadShops({ page: page - 1 })}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft size={16} /> Précédent
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => loadShops({ page: page + 1 })}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 hover:text-white disabled:opacity-30"
            >
              Suivant <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Détail boutique (overlay) */}
      {(selectedShop || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl sm:max-w-lg sm:rounded-2xl">
            {detailLoading || !selectedShop ? (
              <div className="flex justify-center py-16 text-neutral-500">
                <Loader2 size={24} className="animate-spin" />
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedShop.shop.name}</h2>
                    <p className="text-xs text-neutral-500">{selectedShop.shop.notificationEmail || "—"}</p>
                    <p className="text-xs text-neutral-600">Créée le {formatDate(selectedShop.shop.createdAt)}</p>
                  </div>
                  <button onClick={closeShop} className="p-1 text-neutral-500 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                {/* Onglets du détail */}
                <div className="mb-5 grid grid-cols-4 gap-1 rounded-xl bg-neutral-950 p-1">
                  {(
                    [
                      { value: "apercu", label: "Aperçu" },
                      { value: "produits", label: "Produits" },
                      { value: "stock-bas", label: "Stock bas" },
                      { value: "activite", label: "Activité" },
                    ] as { value: DetailTab; label: string }[]
                  ).map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setDetailTab(tab.value)}
                      className={`rounded-lg py-2 text-[11px] font-medium transition ${
                        detailTab === tab.value
                          ? "bg-neutral-800 text-white"
                          : "text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {detailTab === "apercu" && (
                  <>
                {/* Volumétrie */}
                <div className="mb-2 grid grid-cols-3 gap-2">
                  <StatCard icon={<Wallet size={14} />} label="Valeur stock" value={fcfa(selectedShop.stockValue)} />
                  <StatCard icon={<Store size={14} />} label="Produits" value={selectedShop.productCount} />
                  <StatCard icon={<Users size={14} />} label="Équipe" value={selectedShop.team.length} />
                </div>

                {/* Activité du jour */}
                <div className="mb-5 grid grid-cols-2 gap-2">
                  <StatCard
                    icon={<Download size={14} />}
                    label="Entrées aujourd'hui"
                    value={`${selectedShop.purchasedTodayUnits} unités`}
                  />
                  <StatCard
                    icon={<ShoppingCart size={14} />}
                    label="Sorties aujourd'hui"
                    value={`${selectedShop.soldTodayUnits} unités`}
                  />
                </div>

                {/* Activer / désactiver */}
                <section className="mb-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Statut du compte</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        selectedShop.shop.isActive
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {selectedShop.shop.isActive ? "Active" : "Désactivée"}
                    </span>
                  </div>
                  <button
                    disabled={actionLoading}
                    onClick={() =>
                      toggleShopStatus(selectedShop.shop.id, selectedShop.shop.isActive ? "disable" : "activate")
                    }
                    className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-50 ${
                      selectedShop.shop.isActive
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                    }`}
                  >
                    {selectedShop.shop.isActive ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                    {selectedShop.shop.isActive ? "Désactiver la boutique" : "Activer la boutique"}
                  </button>
                </section>

                {/* Essai */}
                <section className="mb-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Période d'essai</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${trialBadge(selectedShop.shop.trialEndsAt).className}`}>
                      {selectedShop.shop.trialEndsAt ? formatDate(selectedShop.shop.trialEndsAt) : "Illimité"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      max={3650}
                      value={trialDays}
                      onChange={(e) => setTrialDays(e.target.value)}
                      className="input flex-1"
                      placeholder="Jours"
                    />
                    <button
                      disabled={actionLoading}
                      onClick={() => extendTrial(selectedShop.shop.id, { days: parseInt(trialDays, 10) })}
                      className="shrink-0 rounded-lg bg-amber-500 px-4 text-sm font-medium text-neutral-950 hover:bg-amber-400 disabled:opacity-50"
                    >
                      Prolonger
                    </button>
                  </div>
                  <button
                    disabled={actionLoading}
                    onClick={() => extendTrial(selectedShop.shop.id, { unlimited: true })}
                    className="mt-2 w-full rounded-lg bg-neutral-800 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-700 disabled:opacity-50"
                  >
                    Lever la limite (illimité)
                  </button>
                </section>

                {/* Équipe */}
                <section className="mb-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                  <span className="mb-3 block text-sm font-medium text-white">Équipe</span>
                  <div className="divide-y divide-neutral-800">
                    {selectedShop.team.map((member) => (
                      <div key={member.id} className="flex items-center justify-between py-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm text-neutral-200">{member.name}</div>
                          <div className="truncate text-xs text-neutral-500">{member.email}</div>
                        </div>
                        <span className="ml-2 shrink-0 text-xs font-medium text-neutral-500 capitalize">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Zone dangereuse */}
                <section className="rounded-xl border border-red-900/40 bg-red-950/20 p-4">
                  <span className="mb-2 block text-sm font-medium text-red-300">Zone dangereuse</span>
                  <p className="mb-2 text-xs text-neutral-400">
                    Tapez <span className="font-semibold text-neutral-200">{selectedShop.shop.name}</span> pour
                    confirmer la suppression définitive de cette boutique et de toutes ses données.
                  </p>
                  <input
                    type="text"
                    value={confirmName}
                    onChange={(e) => setConfirmName(e.target.value)}
                    className="input mb-2"
                    placeholder={selectedShop.shop.name}
                  />
                  <button
                    disabled={actionLoading || confirmName !== selectedShop.shop.name}
                    onClick={handleDelete}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 size={16} /> Supprimer définitivement
                  </button>
                </section>
                  </>
                )}

                {detailTab === "produits" && (
                  <>
                    {inventoryLoading ? (
                      <div className="flex justify-center py-12 text-neutral-500">
                        <Loader2 size={22} className="animate-spin" />
                      </div>
                    ) : (
                      <>
                        {inventorySummary && (
                          <div className="mb-4 grid grid-cols-4 gap-2">
                            <StatCard icon={<CalendarClock size={13} />} label="Périmés" value={inventorySummary.expiredCount} />
                            <StatCard icon={<Clock size={13} />} label="Critiques" value={inventorySummary.criticalCount} />
                            <StatCard icon={<Clock size={13} />} label="Bientôt" value={inventorySummary.warningCount} />
                            <StatCard icon={<PackageSearch size={13} />} label="Sains" value={inventorySummary.healthyCount} />
                          </div>
                        )}

                        <div className="relative mb-3">
                          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                          <input
                            type="text"
                            placeholder="Filtrer par nom ou code-barres..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="input pl-8 py-2 text-sm"
                          />
                        </div>

                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {BATCH_FILTER_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setBatchFilter(opt.value)}
                              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                                batchFilter === opt.value
                                  ? "bg-amber-500 text-neutral-950"
                                  : "bg-neutral-950 text-neutral-400 hover:text-neutral-200"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>

                        {filteredInventory.length === 0 ? (
                          <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-6 text-center text-sm text-neutral-500">
                            Aucun lot ne correspond à ces critères.
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {filteredInventory.map((batch) => {
                              const badge = BATCH_STATUS_LABEL[batch.status];
                              return (
                                <div
                                  key={batch.id}
                                  className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/50 p-3"
                                >
                                  <div className="min-w-0">
                                    <div className="truncate text-sm text-neutral-200">{batch.Product.name}</div>
                                    <div className="truncate text-xs text-neutral-500">
                                      {batch.Product.barcode} · {batch.quantity} {batch.Product.unit} · exp.{" "}
                                      {formatDate(batch.expirationDate)}
                                    </div>
                                  </div>
                                  <span className={`ml-2 shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${badge.className}`}>
                                    {badge.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {detailTab === "stock-bas" && (
                  <>
                    {lowStockLoading ? (
                      <div className="flex justify-center py-12 text-neutral-500">
                        <Loader2 size={22} className="animate-spin" />
                      </div>
                    ) : lowStock.length === 0 ? (
                      <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-6 text-center text-sm text-neutral-500">
                        Aucune rupture ni stock bas pour cette boutique.
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {lowStock.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/50 p-3"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm text-neutral-200">{product.name}</div>
                              <div className="truncate text-xs text-neutral-500">
                                {product.barcode} · seuil {product.minThreshold} {product.unit}
                              </div>
                            </div>
                            <span
                              className={`ml-2 shrink-0 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${
                                product.status === "out_of_stock"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-amber-500/10 text-amber-300"
                              }`}
                            >
                              <PackageX size={11} />
                              {product.totalQuantity} {product.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {detailTab === "activite" && (
                  <>
                    {financeLoading || !finance ? (
                      <div className="flex justify-center py-12 text-neutral-500">
                        <Loader2 size={22} className="animate-spin" />
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-neutral-950 p-1">
                          <button
                            onClick={() => setFinanceTab("in")}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition ${
                              financeTab === "in" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"
                            }`}
                          >
                            <ArrowDownToLine size={13} /> Entrées
                          </button>
                          <button
                            onClick={() => setFinanceTab("out")}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition ${
                              financeTab === "out" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"
                            }`}
                          >
                            <ShoppingCart size={13} /> Sorties
                          </button>
                          <button
                            onClick={() => setFinanceTab("loss")}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition ${
                              financeTab === "loss" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"
                            }`}
                          >
                            <TriangleAlert size={13} /> Pertes
                          </button>
                        </div>

                        {financeTab === "in" && (
                          <div className="grid grid-cols-2 gap-2">
                            <FinanceStatTile label="Aujourd'hui" value={finance.in.today} tone="emerald" />
                            <FinanceStatTile label="7 jours" value={finance.in["7d"]} tone="emerald" />
                            <FinanceStatTile label="14 jours" value={finance.in["14d"]} tone="emerald" />
                            <FinanceStatTile label="21 jours" value={finance.in["21d"]} tone="emerald" />
                            <div className="col-span-2">
                              <FinanceStatTile label="30 jours" value={finance.in["30d"]} tone="emerald" />
                            </div>
                          </div>
                        )}

                        {financeTab === "out" && (
                          <div className="grid grid-cols-2 gap-2">
                            <FinanceStatTile label="Aujourd'hui" value={finance.out.today} tone="amber" />
                            <FinanceStatTile label="7 jours" value={finance.out["7d"]} tone="amber" />
                            <FinanceStatTile label="14 jours" value={finance.out["14d"]} tone="amber" />
                            <FinanceStatTile label="21 jours" value={finance.out["21d"]} tone="amber" />
                            <div className="col-span-2">
                              <FinanceStatTile label="30 jours" value={finance.out["30d"]} tone="amber" />
                            </div>
                          </div>
                        )}

                        {financeTab === "loss" && (
                          <div className="grid grid-cols-2 gap-2">
                            <FinanceStatTile label="Périmés" value={finance.loss.perime} tone="red" />
                            <FinanceStatTile label="Casse" value={finance.loss.casse} tone="red" />
                            <FinanceStatTile label="Vol" value={finance.loss.vole} tone="red" />
                            <FinanceStatTile label="Autre" value={finance.loss.autre} tone="red" />
                            <div className="col-span-2 rounded-xl border border-red-900 bg-red-950/20 p-4 text-center">
                              <div className="text-xs uppercase tracking-wide text-red-400">Total pertes (30j)</div>
                              <div className="mt-1 text-xl font-bold text-red-300">
                                {fcfa(
                                  finance.loss.perime + finance.loss.casse + finance.loss.vole + finance.loss.autre,
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
