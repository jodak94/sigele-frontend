import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FacebookLogo, InstagramLogo, WhatsappLogo } from '@phosphor-icons/react';

/* ─── Assets / Contenido ─────────────────────────────────────────────────── */

const FOTO = 'https://assets.sigele.com.py/tenants/joelgomez/sobre_mi.png';

const REDES = {
    facebook:  null, //'https://facebook.com/joelgomezconcejal',
    instagram: null, // 'https://instagram.com/joelgomezconcejal',
    whatsapp:  'https://wa.me/595982678308',
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
    // Rojos — familia Colorado, sin subtono azul
    red:       '#C41E2E',   // colorado principal — fondo hero y secciones
    redDark:   '#9E1020',   // rojo más oscuro — gradiente, footer
    redDeep:   '#780C18',   // rojo profundo — footer, hover
    redLight:  '#D42535',   // rojo más vivo — hover en botones

    // Crema / blanco — sección de contenido
    cream:     '#FEF8F6',   // fondo sección ejes
    creamBorder: 'rgba(180,20,40,0.12)',

    // Dorado — acento institucional
    gold:      '#D4A017',
    goldLight: '#E8B820',

    // Texto sobre fondo rojo
    white:     '#FFFFFF',
    offWhite:  'rgba(255,245,242,0.92)',
    whiteDim:  'rgba(255,228,222,0.65)',
    whiteFaint:'rgba(255,210,205,0.3)',

    // Texto sobre fondo crema
    textDark:  '#2A0810',
    textMid:   '#7A1825',
    textLight: '#B03040',
};

/* ─── Hooks ──────────────────────────────────────────────────────────────── */

function useFonts() {
    useEffect(() => {
        if (document.getElementById('jg-fonts')) return;
        const link = document.createElement('link');
        link.id = 'jg-fonts';
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
                border: `1px solid ${hovered ? C.creamBorder : C.creamBorder}`,
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
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: C.textDark,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    lineHeight: 1.2,
                }}>
                    {titulo}
                </p>
                <p style={{
                    fontFamily: 'Barlow, sans-serif',
                    fontSize: '0.92rem',
                    color: C.textMid,
                    lineHeight: 1.75,
                }}>
                    {texto}
                </p>
            </div>
        </div>
    );
}

/* ─── Componente principal ───────────────────────────────────────────────── */

export default function JoelGomezPage() {
    useFonts();
    const scrolled = useScrolled();

    useEffect(() => {
        document.title = 'Joel Gómez · Concejal 2026';
    }, []);

    return (
        <div style={{ fontFamily: 'Barlow, sans-serif', minHeight: '100vh', background: C.red, color: C.white }}>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .jg-fadein   { animation: fadeUp 0.7s ease both; }
                .jg-fadein-1 { animation: fadeUp 0.7s 0.1s  ease both; }
                .jg-fadein-2 { animation: fadeUp 0.7s 0.22s ease both; }
                .jg-fadein-3 { animation: fadeUp 0.7s 0.36s ease both; }
                .jg-fadein-4 { animation: fadeUp 0.7s 0.5s  ease both; }

                @media (max-width: 680px) {
                    .jg-hero-section { min-height: auto !important; }
                    .jg-hero-grid {
                        grid-template-columns: 1fr !important;
                        padding-top: 2rem !important;
                        padding-bottom: 3rem !important;
                    }
                    .jg-text-col  { order: 2; }
                    .jg-photo-col { order: 1; justify-content: center !important; align-items: center !important; }
                    .jg-photo-wrap { width: 60% !important; max-width: 200px !important; }
                    .jg-photo-corner-tl,
                    .jg-photo-corner-br { display: none; }
                    .jg-scroll-hint { display: none; }
                    .jg-monogram-bg { display: none; }
                }
            `}</style>

            {/* ── Navbar ─────────────────────────────────────────────────── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: scrolled ? C.redDark : 'transparent',
                borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.15)' : 'transparent'}`,
                transition: 'background 0.3s, border-color 0.3s',
            }}>
                <div style={{
                    maxWidth: '72rem', margin: '0 auto',
                    padding: '0 clamp(1rem, 4vw, 2rem)',
                    height: '3.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Monograma JG — blanco sobre rojo */}
                        <div style={{
                            width: '2rem', height: '2rem', borderRadius: '4px',
                            background: 'rgba(255,255,255,0.2)',
                            border: '1.5px solid rgba(255,255,255,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <span style={{
                                fontFamily: '"Bebas Neue", sans-serif',
                                fontSize: '1rem', color: C.white,
                                lineHeight: 1, letterSpacing: '0.02em',
                            }}>JG</span>
                        </div>
                        <span style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 700, fontSize: '0.85rem',
                            color: C.white, letterSpacing: '0.12em', textTransform: 'uppercase',
                        }}>
                            Joel Gómez
                        </span>
                    </div>
                    <span style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontSize: '0.7rem', fontWeight: 600,
                        color: C.whiteDim, letterSpacing: '0.18em', textTransform: 'uppercase',
                    }}>
                        Elecciones 2026
                    </span>
                </div>
            </header>

            {/* ── Hero — fondo colorado rojo ────────────────────────────── */}
            <section className="jg-hero-section" style={{
                position: 'relative',
                minHeight: 'calc(100vh - 3.5rem)',
                overflow: 'hidden',
                display: 'flex', alignItems: 'stretch',
                background: `linear-gradient(140deg, ${C.redDark} 0%, ${C.red} 55%, ${C.redLight} 100%)`,
            }}>
                {/* Textura grain sutil */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
                    opacity: 0.5, mixBlendMode: 'multiply',
                }} />
                {/* Viñeta inferior */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
                    background: `linear-gradient(to bottom, transparent, ${C.redDark})`,
                    pointerEvents: 'none',
                }} />

                {/* Contenido */}
                <div className="jg-hero-grid" style={{
                    position: 'relative', zIndex: 1,
                    maxWidth: '72rem', margin: '0 auto', width: '100%',
                    padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem',
                    alignItems: 'center',
                }}>

                    {/* ── Texto izquierdo ── */}
                    <div className="jg-text-col">
                        {/* Badges */}
                        <div className="jg-fadein" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            marginBottom: '1.75rem',
                        }}>
                            <div style={{
                                padding: '0.3rem 0.875rem',
                                background: C.gold,
                                borderRadius: '2px',
                                fontFamily: '"Barlow Condensed", sans-serif',
                                fontWeight: 800, fontSize: '0.72rem',
                                color: '#1A0000', letterSpacing: '0.14em', textTransform: 'uppercase',
                            }}>
                                Lista 2A · Opción 10
                            </div>
                            <div style={{
                                padding: '0.3rem 0.875rem',
                                border: '1px solid rgba(255,255,255,0.4)',
                                borderRadius: '2px',
                                fontFamily: '"Barlow Condensed", sans-serif',
                                fontWeight: 600, fontSize: '0.72rem',
                                color: C.offWhite, letterSpacing: '0.14em', textTransform: 'uppercase',
                            }}>
                                Concejal
                            </div>
                        </div>

                        {/* Nombre */}
                        <h1 className="jg-fadein-1" style={{
                            fontFamily: '"Bebas Neue", sans-serif',
                            fontSize: 'clamp(4.5rem, 10vw, 8rem)',
                            lineHeight: 0.9,
                            letterSpacing: '0.02em',
                            color: C.white,
                            marginBottom: '0.5rem',
                        }}>
                            Joel
                            <br />
                            <span style={{ color: C.gold }}>Gómez</span>
                        </h1>

                        {/* Separador */}
                        <div className="jg-fadein-2" style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            margin: '1.5rem 0',
                        }}>
                            <div style={{ width: '3rem', height: '3px', background: C.gold }} />
                            <span style={{
                                fontFamily: '"Barlow Condensed", sans-serif',
                                fontWeight: 600, fontSize: '0.78rem',
                                color: C.gold, letterSpacing: '0.2em', textTransform: 'uppercase',
                            }}>
                                Con Manuel Aguilar · Intendente
                            </span>
                        </div>

                        {/* Tagline */}
                        <p className="jg-fadein-3" style={{
                            fontFamily: 'Barlow, sans-serif',
                            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                            color: C.offWhite,
                            lineHeight: 1.7,
                            maxWidth: '42ch',
                            marginBottom: '2.25rem',
                        }}>
                            No venimos a prometer. Venimos a trabajar por cada barrio,
                            cada familia y cada vecino de nuestra ciudad.
                        </p>

                        {/* Redes */}
                        <div className="jg-fadein-4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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

                    {/* ── Foto ── */}
                    <div className="jg-photo-col" style={{
                        display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end',
                        position: 'relative',
                    }}>
                        {/* Monograma decorativo */}
                        <span className="jg-monogram-bg" style={{
                            position: 'absolute',
                            bottom: '-1rem', right: '-1rem',
                            fontFamily: '"Bebas Neue", sans-serif',
                            fontSize: 'clamp(8rem, 18vw, 16rem)',
                            color: 'rgba(255,255,255,0.07)',
                            lineHeight: 1,
                            userSelect: 'none',
                            letterSpacing: '-0.02em',
                            zIndex: 0,
                        }}>
                            JG10
                        </span>
                        <div className="jg-photo-wrap" style={{ position: 'relative', zIndex: 1, width: '90%', maxWidth: '400px' }}>
                            {/* Esquinas doradas */}
                            <div className="jg-photo-corner-tl" style={{
                                position: 'absolute', top: '-0.75rem', left: '-0.75rem',
                                width: '2.5rem', height: '2.5rem',
                                borderTop: `3px solid ${C.gold}`, borderLeft: `3px solid ${C.gold}`,
                                zIndex: 2,
                            }} />
                            <div className="jg-photo-corner-br" style={{
                                position: 'absolute', bottom: '-0.75rem', right: '-0.75rem',
                                width: '2.5rem', height: '2.5rem',
                                borderBottom: `3px solid ${C.gold}`, borderRight: `3px solid ${C.gold}`,
                                zIndex: 2,
                            }} />
                            <div style={{
                                borderRadius: '0.5rem', overflow: 'hidden',
                                aspectRatio: '3/4',
                                boxShadow: `0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15)`,
                            }}>
                                <img
                                    src={FOTO}
                                    alt="Joel Gómez"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="jg-scroll-hint" style={{
                    position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 2,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                }}>
                    <span style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                        color: C.whiteFaint,
                    }}>Ver más</span>
                    <div style={{ width: '1px', height: '2rem', background: `linear-gradient(to bottom, ${C.whiteFaint}, transparent)` }} />
                </div>
            </section>

            {/* ── Franja lista — tono más oscuro para separar del hero ─── */}
            <div style={{
                background: C.redDark,
                borderTop: `1px solid rgba(255,255,255,0.1)`,
                borderBottom: `1px solid rgba(255,255,255,0.1)`,
                padding: '0.875rem clamp(1rem, 4vw, 2rem)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: '2rem', flexWrap: 'wrap',
            }}>
                {['JG10', 'Lista 2A', 'Opción 10', 'Joel Gómez · Concejal', 'Manuel Aguilar · Intendente'].map((t, i) => (
                    <span key={i} style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        fontWeight: 700, fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.8)', letterSpacing: '0.14em', textTransform: 'uppercase',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}>
                        {i > 0 && <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />}
                        {t}
                    </span>
                ))}
            </div>

            {/* ── Ejes Principales — fondo crema, contraste ────────────── */}
            <section style={{ background: C.cream, padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1rem, 4vw, 2rem)' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

                    {/* Título */}
                    <div style={{ marginBottom: '3rem' }}>
                        <p style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 600, fontSize: '0.72rem',
                            color: C.textLight, letterSpacing: '0.22em', textTransform: 'uppercase',
                            marginBottom: '0.875rem',
                        }}>
                            Programa de gobierno
                        </p>
                        <h2 style={{
                            fontFamily: '"Bebas Neue", sans-serif',
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            lineHeight: 0.95,
                            letterSpacing: '0.02em',
                            color: C.textDark,
                        }}>
                            Ejes principales<br />
                            <span style={{ color: C.red }}>de mis proyectos</span>
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                            <div style={{ width: '3rem', height: '2px', background: C.red }} />
                            <div style={{ flex: 1, maxWidth: '8rem', height: '1px', background: C.creamBorder }} />
                        </div>
                    </div>

                    {/* Grid de ejes */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
                        gap: '0.5rem',
                    }}>
                        {EJES.map((eje, i) => (
                            <EjeItem key={i} titulo={eje.titulo} texto={eje.texto} index={i} />
                        ))}
                    </div>

                    {/* Cita final — vuelve al rojo */}
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
                            color: C.white,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                            lineHeight: 1.3,
                        }}>
                            "Porque no venimos a prometer,{' '}
                            <span style={{ color: C.gold }}>venimos a cumplir.</span>"
                        </p>
                        <p style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontWeight: 600,
                            fontSize: '0.8rem', color: C.whiteDim,
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                            marginTop: '0.75rem',
                        }}>
                            — Joel Gómez
                        </p>
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
                            <span style={{
                                fontFamily: '"Bebas Neue", sans-serif',
                                fontSize: '1.1rem', color: C.white, letterSpacing: '0.04em',
                            }}>JG10</span>
                        </div>
                        <span style={{
                            fontFamily: '"Barlow Condensed", sans-serif',
                            fontSize: '0.78rem', fontWeight: 600,
                            color: C.whiteFaint, letterSpacing: '0.1em', textTransform: 'uppercase',
                        }}>
                            Joel Gómez · Concejal 2026
                        </span>
                    </div>

                    <p style={{
                        fontFamily: 'Barlow, sans-serif',
                        fontSize: '0.75rem', color: C.whiteFaint,
                        textAlign: 'center',
                    }}>
                        Página creada con{' '}
                        <span style={{ color: C.whiteDim, fontWeight: 600 }}>SIGELE</span>.
                        Si estás en campaña, podés tener la tuya.
                    </p>

                    <a
                        href="https://wa.me/595985851696?text=Hola%2C+me+interesa+obtener+m%C3%A1s+informaci%C3%B3n+sobre+SIGELE."
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                            padding: '0.45rem 1.125rem', borderRadius: '2rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.06)',
                            color: C.whiteDim,
                            fontSize: '0.78rem', fontWeight: 600,
                            fontFamily: 'Barlow, sans-serif',
                            textDecoration: 'none',
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
                            color: C.whiteFaint,
                            textDecoration: 'none',
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

/* ─── SocialBtn ──────────────────────────────────────────────────────────── */

function SocialBtn({ href, icon, label, accent = false }: {
    href: string; icon: React.ReactNode; label: string; accent?: boolean;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.55rem 1.125rem',
                borderRadius: '3px',
                border: `1.5px solid ${hovered ? C.white : 'rgba(255,255,255,0.4)'}`,
                background: hovered ? (accent ? C.gold : 'rgba(255,255,255,0.15)') : 'rgba(255,255,255,0.08)',
                color: hovered ? (accent ? '#1A0000' : C.white) : C.offWhite,
                textDecoration: 'none',
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
            }}
        >
            {icon}
            {label}
        </a>
    );
}
