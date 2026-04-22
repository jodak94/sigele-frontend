import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WhatsappLogo, FacebookLogo, InstagramLogo } from '@phosphor-icons/react';

/* ─── Assets / Contenido ─────────────────────────────────────────────────── */

const FOTO_1 = 'https://assets.sigele.com.py/tenants/richipavon/sobre_mi_1.png';
const FOTO_2 = 'https://assets.sigele.com.py/tenants/richipavon/sobre_mi_2.png';

const REDES = {
    facebook:  null,
    instagram: null,
    whatsapp:  null,
};

const EJES = [
    {
        titulo: 'Política cercana y con resultados',
        texto: 'Nuestro compromiso es estar al lado de la gente, escuchando sus necesidades y actuando con responsabilidad para brindar soluciones reales que mejoren la calidad de vida en cada barrio.',
    },
    {
        titulo: 'Defensa Ciudadana',
        texto: 'Impulsamos la creación de una Defensa Ciudadana para garantizar que cada vecino tenga acceso a orientación legal, protección ante abusos y acompañamiento en situaciones de vulnerabilidad. Nadie debe estar solo frente a la injusticia.',
    },
    {
        titulo: 'Crecimiento económico local',
        texto: 'Apostamos al apoyo a emprendedores y la protección de inversores. Queremos una comunidad donde el trabajo sea valorado, protegido y acompañado con herramientas que permitan progresar con seguridad.',
    },
    {
        titulo: 'Una nueva forma de hacer política',
        texto: 'Este proyecto representa el cambio que hace falta: compromiso, transparencia y cercanía. No venimos a prometer — venimos a cumplir.',
    },
];

/* ─── Colores ─────────────────────────────────────────────────────────────── */

const C = {
    red:         '#C41E2E',
    redDark:     '#9E1020',
    redDeep:     '#780C18',
    redLight:    '#D42535',
    cream:       '#FEF8F6',
    creamBorder: 'rgba(180,20,40,0.12)',
    gold:        '#D4A017',
    white:       '#FFFFFF',
    offWhite:    'rgba(255,245,242,0.92)',
    whiteDim:    'rgba(255,228,222,0.65)',
    whiteFaint:  'rgba(255,210,205,0.3)',
    textDark:    '#2A0810',
    textMid:     '#7A1825',
    textLight:   '#B03040',
};

/* ─── Hooks ──────────────────────────────────────────────────────────────── */

function useFonts() {
    useEffect(() => {
        if (document.getElementById('rp-fonts')) return;
        const link = document.createElement('link');
        link.id = 'rp-fonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap';
        document.head.appendChild(link);
    }, []);
}

function useScrolled(threshold = 10) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > threshold);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, [threshold]);
    return scrolled;
}

/* ─── Sub-componentes ────────────────────────────────────────────────────── */

function CheckIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0, marginTop: '0.15rem' }}>
            <rect width="22" height="22" rx="4" fill={C.red} />
            <path d="M5.5 11.5L9 15L16.5 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function EjeItem({ titulo, texto, index }: { titulo: string; texto: string; index: number }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                gap: '1.25rem',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                background: hovered ? C.white : 'transparent',
                border: `1px solid ${C.creamBorder}`,
                boxShadow: hovered ? '0 4px 20px rgba(180,20,40,0.1)' : 'none',
                transition: 'background 0.25s, box-shadow 0.25s',
                cursor: 'default',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                <CheckIcon />
                {index < EJES.length - 1 && (
                    <div style={{ width: '1px', flex: 1, background: 'rgba(180,20,40,0.2)', minHeight: '1.5rem' }} />
                )}
            </div>
            <div>
                <p style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700, fontSize: '1.05rem',
                    color: C.textDark, letterSpacing: '0.03em',
                    textTransform: 'uppercase', marginBottom: '0.5rem', lineHeight: 1.2,
                }}>{titulo}</p>
                <p style={{
                    fontFamily: 'Barlow, sans-serif', fontSize: '0.92rem',
                    color: C.textMid, lineHeight: 1.75,
                }}>{texto}</p>
            </div>
        </div>
    );
}

function SocialBtn({ href, icon, label, accent = false }: {
    href: string; icon: React.ReactNode; label: string; accent?: boolean;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <a
            href={href} target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.55rem 1.125rem', borderRadius: '3px',
                border: `1.5px solid ${hovered ? C.white : 'rgba(255,255,255,0.4)'}`,
                background: hovered ? (accent ? C.gold : 'rgba(255,255,255,0.15)') : 'rgba(255,255,255,0.08)',
                color: hovered ? (accent ? '#1A0000' : C.white) : C.offWhite,
                textDecoration: 'none',
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', transition: 'all 0.2s',
            }}
        >
            {icon}{label}
        </a>
    );
}

/* ─── Componente principal ───────────────────────────────────────────────── */

export default function RichiPavonPage() {
    useFonts();
    const scrolled = useScrolled();

    useEffect(() => {
        document.title = 'Richi Pavón · Concejal 2026';
    }, []);

    return (
        <div style={{ fontFamily: 'Barlow, sans-serif', minHeight: '100vh', background: '#F5F0EF', color: C.textDark }}>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .rp-fadein   { animation: fadeUp 0.65s ease both; }
                .rp-fadein-1 { animation: fadeUp 0.65s 0.08s  ease both; }
                .rp-fadein-2 { animation: fadeUp 0.65s 0.18s ease both; }
                .rp-fadein-3 { animation: fadeUp 0.65s 0.3s ease both; }
                .rp-fadein-4 { animation: fadeUp 0.65s 0.44s  ease both; }

                .rp-photo-card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(120,12,24,0.22) !important; }
                .rp-photo-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }

                @media (max-width: 720px) {
                    .rp-photos-grid { grid-template-columns: 1fr !important; }
                    .rp-hero-number { font-size: 28vw !important; right: -2vw !important; }
                }
                @media (max-width: 480px) {
                    .rp-ticker-inner { gap: 1.25rem !important; }
                }
            `}</style>

            {/* ── Navbar ─────────────────────────────────────────────────── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: scrolled ? C.redDark : C.red,
                borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.18)' : 'transparent'}`,
                transition: 'background 0.3s, border-color 0.3s',
            }}>
                <div style={{
                    maxWidth: '72rem', margin: '0 auto',
                    padding: '0 clamp(1rem, 4vw, 2rem)',
                    height: '3.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '2rem', height: '2rem', borderRadius: '4px',
                            background: 'rgba(255,255,255,0.2)',
                            border: '1.5px solid rgba(255,255,255,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '0.9rem', color: C.white, lineHeight: 1 }}>RP</span>
                        </div>
                        <span style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 700, fontSize: '0.85rem',
                            color: C.white, letterSpacing: '0.12em', textTransform: 'uppercase',
                        }}>Richi Pavón</span>
                    </div>
                    <span style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontSize: '0.7rem', fontWeight: 600,
                        color: C.whiteDim, letterSpacing: '0.18em', textTransform: 'uppercase',
                    }}>Elecciones 2026</span>
                </div>
            </header>

            {/* ── Hero — afiche centrado sobre rojo ────────────────────── */}
            <section style={{
                background: C.red,
                position: 'relative',
                overflow: 'hidden',
                padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1rem, 4vw, 2rem) clamp(3rem, 6vw, 5rem)',
                textAlign: 'center',
            }}>
                {/* Líneas diagonales decorativas */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: `repeating-linear-gradient(
                        -55deg,
                        transparent,
                        transparent 40px,
                        rgba(255,255,255,0.025) 40px,
                        rgba(255,255,255,0.025) 41px
                    )`,
                }} />

                {/* Número gigante de fondo */}
                <span className="rp-hero-number" style={{
                    position: 'absolute',
                    right: '-1vw',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: 'clamp(10rem, 22vw, 22rem)',
                    color: 'rgba(255,255,255,0.055)',
                    lineHeight: 1,
                    userSelect: 'none',
                    letterSpacing: '-0.04em',
                    pointerEvents: 'none',
                }}>1</span>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Badges */}
                    <div className="rp-fadein" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center',
                    }}>
                        <div style={{
                            padding: '0.35rem 1rem',
                            background: C.gold,
                            borderRadius: '2px',
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 800, fontSize: '0.75rem',
                            color: '#1A0000', letterSpacing: '0.16em', textTransform: 'uppercase',
                        }}>Lista 8 · Opción 1</div>
                        <div style={{
                            padding: '0.35rem 1rem',
                            border: '1px solid rgba(255,255,255,0.35)',
                            borderRadius: '2px',
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 600, fontSize: '0.75rem',
                            color: C.offWhite, letterSpacing: '0.16em', textTransform: 'uppercase',
                        }}>Concejal · Lima</div>
                    </div>

                    {/* Nombre — centrado, con línea dorada entre nombre y apellido */}
                    <div className="rp-fadein-1">
                        <h1 style={{
                            fontFamily: '"Bebas Neue", sans-serif',
                            fontSize: 'clamp(5rem, 14vw, 11rem)',
                            lineHeight: 0.88,
                            letterSpacing: '0.04em',
                            color: C.white,
                            margin: 0,
                        }}>
                            Richi
                        </h1>
                        {/* Línea dorada separadora */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '1rem', margin: '0.6rem 0',
                        }}>
                            <div style={{ flex: 1, maxWidth: '6rem', height: '2px', background: `linear-gradient(to left, ${C.gold}, transparent)` }} />
                            <div style={{
                                width: '8px', height: '8px',
                                background: C.gold,
                                transform: 'rotate(45deg)',
                                flexShrink: 0,
                            }} />
                            <div style={{ flex: 1, maxWidth: '6rem', height: '2px', background: `linear-gradient(to right, ${C.gold}, transparent)` }} />
                        </div>
                        <h1 style={{
                            fontFamily: '"Bebas Neue", sans-serif',
                            fontSize: 'clamp(5rem, 14vw, 11rem)',
                            lineHeight: 0.88,
                            letterSpacing: '0.04em',
                            color: C.gold,
                            margin: 0,
                        }}>
                            Pavón
                        </h1>
                    </div>

                    {/* Ciudad */}
                    <p className="rp-fadein-2" style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 600, fontSize: '0.82rem',
                        color: C.whiteDim, letterSpacing: '0.28em', textTransform: 'uppercase',
                        marginTop: '1.75rem', marginBottom: '1rem',
                    }}>Lima · Paraguay</p>

                    {/* Tagline */}
                    <p className="rp-fadein-3" style={{
                        fontFamily: 'Barlow, sans-serif',
                        fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                        color: C.offWhite, lineHeight: 1.75,
                        maxWidth: '46ch', margin: '0 auto 2.25rem',
                    }}>
                        No venimos a prometer. Venimos a trabajar por cada barrio,
                        cada familia y cada vecino de nuestra ciudad.
                    </p>

                    {/* Redes */}
                    <div className="rp-fadein-4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {REDES.facebook && (
                            <SocialBtn href={REDES.facebook} icon={<FacebookLogo size={16} weight="fill" />} label="Facebook" />
                        )}
                        {REDES.instagram && (
                            <SocialBtn href={REDES.instagram} icon={<InstagramLogo size={16} weight="fill" />} label="Instagram" />
                        )}
                        {REDES.whatsapp && (
                            <SocialBtn href={REDES.whatsapp} icon={<WhatsappLogo size={16} weight="fill" />} label="WhatsApp" accent />
                        )}
                    </div>
                </div>
            </section>

            {/* ── Ticker / franja ─────────────────────────────────────────── */}
            <div style={{
                background: C.redDark,
                borderTop: `1px solid rgba(255,255,255,0.1)`,
                borderBottom: `3px solid ${C.gold}`,
                padding: '0.875rem clamp(1rem, 4vw, 2rem)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}>
                <div className="rp-ticker-inner" style={{
                    display: 'flex', alignItems: 'center',
                    gap: '2rem', flexWrap: 'wrap', justifyContent: 'center',
                }}>
                    {['RP · Lista 8', 'Opción 1', 'Richi Pavón · Concejal', 'Lima 2026'].map((t, i) => (
                        <span key={i} style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 700, fontSize: '0.82rem',
                            color: 'rgba(255,255,255,0.85)', letterSpacing: '0.14em', textTransform: 'uppercase',
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                        }}>
                            {i > 0 && <span style={{ width: '4px', height: '4px', background: C.gold, transform: 'rotate(45deg)', flexShrink: 0 }} />}
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Fotos — cards contenidas, no full-width ──────────────── */}
            <section style={{
                background: '#F5F0EF',
                padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem)',
            }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <p style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 600, fontSize: '0.72rem',
                        color: C.textLight, letterSpacing: '0.22em', textTransform: 'uppercase',
                        marginBottom: '1.5rem', textAlign: 'center',
                    }}>Richi en Lima</p>

                    <div className="rp-photos-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.25rem',
                        maxWidth: '900px',
                        margin: '0 auto',
                    }}>
                        {/* Imagen 1 */}
                        <div className="rp-photo-card" style={{
                            borderRadius: '0.375rem',
                            overflow: 'hidden',
                            boxShadow: '0 8px 28px rgba(120,12,24,0.14)',
                            border: `2px solid ${C.red}`,
                            aspectRatio: '938 / 496',
                        }}>
                            <img
                                src={FOTO_1}
                                alt="Richi Pavón"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>

                        {/* Imagen 2 */}
                        <div className="rp-photo-card" style={{
                            borderRadius: '0.375rem',
                            overflow: 'hidden',
                            boxShadow: '0 8px 28px rgba(120,12,24,0.14)',
                            border: `2px solid ${C.red}`,
                            aspectRatio: '938 / 496',
                        }}>
                            <img
                                src={FOTO_2}
                                alt="Richi Pavón en Lima"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Ejes Principales ─────────────────────────────────────────── */}
            <section style={{ background: C.cream, padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1rem, 4vw, 2rem)' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

                    <div style={{ marginBottom: '3rem' }}>
                        <p style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 600, fontSize: '0.72rem',
                            color: C.textLight, letterSpacing: '0.22em', textTransform: 'uppercase',
                            marginBottom: '0.875rem',
                        }}>Programa de gobierno</p>
                        <h2 style={{
                            fontFamily: '"Bebas Neue", sans-serif',
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            lineHeight: 0.95, letterSpacing: '0.02em', color: C.textDark,
                        }}>
                            Ejes principales<br />
                            <span style={{ color: C.red }}>de mis proyectos</span>
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                            <div style={{ width: '3rem', height: '2px', background: C.red }} />
                            <div style={{ flex: 1, maxWidth: '8rem', height: '1px', background: C.creamBorder }} />
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
                        gap: '0.5rem',
                    }}>
                        {EJES.map((eje, i) => (
                            <EjeItem key={i} titulo={eje.titulo} texto={eje.texto} index={i} />
                        ))}
                    </div>

                    <div style={{
                        marginTop: '3rem',
                        padding: '2rem 2.5rem',
                        background: C.red,
                        borderRadius: '0.5rem',
                        boxShadow: `0 8px 32px rgba(180,20,40,0.25)`,
                    }}>
                        <p style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 700,
                            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                            color: C.white, letterSpacing: '0.02em',
                            textTransform: 'uppercase', lineHeight: 1.3,
                        }}>
                            "Porque no venimos a prometer,{' '}
                            <span style={{ color: C.gold }}>venimos a cumplir.</span>"
                        </p>
                        <p style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 600, fontSize: '0.8rem',
                            color: C.whiteDim, letterSpacing: '0.15em',
                            textTransform: 'uppercase', marginTop: '0.75rem',
                        }}>— Richi Pavón</p>
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer style={{
                background: C.redDeep,
                borderTop: `1px solid rgba(255,255,255,0.08)`,
                padding: '2rem clamp(1rem, 4vw, 2rem)',
            }}>
                <div style={{
                    maxWidth: '72rem', margin: '0 auto',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.15)', borderRadius: '3px' }}>
                            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.1rem', color: C.white, letterSpacing: '0.04em' }}>RP1</span>
                        </div>
                        <span style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontSize: '0.78rem', fontWeight: 600,
                            color: C.whiteFaint, letterSpacing: '0.1em', textTransform: 'uppercase',
                        }}>Richi Pavón · Concejal 2026</span>
                    </div>

                    <p style={{ fontFamily: 'Barlow, sans-serif', fontSize: '0.75rem', color: C.whiteFaint, textAlign: 'center' }}>
                        Página creada con{' '}
                        <span style={{ color: C.whiteDim, fontWeight: 600 }}>SIGELE</span>.
                        Si estás en campaña, podés tener la tuya.
                    </p>

                    <a
                        href="https://wa.me/595985851696?text=Hola%2C+me+interesa+obtener+m%C3%A1s+informaci%C3%B3n+sobre+SIGELE."
                        target="_blank" rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                            padding: '0.45rem 1.125rem', borderRadius: '2rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.06)',
                            color: C.whiteDim, fontSize: '0.78rem', fontWeight: 600,
                            fontFamily: 'Barlow, sans-serif', textDecoration: 'none',
                            transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = C.white; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = C.whiteDim; }}
                    >
                        <WhatsappLogo size={14} weight="fill" color="#25d366" />
                        Contactanos
                    </a>

                    <Link
                        to="/padron"
                        style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontSize: '0.68rem', fontWeight: 600,
                            color: C.whiteFaint, textDecoration: 'none',
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.whiteDim)}
                        onMouseLeave={e => (e.currentTarget.style.color = C.whiteFaint)}
                    >
                        Acceso al portal
                    </Link>
                </div>
            </footer>
        </div>
    );
}
