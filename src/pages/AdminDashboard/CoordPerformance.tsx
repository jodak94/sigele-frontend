import { useEffect, useState } from 'react';
import { ShieldCheck, Users, CheckCircle, Envelope, Phone } from '@phosphor-icons/react';
import { getResumenCoordinadores } from '../../api/adminApi';
import type { CoordinadorResumen } from '../../types/admin';

export function CoordPerformance() {
    const [coordinators, setCoordinators] = useState<CoordinadorResumen[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getResumenCoordinadores()
            .then(setCoordinators)
            .catch(() => setCoordinators([]))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200 bg-gray-50">
                    <div className="h-6 w-64 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[0, 1].map((i) => (
                        <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-40" />
                    ))}
                </div>
            </div>
        );
    }

    if (coordinators.length === 0) return null;

    const sorted = [...coordinators].sort((a, b) => b.totalElectores - a.totalElectores);
    const maxElectores = sorted[0].totalElectores || 1;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-black flex items-center">
                    <ShieldCheck size={20} weight="fill" className="mr-2 text-primary" />
                    Desempeño por Coordinador (Admin Zonal)
                </h2>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                    {coordinators.length} coordinadores
                </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {sorted.map((coord, idx) => {
                    const percent = (coord.totalElectores / maxElectores) * 100;
                    const isLeader = idx === 0;
                    const isLast = idx === sorted.length - 1 && sorted.length > 1;
                    const borderColor = isLeader ? 'bg-green-500' : isLast ? 'bg-primary' : 'bg-gray-400';

                    return (
                        <div
                            key={coord.userId}
                            className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative overflow-hidden"
                        >
                            {/* Colored left border accent */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${borderColor}`} />

                            <div className="pl-3">
                                {/* Name + electores count */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="min-w-0">
                                        <h3 className="font-extrabold text-black text-lg leading-tight truncate">
                                            {coord.fullName}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                                            <span className="text-sm font-bold text-gray-500 flex items-center">
                                                <Users size={13} className="mr-1 shrink-0" />
                                                {coord.totalOperadores} Operadores
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <span className="block text-3xl font-black text-primary leading-none">
                                            {coord.totalElectores}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Electores
                                        </span>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="flex flex-col gap-0.5 mb-3">
                                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                        <Envelope size={11} />
                                        {coord.email}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                        <Phone size={11} />
                                        {coord.phone}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>

                                <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                                    <span>
                                        {percent === 100 ? 'Líder en captación 🏆' : 'En progreso'}
                                    </span>
                                    <span className="flex items-center text-black bg-gray-200 px-2 py-0.5 rounded">
                                        <CheckCircle size={12} weight="fill" className="mr-1" />
                                        {coord.totalMiembrosMesa} Miembros Mesa
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
