import type { AdminKpis } from '../../types/admin';

interface KpiCardsProps {
    kpis: AdminKpis | null;
    isLoading: boolean;
}

export function KpiCards({ kpis, isLoading }: KpiCardsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-24" />
                ))}
            </div>
        );
    }

    const cards = [
        { label: 'Total Activos', value: kpis?.totalActivos ?? 0, valueClass: 'text-red-600' },
        { label: 'Candidatos a Mesa', value: kpis?.candidatosMesa ?? 0, valueClass: 'text-black' },
        { label: 'Req. Transporte', value: kpis?.requierenTransporte ?? 0, valueClass: 'text-red-800' },
        { label: 'Tachados (Borrado)', value: kpis?.tachados ?? 0, valueClass: 'text-gray-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <p className="text-sm font-bold text-gray-500 uppercase">{card.label}</p>
                    <p className={`text-4xl font-extrabold ${card.valueClass}`}>{card.value}</p>
                </div>
            ))}
        </div>
    );
}
