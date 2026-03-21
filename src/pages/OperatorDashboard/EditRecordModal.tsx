import { useState } from 'react';
import { X } from '@phosphor-icons/react';
import { useToast } from '../../components/Toast';
import type { CaptacionRecord, UpdateCaptacionRequest } from '../../types/captacion';

interface EditRecordModalProps {
    record: CaptacionRecord;
    onClose: () => void;
    onSave: (id: number, data: UpdateCaptacionRequest) => Promise<void>;
}

export function EditRecordModal({ record, onClose, onSave }: EditRecordModalProps) {
    const toast = useToast();
    const [disponibleMiembroMesa, setDisponibleMiembroMesa] = useState(record.disponibleMiembroMesa);
    const [requiereTransporte, setRequiereTransporte] = useState(record.requiereTransporte);
    const [nroTelefono, setNroTelefono] = useState(record.nroTelefono);
    const [direccionRecogida, setDireccionRecogida] = useState(record.direccionRecogida);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(record.electorId, { nroTelefono, direccionRecogida, disponibleMiembroMesa, requiereTransporte });
            toast.success('Registro actualizado correctamente.');
            onClose();
        } catch {
            toast.error('No se pudo actualizar el registro. Intente de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-extrabold text-lg text-black">Editar Registro</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">
                        <X size={22} weight="bold" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <p className="font-extrabold text-black text-lg">
                            {record.nombre} {record.apellido}
                        </p>
                        <p className="text-sm font-bold text-gray-600">CI: {record.numeroCed}</p>
                    </div>

                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={disponibleMiembroMesa}
                                onChange={(e) => setDisponibleMiembroMesa(e.target.checked)}
                                className="w-5 h-5 border-2 rounded text-black focus:ring-black"
                            />
                            <span className="ml-3 text-sm text-gray-800 font-bold">Miembro de Mesa</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={requiereTransporte}
                                onChange={(e) => setRequiereTransporte(e.target.checked)}
                                className="w-5 h-5 border-2 rounded text-red-800 focus:ring-red-800"
                            />
                            <span className="ml-3 text-sm text-gray-800 font-bold">Requiere Transporte</span>
                        </label>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-gray-200">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                value={nroTelefono}
                                onChange={(e) => setNroTelefono(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none text-sm font-bold focus:ring-2 focus:ring-red-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Dirección Recogida</label>
                            <input
                                type="text"
                                value={direccionRecogida}
                                onChange={(e) => setDireccionRecogida(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none text-sm font-bold focus:ring-2 focus:ring-red-600"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-extrabold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-2.5 rounded-xl text-sm font-extrabold text-white bg-black hover:bg-gray-900 disabled:opacity-60"
                        >
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
