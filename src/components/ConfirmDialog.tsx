import { WarningCircle } from '@phosphor-icons/react';

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    title,
    message,
    confirmLabel = 'Eliminar',
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
                        <WarningCircle size={32} weight="fill" className="text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-extrabold text-black">{title}</h3>
                        <p className="text-sm text-gray-500 font-medium mt-1">{message}</p>
                    </div>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-extrabold text-gray-700 hover:bg-gray-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-extrabold text-white bg-red-600 hover:bg-red-700"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
