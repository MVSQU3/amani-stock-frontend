import { ArrowLeft, Lightbulb, PackageOpen, ScanBarcode, ArrowRightLeft } from "lucide-react";
import { Link } from "react-router";

export default function Guide(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-5 pb-24 text-neutral-100">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/settings"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Guide & Conseils</h1>
        </div>

        <div className="space-y-6">
          {/* Section FEFO */}
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="mb-3 flex items-center gap-3 text-amber-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <ArrowRightLeft size={20} />
              </div>
              <h2 className="text-lg font-semibold">Méthode FEFO</h2>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-neutral-300">
              L'application utilise la méthode <strong>FEFO</strong> (First Expired, First Out - Premier Périmé, Premier Sorti). 
              Lors d'une vente, le système déduira automatiquement les lots qui périment en premier.
            </p>
            <div className="rounded-xl bg-neutral-950 p-4 text-sm text-neutral-400">
              <strong className="block text-white mb-1">Organisation physique :</strong>
              Rangez toujours les nouveaux arrivages (dates lointaines) <strong>au fond</strong> des étagères. 
              Placez les produits qui périment bientôt <strong>devant</strong>, pour qu'ils soient saisis en premier par votre équipe.
            </div>
          </section>

          {/* Section Scanner */}
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="mb-3 flex items-center gap-3 text-blue-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <ScanBarcode size={20} />
              </div>
              <h2 className="text-lg font-semibold">Scan Optimal</h2>
            </div>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li className="flex items-start gap-2">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>Évitez les reflets de lumière sur l'emballage plastique du code-barres.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>Si le code est froissé ou effacé, utilisez le mode manuel (bouton clavier) plutôt que de forcer le scan.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>Gardez une distance de 10 à 15 cm avec l'appareil pour que la mise au point se fasse correctement.</span>
              </li>
            </ul>
          </section>

          {/* Section Alertes */}
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="mb-3 flex items-center gap-3 text-emerald-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <PackageOpen size={20} />
              </div>
              <h2 className="text-lg font-semibold">Gestion des Alertes</h2>
            </div>
            
            <div className="space-y-4 text-sm text-neutral-300">
              <div>
                <h3 className="mb-1 font-medium text-white">⏳ Alertes de Péremption</h3>
                <p className="leading-relaxed">
                  L'onglet <strong>Alertes</strong> liste les produits qui arrivent bientôt à échéance. 
                  Dès qu'un produit apparaît dans cette liste, il est conseillé de :
                </p>
                <ul className="mt-2 ml-4 list-disc space-y-1 text-neutral-400">
                  <li>Vérifier qu'il est bien placé <strong>tout devant</strong> sur l'étagère.</li>
                  <li>
                    Envisager une promotion pour accélérer sa vente via notre{" "}
                    <a 
                      href="https://marketplace.amani-stock.pro/"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
                    >
                      marketplace
                    </a>.
                  </li>
                  <li>Le retirer de la vente si la date est dépassée (et saisir une sortie manuelle avec perte).</li>
                </ul>
              </div>

              <div className="h-px w-full bg-neutral-800" />

              <div>
                <h3 className="mb-1 font-medium text-white">📉 Alertes de Rupture (Seuil)</h3>
                <p className="leading-relaxed">
                  Le seuil d'alerte détermine à quel moment vous devez recommander un produit.
                  <strong> Ne mettez pas systématiquement "0" ou "5".</strong>
                </p>
                <div className="mt-2 rounded-lg bg-neutral-950 p-3 text-neutral-400">
                  <span className="block text-white mb-1">Calcul idéal :</span>
                  Si vous vendez environ 2 boîtes par jour et que votre fournisseur met 4 jours à livrer, 
                  le seuil doit être d'au moins <strong>8 boîtes</strong> (2 x 4).
                </div>
              </div>
            </div>
          </section>

          {/* Section Unités et Prix */}
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="mb-3 flex items-center gap-3 text-purple-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <PackageOpen size={20} />
              </div>
              <h2 className="text-lg font-semibold">Unités et Tarification</h2>
            </div>
            <p className="text-sm leading-relaxed text-neutral-300">
              Faites attention à la cohérence entre la quantité entrée et le prix unitaire renseigné.
            </p>
            <div className="mt-3 rounded-lg bg-neutral-950 p-4 text-sm text-neutral-400">
              <strong className="block text-white mb-2">Exemple classique d'erreur :</strong>
              <p className="mb-2">Vous recevez <strong>1 pack d'eau</strong> contenant <strong>6 bouteilles</strong>.</p>
              <ul className="ml-4 list-disc space-y-2 text-neutral-300">
                <li>
                  <span className="text-red-400 font-semibold">Erreur :</span> Entrer "1" en quantité (pack) mais renseigner le prix de vente d'une seule bouteille. Le calcul financier sera faux !
                </li>
                <li>
                  <span className="text-emerald-400 font-semibold">Bonne pratique :</span> Entrez la quantité dans la <strong>plus petite unité vendable</strong> (ex: "6" bouteilles) et renseignez le prix d'achat/vente d'<strong>une</strong> bouteille.
                </li>
              </ul>
            </div>
          </section>

          <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 p-4 text-sm text-amber-500">
            <Lightbulb size={24} className="shrink-0" />
            <p>Une bonne organisation physique est la clé d'un inventaire digital fiable !</p>
          </div>
        </div>
      </div>
    </div>
  );
}
