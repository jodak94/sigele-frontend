import { MagnifyingGlass } from '@phosphor-icons/react';
import type { ConsultasStats } from '../../types/admin';

interface ConsultasStatsProps {
    stats: ConsultasStats | null;
    isLoading: boolean;
}

export function ConsultasStatsCard({ stats, isLoading }: ConsultasStatsProps) {
    const cards = [
        { label: 'Hoy', value: stats?.hoy ?? 0 },
        { label: 'Ayer', value: stats?.ayer ?? 0 },
        { label: 'Últimos 7 días', value: stats?.ultimosSieteDias ?? 0 },
        { label: 'Total', value: stats?.total ?? 0 },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
                <MagnifyingGlass size={18} weight="bold" className="text-primary" />
                <h2 className="text-sm font-bold text-gray-500 uppercase">Consultas al Padrón Público</h2>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-16" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <div key={card.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">{card.label}</p>
                            <p className="text-3xl font-extrabold text-black">{card.value.toLocaleString('es-PY')}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
