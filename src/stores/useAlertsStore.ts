import { create } from "zustand";
import { axiosClient } from "../api/axiosClient";
import type { AlertsState, ApiResponse, ExpirationAlert, LowStockItem } from "../types/stock.interface";



export const useAlertsStore = create<AlertsState>((set, get) => ({
  expiration: [],
  lowStock: [],
  loading: true,
  error: "",

  disposeBatch: async (batchId: string, quantity: number) => {
    await axiosClient.post("/stock/loss", {
      batchId,
      quantity,
      reason: "Périmé",
    });
    // Retire (ou réduit) le lot localement sans recharger tout l'écran
    set({
      expiration: get()
        .expiration.map((b) =>
          b.id === batchId ? { ...b, quantity: b.quantity - quantity } : b,
        )
        .filter((b) => b.quantity > 0),
    });
  },

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
