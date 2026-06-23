import { Navigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

/**
 * Garde de route : si aucun token n'est présent, on renvoie au login.
 * L'expiration du token (401) est gérée séparément par l'intercepteur axios,
 * qui nettoie le localStorage et redirige automatiquement.
 */
export default function ProtectedRoute({
  children,
}: {
  children: React.JSX.Element;
}): React.JSX.Element {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}