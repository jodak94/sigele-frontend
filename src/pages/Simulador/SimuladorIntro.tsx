import { IdentificationCard, ArrowFatLineRight, CursorClick, ArrowRight } from '@phosphor-icons/react';

const PASOS = [
    {
        Icono: IdentificationCard,
        titulo: 'Presentá tu cédula',
        texto: 'Acercate a la mesa receptora con tu cédula de identidad. Los vocales te entregarán el boletín firmado.',
    },
    {
        Icono: ArrowFatLineRight,
        titulo: 'Insertá el boletín en la máquina',
        texto: 'Colocá el boletín en la ranura siguiendo la dirección de la flecha indicada.',
    },
    {
        Icono: CursorClick,
        titulo: 'Seleccioná tus candidatos',
        texto: 'Tocá la pantalla para elegir tu candidato a Intendente y tu lista a Junta Municipal.',
    },
];

export function SimuladorIntro({ onTerminar }: { onTerminar: () => void }) {
    return (
        <div style={{
            minHeight: '100vh',
            height: '100dvh',
            background: '#f3f2f0',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            overflow: 'hidden',
        }}>

            {/* ── Header ── */}
            <header style={{
                background: 'var(--primary)',
                padding: '13px 20px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <span style={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                }}>
                    SIGELE · Simulador de Votación
                </span>
            </header>

            {/* ── Contenido ── */}
            <main style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(1.5rem, 4vh, 2.5rem) clamp(1rem, 5vw, 2rem)',
            }}>
                <div style={{ width: '100%', maxWidth: '500px' }}>

                    {/* ── Encabezado ── */}
                    <div style={{ marginBottom: 'clamp(1.5rem, 3vh, 2rem)' }}>
                        <p style={{
                            margin: '0 0 0.6rem',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: 'var(--primary)',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                        }}>
                            Guía rápida
                        </p>
                        <h1 style={{
                            margin: '0 0 0.5rem',
                            fontSize: 'clamp(1.4rem, 4vw, 1.75rem)',
                            fontWeight: 800,
                            color: '#111',
                            lineHeight: 1.2,
                            letterSpacing: '-0.02em',
                        }}>
                            ¿Cómo se vota con la máquina?
                        </h1>
                        <p style={{
                            margin: 0,
                            fontSize: '0.88rem',
                            color: '#666',
                            lineHeight: 1.5,
                        }}>
                            Practicá el proceso antes del día de la elección.
                        </p>
                    </div>

                    {/* ── Pasos ── */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        marginBottom: 'clamp(1.5rem, 3vh, 2rem)',
                    }}>
                        {PASOS.map(({ Icono, titulo, texto }, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'flex-start',
                                background: 'white',
                                border: '1px solid #e2e0dd',
                                borderRadius: '10px',
                                padding: '1rem 1.1rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}>
                                {/* Número */}
                                <div style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                }}>
                                    {i + 1}
                                </div>
                                {/* Texto */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                                        <Icono size={15} weight="fill" style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                        <p style={{ margin: 0, fontWeight: 700, color: '#111', fontSize: '0.9rem' }}>{titulo}</p>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#5a5a5a', lineHeight: 1.55 }}>{texto}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Botón ── */}
                    <button
                        onClick={onTerminar}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--primary)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            letterSpacing: '0.07em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'filter 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.88)')}
                        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                        Comenzar simulación
                        <ArrowRight size={16} weight="bold" />
                    </button>

                </div>
            </main>
        </div>
    );
}
