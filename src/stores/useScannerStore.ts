import { create } from "zustand";
import { axiosClient } from "../api/axiosClient";
import type { AddStockPayload, ApiResponse, SellResult } from "../types/stock.interface";
import type { ScannerState } from "../types/scanner.interface";

export const useScannerStore = create<ScannerState>((set) => ({
  loading: false,
  error: null,

  addStock: async (payload: AddStockPayload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosClient.post<ApiResponse<unknown>>("/stock/add", payload);
      set({ loading: false });
      return data.message || "Stock ajouté.";
    } catch (err: any) {
      set({ loading: false });
      throw new Error(err?.response?.data?.message || "Échec de l'enregistrement du stock.");
    }
  },

  sellProduct: async (barcode: string, quantity: number) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosClient.post<ApiResponse<SellResult>>("/stock/sell", { barcode, quantity });
      set({ loading: false });
      return {
        message: data.message || `Vente enregistrée. Reste ${data.data.totalRemaining}.`,
        lowStock: data.data.lowStock,
      };
    } catch (err: any) {
      set({ loading: false });
      throw new Error(err?.response?.data?.message || "Échec de la vente.");
    }
  },
}));
