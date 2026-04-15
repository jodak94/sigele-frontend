import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { getTenant } from '../utils/tenant';

type Status = 'loading' | 'ok' | 'redirect';

export function TenantHomePage() {
    const [status, setStatus] = useState<Status>('loading');
    const [Page, setPage] = useState<ComponentType | null>(null);

    useEffect(() => {
        const slug = getTenant();
        if (!slug) {
            setStatus('redirect');
            return;
        }

        import(`./tenants/${slug}`)
            .then((mod) => {
                setPage(() => mod.default);
                setStatus('ok');
            })
            .catch(() => setStatus('redirect'));
    }, []);

    if (status === 'loading') return null;
    if (status === 'redirect' || !Page) return <Navigate to="/padron" replace />;
    return <Page />;
}
