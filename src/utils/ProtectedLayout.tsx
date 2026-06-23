import { Navigate, Outlet } from "react-router";
import BottomNav from "./BottomNav";
import { useAuthStore } from "../stores/useAuthStore";

/**
 * Layout des pages protégées : vérifie le token, affiche la page courante
 * (<Outlet/>) et la barre de navigation basse commune.
 * Le padding-bottom évite que le contenu passe sous la barre fixe.
 */
export default function ProtectedLayout(): React.JSX.Element {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-neutral-950">
      <main className="pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}