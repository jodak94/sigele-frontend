/**
 * Detects the tenant subdomain from the current hostname.
 *
 * Production:  tenant.sigele.com.py  → "tenant"
 *              sigele.com.py          → null
 * Development: tenant.localhost       → "tenant"
 *              localhost              → null
 */
const BASE_DOMAINS = ['sigele.com.py', 'localhost'];

export function getTenant(): string | null {
    const hostname = window.location.hostname;

    for (const base of BASE_DOMAINS) {
        if (hostname === base || hostname === `www.${base}`) return null;
        if (hostname.endsWith(`.${base}`)) {
            const sub = hostname.slice(0, -(base.length + 1));
            if (sub && sub !== 'www') return sub;
        }
    }

    return null;
}

/**
 * Builds the full URL for a given tenant.
 * e.g. buildTenantUrl("demo") → "https://demo.sigele.com.py"
 */
export function buildTenantUrl(tenant: string): string {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname.endsWith('.localhost');
    if (isLocal) return `http://${tenant}.localhost:${window.location.port}`;
    return `https://${tenant}.sigele.com.py`;
}
