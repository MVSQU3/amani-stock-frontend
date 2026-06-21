import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Loader2, LogIn } from "lucide-react";
import { axiosClient, TOKEN_KEY } from "../api/axiosClient";

/**
 * Écran de connexion.
 * Stocke le token dans localStorage (lu automatiquement par axiosClient),
 * puis redirige vers le scanner.
 */
export default function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email.trim() || !password) {
      setError("Email et mot de passe requis.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosClient.post("/auth/login", {
        email: email.trim(),
        password,
      });
      const token: string | undefined = data?.token ?? data?.data?.token;
      if (!token) throw new Error("Token absent de la réponse.");
      localStorage.setItem(TOKEN_KEY, token);
      // On mémorise l'utilisateur pour l'affichage (en-tête, etc.)
      if (data?.data?.user) {
        localStorage.setItem("amani_user", JSON.stringify(data.data.user));
      }
      navigate("/scan", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Connexion impossible. Vérifie tes identifiants.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/">
            <h1 className="text-2xl font-semibold tracking-tight">Amani Stock</h1>
          </Link>
          <p className="mt-1 text-sm text-neutral-400">
            Connecte-toi pour gérer ton inventaire.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
              Mot de passe
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="input"
            />
          </label>
          <button
            onClick={submit}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-semibold text-neutral-950 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogIn size={18} />
            )}
            Se connecter
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-neutral-500">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
            Inscrivez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}