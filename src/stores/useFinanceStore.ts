import { create } from "zustand";
import { axiosClient } from "../api/axiosClient";
import type { FinanceState } from "../types/finance.interface";

export const useFinanceStore = create<FinanceState>((set) => ({
  financeData: null,
  loading: true,
  error: "",

  loadFinance: async () => {
    set({ loading: true, error: "" });
    try {
      const res = await axiosClient.get("/stock/financial-analytique");
      set({ financeData: res.data.data, loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Impossible de charger les données financières.",
        loading: false,
      });
    }
  },
}));
