import { useState, useEffect, useRef } from 'react';
import { UserPlus, CheckCircle, WarningCircle, MagnifyingGlass, Lock } from '@phosphor-icons/react';
import { createCaptacion } from '../../api/captacionApi';
import { getElectorAuth } from '../../api/padronApi';
import type { ElectorResult } from '../../types/padron';
import type { Ubicacion } from '../../types/captacion';
import { MapPicker } from '../../components/MapPicker';
import { useAuthStore } from '../../store/authStore';
import { usePlanStore } from '../../store/planStore';
import axios from 'axios';

interface CaptureFormProps {
    onSuccess: () => void;
}

interface Message {
    type: 'success' | 'error';
    text: string;
}

export function CaptureForm({ onSuccess }: CaptureFormProps) {
    const cedulaRef = useRef<HTMLInputElement>(null);
    const [cedula, setCedula] = useState('');
    const [elector, setElector] = useState<ElectorResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [telefono, setTelefono] = useState('');
    const [direccionRecogida, setDireccionRecogida] = useState('');
    const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
    const [operadorUbicacion, setOperadorUbicacion] = useState<Ubicacion | null>(null);
    const [disponibleMiembroMesa, setDisponibleMiembroMesa] = useState(false);
    const [requiereTransporte, setRequiereTransporte] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);

    const soportaUbicacion = useAuthStore((s) => s.tenantConfig?.soportaUbicacion ?? false);
    const plan = usePlanStore((s) => s.plan);
    const refreshPlan = usePlanStore((s) => s.refreshPlan);
    const captacionBloqueada = plan?.captacionBloqueada ?? false;

    // Obtener ubicación del operador silenciosamente al montar
    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => setOperadorUbicacion({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                descripcion: '',
            }),
            () => setOperadorUbicacion(null),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
        );
    }, []);

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => setMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [message]);

    const resetForm = () => {
        setCedula('');
        setElector(null);
        setSearchError(null);
        setTelefono('');
        setDireccionRecogida('');
        setUbicacion(null);
        setDisponibleMiembroMesa(false);
        setRequiereTransporte(false);
    };

    const handleSearch = async () => {
        const q = cedula.trim();
        if (!q) return;
        setIsSearching(true);
        setSearchError(null);
        setElector(null);
        try {
            const results = await getElectorAuth(q);
            if (results.length === 0) {
                setSearchError('Cédula no encontrada en el padrón.');
            } else {
                setElector(results[0]);
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setSearchError('Cédula no encontrada en el padrón.');
            } else {
                setSearchError('Error al consultar el padrón.');
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCedula(e.target.value);
        if (elector) {
            setElector(null);
            setSearchError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!elector) return;
        setIsSubmitting(true);
        try {
            await createCaptacion({
                electorId: elector.id,
                nroTelefono: telefono,
                direccionRecogida: direccionRecogida || undefined,
                disponibleMiembroMesa,
                requiereTransporte,
                ubicacion: ubicacion ?? undefined,
                operadorUbicacion,
            });
            onSuccess();
            resetForm();
            setMessage({ type: 'success', text: 'Elector guardado.' });
            setTimeout(() => cedulaRef.current?.focus(), 0);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                const owner = err.response.data?.operadorNombre;
                setMessage({ type: 'error', text: `Registrado por ${owner ?? 'otro operador'}.` });
            } else if (axios.isAxiosError(err) && err.response?.status === 404) {
                setMessage({ type: 'error', text: 'Cédula no está en el padrón.' });
            } else if (axios.isAxiosError(err) && err.response?.status === 400) {
                const serverMsg = err.response.data?.message ?? err.response.data?.detail;
                setMessage({ type: 'error', text: serverMsg ?? 'No se pudo registrar. Verificá el estado de tu plan.' });
                refreshPlan();
            } else {
                setMessage({ type: 'error', text: 'Error al registrar. Intente de nuevo.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const disabled = !elector || captacionBloqueada;

    return (
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
                <h2 className="text-lg font-extrabold text-black mb-5 flex items-center">
                    <UserPlus size={22} weight="bold" className="text-primary mr-2" />
                    Cargar Elector
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Buscador de cédula */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">
                            Cédula de Identidad
                        </label>
                        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl overflow-hidden focus-within-primary">
                            <input
                                ref={cedulaRef}
                                type="text"
                                value={cedula}
                                onChange={handleCedulaChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Ej: 1234567"
                                className="flex-1 px-4 py-3 bg-transparent outline-none font-bold"
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={isSearching || !cedula.trim()}
                                className="px-4 py-3 text-gray-400 hover:text-primary disabled:opacity-40 transition-colors"
                                title="Buscar en padrón"
                            >
                                <MagnifyingGlass size={20} weight="bold" className={isSearching ? 'animate-pulse' : ''} />
                            </button>
                        </div>

                        {/* Resultado de búsqueda */}
                        {elector && (
                            <div className="mt-2 px-3 py-2 bg-gray-900 text-white rounded-xl flex items-center gap-2">
                                <CheckCircle size={18} weight="fill" className="text-green-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-bold leading-tight truncate">{elector.nombre} {elector.apellido}</p>
                                    <p className="text-xs text-gray-400 font-medium">CI {elector.numeroCed.toLocaleString('es-PY')}</p>
                                </div>
                            </div>
                        )}
                        {searchError && (
                            <div className="mt-2 px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2" style={{ background: 'rgba(var(--primary-rgb), 0.06)', border: '1px solid rgba(var(--primary-rgb), 0.25)', color: 'var(--primary-darker)' }}>
                                <WarningCircle size={16} weight="fill" className="shrink-0" />
                                {searchError}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Opciones Logísticas
                        </p>
                        <label className={`flex items-center ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input
                                type="checkbox"
                                checked={disponibleMiembroMesa}
                                onChange={(e) => setDisponibleMiembroMesa(e.target.checked)}
                                disabled={disabled}
                                className="w-5 h-5 border-2 rounded text-black focus:ring-black"
                            />
                            <span className="ml-3 text-sm text-gray-800 font-bold">
                                Disponible Miembro de Mesa
                            </span>
                        </label>
                        <label className={`flex items-center ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input
                                type="checkbox"
                                checked={requiereTransporte}
                                onChange={(e) => setRequiereTransporte(e.target.checked)}
                                disabled={disabled}
                                className="w-5 h-5 border-2 rounded checkbox-primary"
                            />
                            <span className="ml-3 text-sm text-gray-800 font-bold">
                                Requiere transporte Día D
                            </span>
                        </label>
                    </div>

                    <div className="pt-3 border-t border-gray-200 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Teléfono de Contacto <span className="text-primary">*</span>
                            </label>
                            <input
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                required
                                disabled={disabled}
                                placeholder="Ej: 0981 123 456"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none font-bold text-sm input-focus-primary disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Dirección de Recogida (Opcional)
                            </label>
                            <input
                                type="text"
                                value={direccionRecogida}
                                onChange={(e) => setDireccionRecogida(e.target.value)}
                                disabled={disabled}
                                placeholder="Si es distinta a padrón..."
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none font-bold text-sm input-focus-primary disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                        </div>

                        {soportaUbicacion && !disabled && (
                            <MapPicker
                                value={ubicacion}
                                onChange={setUbicacion}
                            />
                        )}
                    </div>

                    {captacionBloqueada ? (
                        <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 font-bold text-sm cursor-not-allowed select-none">
                            <Lock size={16} weight="fill" />
                            Captación bloqueada
                        </div>
                    ) : (
                        <button
                            type="submit"
                            disabled={isSubmitting || disabled}
                            className="w-full font-bold py-3 px-4 rounded-xl shadow-sm btn-primary"
                        >
                            {isSubmitting ? 'Registrando...' : 'Registrar Captación'}
                        </button>
                    )}
                </form>

                <div
                    className={`mt-4 p-4 rounded-xl text-sm font-bold flex items-start transition-all ${message ? '' : 'hidden'}`}
                    style={message && message.type !== 'success' ? { background: 'rgba(var(--primary-rgb), 0.06)', border: '1px solid rgba(var(--primary-rgb), 0.25)', color: 'var(--primary-darker)' } : message ? { background: '#111827', color: 'white' } : undefined}
                >
                    {message?.type === 'success' ? (
                        <CheckCircle size={20} weight="fill" className="text-green-400 mr-2 shrink-0 mt-0.5" />
                    ) : (
                        <WarningCircle size={20} weight="fill" className="text-primary mr-2 shrink-0 mt-0.5" />
                    )}
                    {message?.text}
                </div>
            </div>
        </div>
    );
}
