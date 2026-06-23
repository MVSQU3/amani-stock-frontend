import { create } from "zustand";
import { axiosClient } from "../api/axiosClient";
import type { ApiResponse, StockBatch } from "../types/stock.interface";
import type { InventoryState, Movement } from "../types/inventory.interface";

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  entrees: [],
  sorties: [],
  loading: true,
  error: "",

  loadStock: async () => {
    try {
      const { data } =
        await axiosClient.get<ApiResponse<StockBatch[]>>("/stock/inventory");
      set({ items: data.data });
    } catch (err: any) {
      set({
        error:
          err?.response?.data?.message || "Impossible de charger le stock.",
      });
    } finally {
      set({ loading: false });
    }
  },

  loadMovements: async (days: number) => {
    try {
      const [resIn, resOut] = await Promise.all([
        axiosClient.get<ApiResponse<Movement[]>>(
          `/stock/movements?type=IN&days=${days}`,
        ),
        axiosClient.get<ApiResponse<Movement[]>>(
          `/stock/movements?type=OUT&days=${days}`,
        ),
      ]);
      set({ entrees: resIn.data.data, sorties: resOut.data.data });
    } catch (err: any) {
      set({
        error:
          err?.response?.data?.message ||
          "Impossible de charger les mouvements.",
      });
    } finally {
      set({ loading: false });
    }
  },

  addLoss: async (batchId: string, quantity: number, reason: string) => {
    try {
      await axiosClient.post("/stock/loss", { batchId, quantity, reason });
    } catch (err: any) {
      set({
        error:
          err?.response?.data?.message || "Impossible d'enregistrer la perte.",
      });
    }
  },

  updateBatch: async (id: string, data: any) => {
    try {
      await axiosClient.put(`/stock/batch/${id}`, data);
    } catch (err: any) {
      set({
        error:
          err?.response?.data?.message || "Impossible de mettre à jour le lot.",
      });
    }
  },
}));
