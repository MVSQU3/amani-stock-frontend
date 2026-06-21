import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Loader2, UserPlus } from "lucide-react";
import { axiosClient } from "../api/axiosClient";

/**
 * Écran d'inscription.
 * Crée un utilisateur et une boutique, puis redirige vers la connexion.
 */
export default function Register(): React.JSX.Element {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !password || !shopName.trim()) {
      setError("Tous les champs sont requis.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axiosClient.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        shopName: shopName.trim(),
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Erreur lors de l'inscription. Vérifiez les informations."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-8 text-neutral-100 overflow-y-auto">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/">
            <h1 className="text-2xl font-semibold tracking-tight text-amber-500">Amani Stock</h1>
          </Link>
          <p className="mt-1 text-sm text-neutral-400">
            Créez votre compte et votre boutique.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-800 bg-emerald-950/50 p-3 text-sm text-emerald-200">
            Compte créé avec succès ! Redirection vers la connexion...
          </div>
        )}

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
              Nom complet
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-base outline-none focus:border-amber-500"
              placeholder="Ex: Jean Dupont"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
              Nom de la boutique / Pharmacie
            </span>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="input w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-base outline-none focus:border-amber-500"
              placeholder="Ex: Pharmacie Centrale"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-base outline-none focus:border-amber-500"
              placeholder="jean@exemple.com"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
              Mot de passe
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="input w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-base outline-none focus:border-amber-500"
              placeholder="••••••••"
            />
          </label>
          <button
            onClick={submit}
            disabled={loading || success}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-semibold text-neutral-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <UserPlus size={18} />
            )}
            S'inscrire
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-neutral-500">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
            Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
