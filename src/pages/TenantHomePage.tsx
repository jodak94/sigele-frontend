import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getTenant } from '../utils/tenant';
import { TenantPublicPage } from '../components/TenantPublicPage';

type Status = 'loading' | 'ok' | 'redirect';

export function TenantHomePage() {
    const [status, setStatus] = useState<Status>('loading');
    const [perfil, setPerfil] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        const slug = getTenant();
        if (!slug) {
            setStatus('redirect');
            return;
        }

        import(`../tenant-profiles/${slug}.json`)
            .then((mod) => {
                const data = mod.default ?? mod;
                if (data?.habilitado) {
                    setPerfil(data);
                    setStatus('ok');
                } else {
                    setStatus('redirect');
                }
            })
            .catch(() => setStatus('redirect'));
    }, []);

    if (status === 'loading') return null;
    if (status === 'redirect') return <Navigate to="/padron" replace />;
    return <TenantPublicPage perfil={perfil} />;
}
