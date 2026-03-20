import type { OperatorStats } from '../../types/admin';

interface OperatorDirectoryProps {
    operators: OperatorStats[];
    isLoading: boolean;
}

export function OperatorDirectory({ operators, isLoading }: OperatorDirectoryProps) {
    const sorted = [...operators].sort((a, b) => b.registros - a.registros);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-extrabold text-black">Directorio de Cuentas (Operadores)</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                Usuario / Rol
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                Contacto
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                Métricas
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {isLoading && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-gray-500 font-bold">
                                    Cargando...
                                </td>
                            </tr>
                        )}
                        {!isLoading && sorted.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-gray-500 font-bold">
                                    No hay operadores registrados.
                                </td>
                            </tr>
                        )}
                        {!isLoading &&
                            sorted.map((op) => (
                                <tr key={op.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-black">{op.fullName}</div>
                                        <div className="text-[10px] font-bold uppercase text-red-600">
                                            {op.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-700">{op.phone}</div>
                                        <div className="text-xs text-gray-500 font-medium">{op.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 flex-wrap">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded">
                                                {op.registros} Reg
                                            </span>
                                            <span className="px-2 py-1 bg-black text-white text-xs font-bold rounded">
                                                {op.mesa} Mesa
                                            </span>
                                            {op.tachas > 0 && (
                                                <span className="px-2 py-1 bg-red-50 text-red-800 text-xs font-bold rounded">
                                                    {op.tachas} Tachas
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
