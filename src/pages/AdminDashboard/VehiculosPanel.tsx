import { useEffect, useRef, useState } from 'react';
import { Truck, Plus, PencilSimple, Trash, X, MagnifyingGlass, CaretLeft, CaretRight, CheckCircle, XCircle, Clock } from '@phosphor-icons/react';
import { getVehiculos, createVehiculo, updateVehiculo, deleteVehiculo, getVehiculoRequests, aprobarVehiculoRequest, rechazarVehiculoRequest } from '../../api/vehiculosApi';
import { searchOperadores } from '../../api/usersApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { useAuthStore } from '../../store/authStore';
import type { Vehiculo, CreateVehiculoRequest, VehiculoRequest } from '../../types/vehiculo';
import type { UserListItem, PaginatedResult } from '../../types/user';

const PAGE_SIZE = 10;

const EMPTY_FORM = {
    capacidad: '',
    nombreDueno: '',
    telefonoDueno: '',
    montoAlquiler: '',
    observacion: '',
};

type FormState = typeof EMPTY_FORM;
type Tab = 'vehiculos' | 'solicitudes';

// ─── Modal crear/editar vehículo ──────────────────────────────────────────────

interface VehiculoModalProps {
    vehiculo: Vehiculo | null;
    onClose: () => void;
    onSaved: () => void;
}

function VehiculoModal({ vehiculo, onClose, onSaved }: VehiculoModalProps) {
    const toast = useToast();
    const isEditing = vehiculo !== null;

    const [form, setForm] = useState<FormState>(() =>
        isEditing
            ? {
                capacidad: String(vehiculo.capacidad),
                nombreDueno: vehiculo.nombreDueno,
                telefonoDueno: vehiculo.telefonoDueno,
                montoAlquiler: String(vehiculo.montoAlquiler),
                observacion: vehiculo.observacion ?? '',
            }
            : EMPTY_FORM,
    );

    const [operadorQuery, setOperadorQuery] = useState(vehiculo?.operadorNombre ?? '');
    const [operadorId, setOperadorId] = useState<number | null>(vehiculo?.operadorId ?? null);
    const [suggestions, setSuggestions] = useState<UserListItem[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
                setShowDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (operadorId || !operadorQuery.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }
        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const result = await searchOperadores(operadorQuery.trim());
                setSuggestions(result.items);
                setShowDropdown(result.items.length > 0);
            } catch {
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 350);
        return () => clearTimeout(timer);
    }, [operadorQuery, operadorId]);

    const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSelectOperador = (op: UserListItem) => {
        setOperadorId(op.id);
        setOperadorQuery(op.fullName);
        setSuggestions([]);
        setShowDropdown(false);
    };

    const handleClearOperador = () => {
        setOperadorId(null);
        setOperadorQuery('');
        setSuggestions([]);
    };

    const buildPayload = (): CreateVehiculoRequest => ({
        capacidad: Number(form.capacidad),
        nombreDueno: form.nombreDueno.trim(),
        telefonoDueno: form.telefonoDueno.trim(),
        montoAlquiler: Number(form.montoAlquiler),
        operadorId: operadorId ?? undefined,
        observacion: form.observacion.trim() || undefined,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            if (isEditing) {
                await updateVehiculo(vehiculo.id, buildPayload());
                toast.success('Vehículo actualizado.');
            } else {
                await createVehiculo(buildPayload());
                toast.success('Vehículo registrado.');
            }
            onSaved();
            onClose();
        } catch {
            setError('Error al guardar. Verificá los datos e intentá de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                        <Truck size={20} weight="bold" className="text-primary" />
                        <h3 className="font-extrabold text-lg text-black">
                            {isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">
                        <X size={22} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(var(--primary-rgb), 0.06)', border: '1px solid rgba(var(--primary-rgb), 0.25)', color: 'var(--primary-darker)' }}>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Capacidad (personas) <span className="text-primary">*</span>
                            </label>
                            <input
                                type="number" min={1} value={form.capacidad} onChange={set('capacidad')} required
                                placeholder="Ej: 8"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Monto Alquiler (Gs.) <span className="text-primary">*</span>
                            </label>
                            <input
                                type="number" min={0} step="1000" value={form.montoAlquiler} onChange={set('montoAlquiler')} required
                                placeholder="Ej: 150000"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Nombre del Dueño <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text" value={form.nombreDueno} onChange={set('nombreDueno')} required
                            placeholder="Ej: Carlos Ramírez"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Teléfono del Dueño <span className="text-primary">*</span>
                        </label>
                        <input
                            type="tel" value={form.telefonoDueno} onChange={set('telefonoDueno')} required
                            placeholder="Ej: 0981 456 789"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary"
                        />
                    </div>

                    <div ref={wrapperRef} className="relative">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Operador Asignado <span className="text-gray-400 font-medium">(opcional)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text" value={operadorQuery}
                                onChange={(e) => { setOperadorQuery(e.target.value); if (operadorId) setOperadorId(null); }}
                                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                                placeholder="Buscar operador por nombre..."
                                className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold outline-none input-focus-primary"
                            />
                            <MagnifyingGlass
                                size={16}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isSearching ? 'animate-pulse' : 'text-gray-400'}`}
                                style={isSearching ? { color: 'var(--primary)' } : undefined}
                            />
                            {operadorQuery && (
                                <button type="button" onClick={handleClearOperador} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                                    <X size={14} weight="bold" />
                                </button>
                            )}
                        </div>
                        {showDropdown && suggestions.length > 0 && (
                            <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                {suggestions.map((op) => (
                                    <li key={op.id} onMouseDown={() => handleSelectOperador(op)} className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                                        <div className="font-bold text-sm text-black">{op.fullName}</div>
                                        <div className="text-xs text-gray-500 font-medium">{op.email}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Observación <span className="text-gray-400 font-medium">(opcional)</span>
                        </label>
                        <textarea
                            value={form.observacion} onChange={set('observacion')} rows={2}
                            placeholder="Ej: Camioneta blanca, placa ABC-123"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary resize-none"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3 border-t border-gray-200">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-extrabold hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-sm font-extrabold btn-primary flex items-center gap-2">
                            <Truck size={16} weight="bold" />
                            {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Modal resolución solicitud ───────────────────────────────────────────────

interface ResolveModalProps {
    solicitud: VehiculoRequest;
    accion: 'aprobar' | 'rechazar';
    onClose: () => void;
    onResolved: () => void;
}

function ResolveModal({ solicitud, accion, onClose, onResolved }: ResolveModalProps) {
    const toast = useToast();
    const [observacion, setObservacion] = useState('');
    const [monto, setMonto] = useState(solicitud.montoAlquiler != null ? String(solicitud.montoAlquiler) : '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isAprobar = accion === 'aprobar';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = {
                observacion: observacion.trim() || undefined,
                ...(isAprobar && { montoAlquiler: monto.trim() ? Number(monto) : undefined }),
            };
            if (isAprobar) {
                await aprobarVehiculoRequest(solicitud.id, data);
                toast.success('Solicitud aprobada. El vehículo fue registrado.');
            } else {
                await rechazarVehiculoRequest(solicitud.id, data);
                toast.success('Solicitud rechazada.');
            }
            onResolved();
            onClose();
        } catch {
            toast.error('Error al procesar la solicitud.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                        {isAprobar
                            ? <CheckCircle size={20} weight="fill" className="text-green-600" />
                            : <XCircle size={20} weight="fill" className="text-red-500" />}
                        <h3 className="font-extrabold text-lg text-black">
                            {isAprobar ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">
                        <X size={22} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
                        <p className="font-extrabold text-black">{solicitud.nombreDueno}</p>
                        <p className="text-gray-500 font-medium">{solicitud.telefonoDueno}</p>
                        <div className="flex gap-4 mt-2">
                            <span className="text-gray-600 font-bold">{solicitud.capacidad} pers.</span>
                            {solicitud.montoAlquiler != null && (
                                <span className="text-gray-500 font-medium line-through text-xs">Gs. {solicitud.montoAlquiler.toLocaleString('es-PY')} tentativo</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium pt-1">Solicitado por: {solicitud.operadorNombre}</p>
                    </div>

                    {isAprobar && (
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Monto de Alquiler (Gs.) <span className="text-primary">*</span>
                            </label>
                            <input
                                type="number"
                                min={0}
                                step="1000"
                                required
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                placeholder="Ej: 150000"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Observación <span className="text-gray-400 font-medium">(opcional)</span>
                        </label>
                        <textarea
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            rows={3}
                            placeholder={isAprobar ? 'Ej: Camioneta blanca, placa ABC-123' : 'Ej: Ya existe un vehículo similar'}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary resize-none"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3 border-t border-gray-200">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-extrabold hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-5 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2 text-white ${isAprobar ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {isAprobar ? <CheckCircle size={16} weight="bold" /> : <XCircle size={16} weight="bold" />}
                            {isSubmitting ? 'Procesando...' : isAprobar ? 'Aprobar' : 'Rechazar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Tab solicitudes ──────────────────────────────────────────────────────────

function SolicitudesTab() {
    const hasPermission = useAuthStore(s => s.hasPermission);
    const canResolve = hasPermission('vehiculo:create');

    const [data, setData] = useState<PaginatedResult<VehiculoRequest> | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [resolveTarget, setResolveTarget] = useState<{ solicitud: VehiculoRequest; accion: 'aprobar' | 'rechazar' } | null>(null);

    const load = (p = page) => {
        setIsLoading(true);
        getVehiculoRequests(p, PAGE_SIZE)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => { load(); }, [page]);

    const estadoBadge = (estado: VehiculoRequest['estado']) => {
        if (estado === 'Pendiente') return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                <Clock size={11} weight="fill" /> Pendiente
            </span>
        );
        if (estado === 'Aprobada') return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                <CheckCircle size={11} weight="fill" /> Aprobada
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                <XCircle size={11} weight="fill" /> Rechazada
            </span>
        );
    };

    const fmtGs = (n: number) => `Gs. ${n.toLocaleString('es-PY')}`;
    const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: '2-digit' });

    return (
        <>
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            {['Elector (Dueño)', 'Teléfono', 'Cap.', 'Monto Tentativo', 'Operador', 'Estado', 'Observación', ''].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {isLoading && (
                            <tr><td colSpan={8} className="px-5 py-16 text-center text-gray-400 font-bold animate-pulse">Cargando...</td></tr>
                        )}
                        {!isLoading && (!data || data.items.length === 0) && (
                            <tr><td colSpan={8} className="px-5 py-16 text-center text-gray-400 font-medium">No hay solicitudes.</td></tr>
                        )}
                        {!isLoading && data?.items.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-5 py-3 font-bold text-black">{s.nombreDueno}</td>
                                <td className="px-5 py-3 text-gray-700 font-medium">{s.telefonoDueno}</td>
                                <td className="px-5 py-3 text-center font-black">{s.capacidad}</td>
                                <td className="px-5 py-3 font-bold text-gray-800">
                                    {s.montoAlquiler != null ? fmtGs(s.montoAlquiler) : <span className="text-gray-300">—</span>}
                                </td>
                                <td className="px-5 py-3 text-gray-600 text-xs font-medium">{s.operadorNombre}</td>
                                <td className="px-5 py-3">{estadoBadge(s.estado)}</td>
                                <td className="px-5 py-3 text-gray-500 max-w-[160px] truncate text-xs">
                                    {s.observacion ?? <span className="text-gray-300">—</span>}
                                </td>
                                <td className="px-5 py-3">
                                    {s.estado === 'Pendiente' && canResolve && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setResolveTarget({ solicitud: s, accion: 'aprobar' })}
                                                className="p-1.5 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50"
                                                title="Aprobar"
                                            >
                                                <CheckCircle size={16} weight="bold" />
                                            </button>
                                            <button
                                                onClick={() => setResolveTarget({ solicitud: s, accion: 'rechazar' })}
                                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                title="Rechazar"
                                            >
                                                <XCircle size={16} weight="bold" />
                                            </button>
                                        </div>
                                    )}
                                    {s.estado !== 'Pendiente' && s.fechaResolucion && (
                                        <span className="text-xs text-gray-400 font-medium">{fmtFecha(s.fechaResolucion)}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {data && data.totalPages > 1 && (
                    <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm bg-white sticky bottom-0">
                        <span className="text-gray-500 font-medium">{data.totalCount} solicitud{data.totalCount !== 1 ? 'es' : ''} en total</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(p => p - 1)} disabled={!data.hasPreviousPage} className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                <CaretLeft size={14} weight="bold" />
                            </button>
                            <span className="font-bold text-gray-700">{page} / {data.totalPages}</span>
                            <button onClick={() => setPage(p => p + 1)} disabled={!data.hasNextPage} className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                <CaretRight size={14} weight="bold" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {resolveTarget && (
                <ResolveModal
                    solicitud={resolveTarget.solicitud}
                    accion={resolveTarget.accion}
                    onClose={() => setResolveTarget(null)}
                    onResolved={() => load()}
                />
            )}
        </>
    );
}

// ─── Panel principal ──────────────────────────────────────────────────────────

interface VehiculosPanelProps {
    onClose?: () => void;
}

export function VehiculosPanel({ onClose }: VehiculosPanelProps) {
    const toast = useToast();
    const hasPermission = useAuthStore(s => s.hasPermission);
    const canCreate = hasPermission('vehiculo:create');
    const canUpdate = hasPermission('vehiculo:update');
    const canDelete = hasPermission('vehiculo:delete');

    const [tab, setTab] = useState<Tab>('vehiculos');
    const [data, setData] = useState<PaginatedResult<Vehiculo> | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVehiculo, setModalVehiculo] = useState<Vehiculo | 'new' | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Vehiculo | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !modalVehiculo && !deleteTarget && onClose) onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, modalVehiculo, deleteTarget]);

    const load = (p = page) => {
        setIsLoading(true);
        getVehiculos(p, PAGE_SIZE)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => { if (tab === 'vehiculos') load(); }, [page, tab]);

    const handleSaved = () => load();

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteVehiculo(deleteTarget.id);
            toast.success('Vehículo eliminado.');
            setDeleteTarget(null);
            const newPage = data && data.items.length === 1 && page > 1 ? page - 1 : page;
            setPage(newPage);
            load(newPage);
        } catch {
            toast.error('Error al eliminar el vehículo.');
        } finally {
            setIsDeleting(false);
        }
    };

    const fmtGs = (n: number) => `Gs. ${n.toLocaleString('es-PY')}`;

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                {/* Topbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <Truck size={20} weight="bold" className="text-primary" />
                        <span className="font-extrabold text-gray-900 text-base">Vehículos de Campaña</span>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 ml-2 bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setTab('vehiculos')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors ${tab === 'vehiculos' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                Vehículos
                                {!isLoading && data && tab === 'vehiculos' && (
                                    <span className="ml-1.5 text-gray-400">{data.totalCount}</span>
                                )}
                            </button>
                            <button
                                onClick={() => setTab('solicitudes')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors ${tab === 'solicitudes' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                Solicitudes
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {tab === 'vehiculos' && canCreate && (
                            <button
                                onClick={() => setModalVehiculo('new')}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-extrabold btn-primary"
                            >
                                <Plus size={15} weight="bold" />
                                Agregar
                            </button>
                        )}
                    </div>
                </div>

                {/* Contenido */}
                {tab === 'vehiculos' ? (
                    <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    {['Dueño', 'Teléfono', 'Cap.', 'Monto Alquiler', 'Operador Asignado', 'Observación', ''].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {isLoading && (
                                    <tr><td colSpan={7} className="px-5 py-16 text-center text-gray-400 font-bold animate-pulse">Cargando...</td></tr>
                                )}
                                {!isLoading && (!data || data.items.length === 0) && (
                                    <tr><td colSpan={7} className="px-5 py-16 text-center text-gray-400 font-medium">No hay vehículos registrados.</td></tr>
                                )}
                                {!isLoading && data?.items.map(v => (
                                    <tr key={v.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 font-bold text-black">{v.nombreDueno}</td>
                                        <td className="px-5 py-3 text-gray-700 font-medium">{v.telefonoDueno}</td>
                                        <td className="px-5 py-3 text-center font-black">{v.capacidad}</td>
                                        <td className="px-5 py-3 font-bold text-gray-800">{fmtGs(v.montoAlquiler)}</td>
                                        <td className="px-5 py-3 text-gray-600">
                                            {v.operadorNombre ?? <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-5 py-3 text-gray-500 max-w-xs truncate">
                                            {v.observacion ?? <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                {canUpdate && (
                                                    <button onClick={() => setModalVehiculo(v)} className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-100" title="Editar">
                                                        <PencilSimple size={16} weight="bold" />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button onClick={() => setDeleteTarget(v)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50" title="Eliminar">
                                                        <Trash size={16} weight="bold" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {data && data.totalPages > 1 && (
                            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm bg-white sticky bottom-0">
                                <span className="text-gray-500 font-medium">{data.totalCount} vehículo{data.totalCount !== 1 ? 's' : ''} en total</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPage(p => p - 1)} disabled={!data.hasPreviousPage} className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                        <CaretLeft size={14} weight="bold" />
                                    </button>
                                    <span className="font-bold text-gray-700">{page} / {data.totalPages}</span>
                                    <button onClick={() => setPage(p => p + 1)} disabled={!data.hasNextPage} className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                        <CaretRight size={14} weight="bold" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <SolicitudesTab />
                )}
            </div>

            {modalVehiculo !== null && (
                <VehiculoModal
                    vehiculo={modalVehiculo === 'new' ? null : modalVehiculo}
                    onClose={() => setModalVehiculo(null)}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <ConfirmDialog
                    title="Eliminar Vehículo"
                    message={<>¿Eliminar el vehículo de <strong>{deleteTarget.nombreDueno}</strong>?<br />Esta acción no se puede deshacer.</>}
                    confirmLabel={isDeleting ? 'Eliminando...' : 'Eliminar'}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </>
    );
}
