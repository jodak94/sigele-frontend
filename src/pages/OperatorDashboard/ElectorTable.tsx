import { Printer, PencilSimple, Trash, ArrowCounterClockwise } from '@phosphor-icons/react';
import type { CaptacionRecord } from '../../types/captacion';

interface ElectorTableProps {
    records: CaptacionRecord[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (record: CaptacionRecord) => void;
    onDelete: (id: number) => void;
    onRestore: (id: number) => void;
}

export function ElectorTable({
    records,
    isLoading,
    page,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
    onRestore,
}: ElectorTableProps) {
    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-extrabold text-black">Mi Lista de Electores</h2>
                    <button
                        onClick={() => window.print()}
                        className="text-sm border border-gray-300 px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold flex items-center"
                    >
                        <Printer size={16} weight="bold" className="text-gray-500 mr-2" />
                        Imprimir Planilla
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Elector</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Local / Ubicación</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Etiquetas</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Acciones</th>
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
                            {!isLoading && records.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">
                                        No hay registros aún.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && records.map((r) => {
                                const deleted = r.borrado;
                                const rowCls = deleted ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50 group';
                                const textCls = deleted ? 'line-through text-gray-400' : '';
                                return (
                                    <tr key={r.id} className={`border-b border-gray-100 ${rowCls}`}>
                                        <td className="px-6 py-4">
                                            <div className={`font-extrabold text-black ${textCls}`}>
                                                {r.electorNombre} {r.electorApellido}
                                            </div>
                                            <div className={`text-sm font-bold mt-1 ${textCls}`}>
                                                CI: {r.cedula}
                                                {r.telefono && ` | 📞 ${r.telefono}`}
                                            </div>
                                            {r.direccionRecogida && (
                                                <div className="text-xs font-bold text-red-700 mt-1">
                                                    📍 {r.direccionRecogida}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm font-bold text-gray-800 ${textCls}`}>
                                                {r.localNombre}
                                            </div>
                                            <div className="text-xs font-bold text-gray-500 mt-1">
                                                Mesa: {r.mesa} | Orden: {r.orden}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                {r.disponibleMiembroMesa && (
                                                    <span className="px-2 py-0.5 text-xs font-bold bg-black text-white rounded">
                                                        Mesa
                                                    </span>
                                                )}
                                                {r.requiereTransporte && (
                                                    <span className="px-2 py-0.5 text-xs font-bold bg-red-800 text-white rounded">
                                                        Transporte
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {deleted ? (
                                                <button
                                                    onClick={() => onRestore(r.id)}
                                                    className="text-gray-500 hover:text-black font-bold text-xs flex items-center justify-center mx-auto gap-1"
                                                >
                                                    <ArrowCounterClockwise size={14} weight="bold" />
                                                    Restaurar
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => onEdit(r)}
                                                        className="text-gray-600 hover:text-black"
                                                        title="Editar"
                                                    >
                                                        <PencilSimple size={20} weight="bold" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(r.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Eliminar"
                                                    >
                                                        <Trash size={20} weight="bold" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200 flex justify-center items-center gap-3">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-bold disabled:opacity-40 hover:bg-gray-50"
                        >
                            Anterior
                        </button>
                        <span className="text-sm font-bold text-gray-600">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-bold disabled:opacity-40 hover:bg-gray-50"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
