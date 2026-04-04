const DEFAULT_PRIMARY = '#6B7280';

/** Normaliza cualquier string de color hex a formato #RRGGBB válido.
 *  Si el input es inválido, devuelve el color primario por defecto. */
export function normalizeHex(hex: string): string {
    if (!hex) return DEFAULT_PRIMARY;
    const s = hex.trim();
    const withHash = s.startsWith('#') ? s : `#${s}`;
    // 3-digit → 6-digit
    if (/^#[0-9A-Fa-f]{3}$/.test(withHash)) {
        return `#${withHash[1]}${withHash[1]}${withHash[2]}${withHash[2]}${withHash[3]}${withHash[3]}`;
    }
    // Valid 6-digit
    if (/^#[0-9A-Fa-f]{6}$/.test(withHash)) {
        return withHash.toUpperCase();
    }
    return DEFAULT_PRIMARY;
}

export function hexToRgb(hex: string): [number, number, number] {
    const c = normalizeHex(hex).slice(1); // always 6 valid hex chars after normalize
    return [
        parseInt(c.slice(0, 2), 16),
        parseInt(c.slice(2, 4), 16),
        parseInt(c.slice(4, 6), 16),
    ];
}

export function hexDarken(hex: string, factor: number): string {
    const [r, g, b] = hexToRgb(hex);
    const d = (n: number) =>
        Math.round(Math.max(0, n * (1 - factor))).toString(16).padStart(2, '0');
    return `#${d(r)}${d(g)}${d(b)}`;
}

export function applyPrimaryColor(hex: string) {
    const normalized = normalizeHex(hex);
    const [r, g, b] = hexToRgb(normalized);
    const root = document.documentElement;
    root.style.setProperty('--primary', normalized);
    root.style.setProperty('--primary-dark', hexDarken(normalized, 0.15));
    root.style.setProperty('--primary-darker', hexDarken(normalized, 0.28));
    root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
}
