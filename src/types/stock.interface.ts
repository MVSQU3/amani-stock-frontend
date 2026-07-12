/* -------------------------------------------------------------------------- */
/*  Types calés sur les réponses RÉELLES du backend Amani Stock                 */
/* -------------------------------------------------------------------------- */

/** Classification réglementaire pharmaceutique d'un produit. */
export type RegulatoryCategory =
  | "libre"
  | "ordonnance"
  | "tableau_a"
  | "tableau_b"
  | "stupefiant";

/** Mode d'utilisation du scanner : entrée d'arrivage ou sortie/vente. */
export type AppMode = "add" | "sell";

/** Enveloppe standard de toutes les réponses de l'API. */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  warningDays?: number;
}

/** Produit (fiche stable d'un article). */
export interface Product {
  id: string;
  shopId: string;
  barcode: string;
  name: string;
  category: string | null;
  unit: string;
  minThreshold: number;
  regulatoryCategory: RegulatoryCategory;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lot de stock.
 * ⚠️ purchasePrice / sellPrice arrivent en STRING (type DECIMAL de Postgres) :
 * pense à parseFloat() avant tout calcul côté front.
 * expirationDate est au format d'affichage "JJ-MM-AAAA".
 */
export interface StockBatch {
  id: string;
  shopId: string;
  productId: string;
  quantity: number;
  purchasePrice: string;
  sellPrice: string | null;
  expirationDate: string;
  lotNumber: string | null;
  supplierId: string | null;
  daysRemaining: number; // négatif si le lot est périmé
  createdAt: string;
  updatedAt: string;
  // Sous-ensemble du produit renvoyé par les routes d'inventaire/alertes
  Product?: Pick<
    Product,
    "id" | "name" | "barcode" | "category" | "unit" | "regulatoryCategory"
  > & {
    minThreshold?: number;
  };
  Supplier?: { id: string; name: string; phone: string | null } | null;
}

/** Fournisseur/grossiste (traçabilité amont d'un lot). */
export interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
}

/** Statut d'urgence calculé par le backend pour la coloration. */
export type ExpirationStatus = "expired" | "critical" | "warning";

/** Lot enrichi du statut, renvoyé par /stock/alerts/expiration. */
export interface ExpirationAlert extends StockBatch {
  status: ExpirationStatus;
}

/** Élément renvoyé par /stock/alerts/low-stock. */
export interface LowStockItem {
  id: string;
  name: string;
  barcode: string;
  category: string | null;
  unit: string;
  minThreshold: number;
  totalQuantity: number;
  status: "out_of_stock" | "low";
}

/* ----------------------------- Payloads d'envoi --------------------------- */

/** Corps de POST /stock/add. expirationDate au format "JJ-MM-AAAA". */
export interface AddStockPayload {
  barcode: string;
  name?: string;
  quantity: number;
  expirationDate: string;
  category?: string;
  unit?: string;
  purchasePrice?: number;
  sellPrice?: number;
  minThreshold?: number;
  lotNumber?: string;
  supplierName?: string;
  regulatoryCategory?: RegulatoryCategory;
}

/** Corps de POST /stock/sell. */
export interface SellPayload {
  barcode: string;
  quantity: number;
}

/** data renvoyée par POST /stock/sell. */
export interface SellResult {
  soldQuantity: number;
  batchesAffected: number;
  totalRemaining: number;
  lowStock: boolean;
}

/** Corps de POST /stock/loss (perte/casse d'un lot précis). */
export interface LossPayload {
  batchId: string;
  quantity: number;
  reason?: string;
}



export interface AlertsState {
  expiration: ExpirationAlert[];
  lowStock: LowStockItem[];
  loading: boolean;
  error: string;
  loadAlerts: () => Promise<void>;
  disposeBatch: (batchId: string, quantity: number) => Promise<void>;
}