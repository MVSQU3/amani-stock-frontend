import { create } from "zustand";
import { axiosClient } from "../api/axiosClient";
import type { AlertsState, ApiResponse, ExpirationAlert, LowStockItem } from "../types/stock.interface";



export const useAlertsStore = create<AlertsState>((set) => ({
  expiration: [],
  lowStock: [],
  loading: true,
  error: "",

  loadAlerts: async () => {
    set({ loading: true, error: "" });
    try {
      const [exp, low] = await Promise.all([
        axiosClient.get<ApiResponse<ExpirationAlert[]>>("/stock/alerts/expiration"),
        axiosClient.get<ApiResponse<LowStockItem[]>>("/stock/alerts/low-stock"),
      ]);
      set({
        expiration: exp.data.data,
        lowStock: low.data.data,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Impossible de charger les alertes.",
        loading: false,
      });
    }
  },
}));
