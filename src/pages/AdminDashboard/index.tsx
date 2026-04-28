import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    House, FileText, MapPin, Truck, Users, UserPlus, Package,
} from '@phosphor-icons/react';
import { getAdminKpis, getConsultasStats } from '../../api/adminApi';
import { useAuthStore } from '../../store/authStore';
import { usePlanStore } from '../../store/planStore';
import { PlanBanner } from '../../components/PlanBanner';
import type { AdminKpis, ConsultasStats } from '../../types/admin';
import { VoterSearch } from './VoterSearch';
import { KpiCards } from './KpiCards';
import { OperatorDirectory } from './OperatorDirectory';
import { CoordPerformance } from './CoordPerformance';
import { RankingCards } from './RankingCards';
import { CreateUserModal } from './CreateUserModal';
import { UserManagementTable } from './UserManagementTable';
import { ConsultasStatsCard } from './ConsultasStats';
import { MapaElectores } from './MapaElectores';
import { PublicPageCard } from './PublicPageCard';
import { VehiculosPanel } from './VehiculosPanel';
import { ReportesPage } from '../ReportesPage';
import type { Icon } from "@phosphor-icons/react";

type ViewId = 'panel' | 'reportes' | 'mapa' | 'vehiculos' | 'usuarios';

type NavItem = {
  id: ViewId;
  label: string;
  icon: Icon;
};

export function AdminDashboard() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const hasPermission = useAuthStore((s) => s.hasPermission);
    const isSuperAdmin = user?.role.toLowerCase() === 'admin';
    const refreshPlan = usePlanStore((s) => s.refreshPlan);
    const esPlanFull = usePlanStore((s) => s.plan?.esPlanFull ?? false);
    const soportaUbicacion = useAuthStore((s) => s.tenantConfig?.soportaUbicacion ?? false);

    const [kpis, setKpis] = useState<AdminKpis | null>(null);
    const [consultas, setConsultas] = useState<ConsultasStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeView, setActiveView] = useState<ViewId>('panel');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const navItems: NavItem[] = [
        { id: 'panel', label: 'Panel', icon: House },
        { id: 'reportes', label: 'Reportes', icon: FileText },
        ...(soportaUbicacion ? [{ id: 'mapa' as ViewId, label: 'Mapa', icon: MapPin }] : []),
        ...(hasPermission('vehiculo:read') ? [{ id: 'vehiculos' as ViewId, label: 'Vehículos', icon: Truck }] : []),
        { id: 'usuarios', label: 'Usuarios', icon: Users },
    ];

    const loadData = () => {
        setIsLoading(true);
        Promise.allSettled([getAdminKpis(), getConsultasStats()]).then(([kpiRes, consultasRes]) => {
            if (kpiRes.status === 'fulfilled') setKpis(kpiRes.value);
            if (consultasRes.status === 'fulfilled') setConsultas(consultasRes.value);
        }).finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadData();
        refreshPlan();
    }, []);

    return (
        <div className="fade-in space-y-5">
            <PlanBanner />

            {/* Encabezado de sección */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-black">Centro de Control</h1>
                    <p className="text-gray-500 font-medium text-sm">
                        {activeView === 'panel' && 'Métricas globales y logística de campaña.'}
                        {activeView === 'reportes' && 'Documentación y estadísticas para análisis.'}
                        {activeView === 'mapa' && 'Distribución geográfica de electores captados.'}
                        {activeView === 'vehiculos' && 'Flota de campaña y solicitudes de alquiler.'}
                        {activeView === 'usuarios' && 'Administración de usuarios del sistema.'}
                    </p>
                </div>
                {activeView === 'panel' && !esPlanFull && (
                    <button
                        onClick={() => navigate('/plan')}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-50 font-bold text-sm self-start sm:self-auto"
                    >
                        <Package size={15} weight="fill" className="text-primary" />
                        Mi Plan
                    </button>
                )}
            </div>

            {/* Sub-navegación */}
            <div className="overflow-x-auto -mx-1 px-1">
                <div className="flex gap-1.5 border-b border-gray-200 pb-3 min-w-max sm:min-w-0">
                    {navItems.map(({ id, label, icon: Icon }) => {
                        const active = activeView === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveView(id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-150 ${
                                    active
                                        ? 'shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                                style={active
                                    ? { backgroundColor: 'var(--primary)', color: 'white' }
                                    : undefined}
                            >
                                <Icon
                                    size={15}
                                    weight={active ? 'fill' : 'bold'}
                                />
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Vistas ── */}

            {activeView === 'panel' && (
                <div className="space-y-6">
                    <ConsultasStatsCard stats={consultas} isLoading={isLoading} />
                    <VoterSearch />
                    <KpiCards kpis={kpis} isLoading={isLoading} />
                    {isSuperAdmin && <CoordPerformance />}
                    <RankingCards />
                    <PublicPageCard />
                    <OperatorDirectory />
                </div>
            )}

            {activeView === 'reportes' && <ReportesPage />}

            {activeView === 'mapa' && <MapaElectores />}

            {activeView === 'vehiculos' && <VehiculosPanel />}

            {activeView === 'usuarios' && (
                <div className="space-y-6">
                    {isSuperAdmin ? (
                        <UserManagementTable onCreateUser={() => setShowCreateModal(true)} />
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 flex flex-col items-center gap-4 text-center">
                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                <UserPlus size={26} weight="bold" className="text-gray-400" />
                            </div>
                            <div>
                                <p className="font-extrabold text-gray-900">Crear nuevo usuario</p>
                                <p className="text-sm text-gray-500 font-medium mt-0.5">
                                    Registrá operadores o coordinadores para tu equipo.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold btn-primary shadow-sm"
                            >
                                <UserPlus size={16} weight="bold" />
                                Nuevo Usuario
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={loadData}
                />
            )}
        </div>
    );
}
