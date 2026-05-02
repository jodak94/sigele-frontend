import { useEffect, useState } from 'react';
import { getTenant } from './tenant';

/**
 * Comprueba si existe la pagina publica (sobre-mi) del tenant actual.
 * Devuelve true si el modulo `../pages/tenants/{slug}.tsx` se puede cargar.
 */
export function useTenantPageEnabled(): boolean {
    const slug = getTenant();
    const [habilitado, setHabilitado] = useState(false);

    useEffect(() => {
        if (!slug) {
            setHabilitado(false);
            return;
        }
        let cancelado = false;
        import(`../pages/tenants/${slug}.tsx`)
            .then(() => { if (!cancelado) setHabilitado(true); })
            .catch(() => { if (!cancelado) setHabilitado(false); });
        return () => { cancelado = true; };
    }, [slug]);

    return habilitado;
}
