import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FacebookLogo, InstagramLogo, WhatsappLogo } from '@phosphor-icons/react';

/* ─── Assets ─────────────────────────────────────────────────────────────── */

const FOTO = 'https://assets.sigele.com.py/tenants/mariajosecardenas/sobre_mi.png';

const REDES = {
    facebook:  'https://www.facebook.com/share/17aa2VKs4d/' as string | null,
    instagram: null as string | null,
    whatsapp:  null as string | null,
};

/* ─── Contenido ──────────────────────────────────────────────────────────── */

const TAGLINE = 'Nací y crecí en Villeta. Es esa misma ciudad la que me da la fuerza para trabajar cada día por quienes confían en mí.';

const PROPUESTAS = [
    {
        num: '01',
        titulo: 'Salud Comunitaria',
        texto: 'Ampliar el acceso a servicios de salud en los barrios más alejados del centro, con énfasis en atención materno-infantil y adultos mayores. Cada villetano merece atención digna cerca de su hogar.',
    },
    {
        num: '02',
        titulo: 'Educación con Oportunidades',
        texto: 'Promover programas de apoyo escolar, becas y capacitaciones técnicas para jóvenes. La educación es la herramienta más poderosa para construir un futuro mejor para Villeta.',
    },
    {
        num: '03',
        titulo: 'Crecimiento Local',
        texto: 'Fomentar el comercio local, el turismo y las pymes villetanas. Nuestra ciudad tiene un potencial enorme; trabajaremos para dar a nuestros emprendedores las herramientas que necesitan para crecer.',
    },
    {
        num: '04',
        titulo: 'Mujeres que Transforman',
        texto: 'Impulsar políticas de inclusión y protección para la mujer villetana: desde programas de formación laboral hasta centros de atención integral. Cuando las mujeres prosperan, toda la comunidad avanza.',
    },
];

const CITA = 'Vengo a trabajar con convicción y corazón, porque Villeta se lo merece.';

/* ─── Paleta ─────────────────────────────────────────────────────────────── */

const C = {
    red:        '#D52B1E',
    redDark:    '#B01F14',
    redDeep:    '#8A1510',
    redSoft:    '#E04035',

    warm:       '#FFFAF9',
    warmMid:    '#FEF0EE',
    warmBorder: 'rgba(213,43,30,0.14)',

    rose:       '#F2C4BF',
    roseDim:    'rgba(242,196,191,0.5)',

    white:      '#FFFFFF',
    offWhite:   'rgba(255,246,244,0.93)',
    whiteDim:   'rgba(255,220,215,0.65)',
    whiteFaint: 'rgba(255,205,200,0.35)',

    textDark:   '#1C0507',
    textMid:    '#7A2020',
    textLight:  '#B54040',
};

/* ─── Hooks ──────────────────────────────────────────────────────────────── */

function useFonts() {
    useEffect(() => {
        if (document.getElementById('mjc-fonts')) return;
        const link = document.createElement('link');
        link.id = 'mjc-fonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700;800&display=swap';
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

/* ─── Ticker ─────────────────────────────────────────────────────────────── */

const TICKER_ITEMS = ['Lista 2R', 'Opción 8', 'Concejal Municipal', 'Villeta', 'Elecciones 2026', 'María José Cárdenas'];

function Ticker() {
    return (
        <div style={{
            background: C.redDeep,
            borderTop: `1px solid rgba(255,255,255,0.1)`,
            overflow: 'hidden',
            padding: '0.6rem 0',
        }}>
            <style>{`
                @keyframes mjc-ticker {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                .mjc-ticker-track {
                    display: flex;
                    gap: 0;
                    animation: mjc-ticker 22s linear infinite;
                    width: max-content;
                }
                .mjc-ticker-track:hover { animation-play-state: paused; }
            `}</style>
            <div className="mjc-ticker-track">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <span key={i} style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: C.whiteDim,
                        padding: '0 2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2.5rem',
                        whiteSpace: 'nowrap',
                    }}>
                        {item}
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: C.rose, flexShrink: 0, opacity: 0.6 }} />
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ─── Tarjeta de propuesta ───────────────────────────────────────────────── */

function PropuestaCard({ num, titulo, texto }: { num: string; titulo: string; texto: string }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? C.white : C.warm,
                border: `1px solid ${hovered ? C.warmBorder : C.warmBorder}`,
                borderRadius: '0.75rem',
                padding: '2rem',
                boxShadow: hovered ? '0 8px 32px rgba(213,43,30,0.12)' : '0 1px 4px rgba(213,43,30,0.06)',
                transition: 'background 0.25s, box-shadow 0.25s',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Número grande decorativo */}
            <span style={{
                position: 'absolute',
                top: '-0.75rem',
                right: '1rem',
                fontFamily: '"Playfair Display", serif',
                fontWeight: 900,
                fontSize: '5rem',
                color: hovered ? 'rgba(213,43,30,0.08)' : 'rgba(213,43,30,0.05)',
                lineHeight: 1,
                userSelect: 'none',
                transition: 'color 0.25s',
                pointerEvents: 'none',
            }}>
                {num}
            </span>

            {/* Número pequeño — acento */}
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: hovered ? C.red : C.warmMid,
                border: `1.5px solid ${hovered ? C.red : C.warmBorder}`,
                marginBottom: '1rem',
                transition: 'all 0.25s',
            }}>
                <span style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    color: hovered ? C.white : C.textLight,
                    transition: 'color 0.25s',
                }}>
                    {num}
                </span>
            </div>

            <h3 style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                fontSize: '1.2rem',
                color: C.textDark,
                marginBottom: '0.75rem',
                lineHeight: 1.25,
            }}>
                {titulo}
            </h3>
            <p style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 400,
                fontSize: '0.9rem',
                color: C.textMid,
                lineHeight: 1.75,
            }}>
                {texto}
            </p>
        </div>
    );
}

/* ─── Componente principal ───────────────────────────────────────────────── */

export default function MariaJoseCardenasPage() {
    useFonts();
    const scrolled = useScrolled();

    useEffect(() => {
        document.title = 'María José Cárdenas · Concejal 2026';
    }, []);

    return (
        <div style={{ fontFamily: 'Outfit, sans-serif', minHeight: '100vh', background: C.warm, color: C.textDark }}>

            <style>{`
                @keyframes mjc-fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes mjc-fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .mjc-f0  { animation: mjc-fadeUp 0.6s ease both; }
                .mjc-f1  { animation: mjc-fadeUp 0.6s 0.12s ease both; }
                .mjc-f2  { animation: mjc-fadeUp 0.6s 0.24s ease both; }
                .mjc-f3  { animation: mjc-fadeUp 0.6s 0.38s ease both; }
                .mjc-f4  { animation: mjc-fadeUp 0.6s 0.52s ease both; }
                .mjc-photo-reveal { animation: mjc-fadeIn 0.9s 0.15s ease both; }

                @media (max-width: 720px) {
                    .mjc-hero-grid {
                        grid-template-columns: 1fr !important;
                        min-height: auto !important;
                    }
                    .mjc-photo-panel {
                        height: 70vw !important;
                        min-height: 280px !important;
                        max-height: 420px !important;
                    }
                    .mjc-text-panel {
                        padding: 2.5rem 1.5rem 2rem !important;
                    }
                    .mjc-name { font-size: 3.5rem !important; }
                    .mjc-watermark { display: none; }
                    .mjc-props-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {/* ── Navbar ─────────────────────────────────────────────────── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: scrolled ? C.white : 'transparent',
                borderBottom: `1px solid ${scrolled ? C.warmBorder : 'transparent'}`,
                transition: 'background 0.3s, border-color 0.3s',
                backdropFilter: scrolled ? 'blur(8px)' : 'none',
            }}>
                <div style={{
                    maxWidth: '80rem', margin: '0 auto',
                    padding: '0 clamp(1rem, 4vw, 2.5rem)',
                    height: '3.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    {/* Izquierda — monograma + nombre */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{
                            width: '2.25rem', height: '2.25rem',
                            background: C.red,
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: scrolled ? `0 2px 10px rgba(213,43,30,0.35)` : `0 2px 10px rgba(213,43,30,0.5)`,
                        }}>
                            <span style={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 700, fontSize: '0.85rem',
                                color: C.white, lineHeight: 1,
                            }}>MJ</span>
                        </div>
                        <span style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: 700, fontSize: '0.82rem',
                            color: scrolled ? C.textDark : C.textDark,
                            letterSpacing: '0.04em',
                        }}>
                            María José Cárdenas
                        </span>
                    </div>

                    {/* Derecha — badge lista */}
                    <div style={{
                        padding: '0.3rem 0.875rem',
                        background: scrolled ? C.red : 'rgba(213,43,30,0.1)',
                        border: `1px solid ${scrolled ? 'transparent' : 'rgba(213,43,30,0.3)'}`,
                        borderRadius: '2rem',
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 700, fontSize: '0.68rem',
                        color: scrolled ? C.white : C.red,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        transition: 'all 0.3s',
                    }}>
                        Lista 2R · Opción 8
                    </div>
                </div>
            </header>

            {/* ── Hero — canvas dividido ─────────────────────────────────── */}
            <section>
                <div className="mjc-hero-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    minHeight: 'calc(100vh - 3.75rem)',
                }}>

                    {/* Panel izquierdo — texto sobre blanco cálido */}
                    <div className="mjc-text-panel" style={{
                        background: C.warm,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Franja vertical roja izquierda */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, bottom: 0,
                            width: '4px',
                            background: `linear-gradient(to bottom, transparent, ${C.red} 20%, ${C.red} 80%, transparent)`,
                        }} />

                        {/* Watermark MJC */}
                        <span className="mjc-watermark" style={{
                            position: 'absolute',
                            bottom: '-2rem', left: '-1rem',
                            fontFamily: '"Playfair Display", serif',
                            fontWeight: 900,
                            fontSize: 'clamp(8rem, 16vw, 14rem)',
                            color: 'rgba(213,43,30,0.04)',
                            lineHeight: 1,
                            userSelect: 'none',
                            letterSpacing: '-0.02em',
                            zIndex: 0,
                        }}>
                            MJC
                        </span>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            {/* Badge superior */}
                            <div className="mjc-f0" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '2rem',
                            }}>
                                <div style={{
                                    width: '2rem', height: '1px',
                                    background: C.red,
                                }} />
                                <span style={{
                                    fontFamily: 'Outfit, sans-serif',
                                    fontWeight: 700, fontSize: '0.7rem',
                                    color: C.red,
                                    letterSpacing: '0.22em', textTransform: 'uppercase',
                                }}>
                                    Concejal · Villeta
                                </span>
                            </div>

                            {/* Nombre */}
                            <h1 className="mjc-name mjc-f1" style={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 900,
                                fontSize: 'clamp(3rem, 6vw, 5rem)',
                                lineHeight: 1.05,
                                color: C.textDark,
                                marginBottom: '0.25rem',
                                letterSpacing: '-0.01em',
                            }}>
                                María José
                            </h1>
                            <h1 className="mjc-f1" style={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 700,
                                fontStyle: 'italic',
                                fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
                                lineHeight: 1.05,
                                color: C.red,
                                marginBottom: '2rem',
                                letterSpacing: '-0.01em',
                            }}>
                                Cárdenas
                            </h1>

                            {/* Separador decorativo */}
                            <div className="mjc-f2" style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                marginBottom: '1.75rem',
                            }}>
                                <div style={{ width: '3.5rem', height: '2px', background: C.red }} />
                                <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: C.rose }} />
                                <div style={{ flex: 1, height: '1px', background: C.warmBorder }} />
                            </div>

                            {/* Tagline */}
                            <p className="mjc-f3" style={{
                                fontFamily: 'Outfit, sans-serif',
                                fontWeight: 300,
                                fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                                color: C.textMid,
                                lineHeight: 1.8,
                                maxWidth: '38ch',
                                marginBottom: '2.5rem',
                            }}>
                                {TAGLINE}
                            </p>

                            {/* Redes sociales */}
                            <div className="mjc-f4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {REDES.facebook && <SocialBtn href={REDES.facebook} icon={<FacebookLogo size={15} weight="fill" />} label="Facebook" />}
                                {REDES.instagram && <SocialBtn href={REDES.instagram} icon={<InstagramLogo size={15} weight="fill" />} label="Instagram" />}
                                {REDES.whatsapp && <SocialBtn href={REDES.whatsapp} icon={<WhatsappLogo size={15} weight="fill" />} label="WhatsApp" />}
                            </div>
                        </div>
                    </div>

                    {/* Panel derecho — foto a sangre */}
                    <div className="mjc-photo-panel mjc-photo-reveal" style={{
                        position: 'relative',
                        background: C.redDeep,
                        overflow: 'hidden',
                    }}>
                        {/* Foto */}
                        <img
                            src={FOTO}
                            alt="María José Cárdenas"
                            style={{
                                position: 'absolute', inset: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'top center',
                                display: 'block',
                            }}
                        />

                        {/* Gradiente de transición inferior */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            height: '40%',
                            background: `linear-gradient(to bottom, transparent, rgba(138,21,16,0.85))`,
                            pointerEvents: 'none',
                        }} />

                        {/* Badge flottante — opción */}
                        <div style={{
                            position: 'absolute',
                            bottom: '2rem', left: '50%',
                            transform: 'translateX(-50%)',
                            background: C.white,
                            borderRadius: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                            whiteSpace: 'nowrap',
                        }}>
                            <span style={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 900,
                                fontSize: '2.25rem',
                                color: C.red,
                                lineHeight: 1,
                                letterSpacing: '-0.02em',
                            }}>8</span>
                            <span style={{
                                fontFamily: 'Outfit, sans-serif',
                                fontWeight: 700,
                                fontSize: '0.6rem',
                                color: C.textMid,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                marginTop: '0.2rem',
                            }}>Opción</span>
                        </div>

                        {/* Franja vertical roja derecha — espejo del panel izq */}
                        <div style={{
                            position: 'absolute', top: 0, right: 0, bottom: 0,
                            width: '4px',
                            background: `linear-gradient(to bottom, transparent, ${C.redSoft} 20%, ${C.redSoft} 80%, transparent)`,
                            opacity: 0.6,
                            zIndex: 2,
                        }} />
                    </div>
                </div>
            </section>

            {/* ── Ticker ─────────────────────────────────────────────────── */}
            <Ticker />

            {/* ── Sección de propuestas ──────────────────────────────────── */}
            <section style={{
                background: C.warm,
                padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)',
            }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>

                    {/* Encabezado */}
                    <div style={{ marginBottom: '3.5rem', maxWidth: '52rem' }}>
                        <span style={{
                            display: 'inline-block',
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            color: C.red,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                        }}>
                            Mis compromisos con Villeta
                        </span>
                        <h2 style={{
                            fontFamily: '"Playfair Display", serif',
                            fontWeight: 900,
                            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                            lineHeight: 1.1,
                            color: C.textDark,
                            letterSpacing: '-0.01em',
                        }}>
                            Cuatro ejes para{' '}
                            <span style={{ color: C.red, fontStyle: 'italic' }}>transformar</span>{' '}
                            nuestra ciudad
                        </h2>
                    </div>

                    {/* Grid de tarjetas */}
                    <div className="mjc-props-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                        gap: '1.25rem',
                    }}>
                        {PROPUESTAS.map((p) => (
                            <PropuestaCard key={p.num} {...p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Cita — sección roja ────────────────────────────────────── */}
            <section style={{
                background: `linear-gradient(135deg, ${C.redDark} 0%, ${C.red} 60%, ${C.redSoft} 100%)`,
                padding: 'clamp(4rem, 8vw, 6rem) clamp(1rem, 4vw, 2.5rem)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Patrón de puntos decorativo */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }} />

                {/* Comilla grande decorativa */}
                <div style={{
                    position: 'absolute',
                    top: '-1.5rem', left: 'clamp(1rem, 5vw, 4rem)',
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 900,
                    fontSize: 'clamp(8rem, 18vw, 14rem)',
                    color: 'rgba(255,255,255,0.06)',
                    lineHeight: 1,
                    userSelect: 'none',
                    pointerEvents: 'none',
                }}>
                    "
                </div>

                <div style={{
                    maxWidth: '56rem', margin: '0 auto',
                    position: 'relative', zIndex: 1,
                    textAlign: 'center',
                }}>
                    <p style={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 700,
                        fontStyle: 'italic',
                        fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                        color: C.white,
                        lineHeight: 1.4,
                        letterSpacing: '-0.01em',
                        marginBottom: '2rem',
                    }}>
                        "{CITA}"
                    </p>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                    }}>
                        <div style={{ width: '3rem', height: '1px', background: C.roseDim }} />
                        <span style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: C.roseDim,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                        }}>
                            María José Cárdenas
                        </span>
                        <div style={{ width: '3rem', height: '1px', background: C.roseDim }} />
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer style={{
                background: C.redDeep,
                padding: '2.5rem clamp(1rem, 4vw, 2.5rem)',
            }}>
                <div style={{
                    maxWidth: '80rem', margin: '0 auto',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '2rem', height: '2rem',
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 700, fontSize: '0.75rem',
                                color: C.white,
                            }}>MJ</span>
                        </div>
                        <span style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: 600, fontSize: '0.8rem',
                            color: C.whiteDim, letterSpacing: '0.06em',
                        }}>
                            María José Cárdenas · Concejal 2026
                        </span>
                    </div>

                    <p style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.75rem',
                        color: C.whiteFaint,
                        textAlign: 'center',
                        lineHeight: 1.6,
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
                            padding: '0.5rem 1.25rem', borderRadius: '2rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.07)',
                            color: C.whiteDim,
                            fontSize: '0.78rem', fontWeight: 600,
                            fontFamily: 'Outfit, sans-serif',
                            textDecoration: 'none',
                            transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                            e.currentTarget.style.color = C.white;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.color = C.whiteDim;
                        }}
                    >
                        <WhatsappLogo size={14} weight="fill" color="#25d366" />
                        Contactanos
                    </a>

                    <Link
                        to="/padron"
                        style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '0.68rem', fontWeight: 600,
                            color: C.whiteFaint,
                            textDecoration: 'none',
                            letterSpacing: '0.12em', textTransform: 'uppercase',
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

function SocialBtn({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
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
                padding: '0.55rem 1.25rem',
                borderRadius: '2rem',
                border: `1.5px solid ${hovered ? C.red : C.warmBorder}`,
                background: hovered ? C.red : 'transparent',
                color: hovered ? C.white : C.textMid,
                textDecoration: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.85rem', fontWeight: 600,
                transition: 'all 0.2s',
            }}
        >
            {icon}
            {label}
        </a>
    );
}
