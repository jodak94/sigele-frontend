import { useState, useEffect, useMemo } from 'react';
import { getCaptaciones, deleteCaptacion, restoreCaptacion, updateCaptacion } from '../../api/captacionApi';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../components/Toast';
import type { CaptacionRecord, UpdateCaptacionRequest } from '../../types/captacion';
import { CaptureForm } from './CaptureForm';
import { ElectorTable } from './ElectorTable';
import { EditRecordModal } from './EditRecordModal';

export function OperatorDashboard() {
    const userId = useAuthStore((s) => s.user!.id);
    const toast = useToast();

    const [records, setRecords] = useState<CaptacionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editTarget, setEditTarget] = useState<CaptacionRecord | null>(null);

    const totalActivos = useMemo(() => records.length, [records]);
    const totalMesa = useMemo(
        () => records.filter((r) => r.disponibleMiembroMesa).length,
        [records],
    );

    const loadRecords = () => {
        setIsLoading(true);
        getCaptaciones(userId)
            .then(setRecords)
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadRecords();
    }, []);

    const handleNewRecord = () => {
        loadRecords();
    };

    const handleDelete = async (electorId: number) => {
        try {
            await deleteCaptacion(electorId);
            setRecords((prev) => prev.filter((r) => r.electorId !== electorId));
            toast.success('Registro eliminado correctamente.');
        } catch {
            toast.error('No se pudo eliminar el registro. Intente de nuevo.');
        }
    };

    const handleRestore = async (electorId: number) => {
        const updated = await restoreCaptacion(electorId);
        setRecords((prev) => prev.map((r) => (r.electorId === electorId ? updated : r)));
    };

    const handleEditSave = async (electorId: number, data: UpdateCaptacionRequest) => {
        await updateCaptacion(electorId, data);
        setRecords((prev) => prev.map((r) => (r.electorId === electorId ? { ...r, ...data } : r)));
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
                        <p className="text-3xl font-extrabold text-primary">{totalActivos}</p>
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
