import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import BottomNav from "./BottomNav";
import { useAuthStore } from "../stores/useAuthStore";
import TrialExpired from "../components/TrialExpired";

/**
 * Layout des pages protégées : vérifie le token, affiche la page courante
 * (<Outlet/>) et la barre de navigation basse commune.
 * Le padding-bottom évite que le contenu passe sous la barre fixe.
 */
export default function ProtectedLayout(): React.JSX.Element {
  const { token } = useAuthStore();

  // Détecte l'expiration de l'essai (flag localStorage ou événement axios)
  const [trialExpired, setTrialExpired] = useState(
    () => localStorage.getItem("amani_trial_expired") === "true"
  );

  useEffect(() => {
    const handler = () => setTrialExpired(true);
    window.addEventListener("trial-expired", handler);
    return () => window.removeEventListener("trial-expired", handler);
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (trialExpired) {
    return <TrialExpired />;
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