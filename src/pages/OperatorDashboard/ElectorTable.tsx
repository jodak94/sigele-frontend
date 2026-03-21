import { useState } from 'react';
import { FilePdf, FileXls, PencilSimple, Trash } from '@phosphor-icons/react';
import type { CaptacionRecord } from '../../types/captacion';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { exportarElectores } from '../../api/captacionApi';
import { useToast } from '../../components/Toast';

interface ElectorTableProps {
    records: CaptacionRecord[];
    isLoading: boolean;
    onEdit: (record: CaptacionRecord) => void;
    onDelete: (electorId: number) => void;
    onRestore: (electorId: number) => void;
}

export function ElectorTable({ records, isLoading, onEdit, onDelete, onRestore }: ElectorTableProps) {
    void onRestore; // disponible para uso futuro
    const toast = useToast();
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [exporting, setExporting] = useState<'xls' | 'pdf' | null>(null);

    const handleExport = async (formato: 'xls' | 'pdf') => {
        setExporting(formato);
        try {
            await exportarElectores(formato);
        } catch {
            toast.error('No se pudo generar el reporte. Intente de nuevo.');
        } finally {
            setExporting(null);
        }
    };

    return (
        <>
        <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-extrabold text-black">Mi Lista de Electores</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleExport('xls')}
                            disabled={exporting !== null}
                            className="text-sm border border-gray-300 px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold flex items-center disabled:opacity-50"
                        >
                            <FileXls size={16} weight="bold" className="text-green-600 mr-2" />
                            {exporting === 'xls' ? 'Exportando...' : 'Excel'}
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            disabled={exporting !== null}
                            className="text-sm border border-gray-300 px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold flex items-center disabled:opacity-50"
                        >
                            <FilePdf size={16} weight="bold" className="text-red-600 mr-2" />
                            {exporting === 'pdf' ? 'Exportando...' : 'PDF'}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Elector</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Contacto</th>
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
                            {!isLoading && records.map((r) => (
                                <tr key={r.electorId} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-black">
                                            {r.nombre} {r.apellido}
                                        </div>
                                        <div className="text-sm font-bold text-gray-500 mt-1">
                                            CI: {r.numeroCed}
                                        </div>
                                        {r.direccionRecogida && (
                                            <div className="text-xs font-bold text-red-700 mt-1">
                                                📍 {r.direccionRecogida}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {r.nroTelefono && (
                                            <div className="text-sm font-bold text-gray-800">
                                                📞 {r.nroTelefono}
                                            </div>
                                        )}
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
                                        <div className="flex items-center justify-center space-x-3">
                                            <button
                                                onClick={() => onEdit(r)}
                                                className="text-gray-600 hover:text-black"
                                                title="Editar"
                                            >
                                                <PencilSimple size={20} weight="bold" />
                                            </button>
                                            <button
                                                onClick={() => setPendingDeleteId(r.electorId)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Eliminar"
                                            >
                                                <Trash size={20} weight="bold" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {pendingDeleteId !== null && (
            <ConfirmDialog
                title="Eliminar registro"
                message="¿Está seguro que desea eliminar este elector? Esta acción no se puede deshacer."
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onConfirm={() => {
                    onDelete(pendingDeleteId);
                    setPendingDeleteId(null);
                }}
                onCancel={() => setPendingDeleteId(null)}
            />
        )}
        </>
    );
}
