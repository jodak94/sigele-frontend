import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FacebookLogo, InstagramLogo, User, MapPin, WhatsappLogo } from '@phosphor-icons/react';

const WA_CONTACT = 'https://wa.me/595985851696?text=' + encodeURIComponent('Hola, me interesa obtener más información sobre SIGELE.');

/* ─── Hooks ──────────────────────────────────────────────────────────────── */

function usePerfilColors(colores) {
    useEffect(() => {
        if (!colores) return;
        const root = document.documentElement;
        if (colores.primary)       root.style.setProperty('--primary',        colores.primary);
        if (colores.primaryDark)   root.style.setProperty('--primary-dark',   colores.primaryDark);
        if (colores.primaryDarker) root.style.setProperty('--primary-darker', colores.primaryDarker);
        if (colores.primary) {
            const hex = colores.primary.replace('#', '');
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
        }
    }, [colores]);
}

function useFonts() {
    useEffect(() => {
        if (document.getElementById('tenant-fonts')) return;
        const link = document.createElement('link');
        link.id = 'tenant-fonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:ital,wght@0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap';
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

/* ─── Secciones ──────────────────────────────────────────────────────────── */

/*
 * SeccionTexto — tratamiento editorial: barra lateral de color + tipografía Lora
 * Las secciones pares tienen la barra a la izquierda, las impares una línea superior
 * para romper la repetición visual.
 */
function SeccionTexto({ titulo, contenido, index }) {
    const isEven = index % 2 === 0;
    return (
        <article style={{
            display: 'flex',
            gap: '1.5rem',
            padding: isEven ? '0' : '0',
        }}>
            {/* Barra lateral */}
            <div style={{
                flexShrink: 0,
                width: '4px',
                background: `linear-gradient(to bottom, var(--primary), rgba(var(--primary-rgb), 0.2))`,
                borderRadius: '4px',
                marginTop: '0.25rem',
            }} />
            <div style={{ flex: 1 }}>
                <h3 style={{
                    fontFamily: 'Lora, Georgia, serif',
                    fontWeight: 600,
                    fontStyle: 'italic',
                    fontSize: '1.3rem',
                    color: '#1c2b4a',
                    marginBottom: '0.875rem',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3,
                }}>
                    {titulo}
                </h3>
                <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#4a5568',
                    lineHeight: 1.85,
                    fontSize: '0.975rem',
                }}>
                    {contenido}
                </p>
            </div>
        </article>
    );
}

/*
 * SeccionLista — ficha de compromisos: distinto al texto, usa fondo blanco con
 * encabezado destacado y ítems numerados con acento de color.
 */
function SeccionLista({ titulo, items }) {
    return (
        <article style={{
            background: 'white',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            boxShadow: '0 1px 6px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        }}>
            {/* Encabezado de la lista */}
            <div style={{
                padding: '1rem 1.75rem',
                background: `rgba(var(--primary-rgb), 0.06)`,
                borderBottom: `1px solid rgba(var(--primary-rgb), 0.12)`,
                display: 'flex', alignItems: 'center', gap: '0.625rem',
            }}>
                <span style={{
                    width: '1.5rem', height: '1.5rem', borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4.5L3.2 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                <h3 style={{
                    fontFamily: 'Lora, Georgia, serif',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: '#1c2b4a',
                    letterSpacing: '-0.01em',
                }}>
                    {titulo}
                </h3>
            </div>
            {/* Ítems */}
            <ul style={{ margin: 0, padding: '0.5rem 0', listStyle: 'none' }}>
                {items.map((item, i) => (
                    <li key={i} style={{
                        display: 'flex', alignItems: 'baseline', gap: '1rem',
                        padding: '0.625rem 1.75rem',
                        borderBottom: i < items.length - 1 ? '1px solid #f3f4f6' : 'none',
                    }}>
                        <span style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            color: 'var(--primary)',
                            letterSpacing: '0.05em',
                            flexShrink: 0,
                            minWidth: '1.5rem',
                        }}>
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <span style={{
                            fontFamily: 'DM Sans, sans-serif',
                            color: '#374151',
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                        }}>
                            {item}
                        </span>
                    </li>
                ))}
            </ul>
        </article>
    );
}

function SeccionImagen({ url, titulo }) {
    if (!url) return null;
    return (
        <figure style={{ margin: 0, borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <img src={url} alt={titulo ?? ''} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '22rem' }} />
        </figure>
    );
}

// Mantiene conteo de SeccionTexto para alternar tratamiento
let textoCount = 0;
function renderSeccion(seccion, i) {
    switch (seccion.tipo) {
        case 'texto':  return <SeccionTexto  key={i} titulo={seccion.titulo} contenido={seccion.contenido} index={i} />;
        case 'lista':  return <SeccionLista  key={i} titulo={seccion.titulo} items={seccion.items ?? []} />;
        case 'imagen': return <SeccionImagen key={i} url={seccion.url}       titulo={seccion.titulo} />;
        default: return null;
    }
}

/* ─── Componente principal ───────────────────────────────────────────────── */

export function TenantPublicPage({ perfil }) {
    usePerfilColors(perfil?.colores);
    useFonts();
    const scrolled = useScrolled();

    useEffect(() => {
        if (perfil?.nombre) document.title = perfil.nombre;
    }, [perfil?.nombre]);

    if (!perfil || !perfil.habilitado) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4ef', fontFamily: 'DM Sans, sans-serif' }}>
                <p style={{ color: '#999' }}>Esta página no está disponible.</p>
            </div>
        );
    }

    const { nombre, cargo, ciudad, bio, mainImage, foto, secciones = [], redesSociales = {} } = perfil;
    const fotoSrc = mainImage || foto || null;

    return (
        <div style={{ fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', background: '#f0ede6' }}>

            {/* ── Header institucional ── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'white',
                borderBottom: scrolled ? 'none' : `3px solid var(--primary)`,
                boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.1)' : 'none',
                transition: 'box-shadow 0.3s, border-bottom 0.3s',
            }}>
                <div style={{
                    maxWidth: '64rem', margin: '0 auto',
                    padding: '0 clamp(1rem, 4vw, 2rem)',
                    height: '3.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '3px', height: '1.25rem', background: 'var(--primary)', borderRadius: '2px' }} />
                        <span style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontWeight: 700, fontSize: '0.875rem',
                            color: '#1c2b4a', letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                        }}>
                            {nombre}
                        </span>
                    </div>
                    <span style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.7rem', fontWeight: 600,
                        color: '#9ca3af', letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                    }}>
                        Elecciones 2026
                    </span>
                </div>
            </header>

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{
                    maxWidth: '64rem', margin: '0 auto',
                    padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)',
                    display: 'grid',
                    gridTemplateColumns: fotoSrc ? 'minmax(0,1.1fr) minmax(0,0.9fr)' : '1fr',
                    gap: 'clamp(2rem, 5vw, 4rem)',
                    alignItems: 'center',
                }}>

                    {/* ── Texto izquierdo ── */}
                    <div>
                        {/* Badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                            border: `1.5px solid var(--primary)`,
                            color: 'var(--primary)',
                            padding: '0.25rem 0.875rem',
                            borderRadius: '2rem', marginBottom: '1.5rem',
                            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                        }}>
                            <MapPin size={11} weight="fill" />
                            {[cargo, ciudad].filter(Boolean).join(' · ')}
                        </div>

                        {/* Nombre */}
                        <h1 style={{
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontWeight: 900,
                            fontSize: 'clamp(2.25rem, 6vw, 4rem)',
                            color: '#1c2b4a',
                            lineHeight: 1.05,
                            letterSpacing: '-0.02em',
                            marginBottom: '1.25rem',
                        }}>
                            {nombre}
                        </h1>

                        {/* Separador */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '2.5rem', height: '3px', background: 'var(--primary)', borderRadius: '2px' }} />
                            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                        </div>

                        {/* Bio */}
                        {bio && (
                            <p style={{
                                fontFamily: 'Lora, Georgia, serif',
                                color: '#4a5568',
                                fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
                                lineHeight: 1.85,
                                maxWidth: '46ch',
                                marginBottom: '2rem',
                            }}>
                                {bio}
                            </p>
                        )}

                        {/* Redes */}
                        {(redesSociales.facebook || redesSociales.instagram) && (
                            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                                {redesSociales.facebook && (
                                    <SocialButton href={redesSociales.facebook} icon={<FacebookLogo size={15} weight="fill" />} label="Facebook" />
                                )}
                                {redesSociales.instagram && (
                                    <SocialButton href={redesSociales.instagram} icon={<InstagramLogo size={15} weight="fill" />} label="Instagram" />
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Retrato con bloque geométrico de fondo ── */}
                    {fotoSrc && (
                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            {/* Bloque de color detrás */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-1rem', right: '-0.5rem',
                                width: '80%', height: '85%',
                                background: `rgba(var(--primary-rgb), 0.12)`,
                                borderRadius: '0.5rem',
                                border: `2px solid rgba(var(--primary-rgb), 0.2)`,
                            }} />
                            {/* Acento de color sólido — esquina */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-1rem', right: '-0.5rem',
                                width: '3rem', height: '3rem',
                                background: 'var(--primary)',
                                borderRadius: '0 0 0.5rem 0',
                            }} />
                            {/* Retrato */}
                            <div style={{
                                position: 'relative', zIndex: 1,
                                width: '85%',
                                aspectRatio: '3/4',
                                borderRadius: '0.5rem',
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            }}>
                                <img
                                    src={fotoSrc}
                                    alt={nombre}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Secciones de contenido ────────────────────────────────── */}
            {secciones.length > 0 && (
                <main style={{ padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)' }}>
                    <div style={{ maxWidth: '52rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {secciones.map((s, i) => renderSeccion(s, i))}
                    </div>
                </main>
            )}

            {/* ── Footer ────────────────────────────────────────────────── */}
            <footer style={{
                background: '#1c2b4a',
                marginTop: '2rem',
                padding: '1.75rem clamp(1rem, 4vw, 2rem)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem',
            }}>
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                    fontFamily: 'DM Sans, sans-serif',
                }}>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                        Esta página fue creada con <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>SIGELE</span>.
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                        Si estás en campaña, podés tener la tuya.
                    </p>
                    <a
                        href={WA_CONTACT}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            marginTop: '0.25rem',
                            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                            padding: '0.45rem 1.125rem', borderRadius: '2rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.06)',
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '0.78rem', fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                    >
                        <WhatsappLogo size={14} weight="fill" color="#25d366" />
                        Contactanos
                    </a>
                </div>
                <Link
                    to="/padron"
                    style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.25)',
                        textDecoration: 'none',
                        letterSpacing: '0.04em',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                >
                    Acceso al portal
                </Link>
            </footer>
        </div>
    );
}

function SocialButton({ href, icon, label }) {
    const [hovered, setHovered] = useState(false);
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.425rem',
                padding: '0.45rem 1rem', borderRadius: '2rem',
                border: `1.5px solid ${hovered ? 'var(--primary)' : '#d1d5db'}`,
                background: hovered ? `rgba(var(--primary-rgb), 0.06)` : 'transparent',
                color: hovered ? 'var(--primary)' : '#374151',
                textDecoration: 'none',
                fontSize: '0.8rem', fontWeight: 600,
                transition: 'all 0.2s',
                fontFamily: 'DM Sans, sans-serif',
            }}
        >
            {icon}
            {label}
        </a>
    );
}
