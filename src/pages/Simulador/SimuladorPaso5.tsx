import { CheckCircle, Printer, Fingerprint, ArrowCounterClockwise, Envelope } from '@phosphor-icons/react';

const PASOS_FINALES = [
    {
        Icono: Printer,
        titulo: 'Verificá tu voto',
        texto: 'Una vez impreso el boletín, compará el registro electrónico con la versión impresa acercándolo al lector verificador.',
    },
    {
        Icono: Envelope,
        titulo: 'Entregá el boletín',
        texto: 'Doblá el boletín asegurando el secreto del voto. Entregáselo al presidente de mesa para que lo firme.',
    },
    {
        Icono: Fingerprint,
        titulo: 'Depositá tu voto',
        texto: 'Entintate el dedo índice derecho. Recibí el boletín firmado, depositalo en la urna y retirá tu cédula.',
    },
];

export function SimuladorPaso5({ onTerminar }: { onTerminar: () => void }) {
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

                    {/* ── Confirmación ── */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        marginBottom: 'clamp(1.5rem, 3vh, 2rem)',
                        padding: '1.5rem',
                        background: 'white',
                        border: '1px solid #e2e0dd',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}>
                        <CheckCircle
                            size={48}
                            weight="fill"
                            style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}
                        />
                        <h1 style={{
                            margin: '0 0 0.4rem',
                            fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)',
                            fontWeight: 800,
                            color: '#111',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2,
                        }}>
                            ¡Simulación completada!
                        </h1>
                        <p style={{
                            margin: 0,
                            fontSize: '0.85rem',
                            color: '#666',
                            lineHeight: 1.5,
                        }}>
                            Ya practicaste el proceso de votación. El día de la elección, seguí estos pasos finales:
                        </p>
                    </div>

                    {/* ── Etiqueta sección ── */}
                    <p style={{
                        margin: '0 0 0.65rem',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                    }}>
                        Después de votar
                    </p>

                    {/* ── Pasos finales ── */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        marginBottom: 'clamp(1.5rem, 3vh, 2rem)',
                    }}>
                        {PASOS_FINALES.map(({ Icono, titulo, texto }, i) => (
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
                            border: '1px solid #ddd',
                            background: 'white',
                            color: '#444',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'background 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f0efed'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
                    >
                        <ArrowCounterClockwise size={16} weight="bold" />
                        Volver al inicio
                    </button>

                </div>
            </main>
        </div>
    );
}
