/** data renvoyée par GET /stock/dashboard. */
export interface DashboardData {
  stockValue: number;
  totalUnits: number;
  batchCount: number;
  productCount: number;
  expiring: { count: number; value: number };
  expired: { count: number; value: number };
  lowStockCount: number;
  soldTodayUnits: number;
  purchasedTodayUnits: number;
  warningDays: number;
}

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string;
  loadDashboard: () => Promise<void>;
}
