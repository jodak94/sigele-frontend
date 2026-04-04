import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, UserPlus, MapPin, Fingerprint } from '@phosphor-icons/react';
import { getAdminKpis, getConsultasStats } from '../../api/adminApi';
import { useAuthStore } from '../../store/authStore';
import type { AdminKpis, ConsultasStats } from '../../types/admin';
import { VoterSearch } from './VoterSearch';
import { KpiCards } from './KpiCards';
import { OperatorDirectory } from './OperatorDirectory';
import { CoordPerformance } from './CoordPerformance';
import { RankingCards } from './RankingCards';
import { CreateUserModal } from './CreateUserModal';
import { ConsultasStatsCard } from './ConsultasStats';
import { MapaElectores } from './MapaElectores';

export function AdminDashboard() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const isSuperAdmin = user?.role.toLowerCase() === 'admin';
    
    const [kpis, setKpis] = useState<AdminKpis | null>(null);
    const [consultas, setConsultas] = useState<ConsultasStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMapa, setShowMapa] = useState(false);

    const soportaUbicacion = useAuthStore((s) => s.tenantConfig?.soportaUbicacion ?? false);

    const loadData = () => {
        setIsLoading(true);
        Promise.allSettled([getAdminKpis(), getConsultasStats()]).then(([kpiRes, consultasRes]) => {
            if (kpiRes.status === 'fulfilled') setKpis(kpiRes.value);
            if (consultasRes.status === 'fulfilled') setConsultas(consultasRes.value);
        }).finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-black">Centro de Control</h1>
                    <p className="text-gray-500 font-medium">Métricas globales y logística de campaña.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/reportes?tab=diad')}
                        className="bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-50 font-bold text-sm flex items-center"
                    >
                        <FileText size={16} weight="bold" className="text-primary mr-2" />
                        Reportes D-Day
                    </button>
                    <button
                        onClick={() => navigate('/reportes?tab=mesas')}
                        className="bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-50 font-bold text-sm flex items-center"
                    >
                        <Users size={16} weight="bold" className="mr-2" />
                        Miembros Mesa
                    </button>
                    {soportaUbicacion && (
                        <button
                            onClick={() => setShowMapa(true)}
                            className="bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-50 font-bold text-sm flex items-center"
                        >
                            <MapPin size={16} weight="fill" className="text-primary mr-2" />
                            Mapa de Electores
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/auditoria')}
                        className="bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-50 font-bold text-sm flex items-center"
                    >
                        <Fingerprint size={16} weight="fill" className="text-primary mr-2" />
                        Auditoría
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center shadow-sm btn-primary"
                    >
                        <UserPlus size={16} weight="bold" className="mr-2" />
                        Nuevo Usuario
                    </button>
                </div>
            </div>

            <ConsultasStatsCard stats={consultas} isLoading={isLoading} />
            <VoterSearch />
            <KpiCards kpis={kpis} isLoading={isLoading} />

            {/* Desempeño por Coordinador — solo SuperAdmin */}
            {isSuperAdmin && <CoordPerformance />}

            {/* Ranking Cargas + Electores por Barrio */}
            <RankingCards />

            <OperatorDirectory />

            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={loadData}
                />
            )}

            {showMapa && (
                <MapaElectores onClose={() => setShowMapa(false)} />
            )}
        </div>
    );
}
