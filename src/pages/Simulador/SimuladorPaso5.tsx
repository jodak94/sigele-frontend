import { useState } from 'react';

/* ─── Pasos post-voto ────────────────────────────────────────────────────── */

const PASOS = [
    {
        imagen: '/simulador/maquina_verificar.webp',
        texto: 'Una vez impreso el boletín, verificá que el registro electrónico de tu voto, coincida con la versión impresa, acercando el boletín al lector verificador.',
        boton: 'Continuar',
    },
    {
        imagen: '/simulador/dobla_voto.webp',
        texto: 'Doblá el boletín de manera que se asegure el secreto del voto.\nEntregá al presidente de mesa para que lo firme.',
        boton: 'Continuar',
    },
    {
        imagen: '/simulador/info_tinta.webp',
        texto: 'Entintate el dedo índice de la mano derecha. Recibí del presidente de mesa el boletín y depositalo en la urna plástica. Retirá tu cédula de identidad civil.',
        boton: 'Continuar',
    },
    {
        imagen: '/simulador/agradecimiento.webp',
        texto: '',
        boton: 'Reiniciar',
    },
];

/* ─── Componente ─────────────────────────────────────────────────────────── */

export function SimuladorPaso5({ onTerminar }: { onTerminar: () => void }) {
    const [paso, setPaso] = useState(0);
    const esUltimo = paso === PASOS.length - 1;
    const { imagen, texto, boton } = PASOS[paso];

    function avanzar() {
        if (!esUltimo) setPaso(p => p + 1);
        else onTerminar();
    }

    return (
        <div style={{
            height: '100dvh',
            minHeight: '100vh',
            background: '#eeeeee',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>

            {/* ── Header ── */}
            <header style={{
                background: '#545859',
                padding: '12px',
                flexShrink: 0,
                textAlign: 'center',
            }}>
                <p style={{
                    margin: '0 auto',
                    display: 'inline-block',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                    fontWeight: 700,
                    color: 'white',
                    borderBottom: '2px solid rgba(255,255,255,0.6)',
                    paddingBottom: '4px',
                }}>
                    GUÍA RÁPIDA PARA VOTAR EN LA MÁQUINA DE VOTACIÓN
                </p>
            </header>

            {/* ── Contenido ── */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: 'clamp(0.5rem, 2vh, 2rem) clamp(1rem, 4vw, 2rem)',
                textAlign: 'center',
                minHeight: 0,
            }}>

                {/* Imagen */}
                <img
                    key={imagen}
                    src={imagen}
                    alt=""
                    style={{
                        display: 'block',
                        maxHeight: 'clamp(80px, 32vh, 320px)',
                        maxWidth: '90%',
                        objectFit: 'contain',
                        flexShrink: 0,
                        animation: 'sim-fadein 0.35s ease both',
                    }}
                />

                {/* Texto */}
                {texto && (
                    <p style={{
                        maxWidth: '560px',
                        fontSize: 'clamp(0.85rem, 1.6vw, 1.1rem)',
                        color: '#222',
                        lineHeight: 1.5,
                        margin: 0,
                        whiteSpace: 'pre-line',
                        animation: 'sim-fadein 0.35s 0.08s ease both',
                    }}>
                        {texto}
                    </p>
                )}

                {/* Botón + indicador */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    animation: 'sim-fadein 0.35s 0.15s ease both',
                }}>
                    <button
                        onClick={avanzar}
                        style={{
                            width: '300px',
                            maxWidth: '90vw',
                            minHeight: '60px',
                            padding: '15px 30px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            background: esUltimo ? '#5cb85c' : '#337ab7',
                            color: 'white',
                            lineHeight: 1.4,
                            transition: 'filter 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.9)')}
                        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                        {boton}
                    </button>

                    {paso > 0 && (
                        <button
                            onClick={() => setPaso(p => p - 1)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                padding: '0.25rem 0.5rem',
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#333')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                        >
                            ← Volver
                        </button>
                    )}
                </div>

            </main>

            <style>{`
                @keyframes sim-fadein {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
