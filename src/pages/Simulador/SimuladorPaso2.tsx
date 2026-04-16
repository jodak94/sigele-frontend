import type { ListaJunta } from './data/tipos';
import { FooterSimulador } from './FooterSimulador';

/** Alias para compatibilidad con Paso3 que importa `Lista` desde aquí */
export type Lista = ListaJunta;

/* ─── Card lista ─────────────────────────────────────────────────────────── */

function CardLista({
    lista,
    activa,
    onClick,
}: {
    lista: Lista;
    activa: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={activa ? onClick : undefined}
            style={{
                background: 'white',
                border: '1px solid #bec3be',
                cursor: activa ? 'pointer' : 'default',
                opacity: activa ? 1 : 0.35,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'clamp(10px, 2.5vh, 24px) clamp(8px, 2vw, 20px)',
                boxSizing: 'border-box',
                userSelect: 'none',
                overflow: 'hidden',
                textAlign: 'center',
            }}
        >
            {/* LISTA X — grande arriba */}
            <p style={{
                margin: 0,
                fontSize: 'calc(1.66rem * 0.8 * 1.33 * 2)',
                fontWeight: 900,
                color: '#111',
                lineHeight: 1,
                textTransform: 'uppercase',
            }}>
                LISTA {lista.numero}
            </p>

            {/* Nombre del partido — centro */}
            <p style={{
                margin: 0,
                fontSize: 'calc(1.66rem * 0.8 * 1.33)',
                fontWeight: 700,
                color: '#222',
                textTransform: 'uppercase',
                lineHeight: 1.3,
            }}>
                {lista.partido}
            </p>

            {/* Siglas — abajo */}
            <p style={{
                margin: 0,
                fontSize: 'calc(1.66rem * 0.8 * 1.0)',
                color: '#444',
                fontWeight: 400,
            }}>
                {lista.siglas}
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
                textAlign: 'center',
            }}
        >
            <p style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 'calc(1.66rem * 0.8 * 1.33)',
                color: '#333',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
            }}>
                VOTO EN BLANCO
            </p>
        </div>
    );
}

/* ─── Paso 2 ─────────────────────────────────────────────────────────────── */

export function SimuladorPaso2({
    listas,
    listaIdActiva,
    onAceptar,
    onVolver,
}: {
    listas: ListaJunta[];
    listaIdActiva: string;
    onAceptar: (lista: Lista | 'blanco') => void;
    onVolver?: () => void;
}) {
    // Cuántas celdas necesitamos: listas + VOTO EN BLANCO
    const total = listas.length + 1;
    // Siempre grid 3 columnas; filas las que hagan falta
    const cols = 3;
    const rows = Math.ceil(total / cols);
    // Celdas vacías para completar el grid
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
                    Listas participantes al cargo de <strong>JUNTA MUNICIPAL</strong>
                </p>
            </header>

            {/* ── Grid 3×N ── */}
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
                {listas.map(l => (
                    <CardLista key={l.id} lista={l} activa={l.id === listaIdActiva} onClick={() => onAceptar(l)} />
                ))}
                <CardVotoEnBlanco onClick={() => onAceptar('blanco')} />
                {Array.from({ length: vacias }).map((_, i) => (
                    <div key={i} />
                ))}
            </main>
            <FooterSimulador onVolver={onVolver} />
        </div>
    );
}
