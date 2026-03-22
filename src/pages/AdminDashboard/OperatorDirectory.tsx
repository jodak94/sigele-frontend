import { useEffect, useState } from 'react';
import { List } from '@phosphor-icons/react';
import { getOperatorInfo } from '../../api/adminApi';
import type { OperatorInfo } from '../../types/admin';
import { OperatorElectoresModal } from './OperatorElectoresModal';

export function OperatorDirectory() {
    const [operators, setOperators] = useState<OperatorInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState<OperatorInfo | null>(null);

    useEffect(() => {
        getOperatorInfo()
            .then(setOperators)
            .catch(() => setOperators([]))
            .finally(() => setIsLoading(false));
    }, []);

    const sorted = [...operators].sort((a, b) => b.totalElectores - a.totalElectores);

    return (
        <>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-extrabold text-black">Directorio de Cuentas (Operadores)</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                Usuario
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                Contacto
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                Métricas
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                                Ver Lista
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {isLoading && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                                    Cargando...
                                </td>
                            </tr>
                        )}
                        {!isLoading && sorted.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                                    No hay operadores registrados.
                                </td>
                            </tr>
                        )}
                        {!isLoading &&
                            sorted.map((op) => (
                                <tr key={op.userId} className="hover:bg-gray-50 border-b border-gray-100">
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-black">{op.fullName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-700">{op.phone}</div>
                                        <div className="text-xs text-gray-500 font-medium">{op.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 flex-wrap">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded">
                                                {op.totalElectores} Electores
                                            </span>
                                            <span className="px-2 py-1 bg-black text-white text-xs font-bold rounded">
                                                {op.miembrosMesa} Mesa
                                            </span>
                                            {op.requierenTransporte > 0 && (
                                                <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded">
                                                    {op.requierenTransporte} Transporte
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => setSelected(op)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                                            title="Ver lista de electores"
                                        >
                                            <List size={14} weight="bold" />
                                            Ver Lista
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>

        {selected && (
            <OperatorElectoresModal
                operatorId={selected.userId}
                operatorName={selected.fullName}
                onClose={() => setSelected(null)}
            />
        )}
        </>
    );
}
