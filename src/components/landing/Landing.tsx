import React, { useState, useEffect, type JSX } from 'react';
import { useNavigate } from 'react-router';

type Role = 'gerant' | 'gestionnaire' | 'employe';

interface RoleMeta {
  name: string;
  hue: string;
  ink: string;
  scope: string;
  icon: JSX.Element;
}

interface PermissionDef {
  label: string;
  ger: 'ok' | 'val' | 'no';
  ges: 'ok' | 'val' | 'no';
  emp: 'ok' | 'val' | 'no';
}

interface Stage {
  n: string;
  title: string;
  stat: string;
  statLabel: string;
  desc: string;
}

const AmaniStockLanding: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [role, setRole] = useState<Role>('gerant');

  // Auto-rotate 3D circuit every 2.6s
  useEffect(() => {
    const iv = setInterval(() => {
      setStage((s) => (s + 1) % 4);
    }, 2600);
    return () => clearInterval(iv);
  }, []);

  const goToStage = (i: number) => {
    setStage(i);
  };

  // ===== 3D circuit positioning =====
  const crateXY = [[27, 27], [159, 27], [159, 159], [27, 159]];
  const ringXY = [[0, 0], [132, 0], [132, 132], [0, 132]];

  const crateStyle: React.CSSProperties = {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '34px',
    height: '34px',
    transformStyle: 'preserve-3d',
    transition: 'transform .85s cubic-bezier(.55,.1,.25,1)',
    transform: `translate3d(${crateXY[stage][0]}px,${crateXY[stage][1]}px,31px)`,
  };

  const shadowStyle: React.CSSProperties = {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '34px',
    height: '34px',
    transition: 'transform .85s cubic-bezier(.55,.1,.25,1)',
    transform: `translate3d(${crateXY[stage][0]}px,${crateXY[stage][1]}px,1px)`,
  };

  const ringStyle: React.CSSProperties = {
    position: 'absolute',
    left: '24px',
    top: '24px',
    width: '40px',
    height: '40px',
    transition: 'transform .85s cubic-bezier(.55,.1,.25,1)',
    transform: `translate3d(${ringXY[stage][0]}px,${ringXY[stage][1]}px,.7px)`,
  };

  // ===== Stages =====
  const stages: Stage[] = [
    {
      n: '01',
      title: 'Arrivage',
      stat: '+48 unités',
      statLabel: '3 lots · Doliprane, Riz, Lait UHT',
      desc: "On scanne le code-barres : nom, quantité et date de péremption. Le lot entre en stock, horodaté.",
    },
    {
      n: '02',
      title: 'En stock',
      stat: '1 240 unités',
      statLabel: '86 lots actifs, triés par péremption',
      desc: 'Chaque lot est suivi à l\'unité. Le stock se range tout seul, du plus urgent au plus lointain.',
    },
    {
      n: '03',
      title: 'Vente — FEFO',
      stat: '−5 boîtes',
      statLabel: 'lot exp. 23 juin déduit en premier',
      desc: 'À la sortie, le lot le plus urgent part d\'abord. Un produit périmé ne peut jamais être vendu.',
    },
    {
      n: '04',
      title: 'Alertes',
      stat: '3 alertes',
      statLabel: '≈ 22 000 FCFA de pertes évitées',
      desc: "Péremption proche ou stock bas : l'alerte remonte pendant qu'il est encore temps d'agir.",
    },
  ];

  const active = stages[stage];

  const chips = stages.map((st, i) => ({
    n: st.n,
    label: st.title.replace(' — FEFO', ''),
    idx: i,
  }));

  // ===== Role metadata =====
  const roleMeta: Record<Role, RoleMeta> = {
    gerant: {
      name: 'Gérant',
      hue: '245,165,36',
      ink: '#f5a524',
      scope:
        'Propriétaire de la boutique — contrôle total, nomination du gestionnaire.',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
          <path d="M5 20h14" />
        </svg>
      ),
    },
    gestionnaire: {
      name: 'Gestionnaire',
      hue: '167,139,250',
      ink: '#a78bfa',
      scope: "La boutique lui est confiée — pilote l'équipe et les chiffres, hors facturation.",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      ),
    },
    employe: {
      name: 'Employé',
      hue: '14,165,233',
      ink: '#38bdf8',
      scope: 'Au comptoir — scanne, vend en FEFO, sans toucher aux chiffres.',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  };

  const rm = roleMeta[role];

  // ===== Permissions =====
  const permDefs: PermissionDef[] = [
    {
      label: 'Scanner les arrivages (entrées)',
      ger: 'ok',
      ges: 'ok',
      emp: 'ok',
    },
    { label: 'Enregistrer les ventes (FEFO)', ger: 'ok', ges: 'ok', emp: 'ok' },
    { label: 'Sortie pour perte', ger: 'ok', ges: 'ok', emp: 'val' },
    { label: 'Modifier ou supprimer un lot', ger: 'ok', ges: 'ok', emp: 'no' },
    {
      label: "Voir marges, prix d'achat & C.A.",
      ger: 'ok',
      ges: 'ok',
      emp: 'no',
    },
    { label: 'Gérer le personnel & les rôles', ger: 'ok', ges: 'ok', emp: 'no' },
    {
      label: 'Facturation & propriété de la boutique',
      ger: 'ok',
      ges: 'no',
      emp: 'no',
    },
  ];

  const statusMap: Record<'ok' | 'val' | 'no', { label: string; color: string; hue: string }> = {
    ok: { label: 'Autorisé', color: '#34d399', hue: '16,185,129' },
    val: { label: 'Sur validation', color: '#f5a524', hue: '245,165,36' },
    no: { label: 'Restreint', color: '#8a8a92', hue: '255,255,255' },
  };

  const perms = permDefs.map((p) => {
    const code = role === 'gerant' ? p.ger : role === 'gestionnaire' ? p.ges : p.emp;
    const m = statusMap[code];
    return { label: p.label, code, status: m };
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0b',
        color: '#f4f3f1',
        fontFamily: "'Inter', system-ui, sans-serif",
        lineHeight: '1.55',
        WebkitFontSmoothing: 'antialiased',
        margin: 0,
        padding: 0,
      }}
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");
        @keyframes amani-spin { to { transform: rotateZ(360deg); } }
        @keyframes amani-bob { 0%,100% { transform: translateZ(0); } 50% { transform: translateZ(9px); } }
        @keyframes amani-pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        @keyframes amani-dash { to { stroke-dashoffset: -64; } }
        @keyframes amani-shimmer { to { background-position: 220% 0; } }
        @keyframes amani-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        body { margin: 0; }

        .page-container {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 22px;
        }
        .hero-buttons {
          display: flex;
          gap: 11px;
          flex-wrap: wrap;
        }
        .features-grid {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .heat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .circuit-container {
          display: block;
        }
        .circuit-text {
          margin-bottom: 20px;
        }
        .circuit-scene {
          margin: 0 auto;
          width: 100%;
          max-width: 400px;
        }
        
        @media (min-width: 900px) {
          section {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
          }
          .hero-text-container {
            text-align: center;
            max-width: 860px;
            margin: 0 auto;
          }
          .hero-text-container h1 {
            font-size: 68px !important;
            line-height: 1.02 !important;
            margin-bottom: 28px !important;
          }
          .hero-text-container p {
            font-size: 19px !important;
            margin-bottom: 36px !important;
          }
          .hero-buttons {
            justify-content: center;
          }
          .features-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
          .heat-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
          .staff-grid {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 60px;
            align-items: start;
          }
          .circuit-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 60px;
          }
          .circuit-text {
            flex: 1;
            margin-bottom: 0;
          }
          .circuit-scene {
            flex: 1;
          }
        }
      `}</style>

      {/* ========== HEADER ========== */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'linear-gradient(180deg,rgba(10,10,11,.96),rgba(10,10,11,.78))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(42,42,48,.55)',
        }}
      >
        <div className="page-container" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '7px',
                background: 'linear-gradient(135deg,#f5a524,#f97316 55%,#e5484d)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.12)',
              }}
            />
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: '17px',
                letterSpacing: '-.02em',
              }}
            >
              Amani&nbsp;Stock
            </span>
          </div>
          <button
            onClick={() => navigate('/register')}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#1a1200',
              background: '#f5a524',
              padding: '8px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            S'inscrire
          </button>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section style={{ padding: '30px 0 8px' }}>
        <div className="page-container hero-text-container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#9b9ba3', fontWeight: 600, marginBottom: '18px' }}>
            <span style={{ width: '24px', height: '3px', borderRadius: '3px', background: 'linear-gradient(90deg,#f5a524,#f97316 55%,#e5484d)' }} />
            Stock périssable, zéro angle mort
          </div>
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: '34px',
              lineHeight: 1.07,
              letterSpacing: '-.03em',
              margin: '0 0 15px',
            }}
          >
            Tout votre stock,<br />
            du carton au{' '}
            <span
              style={{
                background: 'linear-gradient(90deg,#f5a524,#f97316 60%,#e5484d)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              comptoir
            </span>
            .
          </h1>
          <p style={{ fontSize: '15.5px', color: '#9b9ba3', margin: '0 0 22px' }}>
            On scanne l'arrivage, on vend en{' '}
            <strong style={{ color: '#f4f3f1', fontWeight: 600 }}>FEFO strict</strong>, on alerte avant la péremption — et
            désormais chaque membre de l'équipe a juste les accès qu'il lui faut.
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => navigate('/register')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1a1200',
                background: '#f5a524',
                padding: '13px 20px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Créer ma boutique
            </button>
            <button
              onClick={() => document.getElementById('circuit')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#f4f3f1',
                border: '1px solid #2a2a30',
                padding: '13px 18px',
                borderRadius: '12px',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              Voir le circuit
            </button>
          </div>
          <div style={{ marginTop: '18px', fontSize: '12.5px', color: '#9b9ba3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 11px #10b981' }} />
            Pensé pour le mobile — utilisable d'une main, derrière le comptoir.
          </div>
        </div>
      </section>

      {/* heat divider */}
      <div
        style={{
          height: '3px',
          margin: '26px 0 0',
          background: 'linear-gradient(90deg,#f5a524,#f97316 55%,#e5484d)',
          backgroundSize: '220% 100%',
          animation: 'amani-shimmer 6s linear infinite',
          opacity: 0.8,
        }}
      />

      {/* ========== 3D STOCK CIRCUIT ========== */}
      <section id="circuit" style={{ padding: '36px 0 40px' }}>
        <div className="page-container circuit-container">
          <div className="circuit-text">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#9b9ba3', fontWeight: 600, marginBottom: '14px' }}>
              <span style={{ width: '24px', height: '3px', borderRadius: '3px', background: 'linear-gradient(90deg,#f5a524,#f97316 55%,#e5484d)' }} />
              En 3D, le circuit complet
            </div>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 700,
                fontSize: '27px',
                lineHeight: 1.08,
                letterSpacing: '-.02em',
                margin: '0 0 6px',
              }}
            >
              Un produit, du quai à la vente.
            </h2>
            <p style={{ fontSize: '14px', color: '#9b9ba3', margin: '0 0 8px' }}>
              Chaque lot suit le même circuit. Suivez la caisse qui tourne, ou touchez une étape.
            </p>
          </div>

          <div className="circuit-scene">
            {/* 3D Scene */}
        <div
          style={{
            position: 'relative',
            height: '286px',
            margin: '6px -6px 0',
            perspective: '1000px',
            perspectiveOrigin: '50% 42%',
          }}
        >
          {/* ambient glow */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '54%',
              width: '300px',
              height: '230px',
              transform: 'translate(-50%,-50%)',
              background: 'radial-gradient(ellipse at center,rgba(245,165,36,.16),transparent 68%)',
              filter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '220px',
              height: '220px',
              margin: '-110px 0 0 -110px',
              transformStyle: 'preserve-3d',
              transform: 'rotateX(57deg) rotateZ(-46deg)',
            }}
          >
            {/* floor plate */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '16px',
                background: 'linear-gradient(145deg,#17171c,#101014)',
                border: '1px solid #2a2a30',
                boxShadow: '0 26px 40px -14px rgba(0,0,0,.85), inset 0 0 0 1px rgba(255,255,255,.02)',
                backgroundImage: 'linear-gradient(#ffffff09 1px,transparent 1px),linear-gradient(90deg,#ffffff09 1px,transparent 1px)',
                backgroundSize: '100% 100%,36.6px 36.6px,36.6px 36.6px',
              }}
            />

            {/* conveyor loop */}
            <svg
              viewBox="0 0 220 220"
              style={{
                position: 'absolute',
                inset: 0,
                width: '220px',
                height: '220px',
                transform: 'translateZ(1px)',
                overflow: 'visible',
              }}
            >
              <path
                d="M44 44 H176 V176 H44 Z"
                fill="none"
                stroke="#3a2c13"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d="M44 44 H176 V176 H44 Z"
                fill="none"
                stroke="#f5a524"
                strokeWidth="2.4"
                strokeLinejoin="round"
                strokeDasharray="9 13"
                strokeLinecap="round"
                style={{ animation: 'amani-dash 1.6s linear infinite', opacity: 0.85 }}
              />
            </svg>

            {/* pads (static) */}
            {[
              [24, 24],
              [156, 24],
              [156, 156],
              [24, 156],
            ].map((pos, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${pos[0]}px`,
                  top: `${pos[1]}px`,
                  width: '40px',
                  height: '40px',
                  borderRadius: '11px',
                  background: 'rgba(26,26,30,.7)',
                  border: '1px solid #2f2f37',
                  transform: 'translateZ(.5px)',
                }}
              />
            ))}

            {/* traveling active ring */}
            <div style={ringStyle}>
              <div
                style={{
                  position: 'absolute',
                  inset: '-4px',
                  borderRadius: '14px',
                  border: '1.5px solid #f5a524',
                  boxShadow: '0 0 20px 2px rgba(245,165,36,.55), inset 0 0 14px rgba(245,165,36,.3)',
                  animation: 'amani-pulse 2.4s ease-in-out infinite',
                }}
              />
            </div>

            {/* billboarded icons */}
            {[
              [24, 24, 'download'],
              [156, 24, 'package'],
              [156, 156, 'shopping-cart'],
              [24, 156, 'alert'],
            ].map((pos, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${pos[0]}px`,
                  top: `${pos[1]}px`,
                  width: '40px',
                  height: '40px',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: '30px',
                    height: '30px',
                    margin: '-15px 0 0 -15px',
                    borderRadius: '9px',
                    background: '#16161a',
                    border: '1px solid #34343c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f5a524',
                    transform: 'translateZ(30px) rotateZ(46deg) rotateX(-57deg)',
                    boxShadow: '0 6px 14px rgba(0,0,0,.5)',
                  }}
                >
                  <IconByName name={pos[2] as string} />
                </div>
              </div>
            ))}

            {/* crate shadow */}
            <div style={shadowStyle}>
              <div
                style={{
                  position: 'absolute',
                  inset: '-4px',
                  borderRadius: '50%',
                  background: 'radial-gradient(closest-side,rgba(0,0,0,.55),transparent)',
                  filter: 'blur(2.5px)',
                }}
              />
            </div>

            {/* traveling crate (3D cube) */}
            <div style={crateStyle}>
              <div style={{ width: '34px', height: '34px', transformStyle: 'preserve-3d', animation: 'amani-bob 2.4s ease-in-out infinite' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    transformStyle: 'preserve-3d',
                    animation: 'amani-spin 16s linear infinite',
                  }}
                >
                  {/* cube faces */}
                  {[
                    { color: '#e0941f', border: '#a86a14', tz: 17 },
                    { color: '#b9741a', border: '#8a5614', tz: 17, ry: 180 },
                    { color: '#c97f1b', border: '#8a5614', tz: 17, ry: 90 },
                    { color: '#d98a1f', border: '#8a5614', tz: 17, ry: -90 },
                    { color: '#f7b955', border: 'none', tz: 17, rx: 90 },
                    { color: '#7a4d12', border: 'none', tz: 17, rx: -90 },
                  ].map((face, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '34px',
                        height: '34px',
                        background: face.color,
                        border: face.border ? `1px solid ${face.border}` : 'none',
                        boxSizing: 'border-box',
                        transform: `
                          ${face.ry ? `rotateY(${face.ry}deg)` : ''}
                          ${face.rx ? `rotateX(${face.rx}deg)` : ''}
                          translateZ(${face.tz}px)
                        `,
                        boxShadow: face.color === '#f7b955' ? 'inset 0 0 0 1px #c8881c' : undefined,
                      }}
                    >
                      {face.color === '#f7b955' && (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: 0,
                              width: '5px',
                              height: '100%',
                              marginLeft: '-2.5px',
                              background: 'rgba(180,110,20,.55)',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: 0,
                              height: '5px',
                              width: '100%',
                              marginTop: '-2.5px',
                              background: 'rgba(180,110,20,.55)',
                            }}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* stage chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '7px', marginTop: '14px' }}>
          {chips.map((chip) => (
            <button
              key={chip.idx}
              onClick={() => goToStage(chip.idx)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: '10px 4px',
                borderRadius: '11px',
                cursor: 'pointer',
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif",
                background: stage === chip.idx ? 'rgba(245,165,36,.12)' : '#141417',
                border: stage === chip.idx ? '1px solid rgba(245,165,36,.5)' : '1px solid #2a2a30',
                color: stage === chip.idx ? '#f5a524' : '#9b9ba3',
                transition: 'all .25s ease',
              }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', opacity: 0.7 }}>
                {chip.n}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, lineHeight: 1.1 }}>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* active stage detail */}
        <div
          style={{
            marginTop: '12px',
            background: '#141417',
            border: '1px solid #2a2a30',
            borderRadius: '16px',
            padding: '16px 16px 17px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#f5a524' }}>
                {active.n}
              </span>
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 700,
                  fontSize: '18px',
                  letterSpacing: '-.01em',
                }}
              >
                {active.title}
              </span>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 700,
                  fontSize: '17px',
                  color: '#f5a524',
                  letterSpacing: '-.01em',
                }}
              >
                {active.stat}
              </div>
            </div>
          </div>
          <p style={{ fontSize: '13.5px', color: '#9b9ba3', margin: '0 0 9px' }}>{active.desc}</p>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#6f6f78' }}>
            {active.statLabel}
          </div>
        </div>
          </div>
        </div>
      </section>

      {/* ========== STAFF MANAGEMENT ========== */}
      <section
        style={{
          padding: '38px 0 40px',
          background: '#141417',
          borderTop: '1px solid #21212600',
          borderBottom: '1px solid #21212600',
        }}
      >
        <div className="page-container staff-grid">
          <div className="staff-left">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
              <span
                style={{
                  fontSize: '10px',
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#1a1200',
                  background: '#f5a524',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                Nouveau
              </span>
              <span
                style={{
                  fontSize: '11px',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#9b9ba3',
                  fontWeight: 600,
                }}
              >
                Gestion du personnel
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 700,
                fontSize: '27px',
                lineHeight: 1.08,
                letterSpacing: '-.02em',
                margin: '0 0 6px',
              }}
            >
              Votre équipe, chacun à sa place.
            </h2>
            <p style={{ fontSize: '14px', color: '#9b9ba3', margin: '0 0 18px' }}>
              Le gérant possède la boutique et gère la facturation. Il en confie la gestion au gestionnaire, qui pilote
              l'équipe et les chiffres. L'employé, lui, scanne et vend. Choisissez un rôle :
            </p>

            {/* role toggle */}
        <div style={{ display: 'flex', gap: '5px', background: '#0e0e11', border: '1px solid #2a2a30', borderRadius: '13px', padding: '5px', marginBottom: '14px' }}>
          {(['gerant', 'gestionnaire', 'employe'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: '9px 4px',
                borderRadius: '9px',
                cursor: 'pointer',
                fontSize: '12.5px',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                transition: 'all .2s ease',
                whiteSpace: 'nowrap',
                border: '1px solid transparent',
                background: role === r ? rm.ink : 'transparent',
                color: role === r ? '#12100a' : '#9b9ba3',
              }}
            >
              {r === 'gerant' ? 'Gérant' : r === 'gestionnaire' ? 'Gestionnaire' : 'Employé'}
            </button>
          ))}
        </div>

        {/* role card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '13px',
            background: '#0e0e11',
            border: '1px solid #2a2a30',
            borderRadius: '16px',
            padding: '15px 16px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '13px',
              flexShrink: 0,
              background: `rgba(${rm.hue},.15)`,
              border: `1px solid rgba(${rm.hue},.4)`,
              color: rm.ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: '20px',
            }}
          >
            {rm.icon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: '16px' }}>
              {rm.name}
            </div>
            <div style={{ fontSize: '12.5px', color: '#9b9ba3', marginTop: '1px' }}>{rm.scope}</div>
          </div>
        </div>

        {/* permission matrix */}
        <div style={{ background: '#0e0e11', border: '1px solid #2a2a30', borderRadius: '16px', overflow: 'hidden' }}>
          {perms.map((perm, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 15px',
                borderBottom: i < perms.length - 1 ? '1px solid #202026' : 'none',
              }}
            >
              <span style={{ fontSize: '13px', color: '#d8d8dd', paddingRight: '10px' }}>{perm.label}</span>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: '11.5px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  color: perm.status.color,
                  background:
                    perm.code === 'no'
                      ? 'rgba(255,255,255,.04)'
                      : `rgba(${perm.status.hue},.12)`,
                  border:
                    perm.code === 'no'
                      ? '1px solid #2a2a30'
                      : `1px solid rgba(${perm.status.hue},.28)`,
                }}
              >
                {perm.status.label}
              </span>
            </div>
          ))}
        </div>

        {/* team roster */}
        <div style={{ marginTop: '16px' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#6f6f78',
              fontWeight: 600,
              marginBottom: '9px',
            }}
          >
            Votre équipe · 3 membres
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { name: 'Awa Diallo', role: 'Gérant', color: '#f5a524', hue: '245,165,36' },
              {
                name: 'Koffi Mensah',
                role: 'Gestionnaire',
                color: '#a78bfa',
                hue: '167,139,250',
              },
              { name: 'Fatou Bâ', role: 'Employé', color: '#38bdf8', hue: '14,165,233' },
            ].map((member) => (
              <div
                key={member.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  background: '#0e0e11',
                  border: '1px solid #2a2a30',
                  borderRadius: '12px',
                  padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '9px',
                    background: `rgba(${member.hue},.15)`,
                    border: `1px solid rgba(${member.hue},.35)`,
                    color: member.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                    flexShrink: 0,
                  }}
                >
                  {member.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{member.name}</div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: member.color,
                    background: `rgba(${member.hue},.1)`,
                    border: `1px solid rgba(${member.hue},.25)`,
                    padding: '3px 9px',
                    borderRadius: '20px',
                  }}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section style={{ padding: '38px 0 36px' }}>
        <div className="page-container">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              fontSize: '11px',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: '#9b9ba3',
              fontWeight: 600,
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                width: '24px',
                height: '3px',
                borderRadius: '3px',
                background: 'linear-gradient(90deg,#f5a524,#f97316 55%,#e5484d)',
              }}
            />
            Ce que fait Amani Stock
          </div>
          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: '27px',
              lineHeight: 1.08,
              letterSpacing: '-.02em',
              margin: '0 0 18px',
            }}
          >
            Tout le cycle, rien de superflu.
          </h2>
          <div className="features-grid">
          {[
            {
              title: 'Scan entrée & sortie',
              desc: 'Le code-barres enregistre l\'arrivage ou la vente. Caméra optimisée, ou saisie au clavier si besoin.',
              icon: 'scan',
            },
            {
              title: 'Vente FEFO automatique',
              desc: 'Le lot le plus proche de la péremption part en premier. Un lot périmé est exclu de la vente.',
              icon: 'fefo',
            },
            {
              title: 'Alertes péremption & rupture',
              desc: 'Une échelle de chaleur claire pour agir avant de jeter, et le stock bas qui remonte à temps.',
              icon: 'alert',
            },
            {
              title: 'Traçabilité lot par lot',
              desc: 'Chaque entrée, vente et perte est journalisée. Vous savez toujours d\'où vient un écart d\'inventaire.',
              icon: 'trace',
            },
          ].map((feat, i) => (
            <div
              key={i}
              style={{
                background: '#141417',
                border: '1px solid #2a2a30',
                borderRadius: '16px',
                padding: '18px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '11px',
                  background: '#1a1a1e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f5a524',
                  marginBottom: '13px',
                }}
              >
                <FeatureIcon name={feat.icon} />
              </div>
              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 700,
                  fontSize: '17px',
                  margin: '0 0 6px',
                }}
              >
                {feat.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#9b9ba3', margin: 0 }}>{feat.desc}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* ========== HEAT SCALE ========== */}
      <section style={{ padding: '34px 0 38px', background: '#141417' }}>
        <div className="page-container">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              fontSize: '11px',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: '#9b9ba3',
              fontWeight: 600,
              marginBottom: '13px',
            }}
          >
            <span
              style={{
                width: '24px',
                height: '3px',
                borderRadius: '3px',
                background: 'linear-gradient(90deg,#f5a524,#f97316 55%,#e5484d)',
              }}
            />
            Lisible d'un coup d'œil
          </div>
          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: 1.1,
              letterSpacing: '-.02em',
              margin: '0 0 16px',
            }}
          >
            Une couleur, une décision.
          </h2>
          <div className="heat-grid">
          {[
            { color: '#10b981', label: 'Sain', desc: 'Stock confortable, péremption lointaine.' },
            { color: '#f5a524', label: 'Bientôt', desc: 'Entre dans la fenêtre d\'alerte. À écouler.' },
            { color: '#f97316', label: 'Critique', desc: 'Périme sous 7 jours. À pousser tout de suite.' },
            { color: '#e5484d', label: 'Périmé', desc: 'À sortir pour perte, jamais à vendre.' },
          ].map((scale, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #2a2a30',
                borderTop: `3px solid ${scale.color}`,
                borderRadius: '12px',
                padding: '14px',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>{scale.label}</div>
              <div style={{ fontSize: '12px', color: '#9b9ba3' }}>{scale.desc}</div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section style={{ padding: '46px 0 44px', textAlign: 'center' }}>
        <div className="page-container" style={{ maxWidth: '600px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#34d399',
              border: '1px solid rgba(16,185,129,.4)',
              padding: '6px 13px',
              borderRadius: '20px',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 9px #10b981',
              }}
            />
            Tout existe et fonctionne déjà
          </span>
          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: '28px',
              lineHeight: 1.08,
              letterSpacing: '-.02em',
              margin: '0 0 12px',
            }}
          >
            Cherchons nos premiers commerces pilotes.
          </h2>
          <p style={{ fontSize: '14.5px', color: '#9b9ba3', margin: '0 0 24px' }}>
            Pharmacie ou épicerie en Afrique de l'Ouest qui perd de l'argent en produits périmés ? Testez Amani Stock
            sur votre vrai stock.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#1a1200',
              background: '#f5a524',
              padding: '14px 26px',
              borderRadius: '13px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Créer ma boutique
          </button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer
        style={{
          borderTop: '1px solid #2a2a30',
          padding: '24px 0 40px',
        }}
      >
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <span
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg,#f5a524,#f97316 55%,#e5484d)',
              }}
            />
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: '15px',
              }}
            >
              Amani Stock
            </span>
          </div>
          <div style={{ fontSize: '12.5px', color: '#6f6f78' }}>
            Gestion de stock pour produits périssables · Afrique de l'Ouest
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper components
const IconByName: React.FC<{ name: string }> = ({ name }) => {
  const icons: Record<string, JSX.Element> = {
    download: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12" />
        <path d="m7 12 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    ),
    package: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.5 4.27 12 6.81l4.5-2.54" />
        <path d="M21 8.6 12 13.7 3 8.6" />
        <path d="M3 8.6v6.8l9 5.1 9-5.1V8.6L12 3.5 3 8.6Z" />
        <path d="M12 13.7V21" />
      </svg>
    ),
    'shopping-cart': (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21.5 7H6" />
      </svg>
    ),
    alert: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        <path d="M3.3 12a8.7 8.7 0 0 1 17.4 0c0 7 3 9 3 9H.3s3-2 3-9" />
      </svg>
    ),
  };
  return icons[name] || null;
};

const FeatureIcon: React.FC<{ name: string }> = ({ name }) => {
  const icons: Record<string, JSX.Element> = {
    scan: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <path d="M7 8v8" />
        <path d="M11 8v8" />
        <path d="M15 8v8" />
      </svg>
    ),
    fefo: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
      </svg>
    ),
    alert: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    ),
    trace: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="m9 13 2 2 4-4" />
      </svg>
    ),
  };
  return icons[name] || null;
};

export default AmaniStockLanding;
