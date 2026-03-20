import { ShieldCheck, Users, CheckCircle } from '@phosphor-icons/react';
import type { CoordinatorPerformance } from '../../types/admin';

interface CoordPerformanceProps {
    coordinators: CoordinatorPerformance[];
    isLoading: boolean;
}

export function CoordPerformance({ coordinators, isLoading }: CoordPerformanceProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200 bg-gray-50">
                    <div className="h-6 w-64 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[0, 1].map((i) => (
                        <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-36" />
                    ))}
                </div>
            </div>
        );
    }

    if (coordinators.length === 0) return null;

    const maxRegs = Math.max(...coordinators.map((c) => c.totalCargados), 1);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-black flex items-center">
                    <ShieldCheck size={20} weight="fill" className="mr-2 text-red-600" />
                    Desempeño por Coordinador (Admin Zonal)
                </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {coordinators.map((coord, idx) => {
                    const percent = (coord.totalCargados / maxRegs) * 100;
                    const isLeader = idx === 0;
                    const isLast = idx === coordinators.length - 1 && coordinators.length > 1;
                    const borderColor = isLeader
                        ? 'bg-green-500'
                        : isLast
                        ? 'bg-red-500'
                        : 'bg-gray-400';

                    return (
                        <div
                            key={coord.id}
                            className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative overflow-hidden"
                        >
                            {/* Colored left border */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${borderColor}`} />

                            <div className="pl-3">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-extrabold text-black text-lg leading-tight">
                                            {coord.fullName}
                                        </h3>
                                        <p className="text-sm font-bold text-gray-500 flex items-center mt-1">
                                            <Users size={14} className="mr-1" />
                                            {coord.cantOperadores} Operadores a cargo
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <span className="block text-3xl font-black text-red-600 leading-none">
                                            {coord.totalCargados}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Electores
                                        </span>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>

                                <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                                    <span>
                                        {percent === 100 ? 'Líder en captación 🏆' : 'En progreso'}
                                    </span>
                                    <span className="flex items-center text-black bg-gray-200 px-2 py-0.5 rounded">
                                        <CheckCircle size={12} weight="fill" className="mr-1" />
                                        {coord.miembrosMesa} Miembros Mesa
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
