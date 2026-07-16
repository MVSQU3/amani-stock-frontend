import { create } from "zustand";
import { axiosClient, TOKEN_KEY } from "../api/axiosClient";
import type { AuthState } from "../types/auth.interface";

export const useAuthStore = create<AuthState>((set) => {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  const storedUser = localStorage.getItem("amani_user");

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    loading: false,
    error: null,

    login: async (email, phone, password) => {
      set({ loading: true, error: null });
      try {
        const loginmode = email ? "email" : "phone";
        const { data } = await axiosClient.post("/auth/login", { email, phone, password, loginmode });
        const token = data?.token ?? data?.data?.token;
        const user = data?.data?.user;

        if (!token) throw new Error("Token absent de la réponse.");

        localStorage.setItem(TOKEN_KEY, token);
        if (user) localStorage.setItem("amani_user", JSON.stringify(user));

        set({ user, token, loading: false });
      } catch (err: any) {
        set({
          error: err?.response?.data?.message || "Connexion impossible. Vérifiez vos identifiants.",
          loading: false,
        });
        throw err;
      }
    },

    register: async (name, email, phone, password, shopName, type) => {
      set({ loading: true, error: null });
      try {
        await axiosClient.post("/auth/register", { name, email, phone, password, shopName, type });
        set({ loading: false });
      } catch (err: any) {
        set({
          error: err?.response?.data?.message || "Erreur lors de l'inscription.",
          loading: false,
        });
        throw err;
      }
    },

    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("amani_user");
      set({ user: null, token: null });
      // On redirige brutalement vers login pour nettoyer l'état de l'application
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    },

    clearError: () => set({ error: null })
  };
});
