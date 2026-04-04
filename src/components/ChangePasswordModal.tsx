import { useState } from 'react';
import { X, Lock, Eye, EyeSlash, ShieldCheck } from '@phosphor-icons/react';
import { changePassword } from '../api/usersApi';
import { useAuthStore } from '../store/authStore';
import { useToast } from './Toast';
import axios from 'axios';

interface ChangePasswordModalProps {
    onClose?: () => void;
    onSuccess: () => void;
    /** Cuando es true no hay botón de cerrar y el usuario está obligado a cambiar */
    forced?: boolean;
}

export function ChangePasswordModal({ onClose, onSuccess, forced = false }: ChangePasswordModalProps) {
    const userId = useAuthStore((state) => state.user?.id);
    const toast = useToast();

    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mismatch = confirm.length > 0 && next !== confirm;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (next !== confirm) {
            setError('Las contraseñas nuevas no coinciden.');
            return;
        }
        if (!userId) return;

        setError(null);
        setIsSubmitting(true);
        try {
            await changePassword(userId, current, next);
            toast.success('Contraseña actualizada correctamente.');
            onSuccess();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                setError('La contraseña actual es incorrecta.');
            } else {
                setError('Error al cambiar la contraseña. Intente de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={20} weight="bold" className="text-primary" />
                        <div>
                            <h3 className="font-extrabold text-lg text-black leading-tight">
                                {forced ? 'Cambio de contraseña requerido' : 'Cambiar contraseña'}
                            </h3>
                            {forced && (
                                <p className="text-xs text-gray-500 font-medium">
                                    Debes establecer una nueva contraseña para continuar.
                                </p>
                            )}
                        </div>
                    </div>
                    {!forced && onClose && (
                        <button onClick={onClose} className="text-gray-400 hover:text-black">
                            <X size={22} weight="bold" />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(var(--primary-rgb), 0.06)', border: '1px solid rgba(var(--primary-rgb), 0.25)', color: 'var(--primary-darker)' }}>
                            {error}
                        </div>
                    )}

                    <PasswordField
                        label="Contraseña actual"
                        value={current}
                        onChange={setCurrent}
                        show={showCurrent}
                        onToggle={() => setShowCurrent((v) => !v)}
                    />

                    <PasswordField
                        label="Nueva contraseña"
                        value={next}
                        onChange={setNext}
                        show={showNext}
                        onToggle={() => setShowNext((v) => !v)}
                    />

                    <PasswordField
                        label="Confirmar nueva contraseña"
                        value={confirm}
                        onChange={setConfirm}
                        show={showConfirm}
                        onToggle={() => setShowConfirm((v) => !v)}
                        invalid={mismatch}
                        hint={mismatch ? 'Las contraseñas no coinciden.' : undefined}
                    />

                    <div className="pt-2 flex justify-end gap-3 border-t border-gray-200">
                        {!forced && onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-extrabold hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting || mismatch || !current || !next || !confirm}
                            className="px-5 py-2.5 rounded-xl text-sm font-extrabold btn-primary flex items-center gap-2"
                        >
                            <Lock size={16} weight="bold" />
                            {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface PasswordFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
    invalid?: boolean;
    hint?: string;
}

function PasswordField({ label, value, onChange, show, onToggle, invalid, hint }: PasswordFieldProps) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
                {label} <span className="text-primary">*</span>
            </label>
            <div className={`flex items-center bg-gray-50 border rounded-xl px-4 py-2.5 ${invalid ? 'border-primary' : 'border-gray-300'}`}>
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    className="flex-1 bg-transparent outline-none font-bold text-sm text-gray-700"
                />
                <button type="button" onClick={onToggle} className="text-gray-400 hover:text-gray-700 ml-2">
                    {show ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
            </div>
            {hint && <p className="text-xs font-medium mt-1 text-primary">{hint}</p>}
        </div>
    );
}
