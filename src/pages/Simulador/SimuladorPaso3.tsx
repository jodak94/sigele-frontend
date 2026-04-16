import type { ListaJunta, CandidatoJunta } from './data/tipos';
import { FooterSimulador } from './FooterSimulador';

/* ─── Tipos ──────────────────────────────────────────────────────────────── */

export interface SeleccionJunta {
    partido: string;
    lista: string;
    nombre: string;
    opcion: number;
    foto?: string;
}

/* ─── Avatar SVG ─────────────────────────────────────────────────────────── */

function Avatar({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 60 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <rect width="60" height="60" fill="#f0f0f0" />
            <circle cx="30" cy="22" r="14" fill={color} opacity="0.5" />
            <ellipse cx="30" cy="58" rx="24" ry="16" fill={color} opacity="0.35" />
        </svg>
    );
}

/* ─── Foto / Avatar ──────────────────────────────────────────────────────── */

function CandidatoFoto({ foto, color }: { foto?: string; color: string }) {
    if (foto) return <img src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
    return <Avatar color={color} />;
}

/* ─── Card candidato ─────────────────────────────────────────────────────── */

function CardCandidato({
    candidato,
    color,
    activo,
    onClick,
}: {
    candidato: CandidatoJunta;
    color: string;
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
                display: 'grid',
                alignItems: 'center',
                gridTemplateAreas: '"fotoCandidato numeroOrden" "nombreCandidato nombreCandidato"',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'minmax(50%, 2fr) 1fr',
                boxSizing: 'border-box',
                userSelect: 'none',
                overflow: 'hidden',
            }}
        >
            {/* Foto */}
            <div style={{
                gridArea: 'fotoCandidato',
                overflow: 'hidden',
                alignSelf: 'stretch',
            }}>
                <CandidatoFoto foto={candidato.foto} color={color} />
            </div>

            {/* Opción + número */}
            <div style={{
                gridArea: 'numeroOrden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1.1,
            }}>
                <p style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 'calc(1.66rem * 0.8 * 1.1)',
                    color: '#111',
                }}>
                    Opción
                </p>
                <p style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 'calc(1.66rem * 0.8 * 1.33)',
                    color: '#111',
                }}>
                    {candidato.opcion}
                </p>
            </div>

            {/* Nombre */}
            <p style={{
                gridArea: 'nombreCandidato',
                margin: 0,
                padding: '2px 4px',
                textAlign: 'center',
                fontSize: 'calc(1.66rem * 0.8 * 0.9)',
                color: '#222',
                lineHeight: 1.2,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                alignSelf: 'center',
            } as React.CSSProperties}>
                {candidato.nombre}
            </p>
        </div>
    );
}

/* ─── Paso 3 ─────────────────────────────────────────────────────────────── */

export function SimuladorPaso3({
    lista,
    candidatos,
    opcionActiva,
    onAceptar,
    onVolver,
}: {
    lista: ListaJunta;
    candidatos: CandidatoJunta[];
    opcionActiva: number;
    onAceptar: (sel: SeleccionJunta) => void;
    onVolver?: () => void;
}) {
    const cols = candidatos.length <= 12 ? 4 : 6;
    const rows = Math.ceil(candidatos.length / cols);
    const vacias = rows * cols - candidatos.length;

    return (
        <div style={{
            height: '100%',
            background: '#eeeeee',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Arial, sans-serif',
        }}>

            {/* ── Header principal ── */}
            <header style={{
                background: '#545859',
                padding: '8px 16px',
                flexShrink: 0,
                textAlign: 'center',
            }}>
                <p style={{
                    margin: 0,
                    fontSize: 'calc(1.66rem * 0.8 * 1.0)',
                    fontWeight: 700,
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                }}>
                    Candidatos a <strong>JUNTA MUNICIPAL</strong>
                </p>
            </header>

            {/* ── Sub-header con lista seleccionada ── */}
            <div style={{
                background: 'white',
                borderBottom: '2px solid #545859',
                padding: '4px 16px',
                flexShrink: 0,
                textAlign: 'center',
            }}>
                <p style={{
                    margin: 0,
                    fontSize: 'calc(1.66rem * 0.8 * 0.85)',
                    fontWeight: 400,
                    color: '#333',
                }}>
                    Lista {lista.numero}
                </p>
                <p style={{
                    margin: 0,
                    fontSize: 'calc(1.66rem * 0.8 * 1.33)',
                    fontWeight: 900,
                    color: '#111',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                }}>
                    {lista.partido}
                </p>
            </div>

            {/* ── Grid dinámico ── */}
            <main style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: '4px',
                padding: '4px',
                background: '#eeeeee',
                minHeight: 0,
                boxSizing: 'border-box',
            }}>
                {candidatos.map(c => (
                    <CardCandidato
                        key={c.opcion}
                        candidato={c}
                        color={lista.color}
                        activo={c.opcion === opcionActiva}
                        onClick={() => onAceptar({ partido: lista.partido, lista: lista.numero, nombre: c.nombre, opcion: c.opcion, foto: c.foto })}
                    />
                ))}
                {Array.from({ length: vacias }).map((_, i) => <div key={i} />)}
            </main>
            <FooterSimulador onVolver={onVolver} />
        </div>
    );
}
