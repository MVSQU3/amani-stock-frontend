import { Navigate, Outlet } from "react-router";
import { TOKEN_KEY } from "../api/axiosClient";
import BottomNav from "./BottomNav";

/**
 * Layout des pages protégées : vérifie le token, affiche la page courante
 * (<Outlet/>) et la barre de navigation basse commune.
 * Le padding-bottom évite que le contenu passe sous la barre fixe.
 */
export default function ProtectedLayout(): React.JSX.Element {
  const token = localStorage.getItem(TOKEN_KEY);
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