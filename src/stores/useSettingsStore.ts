import { create } from "zustand";
import { axiosClient } from "../api/axiosClient";
import type { SettingsResponse } from "../api/settings";
import type { SettingsState } from "../types/settings.interface";



export const useSettingsStore = create<SettingsState>((set) => ({
  shop: null,
  user: null,
  team: [],
  loading: true,
  error: "",

  loadSettings: async () => {
    set({ loading: true, error: "" });
    try {
      const response = await axiosClient.get<SettingsResponse>("/auth/settings");
      const { shop, user, teamMember } = response.data.data;
      set({ shop, user, team: teamMember, loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Erreur lors du chargement des paramètres.",
        loading: false,
      });
    }
  },

  addMember: async (data: any) => {
    try {
      await axiosClient.post("/auth/team", data);
      // Recharger pour obtenir l'ID généré
      useSettingsStore.getState().loadSettings();
    } catch (err: any) {
      throw err;
    }
  },

  updateMember: async (id: string, data: any) => {
    try {
      await axiosClient.put(`/auth/team/${id}`, data);
      useSettingsStore.getState().loadSettings();
    } catch (err: any) {
      throw err;
    }
  },

  manageMemberStatus: async (id: string, action: "remove" | "disable") => {
    try {
      await axiosClient.post("/auth/team/action", { id, action });
      useSettingsStore.getState().loadSettings();
    } catch (err: any) {
      throw err;
    }
  },
}));
