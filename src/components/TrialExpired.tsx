import { LockKeyhole, Mail } from "lucide-react";

/**
 * Écran de blocage affiché quand la période d'essai de 30 jours est terminée.
 * Remplace l'app entière jusqu'à réactivation manuelle du compte.
 */
export default function TrialExpired(): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm text-center">

        {/* Icône cadenas */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
          <LockKeyhole size={32} />
        </div>

        {/* Titre */}
        <h1 className="mb-2 text-xl font-semibold text-neutral-100">
          Période d'essai terminée
        </h1>

        {/* Message */}
        <p className="mb-6 text-sm leading-relaxed text-neutral-400">
          Votre essai gratuit de <span className="text-neutral-200 font-medium">30 jours</span> est
          arrivé à expiration. Vos données sont conservées et restent
          accessibles dès la réactivation de votre compte.
        </p>

        {/* Contact */}
        <a
          href="mailto:contact@amani-stock.pro"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400"
        >
          <Mail size={16} />
          Contacter pour continuer
        </a>

        <p className="mt-4 text-xs text-neutral-600">
          contact@amani-stock.pro
        </p>
      </div>
    </div>
  );
}
