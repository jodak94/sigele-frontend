import { useEffect, useState, useRef } from 'react';
import { CheckSquare, MagnifyingGlass, ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock } from '@phosphor-icons/react';
import { getAsistenciaList, getAsistenciaResumen, marcarAsistencia } from '../../api/asistenciaApi';
import { useToast } from '../../components/Toast';
import type { AsistenciaElector, AsistenciaResumen } from '../../types/asistencia';

const PAGE_SIZE = 15;

export function AsistenciaPanel() {
    const toast = useToast();
    const [electores, setElectores] = useState<AsistenciaElector[]>([]);
    const [resumen, setResumen] = useState<AsistenciaResumen | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [marcandoKey, setMarcandoKey] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadResumen = () => {
        getAsistenciaResumen().then(setResumen).catch(() => setResumen(null));
    };

    const loadElectores = (p: number, term: string) => {
        setIsLoading(true);
        getAsistenciaList(p, PAGE_SIZE, term || undefined)
            .then((res) => {
                setElectores(res.items);
                setTotalPages(res.totalPages);
            })
            .catch(() => setElectores([]))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadElectores(page, search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        loadResumen();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            loadElectores(1, val);
        }, 400);
    };

    const handleToggle = async (elector: AsistenciaElector) => {
        const key = `${elector.userId}-${elector.cedula}`;
        const nuevoAsistio = !elector.asistio;
        setMarcandoKey(key);

        setElectores((prev) => prev.map((e) =>
            e.userId === elector.userId && e.cedula === elector.cedula
                ? { ...e, asistio: nuevoAsistio, asistioMarcadoEn: nuevoAsistio ? new Date().toISOString() : null }
                : e
        ));
        setResumen((prev) => prev ? {
            ...prev,
            totalAsistieron: prev.totalAsistieron + (nuevoAsistio ? 1 : -1),
            totalFaltantes: prev.totalFaltantes + (nuevoAsistio ? -1 : 1),
            porcentajeAsistencia: prev.totalElectores === 0 ? 0
                : Math.round(((prev.totalAsistieron + (nuevoAsistio ? 1 : -1)) * 1000 / prev.totalElectores)) / 10,
        } : prev);

        try {
            await marcarAsistencia(elector.userId, elector.cedula, nuevoAsistio);
        } catch {
            setElectores((prev) => prev.map((e) =>
                e.userId === elector.userId && e.cedula === elector.cedula
                    ? { ...e, asistio: elector.asistio, asistioMarcadoEn: elector.asistioMarcadoEn }
                    : e
            ));
            loadResumen();
            toast.error('No se pudo actualizar la asistencia. Intente de nuevo.');
        } finally {
            setMarcandoKey(null);
        }
    };

    const kpis = [
        { label: 'Total de Electores', value: resumen?.totalElectores ?? 0, valueClass: 'text-black' },
        { label: 'Asistieron a Votar', value: resumen?.totalAsistieron ?? 0, valueClass: 'text-primary' },
        { label: 'Faltan por Votar', value: resumen?.totalFaltantes ?? 0, valueClass: 'text-gray-500' },
        { label: '% de Asistencia', value: `${resumen?.porcentajeAsistencia ?? 0}%`, valueClass: 'text-black' },
    ];

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {kpis.map((card) => (
                    <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <p className="text-sm font-bold text-gray-500 uppercase">{card.label}</p>
                        <p className={`text-4xl font-extrabold ${card.valueClass}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <CheckSquare size={20} weight="bold" className="text-primary" />
                        <h2 className="text-lg font-extrabold text-black">Asistencia Día-D</h2>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <MagnifyingGlass size={15} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Buscar por cédula o nombre..."
                            className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-sm input-focus-primary"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Nombre</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Cédula</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Teléfono</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Local de Votación</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Operador Responsable</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Estado</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {isLoading && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500 font-bold">Cargando...</td>
                                </tr>
                            )}
                            {!isLoading && electores.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500 font-bold">No hay electores registrados.</td>
                                </tr>
                            )}
                            {!isLoading && electores.map((e) => {
                                const key = `${e.userId}-${e.cedula}`;
                                const isBusy = marcandoKey === key;
                                return (
                                    <tr key={key} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{e.nombreApellido}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{e.cedula}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{e.telefono}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{e.localVotacion ?? '—'}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{e.operadorResponsable ?? '—'}</td>
                                        <td className="px-6 py-4 text-center">
                                            {e.asistio ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700">
                                                    <CheckCircle size={12} weight="fill" /> Asistió
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-500">
                                                    <Clock size={12} weight="bold" /> Pendiente
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggle(e)}
                                                disabled={isBusy}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                                                    e.asistio
                                                        ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
                                                        : 'border-green-200 hover:bg-green-50 text-green-700'
                                                }`}
                                            >
                                                {e.asistio
                                                    ? <><XCircle size={14} weight="bold" /> Desmarcar</>
                                                    : <><CheckCircle size={14} weight="bold" /> Marcar asistencia</>}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
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
        </div>
    );
}
