export interface FinanceState {
  financeData: any | null;
  loading: boolean;
  error: string;
  loadFinance: () => Promise<void>;
}
