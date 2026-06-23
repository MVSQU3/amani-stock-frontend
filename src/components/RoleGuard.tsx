import type { ReactNode } from "react";
import { useAuthStore } from "../stores/useAuthStore";

/**
 * Rôles disponibles dans l'application.
 * Correspond à l'ENUM backend : "gerant" | "employe" | "gestionnaire" | "admin"
 */
export type Role = "gerant" | "employe" | "gestionnaire" | "admin";

interface RoleGuardProps {
  /** Rôle(s) autorisé(s) à voir le contenu. */
  allowed: Role | Role[];
  /** Contenu affiché si l'utilisateur a le bon rôle. */
  children: ReactNode;
  /** Contenu alternatif affiché si le rôle ne correspond pas (optionnel). */
  fallback?: ReactNode;
}

/**
 * Affiche `children` uniquement si le rôle de l'utilisateur connecté
 * fait partie de la liste `allowed`. Sinon, affiche `fallback` (ou rien).
 *
 * @example
 * // Bouton visible uniquement par le gérant et l'admin
 * <RoleGuard allowed={["gerant", "admin"]}>
 *   <button>Supprimer le lot</button>
 * </RoleGuard>
 *
 * @example
 * // Avec un fallback
 * <RoleGuard allowed="gerant" fallback={<p>Accès réservé au gérant.</p>}>
 *   <AdminPanel />
 * </RoleGuard>
 */
export default function RoleGuard({
  allowed,
  children,
  fallback = null,
}: RoleGuardProps): ReactNode {
  const user = useAuthStore((s) => s.user);
  const roles = Array.isArray(allowed) ? allowed : [allowed];

  if (!user || !roles.includes(user.role as Role)) {
    return fallback;
  }

  return children;
}

/**
 * Hook utilitaire pour vérifier le rôle dans la logique (pas dans le JSX).
 *
 * @example
 * const canDelete = useHasRole(["gerant", "admin"]);
 * if (canDelete) { ... }
 */
export function useHasRole(allowed: Role | Role[]): boolean {
  const user = useAuthStore((s) => s.user);
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  return !!user && roles.includes(user.role as Role);
}
