import { useEffect, useState } from 'react';
import { ChartBar, MapPin } from '@phosphor-icons/react';
import { getRankingOperadores, getZonaStats } from '../../api/adminApi';
import type { OperatorRanking, ZonaStat } from '../../types/admin';

export function RankingCards() {
    const [ranking, setRanking] = useState<OperatorRanking[]>([]);
    const [zonas, setZonas] = useState<ZonaStat[]>([]);
    const [isLoadingRanking, setIsLoadingRanking] = useState(true);
    const [isLoadingZonas, setIsLoadingZonas] = useState(true);

    useEffect(() => {
        getRankingOperadores()
            .then(setRanking)
            .catch(() => setRanking([]))
            .finally(() => setIsLoadingRanking(false));

        getZonaStats()
            .then(setZonas)
            .catch(() => setZonas([]))
            .finally(() => setIsLoadingZonas(false));
    }, []);

    const maxOp = Math.max(...ranking.map((o) => o.totalElectores), 1);
    const maxZona = Math.max(...zonas.map((z) => z.totalElectores), 1);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ranking Cargas */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-extrabold text-black mb-6 flex items-center">
                    <ChartBar size={20} weight="fill" className="mr-2 text-primary" />
                    Ranking Cargas
                </h2>
                {isLoadingRanking ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-gray-100 animate-pulse rounded h-8" />
                        ))}
                    </div>
                ) : ranking.length === 0 ? (
                    <p className="text-gray-400 text-sm font-medium text-center py-6">Sin datos aún.</p>
                ) : (
                    <div className="space-y-5 max-h-80 overflow-y-auto pr-1">
                        {ranking.map((op, idx) => {
                            const percent = (op.totalElectores / maxOp) * 100;
                            return (
                                <div key={op.userId}>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="font-bold text-gray-800 text-sm flex items-center gap-1 min-w-0">
                                            <span className="text-xs font-black text-gray-400 w-5 shrink-0">
                                                {idx + 1}.
                                            </span>
                                            <span className="truncate">{op.fullName}</span>
                                        </span>
                                        <span className="font-extrabold text-primary text-sm shrink-0 ml-2">
                                            {op.totalElectores}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full transition-all duration-1000"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Electores por Zona */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-extrabold text-black mb-6 flex items-center">
                    <MapPin size={20} weight="fill" className="mr-2 text-primary" />
                    Electores por Zona
                </h2>
                {isLoadingZonas ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-gray-100 animate-pulse rounded h-8" />
                        ))}
                    </div>
                ) : zonas.length === 0 ? (
                    <p className="text-gray-400 text-sm font-medium text-center py-6">Sin datos aún.</p>
                ) : (
                    <div className="space-y-5 max-h-80 overflow-y-auto pr-1">
                        {zonas.map((z, idx) => {
                            const percent = (z.totalElectores / maxZona) * 100;
                            return (
                                <div key={`${z.depart}-${z.distrito}-${z.zona}`}>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="font-bold text-gray-800 text-sm flex items-center gap-1 min-w-0">
                                            <span className="text-xs font-black text-gray-400 w-5 shrink-0">
                                                {idx + 1}.
                                            </span>
                                            <span className="truncate">{z.descripcion ?? 'Sin zona'}</span>
                                        </span>
                                        <span className="font-extrabold text-black text-sm shrink-0 ml-2">
                                            {z.totalElectores}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className="bg-gray-800 h-2.5 rounded-full transition-all duration-1000"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
