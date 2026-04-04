import { useState, useEffect } from 'react';
import { X, UserPlus, Eye, EyeSlash, Copy, Check } from '@phosphor-icons/react';
import { createUser, getCoordinators, getRoles } from '../../api/usersApi';
import { CustomSelect } from '../../components/CustomSelect';
import { useToast } from '../../components/Toast';
import { useAuthStore } from '../../store/authStore';
import type { CoordinatorListItem, Role } from '../../types/user';
import axios from 'axios';

const TEMP_PASSWORD = 'SGELE-2026!';

interface CreateUserModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
    const toast = useToast();
    const loggedUser = useAuthStore((state) => state.user);
    const isCoordinator = loggedUser?.role.toLowerCase().includes('coord') ?? false;

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [roleId, setRoleId] = useState<number | ''>('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [coordinatorId, setCoordinatorId] = useState<number | ''>('');
    const [coordinators, setCoordinators] = useState<CoordinatorListItem[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedRole = roles.find((r) => r.id === roleId);
    const showCoordinatorSelect = !isCoordinator && (selectedRole?.name.toLowerCase().includes('oper') ?? false);

    useEffect(() => {
        getRoles().then(setRoles).catch(() => setRoles([]));
        if (!isCoordinator) {
            getCoordinators().then(setCoordinators).catch(() => setCoordinators([]));
        }
    }, [isCoordinator]);

    // Si el usuario logeado es coordinador, auto-seleccionar el rol Operador
    useEffect(() => {
        if (isCoordinator && roles.length > 0) {
            const operatorRole = roles.find((r) => r.name.toLowerCase().includes('oper'));
            if (operatorRole) setRoleId(operatorRole.id);
        }
    }, [isCoordinator, roles]);

    // Reset coordinator when role changes (solo aplica para admin)
    useEffect(() => {
        if (!isCoordinator) setCoordinatorId('');
    }, [roleId, isCoordinator]);

    const handleCopyPassword = async () => {
        await navigator.clipboard.writeText(TEMP_PASSWORD);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            const effectiveCoordinatorId = isCoordinator
                ? loggedUser!.id
                : (showCoordinatorSelect && coordinatorId ? Number(coordinatorId) : undefined);

            await createUser({
                fullName,
                email,
                phone,
                roleId: Number(roleId),
                coordinatorId: effectiveCoordinatorId,
                password: TEMP_PASSWORD,
            });
            toast.success('Usuario creado exitosamente.');
            onSuccess();
            onClose();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                setError('Ya existe un usuario con ese correo electrónico.');
            } else {
                setError('Error al crear el usuario. Intente de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                        <UserPlus size={20} weight="bold" className="text-primary" />
                        <h3 className="font-extrabold text-lg text-black">Nuevo Usuario</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">
                        <X size={22} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(var(--primary-rgb), 0.06)', border: '1px solid rgba(var(--primary-rgb), 0.25)', color: 'var(--primary-darker)' }}>
                            {error}
                        </div>
                    )}

                    {/* Nombre */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Nombre Completo <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Ej: Juan Carlos Pérez"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Correo Electrónico (Usuario) <span className="text-primary">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="usuario@ejemplo.com"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Teléfono Móvil <span className="text-primary">*</span>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            placeholder="Ej: 0981 123 456"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary"
                        />
                    </div>

                    {/* Rol — oculto para coordinador (siempre crea Operador) */}
                    {!isCoordinator && (
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Rol de Sistema <span className="text-primary">*</span>
                            </label>
                            <CustomSelect
                                value={roleId}
                                onChange={(v) => setRoleId(v === '' ? '' : Number(v))}
                                placeholder="— Seleccione un rol —"
                                options={roles.map((r) => ({ value: r.id, label: r.name }))}
                            />
                        </div>
                    )}

                    {/* Asignar a Coordinador — solo admin creando Operador */}
                    {showCoordinatorSelect && (
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Asignar a Coordinador <span className="text-primary">*</span>
                            </label>
                            <CustomSelect
                                value={coordinatorId}
                                onChange={(v) => setCoordinatorId(v === '' ? '' : Number(v))}
                                placeholder="— Seleccione un coordinador —"
                                options={coordinators.map((c) => ({ value: c.id, label: c.fullName }))}
                            />
                        </div>
                    )}

                    {/* Contraseña provisoria */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Contraseña Provisoria
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5">
                                <span className="flex-1 font-mono font-bold text-sm text-gray-700 tracking-wider">
                                    {showPassword ? TEMP_PASSWORD : '••••••••••'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="text-gray-400 hover:text-gray-700 ml-2"
                                >
                                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={handleCopyPassword}
                                className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-600"
                                title="Copiar contraseña"
                            >
                                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 font-medium mt-1.5">
                            El usuario deberá cambiarla al iniciar sesión por primera vez.
                        </p>
                    </div>

                    {/* Acciones */}
                    <div className="pt-2 flex justify-end gap-3 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-extrabold hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl text-sm font-extrabold btn-primary flex items-center gap-2"
                        >
                            <UserPlus size={16} weight="bold" />
                            {isSubmitting ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
