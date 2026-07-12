export interface ShopSummary {
  id: string;
  name: string;
  notificationEmail?: string | null;
  expiryWarningDays: number;
  trialEndsAt: string | null;
  isActive: boolean;
  createdAt: string;
  userCount: number;
}

export interface ShopTeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface ShopDetail {
  shop: Omit<ShopSummary, "userCount">;
  team: ShopTeamMember[];
  stockValue: number;
  stockUnits: number;
  productCount: number;
  soldTodayUnits: number;
  purchasedTodayUnits: number;
}

export interface FinancePeriod {
  today: number;
  "7d": number;
  "14d": number;
  "21d": number;
  "30d": number;
}

export interface ShopFinance {
  in: FinancePeriod;
  out: FinancePeriod;
  loss: {
    perime: number;
    casse: number;
    vole: number;
    autre: number;
  };
}

export type BatchStatus = "expired" | "critical" | "warning" | "healthy";

export interface ShopInventoryBatch {
  id: string;
  quantity: number;
  purchasePrice: number;
  sellPrice: number | null;
  expirationDate: string;
  daysRemaining: number;
  status: BatchStatus;
  value: number;
  Product: {
    name: string;
    barcode: string;
    category: string | null;
    unit: string;
    minThreshold: number;
  };
}

export interface ShopInventorySummary {
  totalValue: number;
  expiredCount: number;
  expiredValue: number;
  criticalCount: number;
  warningCount: number;
  healthyCount: number;
}

export type LowStockStatus = "out_of_stock" | "low";

export interface ShopLowStockProduct {
  id: string;
  name: string;
  barcode: string;
  category: string | null;
  unit: string;
  minThreshold: number;
  totalQuantity: number;
  status: LowStockStatus;
}

export interface PlatformStats {
  shopCount: number;
  activeShopCount: number;
  disabledShopCount: number;
  trialExpiredCount: number;
  expiringSoonCount: number;
  userCount: number;
  totalStockValue: number;
}

export type ShopStatusFilter = "all" | "active" | "disabled" | "trial" | "expired";

export interface AdminState {
  stats: PlatformStats | null;
  shops: ShopSummary[];
  shopsCount: number;
  page: number;
  totalPages: number;
  search: string;
  status: ShopStatusFilter;
  selectedShop: ShopDetail | null;
  loading: boolean;
  detailLoading: boolean;
  actionLoading: boolean;
  error: string;

  inventory: ShopInventoryBatch[];
  inventorySummary: ShopInventorySummary | null;
  inventoryLoading: boolean;
  inventoryLoaded: boolean;

  lowStock: ShopLowStockProduct[];
  lowStockLoading: boolean;
  lowStockLoaded: boolean;

  finance: ShopFinance | null;
  financeLoading: boolean;
  financeLoaded: boolean;

  loadStats: () => Promise<void>;
  loadShops: (opts?: { page?: number; search?: string; status?: ShopStatusFilter }) => Promise<void>;
  openShop: (id: string) => Promise<void>;
  closeShop: () => void;
  toggleShopStatus: (id: string, action: "activate" | "disable") => Promise<void>;
  extendTrial: (id: string, payload: { days?: number; unlimited?: boolean }) => Promise<void>;
  removeShop: (id: string, confirmName: string) => Promise<void>;
  loadShopInventory: (id: string) => Promise<void>;
  loadShopLowStock: (id: string) => Promise<void>;
  loadShopFinance: (id: string) => Promise<void>;
}
