import { axiosClient } from "./axiosClient";
import type {
  PlatformStats,
  ShopDetail,
  ShopFinance,
  ShopInventoryBatch,
  ShopInventorySummary,
  ShopLowStockProduct,
  ShopStatusFilter,
  ShopSummary,
} from "../types/admin.interface";

/**
 * Toutes ces routes sont réservées au rôle "admin" (super-admin plateforme).
 * Voir amani-stock-backend/src/routes/admin.routes.js
 */

export interface ShopsListResponse {
  success: boolean;
  count: number;
  page: number;
  totalPages: number;
  data: ShopSummary[];
}

export const fetchPlatformStats = async (): Promise<PlatformStats> => {
  const response = await axiosClient.get<{ success: boolean; data: PlatformStats }>("/admin/stats");
  return response.data.data;
};

export const fetchShops = async (params: {
  page?: number;
  search?: string;
  status?: ShopStatusFilter;
}): Promise<ShopsListResponse> => {
  const response = await axiosClient.get<ShopsListResponse>("/admin/shops", { params });
  return response.data;
};

export const fetchShopById = async (id: string): Promise<ShopDetail> => {
  const response = await axiosClient.get<{ success: boolean; data: ShopDetail }>(`/admin/shops/${id}`);
  return response.data.data;
};

export interface ShopInventoryResponse {
  success: boolean;
  count: number;
  warningDays: number;
  summary: ShopInventorySummary;
  data: ShopInventoryBatch[];
}

export const fetchShopInventory = async (id: string): Promise<ShopInventoryResponse> => {
  const response = await axiosClient.get<ShopInventoryResponse>(`/admin/shops/${id}/inventory`);
  return response.data;
};

export const fetchShopLowStock = async (id: string): Promise<ShopLowStockProduct[]> => {
  const response = await axiosClient.get<{ success: boolean; data: ShopLowStockProduct[] }>(
    `/admin/shops/${id}/low-stock`,
  );
  return response.data.data;
};

export const fetchShopFinance = async (id: string): Promise<ShopFinance> => {
  const response = await axiosClient.get<{ success: boolean; data: ShopFinance }>(`/admin/shops/${id}/finance`);
  return response.data.data;
};

export const updateShopStatus = async (id: string, action: "activate" | "disable") => {
  const response = await axiosClient.post(`/admin/shops/${id}/status`, { action });
  return response.data;
};

export const extendShopTrial = async (
  id: string,
  payload: { days?: number; unlimited?: boolean },
) => {
  const response = await axiosClient.post(`/admin/shops/${id}/trial`, payload);
  return response.data;
};

export const deleteShop = async (id: string, confirmName: string) => {
  const response = await axiosClient.delete(`/admin/shops/${id}`, { data: { confirmName } });
  return response.data;
};
