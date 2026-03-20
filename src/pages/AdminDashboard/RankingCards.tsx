import { ChartBar, MapPin } from '@phosphor-icons/react';
import type { OperatorStats, BarrioStat } from '../../types/admin';

interface RankingCardsProps {
    operators: OperatorStats[];
    barrios: BarrioStat[];
    isLoading: boolean;
}

export function RankingCards({ operators, barrios, isLoading }: RankingCardsProps) {
    const maxOp = Math.max(...operators.map((o) => o.registros), 1);
    const maxBarrio = Math.max(...barrios.map((b) => b.total), 1);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-100 animate-pulse rounded-2xl h-64" />
                <div className="bg-gray-100 animate-pulse rounded-2xl h-64" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ranking Cargas */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-extrabold text-black mb-6 flex items-center">
                    <ChartBar size={20} weight="fill" className="mr-2 text-red-600" />
                    Ranking Cargas
                </h2>
                {operators.length === 0 ? (
                    <p className="text-gray-400 text-sm font-medium text-center py-6">
                        Sin datos aún.
                    </p>
                ) : (
                    <div className="space-y-5">
                        {operators.map((op, idx) => {
                            const percent = (op.registros / maxOp) * 100;
                            return (
                                <div key={op.id}>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="font-bold text-gray-800 text-sm flex items-center gap-1 min-w-0">
                                            <span className="text-xs font-black text-gray-400 w-5 shrink-0">
                                                {idx + 1}.
                                            </span>
                                            <span className="truncate">{op.fullName}</span>
                                        </span>
                                        <span className="font-extrabold text-red-600 text-sm shrink-0 ml-2">
                                            {op.registros}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className="bg-red-600 h-2.5 rounded-full transition-all duration-1000"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Electores por Barrio */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-extrabold text-black mb-6 flex items-center">
                    <MapPin size={20} weight="fill" className="mr-2 text-red-600" />
                    Electores por Barrio
                </h2>
                {barrios.length === 0 ? (
                    <p className="text-gray-400 text-sm font-medium text-center py-6">
                        Sin datos aún.
                    </p>
                ) : (
                    <div className="space-y-5">
                        {barrios.map((barrio, idx) => {
                            const percent = (barrio.total / maxBarrio) * 100;
                            return (
                                <div key={barrio.nombre}>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span
                                            className="font-bold text-gray-800 text-sm flex items-center gap-1 min-w-0"
                                            title={barrio.nombre}
                                        >
                                            <span className="text-xs font-black text-gray-400 w-5 shrink-0">
                                                {idx + 1}.
                                            </span>
                                            <span className="truncate max-w-[200px]">{barrio.nombre}</span>
                                        </span>
                                        <span className="font-extrabold text-black text-sm shrink-0 ml-2">
                                            {barrio.total}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className="bg-gray-800 h-2.5 rounded-full transition-all duration-1000"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    {barrio.seccional && (
                                        <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                                            Seccional {barrio.seccional}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
