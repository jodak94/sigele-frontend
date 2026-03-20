import { useState, useEffect, useMemo } from 'react';
import { getCaptaciones, deleteCaptacion, restoreCaptacion, updateCaptacion } from '../../api/captacionApi';
import type { CaptacionRecord, UpdateCaptacionRequest } from '../../types/captacion';
import { CaptureForm } from './CaptureForm';
import { ElectorTable } from './ElectorTable';
import { EditRecordModal } from './EditRecordModal';

const PAGE_SIZE = 10;

export function OperatorDashboard() {
    const [records, setRecords] = useState<CaptacionRecord[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [editTarget, setEditTarget] = useState<CaptacionRecord | null>(null);

    const totalActivos = useMemo(() => records.filter((r) => !r.borrado).length, [records]);
    const totalMesa = useMemo(
        () => records.filter((r) => !r.borrado && r.disponibleMiembroMesa).length,
        [records],
    );

    useEffect(() => {
        setIsLoading(true);
        getCaptaciones(page, PAGE_SIZE)
            .then((result) => {
                setRecords(result.items);
                setTotalPages(result.totalPages);
            })
            .finally(() => setIsLoading(false));
    }, [page]);

    const handleNewRecord = (record: CaptacionRecord) => {
        setRecords((prev) => [record, ...prev]);
    };

    const handleDelete = async (id: number) => {
        await deleteCaptacion(id);
        setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, borrado: true } : r)));
    };

    const handleRestore = async (id: number) => {
        const updated = await restoreCaptacion(id);
        setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
    };

    const handleEditSave = async (id: number, data: UpdateCaptacionRequest) => {
        const updated = await updateCaptacion(id, data);
        setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
    };

    return (
        <div className="fade-in space-y-6">
            {/* KPI Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-black">Panel Operativo</h1>
                    <p className="text-gray-500 font-medium">Gestione su lista de electores captados.</p>
                </div>
                <div className="flex space-x-4">
                    <div className="text-center px-4 border-r border-gray-200">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Activos</p>
                        <p className="text-3xl font-extrabold text-red-600">{totalActivos}</p>
                    </div>
                    <div className="text-center px-2">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Miembros Mesa</p>
                        <p className="text-3xl font-extrabold text-black">{totalMesa}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <CaptureForm onSuccess={handleNewRecord} />
                <ElectorTable
                    records={records}
                    isLoading={isLoading}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onEdit={setEditTarget}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                />
            </div>

            {editTarget && (
                <EditRecordModal
                    record={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={handleEditSave}
                />
            )}
        </div>
    );
}
