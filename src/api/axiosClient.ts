import axios from "axios";

/**
 * Client HTTP centralisé pour toute l'application.
 * - baseURL lue depuis .env (VITE_API_URL), ex: http://localhost:3000/api
 * - le token est injecté automatiquement à chaque requête
 * - une réponse 401 déconnecte l'utilisateur et le renvoie au login
 */
export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" },
});

// Clé unique de stockage du token (réutilisée par le store d'auth)
export const TOKEN_KEY = "amani_token";

// --- Intercepteur de REQUÊTE : on attache le token s'il existe ---------------
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        // ⚠️ Ton middleware lit le token brut (sans préfixe "Bearer"), comme dans
        // tes tests Postman. Si tu passes un jour à la convention "Bearer <token>",
        // c'est l'UNIQUE ligne à modifier.
        config.headers.Authorization = token;
    }
    return config;
});

// --- Intercepteur de RÉPONSE : gestion centralisée du 401 --------------------
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            // Redirection dure : on évite les états zombies après expiration du token
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    },
);