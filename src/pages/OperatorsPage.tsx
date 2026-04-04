import { useEffect, useState } from 'react';
import { Users, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { getOperators } from '../api/usersApi';
import type { UserListItem } from '../types/user';
import { useAuthStore } from '../store/authStore';

export function OperatorsPage() {
    const user = useAuthStore((state) => state.user);
    const [operators, setOperators] = useState<UserListItem[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pageSize = 10;

    const fetchOperators = async (currentPage: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getOperators(currentPage, pageSize);
            setOperators(result.items);
            setTotalPages(result.totalPages);
            setTotalCount(result.totalCount);
        } catch {
            setError('Error al cargar los operadores.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOperators(page);
    }, [page]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Nunca';
        return new Date(dateString).toLocaleDateString('es-PY', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <Users size={28} className="text-primary" weight="fill" />
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        {user?.role === 'Admin' ? 'Todos los Operadores' : 'Mis Operadores'}
                    </h1>
                </div>
                <p className="text-gray-500 font-medium ml-10">
                    {totalCount} operador{totalCount !== 1 ? 'es' : ''} encontrado{totalCount !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 rounded-2xl font-medium" style={{ background: 'rgba(var(--primary-rgb), 0.06)', border: '1px solid rgba(var(--primary-rgb), 0.25)', color: 'var(--primary-darker)' }}>
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Operador
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Contacto
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Último Acceso
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Registrado
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                                    Cargando...
                                </td>
                            </tr>
                        ) : operators.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                                    No se encontraron operadores.
                                </td>
                            </tr>
                        ) : (
                            operators.map((op) => (
                                <tr key={op.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-black">{op.fullName}</div>
                                        <div className="text-xs font-bold uppercase text-primary">{op.role}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-700">{op.phone}</div>
                                        <div className="text-xs text-gray-500 font-medium">{op.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600 font-medium">
                                            {formatDate(op.lastLogin)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600 font-medium">
                                            {formatDate(op.createdAt)}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500 font-medium">
                            Página {page} de {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <CaretLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === totalPages}
                                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <CaretRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}