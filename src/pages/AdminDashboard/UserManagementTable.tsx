import { useEffect, useState, useRef } from 'react';
import { Users, ArrowLeft, ArrowRight, LockKey, MagnifyingGlass } from '@phosphor-icons/react';
import { getAllUsers, adminResetPassword } from '../../api/usersApi';
import { useToast } from '../../components/Toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import type { UserListItem } from '../../types/user';

const PAGE_SIZE = 10;
const TEMP_PASSWORD = 'SGELE-2026!';

export function UserManagementTable() {
    const toast = useToast();
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [resettingId, setResettingId] = useState<number | null>(null);
    const [confirmUser, setConfirmUser] = useState<UserListItem | null>(null);
    const [search, setSearch] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const load = (p: number, nombre: string) => {
        setIsLoading(true);
        getAllUsers(p, PAGE_SIZE, nombre || undefined)
            .then((res) => {
                setUsers(res.items);
                setTotalPages(res.totalPages);
            })
            .catch(() => setUsers([]))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => { load(page, search); }, [page]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            load(1, val);
        }, 400);
    };

    const handleConfirmReset = async () => {
        if (!confirmUser) return;
        const user = confirmUser;
        setConfirmUser(null);
        setResettingId(user.id);
        try {
            await adminResetPassword(user.id);
            toast.success(`Contraseña de ${user.fullName} restablecida a: ${TEMP_PASSWORD}`);
        } catch {
            toast.error('Error al restablecer la contraseña. Intente de nuevo.');
        } finally {
            setResettingId(null);
        }
    };

    return (
        <>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Users size={20} weight="bold" className="text-primary" />
                    <h2 className="text-lg font-extrabold text-black">Gestión de Usuarios</h2>
                </div>
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlass size={15} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Buscar por nombre..."
                        className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Nombre</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Rol</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {isLoading && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">Cargando...</td>
                            </tr>
                        )}
                        {!isLoading && users.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500 font-bold">No hay usuarios registrados.</td>
                            </tr>
                        )}
                        {!isLoading && users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{u.fullName}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700">
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => setConfirmUser(u)}
                                        disabled={resettingId === u.id}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        title="Restablecer contraseña"
                                    >
                                        <LockKey size={14} weight="bold" />
                                        {resettingId === u.id ? 'Restableciendo...' : 'Restablecer contraseña'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">
                        Página {page} de {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft size={14} weight="bold" />
                        </button>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ArrowRight size={14} weight="bold" />
                        </button>
                    </div>
                </div>
            )}
        </div>

        {confirmUser && (
            <ConfirmDialog
                title="¿Restablecer contraseña?"
                message={<>La contraseña de <strong>{confirmUser.fullName}</strong> será restablecida a: <strong>{TEMP_PASSWORD}</strong>.<br /><span className="text-xs text-gray-400">El usuario deberá cambiarla al iniciar sesión.</span></>}
                confirmLabel="Restablecer"
                cancelLabel="Cancelar"
                onConfirm={handleConfirmReset}
                onCancel={() => setConfirmUser(null)}
            />
        )}
        </>
    );
}
