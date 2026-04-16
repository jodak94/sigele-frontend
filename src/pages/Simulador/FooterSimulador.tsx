export function FooterSimulador({ onVolver }: { onVolver?: () => void }) {
    const btnBase: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        background: '#b0b0b0',
        border: 'none',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: 'Arial, sans-serif',
    };

    return (
        <footer style={{
            flexShrink: 0,
            background: '#c8c8c8',
            display: 'flex',
            alignItems: 'stretch',
            gap: '4px',
            padding: '4px',
        }}>
            {/* Vista alto contraste — deshabilitado */}
            <div style={{ ...btnBase, cursor: 'default', opacity: 0.4, pointerEvents: 'none' }}>
                {/* Icono contraste: mitad negro mitad blanco */}
                <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="15" fill="white" stroke="#555" strokeWidth="2" />
                    <path d="M16 1 A15 15 0 0 1 16 31 Z" fill="#333" />
                </svg>
                <span style={{ fontSize: 'calc(1.66rem * 0.8 * 0.7)', fontWeight: 600, color: '#222', lineHeight: 1.2 }}>
                    Vista alto<br />contraste
                </span>
            </div>

            {/* Volver Atrás */}
            {onVolver && (
                <div style={{ ...btnBase, cursor: 'pointer' }} onClick={onVolver}>
                    {/* Icono flecha izquierda */}
                    <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="4" fill="#555" />
                        <polyline points="20,8 12,16 20,24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 'calc(1.66rem * 0.8 * 0.7)', fontWeight: 600, color: '#222', lineHeight: 1.2 }}>
                        Volver<br />Atrás
                    </span>
                </div>
            )}
        </footer>
    );
}
