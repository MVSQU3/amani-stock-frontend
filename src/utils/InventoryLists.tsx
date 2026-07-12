import { useState } from "react";
import {
  PackageSearch,
  TriangleAlert,
  X,
  ArrowDownToLine,
  ShoppingCart,
  CheckCircle2,
  Pencil,
  Loader2,
} from "lucide-react";
import type { RegulatoryCategory, StockBatch } from "../types/stock.interface";
import { useInventoryStore } from "../stores/useInventoryStore";
import type { Movement } from "../types/inventory.interface";
import {
  REGULATORY_CATEGORIES,
  regulatoryAccent,
  regulatoryLabel,
} from "./regulatory";



export const dotColor = (d: number): string =>
  d < 0
    ? "bg-red-600"
    : d <= 7
      ? "bg-orange-500"
      : d <= 30
        ? "bg-amber-500"
        : "bg-green-600";

export const expiryHint = (d: number): string =>
  d < 0 ? `périmé (${Math.abs(d)} j)` : `J-${d}`;

export const LOSS_REASONS = ["Périmé", "Casse", "Vol", "Retour", "Autre"];

// =========================================================================
export function Empty({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center text-neutral-500">
      <div className="text-neutral-600">
        {icon ?? <CheckCircle2 size={28} />}
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}

// =========================================================================
export function LossForm({
  batch,
  onClose,
  onDone,
}: {
  batch: StockBatch;
  onClose: () => void;
  onDone: () => void;
}) {
  const [quantity, setQuantity] = useState(String(batch.quantity));
  const [reason, setReason] = useState(LOSS_REASONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const { addLoss } = useInventoryStore();

  const submit = async () => {
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0 || qty > batch.quantity) {
      setErr(`Quantité entre 1 et ${batch.quantity}.`);
      return;
    }
    setSubmitting(true);
    setErr("");
    try {
      await addLoss(batch.id, qty, reason);
      onDone();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Échec de l'enregistrement.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-red-300">
          Sortir pour perte
        </span>
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-300"
        >
          <X size={14} />
        </button>
      </div>
      {err && <p className="mb-2 text-xs text-red-300">{err}</p>}
      <div className="flex gap-2">
        <input
          inputMode="numeric"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-20 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-2 text-sm outline-none focus:border-red-500"
        />
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-2 text-sm outline-none focus:border-red-500"
        >
          {LOSS_REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          onClick={submit}
          disabled={submitting}
          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-neutral-100 disabled:opacity-50"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : "OK"}
        </button>
      </div>
    </div>
  );
}

// =========================================================================
export function EditForm({
  batch,
  onClose,
  onDone,
}: {
  batch: StockBatch;
  onClose: () => void;
  onDone: () => void;
}) {
  const [name, setName] = useState(batch.Product?.name || "");
  const [barcode, setBarcode] = useState(batch.Product?.barcode || "");
  const [expirationDate, setExpirationDate] = useState(batch.expirationDate || "");
  const [lotNumber, setLotNumber] = useState(batch.lotNumber || "");
  const [supplierName, setSupplierName] = useState(batch.Supplier?.name || "");
  const [regulatoryCategory, setRegulatoryCategory] = useState<RegulatoryCategory>(
    batch.Product?.regulatoryCategory || "libre",
  );
  const [quantity, setQuantity] = useState(String(batch.quantity));
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const { updateBatch } = useInventoryStore();

  const submit = async () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      setErr("Quantité invalide.");
      return;
    }
    if (!expirationDate) {
      setErr("Date de péremption obligatoire.");
      return;
    }

    setSubmitting(true);
    setErr("");
    try {
      await updateBatch(batch.id, {
        name,
        barcode,
        expirationDate,
        lotNumber,
        supplierName,
        regulatoryCategory,
        quantity: qty,
      });
      onDone();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Échec de la modification.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-sky-300">
          Modifier le lot
        </span>
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-300"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du produit"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Code-barres"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <input
          type="text"
          value={lotNumber}
          onChange={(e) => setLotNumber(e.target.value)}
          placeholder="N° de lot"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <input
          type="text"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          placeholder="Fournisseur"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <select
          value={regulatoryCategory}
          onChange={(e) => setRegulatoryCategory(e.target.value as RegulatoryCategory)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-sky-500"
        >
          {REGULATORY_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-sky-500"
          />
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-20 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-2 text-center text-sm outline-none focus:border-sky-500"
          />
        </div>
        <button
          onClick={submit}
          disabled={submitting}
          className="w-full mt-1 rounded-lg bg-sky-600/20 px-3 py-2 text-sm font-medium text-sky-400 hover:bg-sky-600/30 disabled:opacity-50"
        >
          {submitting ? <Loader2 size={16} className="mx-auto animate-spin" /> : "Enregistrer"}
        </button>
      </div>
      {err && <p className="mt-2 text-center text-xs text-red-400">{err}</p>}
    </div>
  );
}

export function StockList({
  items,
  openLossId,
  setOpenLossId,
  openEditId,
  setOpenEditId,
  onDone,
}: {
  items: StockBatch[];
  openLossId: string | null;
  setOpenLossId: (id: string | null) => void;
  openEditId: string | null;
  setOpenEditId: (id: string | null) => void;
  onDone: () => void;
}) {
  if (!items.length) {
    return (
      <Empty
        label="Aucun stock pour l'instant. Scanne un arrivage."
        icon={<PackageSearch size={28} />}
      />
    );
  }

  return (
    <ul className="space-y-2.5">
      {items.map((b) => (
        <li
          key={b.id}
          className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-medium text-neutral-100">
                  {b.Product?.name ?? "Produit"}
                </p>
                {b.Product?.regulatoryCategory &&
                  b.Product.regulatoryCategory !== "libre" && (
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${regulatoryAccent(b.Product.regulatoryCategory)}`}
                    >
                      {regulatoryLabel(b.Product.regulatoryCategory)}
                    </span>
                  )}
              </div>
              <p className="mt-0.5 font-mono text-xs text-neutral-500">
                {b.Product?.barcode}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-neutral-600">
                Lot {b.lotNumber || b.id?.slice(0, 8).toUpperCase()}
                {b.Supplier?.name ? ` · ${b.Supplier.name}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <span
                className={`h-2 w-2 rounded-full ${dotColor(b.daysRemaining)}`}
              />
              {b.quantity} {b.Product?.unit ?? ""}{" "}
              <span className="text-xs font-mono ml-1 text-neutral-400">
                {b.daysRemaining <= 30 ? b.purchasePrice : (b.sellPrice || "0")} FCFA
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>
              Exp. {b.expirationDate} · {expiryHint(b.daysRemaining)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setOpenLossId(null);
                  setOpenEditId(openEditId === b.id ? null : b.id);
                }}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-neutral-400 hover:bg-neutral-800 hover:text-sky-300"
              >
                <Pencil size={13} /> Éditer
              </button>
              <button
                onClick={() => {
                  setOpenEditId(null);
                  setOpenLossId(openLossId === b.id ? null : b.id);
                }}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-neutral-400 hover:bg-neutral-800 hover:text-red-300"
              >
                <TriangleAlert size={13} /> Perte
              </button>
            </div>
          </div>
          {openLossId === b.id && (
            <LossForm
              batch={b}
              onClose={() => setOpenLossId(null)}
              onDone={() => {
                setOpenLossId(null);
                onDone();
              }}
            />
          )}
          {openEditId === b.id && (
            <EditForm
              batch={b}
              onClose={() => setOpenEditId(null)}
              onDone={() => {
                setOpenEditId(null);
                onDone();
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

// =========================================================================
export function MovementList({
  movements,
  type,
  emptyLabel,
}: {
  movements: Movement[];
  type: "IN" | "OUT";
  emptyLabel: string;
}) {
  if (!movements.length) {
    return (
      <Empty
        label={emptyLabel}
        icon={
          type === "IN" ? (
            <ArrowDownToLine size={28} />
          ) : (
            <ShoppingCart size={28} />
          )
        }
      />
    );
  }

  // --- Regroupement : même produit + même minute + même type ---
  // Permet d'afficher une vente FEFO répartie sur N lots comme une seule ligne.
  const groups: {
    key: string;
    movements: Movement[];
    totalQty: number;
    representative: Movement;
  }[] = [];

  const seen = new Map<string, number>(); // key -> index dans groups[]

  for (const m of movements) {
    // Clé : barcode + heure arrondie à la minute + type
    const minuteKey = `${m.Product?.barcode ?? m.id}_${m.dateLabel}_${m.timeLabel}_${m.type}`;
    if (seen.has(minuteKey)) {
      const idx = seen.get(minuteKey)!;
      groups[idx].movements.push(m);
      groups[idx].totalQty += m.quantity;
    } else {
      seen.set(minuteKey, groups.length);
      groups.push({
        key: minuteKey,
        movements: [m],
        totalQty: m.quantity,
        representative: m,
      });
    }
  }

  return (
    <ul className="space-y-2.5">
      {groups.map((g) => {
        const m = g.representative;
        const isLoss = m.type === "LOSS";
        const lotCount = g.movements.length;
        const isFefoSplit = lotCount > 1;
        const accentBorder =
          type === "IN"
            ? "border-l-emerald-500"
            : isLoss
              ? "border-l-red-500"
              : "border-l-amber-500";
        const accentText =
          type === "IN"
            ? "text-emerald-400"
            : isLoss
              ? "text-red-300"
              : "text-amber-300";
        const qtyLabel = type === "IN" ? `+${g.totalQty}` : `-${g.totalQty}`;
        const reasonLabel = isLoss
          ? `Perte : ${m.reason ?? "–"}`
          : (m.reason ?? "vente");

        return (
          <li
            key={g.key}
            className={`rounded-xl border border-neutral-800 border-l-4 ${accentBorder} bg-neutral-900/60 p-3.5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-neutral-100">
                  {m.Product?.name ?? "Produit"}
                </p>
                <p className="mt-0.5 font-mono text-xs text-neutral-500">
                  {m.Product?.barcode}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-sm font-bold ${accentText}`}>
                  {qtyLabel} {m.Product?.unit ?? ""}
                </span>
                {isFefoSplit && (
                  <span className="rounded-md bg-neutral-800 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400">
                    FEFO · {lotCount} lots
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
              <span className="capitalize">{reasonLabel}</span>
              <span>
                {m.dateLabel} {m.timeLabel}
              </span>
            </div>
            {isFefoSplit && (
              <div className="mt-2 space-y-1 border-t border-neutral-800 pt-2">
                {g.movements.map((mv, i) => (
                  <div
                    key={mv.id}
                    className="flex items-center justify-between text-[10px]"
                  >
                    <span className="text-neutral-600">Lot {i + 1}</span>
                    <span className="font-mono text-neutral-500">
                      {mv.batchId
                        ? mv.batchId.slice(0, 8).toUpperCase()
                        : mv.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={accentText}>
                      {type === "IN" ? "+" : "-"}
                      {mv.quantity} {mv.Product?.unit ?? ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
