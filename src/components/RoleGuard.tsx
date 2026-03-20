import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface RoleGuardProps {
    allowed: string[];
    children: React.ReactNode;
}

export function RoleGuard({ allowed, children }: RoleGuardProps) {
    const user = useAuthStore((state) => state.user);
    if (!user || !allowed.some((r) => r.toLowerCase() === user.role.toLowerCase())) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}
