import type { SeleccionIntendente } from './SimuladorPaso1';
import type { SeleccionJunta } from './SimuladorPaso3';

/* ─── Foto / Avatar ──────────────────────────────────────────────────────── */

function CandidatoFoto({ foto }: { foto?: string }) {
    if (foto) return <img src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
    return (
        <svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" fill="#e8e8e8" />
            <circle cx="40" cy="28" r="20" fill="#aaa" opacity="0.5" />
            <ellipse cx="40" cy="78" rx="30" ry="20" fill="#aaa" opacity="0.35" />
        </svg>
    );
}

/* ─── Columna de selección ───────────────────────────────────────────────── */

function ColumnaSeleccion({
    titulo,
    partido,
    lista,
    nombre,
    foto,
    subtitulo,
    onModificar,
}: {
    titulo: string;
    partido: string;
    lista: string;
    nombre: string;
    foto?: string;
    subtitulo?: string;
    onModificar: () => void;
}) {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            boxSizing: 'border-box',
            background: 'white',
            border: '1px solid #bec3be',
            overflow: 'hidden',
        }}>
            {/* Título cargo */}
            <p style={{
                margin: '0 0 8px 0',
                fontSize: 'calc(1.66rem * 0.8 * 1.0)',
                fontWeight: 700,
                color: '#111',
                textTransform: 'uppercase',
                textAlign: 'center',
                width: '100%',
            }}>
                {titulo}
            </p>

            {/* Divisor — respeta el padding del card, no toca el borde */}
            <hr style={{ width: '100%', margin: '0 0 0 0', border: 'none', borderTop: '2px solid #545859' }} />

            {/* Grid de contenido */}
            <div style={{
                display: 'grid',
                width: '100%',
                flex: 1,
                gridTemplateRows: '1fr 1fr minmax(33%, 1fr) 2fr',
                gridTemplateColumns: '1fr',
                justifyItems: 'center',
                alignItems: 'center',
                minHeight: 0,
            }}>
                {/* Partido */}
                <p style={{
                    margin: 0,
                    fontSize: 'calc(1.66rem * 0.8 * 1.33)',
                    fontWeight: 700,
                    color: '#111',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: 1.2,
                }}>
                    {partido}
                </p>

                {/* Lista */}
                <p style={{
                    margin: 0,
                    fontSize: 'calc(1.66rem * 0.8 * 1.1)',
                    fontWeight: 700,
                    color: '#111',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}>
                    {lista ? `LISTA  ${lista}` : ''}
                </p>

                {/* Foto — cuadrada, sin borde */}
                <div style={{
                    height: '100%',
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                }}>
                    <CandidatoFoto foto={foto} />
                </div>

                {/* Nombre + Opción */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{
                        margin: 0,
                        fontSize: 'calc(1.66rem * 0.8 * 1.33)',
                        fontWeight: 700,
                        color: '#111',
                        lineHeight: 1.2,
                    }}>
                        {nombre}
                    </p>
                    {subtitulo && (
                        <p style={{
                            margin: '4px 0 0 0',
                            fontSize: 'calc(1.66rem * 0.8 * 0.85)',
                            color: '#444',
                        }}>
                            {subtitulo}
                        </p>
                    )}
                </div>
            </div>

            {/* Botón Modificar — centrado, no full width */}
            <button
                onClick={onModificar}
                style={{
                    marginTop: '8px',
                    padding: 'clamp(6px, 1.2vh, 10px) clamp(24px, 5vw, 48px)',
                    fontSize: 'calc(1.66rem * 0.8 * 0.9)',
                    fontWeight: 700,
                    background: '#545859',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}>
                Modificar
            </button>
        </div>
    );
}

/* ─── Paso 4 ─────────────────────────────────────────────────────────────── */

export function SimuladorPaso4({
    intendente,
    junta,
    onModificarIntendente,
    onModificarJunta,
    onImprimir,
}: {
    intendente: SeleccionIntendente;
    junta: SeleccionJunta;
    onModificarIntendente: () => void;
    onModificarJunta: () => void;
    onImprimir: () => void;
}) {
    return (
        <div style={{
            height: '100dvh',
            minHeight: '100vh',
            background: '#eeeeee',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Arial, sans-serif',
        }}>

            {/* ── Header ── */}
            <header style={{
                background: '#545859',
                padding: '10px 16px',
                flexShrink: 0,
                textAlign: 'center',
            }}>
                <p style={{
                    margin: '0 auto',
                    display: 'inline-block',
                    fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                    fontWeight: 700,
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    borderBottom: '2px solid rgba(255,255,255,0.6)',
                    paddingBottom: '3px',
                }}>
                    Opciones seleccionadas
                </p>
            </header>

            {/* ── Contenido ── */}
            <main style={{
                flex: 1,
                display: 'flex',
                gap: '5px',
                padding: '10px',
                background: '#eeeeee',
                minHeight: 0,
                boxSizing: 'border-box',
            }}>
                {/* Columna intendente */}
                <ColumnaSeleccion
                    titulo="Intendente Municipal"
                    partido={intendente.partido}
                    lista={intendente.lista}
                    nombre={intendente.nombre}
                    foto={intendente.foto}
                    onModificar={onModificarIntendente}
                />

                {/* Columna junta */}
                <ColumnaSeleccion
                    titulo="Junta Municipal"
                    partido={junta.partido}
                    lista={junta.lista}
                    nombre={junta.nombre}
                    foto={junta.foto}
                    subtitulo={`Opción ${junta.opcion}`}
                    onModificar={onModificarJunta}
                />

                {/* Columna botones */}
                <div style={{
                    width: 'clamp(80px, 14vw, 140px)',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}>
                    {/* Reiniciar */}
                    <button onClick={onModificarIntendente} style={{
                        flex: 1,
                        background: '#fc7b02',
                        border: '4px solid #f65e01',
                        borderRadius: '4px',
                        margin: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'clamp(4px, 1vh, 10px)',
                        padding: '12px 8px',
                        color: 'white',
                    }}>
                        <svg viewBox="0 0 24 24" width="clamp(24px, 4vw, 38px)" height="clamp(24px, 4vw, 38px)" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 4v6h6" />
                            <path d="M3.51 15a9 9 0 1 0 .49-3.9" />
                        </svg>
                        <span style={{
                            fontSize: 'clamp(0.6rem, 1.1vw, 0.8rem)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            lineHeight: 1.2,
                            textAlign: 'center',
                        }}>
                            Reiniciar<br />Selección
                        </span>
                    </button>

                    {/* Imprimir */}
                    <button onClick={onImprimir} style={{
                        flex: 3,
                        background: '#029d02',
                        border: '4px solid #029d02',
                        borderRadius: '4px',
                        margin: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'clamp(4px, 1vh, 10px)',
                        padding: '12px 8px',
                        color: 'white',
                    }}>
                        <svg viewBox="0 0 24 24" width="clamp(24px, 4vw, 38px)" height="clamp(24px, 4vw, 38px)" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                        <span style={{
                            fontSize: 'clamp(0.6rem, 1.1vw, 0.8rem)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            lineHeight: 1.2,
                            textAlign: 'center',
                        }}>
                            Imprimir<br />Selección
                        </span>
                    </button>
                </div>
            </main>
        </div>
    );
}
