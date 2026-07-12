import { create } from "zustand";
import type { AdminState, ShopStatusFilter } from "../types/admin.interface";
import {
  deleteShop,
  extendShopTrial,
  fetchPlatformStats,
  fetchShopById,
  fetchShopFinance,
  fetchShopInventory,
  fetchShopLowStock,
  fetchShops,
  updateShopStatus,
} from "../api/admin";

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: null,
  shops: [],
  shopsCount: 0,
  page: 1,
  totalPages: 1,
  search: "",
  status: "all",
  selectedShop: null,
  loading: false,
  detailLoading: false,
  actionLoading: false,
  error: "",

  inventory: [],
  inventorySummary: null,
  inventoryLoading: false,
  inventoryLoaded: false,

  lowStock: [],
  lowStockLoading: false,
  lowStockLoaded: false,

  finance: null,
  financeLoading: false,
  financeLoaded: false,

  loadStats: async () => {
    try {
      const stats = await fetchPlatformStats();
      set({ stats });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Erreur lors du chargement des statistiques." });
    }
  },

  loadShops: async (opts) => {
    const page = opts?.page ?? get().page;
    const search = opts?.search ?? get().search;
    const status = (opts?.status ?? get().status) as ShopStatusFilter;

    set({ loading: true, error: "", page, search, status });
    try {
      const res = await fetchShops({ page, search, status });
      set({
        shops: res.data,
        shopsCount: res.count,
        totalPages: res.totalPages,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Erreur lors du chargement des boutiques.",
        loading: false,
      });
    }
  },

  openShop: async (id: string) => {
    set({
      detailLoading: true,
      error: "",
      inventory: [],
      inventorySummary: null,
      inventoryLoaded: false,
      lowStock: [],
      lowStockLoaded: false,
      finance: null,
      financeLoaded: false,
    });
    try {
      const detail = await fetchShopById(id);
      set({ selectedShop: detail, detailLoading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Erreur lors du chargement de la boutique.",
        detailLoading: false,
      });
    }
  },

  closeShop: () =>
    set({
      selectedShop: null,
      inventory: [],
      inventorySummary: null,
      inventoryLoaded: false,
      lowStock: [],
      lowStockLoaded: false,
      finance: null,
      financeLoaded: false,
    }),

  loadShopInventory: async (id: string) => {
    set({ inventoryLoading: true, error: "" });
    try {
      const res = await fetchShopInventory(id);
      set({ inventory: res.data, inventorySummary: res.summary, inventoryLoading: false, inventoryLoaded: true });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Erreur lors du chargement de l'inventaire.",
        inventoryLoading: false,
      });
    }
  },

  loadShopLowStock: async (id: string) => {
    set({ lowStockLoading: true, error: "" });
    try {
      const data = await fetchShopLowStock(id);
      set({ lowStock: data, lowStockLoading: false, lowStockLoaded: true });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Erreur lors du chargement des ruptures.",
        lowStockLoading: false,
      });
    }
  },

  loadShopFinance: async (id: string) => {
    set({ financeLoading: true, error: "" });
    try {
      const data = await fetchShopFinance(id);
      set({ finance: data, financeLoading: false, financeLoaded: true });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Erreur lors du chargement de l'activité financière.",
        financeLoading: false,
      });
    }
  },

  toggleShopStatus: async (id, action) => {
    set({ actionLoading: true, error: "" });
    try {
      await updateShopStatus(id, action);
      await Promise.all([get().loadShops(), get().openShop(id), get().loadStats()]);
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Erreur lors du changement de statut." });
    } finally {
      set({ actionLoading: false });
    }
  },

  extendTrial: async (id, payload) => {
    set({ actionLoading: true, error: "" });
    try {
      await extendShopTrial(id, payload);
      await Promise.all([get().loadShops(), get().openShop(id), get().loadStats()]);
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Erreur lors de la mise à jour de l'essai." });
    } finally {
      set({ actionLoading: false });
    }
  },

  removeShop: async (id, confirmName) => {
    set({ actionLoading: true, error: "" });
    try {
      await deleteShop(id, confirmName);
      set({ selectedShop: null });
      await Promise.all([get().loadShops(), get().loadStats()]);
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Erreur lors de la suppression." });
      throw err;
    } finally {
      set({ actionLoading: false });
    }
  },
}));
