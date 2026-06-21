import { NavLink } from "react-router";
import { LayoutGrid, ScanLine, Boxes, Bell, LogOut } from "lucide-react";
import { TOKEN_KEY } from "../api/axiosClient";

/**
 * Barre de navigation basse (pattern mobile).
 * Fixe en bas de l'écran, accessible au pouce.
 */
export default function BottomNav(): React.JSX.Element {
  const base =
    "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition";
  const active = "text-amber-400";
  const inactive = "text-neutral-500 hover:text-neutral-300";
  const cls = ({ isActive }: { isActive: boolean }) =>
    `${base} ${isActive ? active : inactive}`;

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-neutral-800 bg-neutral-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-md">
        <NavLink to="/dashboard" className={cls}>
          <LayoutGrid size={20} />
          Accueil
        </NavLink>
        <NavLink to="/inventory" className={cls}>
          <Boxes size={20} />
          Inventaire
        </NavLink>
        <NavLink to="/scan" className={cls}>
          <ScanLine size={20} />
          Scanner
        </NavLink>
        <NavLink to="/alerts" className={cls}>
          <Bell size={20} />
          Alertes
        </NavLink>
        <button
          onClick={handleLogout}
          className={`${base} text-red-500/80 hover:text-red-500`}
        >
          <LogOut size={20} />
          Quitter
        </button>
      </div>
    </nav>
  );
}
