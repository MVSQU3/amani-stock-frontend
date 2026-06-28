import { useState, useRef, useEffect, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  Camera,
  Keyboard,
  X,
  ArrowDownToLine,
  ShoppingCart,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ScanLine,
} from "lucide-react";
import type {
  AppMode,
  AddStockPayload,
} from "../types/stock.interface";
import Field from "../utils/FieldWrapper";
import { useScannerStore } from "../stores/useScannerStore";

const READER_ID = "qr-reader";

// Formats de codes-barres produits courants (EAN/UPC) + Code 128
const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
];

// Objectifs INADAPTÉS au scan rapproché (ne font pas la mise au point de près).
// On garde le "grand angle" principal, on écarte l'ultra grand angle, le
// téléobjectif, le capteur de profondeur et le macro.
const UNSUITABLE_LENS =
  /ultra|t[ée]l[ée]|telephoto|depth|profondeur|macro|truedepth|mono/i;

/**
 * Choisit l'identifiant de la meilleure caméra arrière parmi celles exposées
 * par le navigateur. Heuristique basée sur les libellés (labels).
 */
const pickBackCameraId = (
  cameras: { id: string; label: string }[],
): string | undefined => {
  if (!cameras.length) return undefined;
  const back = cameras.filter((c) =>
    /back|rear|arri[èe]re|environment/i.test(c.label),
  );
  const pool = back.length ? back : cameras;
  const main = pool.find((c) => !UNSUITABLE_LENS.test(c.label)) ?? pool[0];
  return main.id;
};

/** yyyy-mm-dd (input natif) -> dd-mm-yyyy (attendu par le backend). */
const toApiDate = (isoDate: string): string => {
  const [y, m, d] = isoDate.split("-");
  return `${d}-${m}-${y}`;
};

type Feedback =
  | { type: "success"; message: string; lowStock?: boolean }
  | { type: "error"; message: string }
  | null;

/**
 * Scanner de stock mobile-first.
 * Deux modes : "add" (arrivage) et "sell" (vente FEFO).
 * Repli clavier si la caméra est indisponible ou le code illisible.
 */
export default function Scanner(): React.JSX.Element {
  const [mode, setMode] = useState<AppMode>("add");
  const [isScanning, setIsScanning] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [tempBarcode, setTempBarcode] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  
  const { addStock, sellProduct, loading: submitting } = useScannerStore();

  // Champs du formulaire (mode "add")
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [expirationDate, setExpirationDate] = useState(""); // yyyy-mm-dd
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("pièce");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [minThreshold, setMinThreshold] = useState("5");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const runningRef = useRef(false);

  const stopCamera = useCallback(async () => {
    if (scannerRef.current && runningRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {
        /* la caméra était déjà arrêtée */
      }
      runningRef.current = false;
    }
    setIsScanning(false);
  }, []);

  // Arrêt propre au démontage
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const onScanned = useCallback(
    async (decoded: string) => {
      await stopCamera();
      setBarcode(decoded);
      setFeedback(null);

      // Best-effort : pré-remplir le nom via Open Food Facts (mode arrivage).
      // Échec silencieux : la saisie manuelle reste toujours possible.
      if (mode === "add") {
        try {
          const r = await fetch(
            `https://world.openfoodfacts.org/api/v0/product/${decoded}.json`,
          );
          const json = await r.json();
          if (json?.product?.product_name) setName(json.product.product_name);
        } catch {
          /* pas de réseau ou produit inconnu : on ignore */
        }
      }
    },
    [mode, stopCamera],
  );

  const startCamera = useCallback(async () => {
    setFeedback(null);
    setManualMode(false);
    setIsScanning(true);
    // Laisser le DOM peindre le conteneur avant d'attacher la caméra
    setTimeout(async () => {
      const scanner = new Html5Qrcode(READER_ID, {
        formatsToSupport: BARCODE_FORMATS,
        verbose: false,
      });
      scannerRef.current = scanner;

      // Liste ORDONNÉE de tentatives. La 1re vise le bon objectif ;
      // les suivantes reproduisent l'ancien comportement qui fonctionnait.
      const attempts: MediaTrackConstraints[] = [];
      try {
        const cameras = await Html5Qrcode.getCameras();
        const id = pickBackCameraId(cameras);
        if (id) attempts.push({ deviceId: { exact: id } });
      } catch {
        /* énumération impossible : on s'appuiera sur facingMode */
      }
      attempts.push({ facingMode: { ideal: "environment" } });
      // attempts.push({ facingMode: "environment" });

      const config = { fps: 10, qrbox: { width: 260, height: 160 } };
      let started = false;

      for (let i = 0; i < attempts.length; i++) {
        try {
          await scanner.start(
            attempts[i],
            config,
            (decoded) => onScanned(decoded),
            () => {
              /* erreurs de frame ignorées */
            },
          );
          started = true;
          break;
        } catch {
          // Caméra peut-être encore occupée : court délai avant le repli
          await new Promise((r) => setTimeout(r, 250));
        }
      }

      if (!started) {
        setIsScanning(false);
        setFeedback({
          type: "error",
          message:
            "Caméra inaccessible. Vérifie les autorisations, ou saisis le code à la main.",
        });
        return;
      }
      runningRef.current = true;

      // Améliorations best-effort APRÈS démarrage : autofocus puis léger zoom.
      // Aucune ne peut faire échouer le scan.
      try {
        await scanner.applyVideoConstraints({
          advanced: [{ focusMode: "continuous" } as any],
        });
      } catch {
        /* mise au point non réglable : on ignore */
      }
      try {
        const caps: any = scanner.getRunningTrackCapabilities?.();
        if (caps?.zoom) {
          const target = Math.min(2, caps.zoom.max ?? 1);
          if (target > (caps.zoom.min ?? 1)) {
            await scanner.applyVideoConstraints({
              advanced: [{ zoom: target } as any],
            });
          }
        }
      } catch {
        /* zoom non supporté : on ignore */
      }
    }, 80);
  }, [onScanned]);

  const resetAll = () => {
    setBarcode("");
    setTempBarcode("");
    setName("");
    setQuantity("1");
    setExpirationDate("");
    setCategory("");
    setUnit("pièce");
    setPurchasePrice("");
    setSellPrice("");
    setMinThreshold("5");
    setManualMode(false);
  };

  const switchMode = async (next: AppMode) => {
    if (next === mode) return;
    await stopCamera();
    resetAll();
    setFeedback(null);
    setMode(next);
  };

  /* --------------------------------- ADD --------------------------------- */
  const submitAdd = async () => {
    const qty = parseInt(quantity, 10);
    if (!barcode || !qty || qty <= 0 || !expirationDate) {
      setFeedback({
        type: "error",
        message: "Code-barres, quantité et date de péremption sont requis.",
      });
      return;
    }
    setFeedback(null);
    try {
      const payload: AddStockPayload = {
        barcode,
        name: name.trim() || undefined,
        quantity: qty,
        expirationDate: toApiDate(expirationDate),
        category: category.trim() || undefined,
        unit: unit.trim() || undefined,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        sellPrice: sellPrice ? parseFloat(sellPrice) : undefined,
        minThreshold: minThreshold ? parseInt(minThreshold, 10) : undefined,
      };
      
      const message = await addStock(payload);
      
      setFeedback({
        type: "success",
        message,
      });
      resetAll();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message,
      });
    }
  };

  /* --------------------------------- SELL -------------------------------- */
  const submitSell = async () => {
    const qty = parseInt(quantity, 10);
    if (!barcode || !qty || qty <= 0) {
      setFeedback({
        type: "error",
        message: "Code-barres et quantité requis.",
      });
      return;
    }
    setFeedback(null);
    try {
      const result = await sellProduct(barcode, qty);
      setFeedback({
        type: "success",
        message: result.message,
        lowStock: result.lowStock,
      });
      resetAll();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message,
      });
    }
  };

  const hasBarcode = barcode.length > 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-5">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-4 text-lg font-semibold tracking-tight">
          {mode === "add" ? "Entrée de stock" : "Sortie / Vente"}
        </h1>

        {/* Bascule de mode */}
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-neutral-900 p-1">
          <button
            onClick={() => switchMode("add")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
              mode === "add"
                ? "bg-amber-500 text-neutral-950"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <ArrowDownToLine size={16} /> Entrée
          </button>
          <button
            onClick={() => switchMode("sell")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
              mode === "sell"
                ? "bg-amber-500 text-neutral-950"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <ShoppingCart size={16} /> Sortie
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${
              feedback.type === "success"
                ? "border-emerald-800 bg-emerald-950/50 text-emerald-200"
                : "border-red-800 bg-red-950/50 text-red-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            )}
            <div>
              <p>{feedback.message}</p>
              {feedback.type === "success" && feedback.lowStock && (
                <p className="mt-1 font-medium text-red-300">
                  ⚠ Seuil de rupture atteint pour ce produit.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Zone de capture */}
        {!hasBarcode && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            {isScanning ? (
              <div>
                <div
                  id={READER_ID}
                  className="overflow-hidden rounded-xl [&_video]:rounded-xl"
                />
                <button
                  onClick={stopCamera}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-800 py-2.5 text-sm font-medium text-neutral-200"
                >
                  <X size={16} /> Arrêter
                </button>
              </div>
            ) : manualMode ? (
              <div className="space-y-3">
                <label className="block text-sm text-neutral-400">
                  Code-barres
                </label>
                <input
                  autoFocus
                  inputMode="numeric"
                  value={tempBarcode}
                  onChange={(e) => setTempBarcode(e.target.value)}
                  placeholder="Ex : 3250390001234"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base outline-none focus:border-amber-500"
                />
                <button
                  disabled={!tempBarcode.trim()}
                  onClick={() => {
                    setBarcode(tempBarcode);
                    setManualMode(false);
                    setFeedback(null);
                  }}
                  className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-neutral-950 disabled:opacity-40"
                >
                  Valider le code
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                  <ScanLine size={30} />
                </div>
                <p className="text-center text-sm text-neutral-400">
                  Scanne un produit pour{" "}
                  {mode === "add"
                    ? "l'ajouter au stock"
                    : "enregistrer une sortie"}
                  .
                </p>
                <button
                  onClick={startCamera}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-semibold text-neutral-950"
                >
                  <Camera size={18} /> Démarrer le scan
                </button>
                <button
                  onClick={() => setManualMode(true)}
                  className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200"
                >
                  <Keyboard size={16} /> Saisir le code à la main
                </button>
              </div>
            )}
          </div>
        )}

        {/* Formulaire de confirmation après capture */}
        {hasBarcode && (
          <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Code-barres
                </p>
                <p className="font-mono text-sm text-neutral-200">{barcode}</p>
              </div>
              <button
                onClick={resetAll}
                className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs text-neutral-300"
              >
                Changer
              </button>
            </div>

            {mode === "add" ? (
              <>
                <Field label="Nom du produit">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex : Doliprane 1000mg"
                    className="input"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={`Quantité (en ${unit})`}>
                    <input
                      inputMode="numeric"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="input"
                    />
                  </Field>
                  <Field label="Péremption">
                    <input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      className="input"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Unité">
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="input"
                    >
                      <option value="pièce">Pièce</option>
                      <option value="boîte">Boîte</option>
                      <option value="plaquette">Plaquette</option>
                      <option value="flacon">Flacon</option>
                      <option value="tube">Tube</option>
                      <option value="sachet">Sachet</option>
                      <option value="carton">Carton</option>
                      <option value="pack">Pack</option>
                      <option value="pallette">Pallette</option>
                    </select>
                  </Field>
                  <Field label="Seuil d'alerte">
                    <input
                      inputMode="numeric"
                      value={minThreshold}
                      onChange={(e) => setMinThreshold(e.target.value)}
                      className="input"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Prix d'achat unitaire">
                    <input
                      inputMode="decimal"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      placeholder="0.00"
                      className="input"
                    />
                  </Field>
                  <Field label="Prix de vente unitaire">
                    <input
                      inputMode="decimal"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      placeholder="0.00"
                      className="input"
                    />
                  </Field>
                </div>
                <Field label="Catégorie">
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex : Médicaments"
                    className="input"
                  />
                </Field>
                <button
                  onClick={submitAdd}
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-semibold text-neutral-950 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <ArrowDownToLine size={18} />
                  )}
                  Enregistrer l'entrée
                </button>
              </>
            ) : (
              <>
                <Field label="Quantité à sortir">
                  <input
                    autoFocus
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input"
                  />
                </Field>
                <p className="text-xs text-neutral-500">
                  La sortie suit la règle FEFO : les lots qui périment le plus
                  tôt sont déduits en premier.
                </p>
                <button
                  onClick={submitSell}
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-semibold text-neutral-950 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={18} />
                  )}
                  Enregistrer la sortie
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

