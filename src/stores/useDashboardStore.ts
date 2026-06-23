import { create } from "zustand";
import { axiosClient } from "../api/axiosClient";
import type { ApiResponse } from "../types/stock.interface";
import type { DashboardData, DashboardState } from "../types/dashboard.interface";


export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: true,
  error: "",

  loadDashboard: async () => {
    set({ loading: true, error: "" });
    try {
      const res = await axiosClient.get<ApiResponse<DashboardData>>("/stock/dashboard");
      set({ data: res.data.data, loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Impossible de charger le tableau de bord.",
        loading: false,
      });
    }
  },
}));
