import { useEffect, useRef } from "react";
import { Link } from "react-router";
import "./Landing.css";

/**
 * Page d'accueil marketing publique.
 * Tout le style est scopé sous .amani-landing (voir Landing.css) pour ne pas
 * interférer avec le reste de l'application.
 */
export default function Landing(): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Bordure du header au défilement
    const nav = root.querySelector(".nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Révélation progressive au défilement
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
      io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div className="amani-landing" ref={rootRef}>
      <header className="nav">
        <div className="wrap nav-inner">
          <div className="logo">
            <span className="mark" /> Amani&nbsp;Stock
          </div>
          <nav className="nav-links">
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#fefo">FEFO</a>
            <a href="#etapes">Comment ça marche</a>
          </nav>
          <div className="nav-cta">
            <Link to="/login" className="nav-login">
              Se connecter
            </Link>
            <Link to="/register" className="btn btn-primary">
              S'inscrire
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div data-reveal="">
            <span className="eyebrow">Stock périssable, sans angle mort</span>
            <h1>
              Le bon lot vendu <span className="accent">en premier</span>. Toujours.
            </h1>
            <p className="lead">
              Amani Stock gère vos produits périssables au comptoir : on scanne, on
              vend en <strong>FEFO strict</strong>, et on vous alerte avant qu'un
              produit ne périme ou ne tombe en rupture.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Créer un compte
              </Link>
              <a href="#fefo" className="btn btn-ghost">
                Voir la méthode FEFO
              </a>
            </div>
            <div className="hero-note">
              <span className="dot-ok" /> Pensé d'abord pour le mobile — utilisable
              d'une main, derrière le comptoir.
            </div>
          </div>

          <div className="phone-wrap" data-reveal="">
            <div className="phone">
              <div className="screen">
                <div className="screen-head">
                  <span className="title">Alertes</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                    aujourd'hui
                  </span>
                </div>
                <div className="tabs">
                  <div className="tab active">
                    Péremption <span className="badge">3</span>
                  </div>
                  <div className="tab">Ruptures</div>
                </div>

                <div className="lot r1">
                  <div className="lot-top">
                    <div>
                      <div className="lot-name">Sirop contre la toux</div>
                      <div className="lot-code mono">3401560000002</div>
                    </div>
                    <span className="pill red">
                      <i /> Périmé
                    </span>
                  </div>
                  <div className="lot-bot">
                    <span className="urg red">Périmé depuis 10 j</span>
                    <span className="meta">12 flacons · exp. 10-06-2026</span>
                  </div>
                </div>

                <div className="lot r2">
                  <div className="lot-top">
                    <div>
                      <div className="lot-name">Doliprane 1000mg</div>
                      <div className="lot-code mono">3250390001234</div>
                    </div>
                    <span className="pill orange">
                      <i /> Critique
                    </span>
                  </div>
                  <div className="lot-bot">
                    <span className="urg orange">Périme dans 3 j</span>
                    <span className="meta">5 boîtes · exp. 23-06-2026</span>
                  </div>
                </div>

                <div className="lot r3">
                  <div className="lot-top">
                    <div>
                      <div className="lot-name">Lait UHT 1L</div>
                      <div className="lot-code mono">3033710065967</div>
                    </div>
                    <span className="pill amber">
                      <i /> Bientôt
                    </span>
                  </div>
                  <div className="lot-bot">
                    <span className="urg amber">Périme dans 20 j</span>
                    <span className="meta">24 briques · exp. 11-07-2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="heat-line" />

      {/* FEFO SPOTLIGHT */}
      <section id="fefo">
        <div className="wrap">
          <div className="spotlight">
            <div data-reveal="">
              <span className="eyebrow">La règle au cœur du produit</span>
              <h2 style={{ fontSize: "clamp(28px,4.4vw,42px)", margin: "16px 0 16px" }}>
                FEFO : on déstocke d'abord ce qui périme le plus tôt.
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 17, marginBottom: 18 }}>
                À chaque vente, Amani Stock choisit automatiquement le lot dont la
                date de péremption est la plus proche. Vous n'avez rien à calculer,
                et un produit déjà périmé ne peut pas être vendu par erreur.
              </p>
              <p style={{ color: "var(--muted)", fontSize: 15 }}>
                Deux ventes en même temps ? Le stock est verrouillé le temps de
                l'opération : pas de double sortie, pas de stock fantôme.
              </p>
            </div>
            <div className="fefo-demo" data-reveal="">
              <div className="cap">Vente de 5 boîtes de Doliprane</div>
              <div className="fefo-row first">
                <span className="when mono">exp. 23 juin</span>
                <span className="bar">
                  <span style={{ width: "100%", background: "var(--orange)" }} />
                </span>
                <span className="tag">Vendu en 1er</span>
              </div>
              <div className="fefo-row">
                <span className="when mono">exp. 10 juil.</span>
                <span className="bar">
                  <span style={{ width: "100%", background: "var(--amber)" }} />
                </span>
                <span className="tag dim">en attente</span>
              </div>
              <div className="fefo-row">
                <span className="when mono">exp. 06 jan.</span>
                <span className="bar">
                  <span style={{ width: "100%", background: "var(--emerald)" }} />
                </span>
                <span className="tag dim">en attente</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fonctionnalites" style={{ background: "var(--ink-2)" }}>
        <div className="wrap">
          <div className="sec-head" data-reveal="">
            <span className="eyebrow">Ce que fait Amani Stock</span>
            <h2>Tout le cycle de vie d'un produit périssable.</h2>
            <p>
              De l'arrivage jusqu'à la sortie pour perte — chaque étape couverte,
              rien de superflu.
            </p>
          </div>
          <div className="grid">
            <div className="card" data-reveal="">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 7v10M11 7v10M15 7v10M18 7v10" />
                </svg>
              </div>
              <h3>Scan entrée &amp; sortie</h3>
              <p>
                Scannez le code-barres pour enregistrer un arrivage ou une vente.
                Caméra optimisée pour le bon objectif, et saisie au clavier si besoin.
              </p>
            </div>
            <div className="card" data-reveal="">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M5 12H1M23 12h-4" />
                  <circle cx="12" cy="12" r="5" />
                </svg>
              </div>
              <h3>Vente FEFO automatique</h3>
              <p>
                Le lot le plus proche de la péremption part en premier, sans
                intervention. Les lots périmés sont exclus de la vente.
              </p>
            </div>
            <div className="card" data-reveal="">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                </svg>
              </div>
              <h3>Alertes de péremption</h3>
              <p>
                Une échelle de chaleur claire — bientôt, critique, périmé — pour agir
                avant de jeter. Seuil d'alerte réglable pour votre boutique.
              </p>
            </div>
            <div className="card" data-reveal="">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
                </svg>
              </div>
              <h3>Alertes de rupture</h3>
              <p>
                Dès qu'un produit passe sous son seuil, il remonte dans vos alertes —
                rupture totale ou stock bas distingués d'un coup d'œil.
              </p>
            </div>
            <div className="card" data-reveal="">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M9 13l2 2 4-4" />
                </svg>
              </div>
              <h3>Traçabilité des mouvements</h3>
              <p>
                Chaque entrée, vente et perte est journalisée, lot par lot. Vous savez
                toujours d'où vient un écart d'inventaire.
              </p>
            </div>
            <div className="card" data-reveal="">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
                  <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
                  <path d="M12 3v2" />
                  <path d="M3.7 12a8.3 8.3 0 0 1 16.6 0c0 7 3 9 3 9H.7s3-2 3-9" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              </div>
              <h3>Sortie pour perte</h3>
              <p>
                Sortez proprement les lots périmés ou cassés avec un motif. Vos totaux
                restent justes, plus de produits fantômes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="etapes">
        <div className="wrap">
          <div className="sec-head" data-reveal="">
            <span className="eyebrow">Au comptoir, en trois gestes</span>
            <h2>Simple à prendre en main.</h2>
          </div>
          <div className="steps">
            <div className="step" data-reveal="">
              <div className="num">01</div>
              <h3>Scannez l'arrivage</h3>
              <p>
                Code-barres, quantité, date de péremption. Le produit entre en stock
                avec son lot.
              </p>
            </div>
            <div className="step" data-reveal="">
              <div className="num">02</div>
              <h3>Vendez en FEFO</h3>
              <p>
                Scannez à la sortie : le lot le plus urgent est déduit automatiquement,
                en toute sécurité.
              </p>
            </div>
            <div className="step" data-reveal="">
              <div className="num">03</div>
              <h3>Soyez alerté à temps</h3>
              <p>
                Péremption proche ou stock bas : l'alerte arrive pendant qu'il est
                encore temps d'agir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HEAT SCALE */}
      <section style={{ background: "var(--ink-2)" }}>
        <div className="wrap">
          <div className="sec-head" data-reveal="">
            <span className="eyebrow">Lisible d'un coup d'œil</span>
            <h2>Une couleur, une décision.</h2>
            <p>
              La même échelle partout dans l'app : vous savez quoi traiter en priorité
              sans réfléchir.
            </p>
          </div>
          <div className="scale">
            <div className="scale-item s-ok" data-reveal="">
              <div className="lab">Sain</div>
              <div className="desc">Stock confortable, péremption lointaine. Rien à faire.</div>
            </div>
            <div className="scale-item s-w" data-reveal="">
              <div className="lab">Bientôt</div>
              <div className="desc">Entre dans la fenêtre d'alerte. À écouler en priorité.</div>
            </div>
            <div className="scale-item s-c" data-reveal="">
              <div className="lab">Critique</div>
              <div className="desc">Périme sous 7 jours. À pousser tout de suite.</div>
            </div>
            <div className="scale-item s-e" data-reveal="">
              <div className="lab">Périmé</div>
              <div className="desc">À sortir du stock pour perte, jamais à vendre.</div>
            </div>
          </div>
        </div>
      </section>

      {/* HONESTY + CTA */}
      <section id="pilote">
        <div className="wrap honesty" data-reveal="">
          <span className="seal">
            <i /> Tout ce qui est sur cette page existe et fonctionne déjà.
          </span>
          <h2>Cherchons les premiers commerces pilotes.</h2>
          <p>
            Pharmacie ou commerce de détail en Afrique de l'Ouest qui perd de l'argent
            en produits périmés ou en ruptures ? Testez Amani Stock sur votre vrai
            stock et aidez-nous à l'affiner pour votre métier.
          </p>
          <Link
            to="/register"
            className="btn btn-primary"
          >
            Créer ma boutique
          </Link>
        </div>
      </section>

      <footer>
        <div className="wrap foot-inner">
          <div className="logo" style={{ fontSize: 16 }}>
            <span className="mark" style={{ width: 22, height: 22 }} /> Amani Stock
          </div>
          <div>Gestion de stock pour produits périssables · Afrique de l'Ouest</div>
        </div>
      </footer>
    </div>
  );
}
