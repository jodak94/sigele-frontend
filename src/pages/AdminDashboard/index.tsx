import { useState, useEffect } from 'react';
import { FileText, Users, UserPlus } from '@phosphor-icons/react';
import { getAdminKpis, getOperatorStats, getCoordinatorStats, getBarrioStats, getConsultasStats } from '../../api/adminApi';
import { useAuthStore } from '../../store/authStore';
import type { AdminKpis, OperatorStats, CoordinatorPerformance, BarrioStat, ConsultasStats } from '../../types/admin';
import { VoterSearch } from './VoterSearch';
import { KpiCards } from './KpiCards';
import { OperatorDirectory } from './OperatorDirectory';
import { CoordPerformance } from './CoordPerformance';
import { RankingCards } from './RankingCards';
import { CreateUserModal } from './CreateUserModal';
import { ConsultasStatsCard } from './ConsultasStats';

export function AdminDashboard() {
    const user = useAuthStore((state) => state.user);
    const isSuperAdmin = user?.role.toLowerCase() === 'admin';

    const [kpis, setKpis] = useState<AdminKpis | null>(null);
    const [operators, setOperators] = useState<OperatorStats[]>([]);
    const [coordinators, setCoordinators] = useState<CoordinatorPerformance[]>([]);
    const [barrios, setBarrios] = useState<BarrioStat[]>([]);
    const [consultas, setConsultas] = useState<ConsultasStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const loadData = () => {
        setIsLoading(true);

        const base = [getAdminKpis(), getOperatorStats(), getBarrioStats(), getConsultasStats()] as const;
        const coordCall = isSuperAdmin ? getCoordinatorStats() : Promise.resolve(null);

        Promise.allSettled([...base, coordCall]).then(([kpiRes, opRes, barrioRes, consultasRes, coordRes]) => {
            if (kpiRes.status === 'fulfilled') setKpis(kpiRes.value);
            if (opRes.status === 'fulfilled') setOperators(opRes.value);
            if (barrioRes.status === 'fulfilled') setBarrios(barrioRes.value);
            if (consultasRes.status === 'fulfilled') setConsultas(consultasRes.value);
            if (coordRes.status === 'fulfilled' && coordRes.value) setCoordinators(coordRes.value);
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
                    <button className="bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-50 font-bold text-sm flex items-center">
                        <FileText size={16} weight="bold" className="text-red-600 mr-2" />
                        Reportes D-Day
                    </button>
                    <button className="bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-50 font-bold text-sm flex items-center">
                        <Users size={16} weight="bold" className="mr-2" />
                        Miembros Mesa
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 font-bold text-sm flex items-center shadow-sm"
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
            {isSuperAdmin && (
                <CoordPerformance coordinators={coordinators} isLoading={isLoading} />
            )}

            {/* Ranking Cargas + Electores por Barrio */}
            <RankingCards operators={operators} barrios={barrios} isLoading={isLoading} />

            <OperatorDirectory operators={operators} isLoading={isLoading} />

            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={loadData}
                />
            )}
        </div>
    );
}
