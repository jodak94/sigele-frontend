
import type { CandidatoIntendente } from './data/tipos';
import { FooterSimulador } from './FooterSimulador';

/* ─── Tipos ──────────────────────────────────────────────────────────────── */

export interface SeleccionIntendente {
    partido: string;
    lista: string;
    nombre: string;
    foto?: string;
}

/* ─── Foto / Avatar ──────────────────────────────────────────────────────── */

function CandidatoFoto({ foto, color }: { foto?: string; color: string }) {
    if (foto) return <img src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    return <Avatar color={color} />;
}

function Avatar({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 80 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="100" fill="#f0f0f0" />
            <circle cx="40" cy="32" r="20" fill={color} opacity="0.5" />
            <ellipse cx="40" cy="90" rx="30" ry="22" fill={color} opacity="0.35" />
        </svg>
    );
}

/* ─── Card candidato ─────────────────────────────────────────────────────── */

function CardCandidato({
    candidato,
    activo,
    onClick,
}: {
    candidato: CandidatoIntendente;
    activo: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={activo ? onClick : undefined}
            style={{
                background: 'white',
                border: '1px solid #bec3be',
                cursor: activo ? 'pointer' : 'default',
                opacity: activo ? 1 : 0.35,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(8px, 2vh, 20px) clamp(10px, 2.5vw, 24px)',
                boxSizing: 'border-box',
                userSelect: 'none',
                overflow: 'hidden',
            }}
        >
            {/* Partido */}
            <p style={{
                margin: '0 0 clamp(4px, 1vh, 10px) 0',
                fontWeight: 700,
                fontSize: 'calc(1.66rem * 0.8 * 1.33)',
                color: '#222',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                textAlign: 'center',
            }}>
                {candidato.partido}
            </p>

            {/* Foto + Lista */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(8px, 2vw, 20px)',
                minHeight: 0,
                width: '100%',
            }}>
                {/* Foto — sin borde */}
                <div style={{
                    height: 'clamp(70px, 17vh, 160px)',
                    aspectRatio: '1/1',
                    flexShrink: 0,
                    overflow: 'hidden',
                }}>
                    <CandidatoFoto foto={candidato.foto} color={candidato.colores[0]} />
                </div>

                {/* Lista + número + siglas */}
                <div style={{
                    fontSize: 'calc(1.66rem * 0.8 * 1.33 * 1.8)',
                    lineHeight: 1,
                    textAlign: 'center',
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: '0.5em',
                        fontWeight: 700,
                        color: '#222',
                        textTransform: 'uppercase',
                    }}>
                        LISTA
                    </p>
                    <p style={{
                        margin: 0,
                        fontSize: '1em',
                        fontWeight: 700,
                        color: '#111',
                    }}>
                        {candidato.lista}
                    </p>
                    <p style={{
                        margin: 0,
                        fontSize: '0.5em',
                        fontWeight: 400,
                        color: '#333',
                    }}>
                        {candidato.siglas}
                    </p>
                </div>
            </div>

            {/* Nombre candidato */}
            <p style={{
                margin: 'clamp(4px, 1vh, 10px) 0 0 0',
                fontSize: 'calc(1.66rem * 0.8 * 1.33)',
                fontWeight: 400,
                color: '#222',
                textAlign: 'center',
                lineHeight: 1.2,
            }}>
                {candidato.nombre}
            </p>
        </div>
    );
}

/* ─── Card voto en blanco ────────────────────────────────────────────────── */

function CardVotoEnBlanco(_: { onClick: () => void }) {
    return (
        <div
            onClick={undefined}
            style={{
                background: 'white',
                border: '1px solid #bec3be',
                cursor: 'default',
                opacity: 0.35,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
            }}
        >
            <p style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                color: '#333',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                textAlign: 'center',
            }}>
                VOTO EN BLANCO
            </p>
        </div>
    );
}

/* ─── Paso 1 ─────────────────────────────────────────────────────────────── */

export function SimuladorPaso1({
    candidatos,
    intendenteIdActivo,
    onAceptar,
    onVolver,
}: {
    candidatos: CandidatoIntendente[];
    intendenteIdActivo: string;
    onAceptar: (sel: SeleccionIntendente) => void;
    onVolver?: () => void;
}) {
    // Grid 2 columnas; filas dinámicas según cantidad de candidatos + voto en blanco
    const total = candidatos.length + 1;
    const cols = 2;
    const rows = Math.ceil(total / cols);
    const vacias = rows * cols - total;

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
                    margin: 0,
                    fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                    fontWeight: 700,
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                }}>
                    Candidatos a <strong>INTENDENTE MUNICIPAL</strong>
                </p>
            </header>

            {/* ── Grid ── */}
            <main style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: '10px',
                padding: '10px',
                background: '#eeeeee',
                minHeight: 0,
                boxSizing: 'border-box',
            }}>
                {candidatos.map(c => (
                    <CardCandidato key={c.id} candidato={c} activo={c.id === intendenteIdActivo} onClick={() => onAceptar({ partido: c.partido, lista: c.lista, nombre: c.nombre, foto: c.foto })} />
                ))}
                <CardVotoEnBlanco onClick={() => onAceptar({ partido: 'VOTO EN BLANCO', lista: '', nombre: '' })} />
                {Array.from({ length: vacias }).map((_, i) => <div key={i} />)}
            </main>
            <FooterSimulador onVolver={onVolver} />
        </div>
    );
}
