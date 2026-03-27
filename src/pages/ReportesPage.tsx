import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Printer, MagnifyingGlass, X, FileText, FileXls, FilePdf } from '@phosphor-icons/react';
import { getConsultasStats, getSeccionalStats, getPadronPublicoStats, getTopLocales, getUltimasConsultas } from '../api/adminApi';
import { searchOperadores, getCoordinators } from '../api/usersApi';
import { CustomSelect } from '../components/CustomSelect';
import { getReporteElectores, exportarReporteElectores, getReporteResumenOperadores, exportarReporteResumenOperadores, getReporteDiaD, exportarReporteDiaD, getReporteCandidatosMesa, exportarReporteCandidatosMesa } from '../api/captacionApi';
import { useAuthStore } from '../store/authStore';
import type { ConsultasStats, SeccionalStat, PadronPublicoStats, TopLocalItem, UltimaConsultaItem } from '../types/admin';
import type { UserListItem, CoordinatorListItem } from '../types/user';
import type { ReporteElectorItem, ReporteOperadorItem, ReporteResumenOperadoresResponse, ReporteDiaDResponse, ReporteDiaDLocal, ReporteCandidatosMesaResponse, ReporteCandidatosMesaLocal } from '../types/captacion';

type TabId = 'planilla' | 'coordinador' | 'diad' | 'mesas' | 'stats' | 'zonas';

const TABS: { id: TabId; label: string }[] = [
    { id: 'planilla', label: 'Planilla Operador' },
    { id: 'coordinador', label: 'Lista Coordinador' },
    { id: 'diad', label: 'Reporte Día D' },
    { id: 'mesas', label: 'Miembros de Mesa' },
    { id: 'stats', label: 'Stats Padrón' },
    { id: 'zonas', label: 'Stats Zonas' },
];

// ─── Tab: planilla ────────────────────────────────────────────────────────────

function TabPlanilla() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<UserListItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selected, setSelected] = useState<UserListItem | null>(null);
    const [records, setRecords] = useState<ReporteElectorItem[]>([]);
    const [reportOperadorNombre, setReportOperadorNombre] = useState('');
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [exporting, setExporting] = useState<'xls' | 'pdf' | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer click afuera
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Debounce: buscar cuando cambia query y no hay selección
    useEffect(() => {
        if (selected || !query.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }
        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const result = await searchOperadores(query.trim());
                setSuggestions(result.items);
                setShowDropdown(result.items.length > 0);
            } catch {
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 350);
        return () => clearTimeout(timer);
    }, [query, selected]);

    const handleSelect = (op: UserListItem) => {
        setSelected(op);
        setQuery(op.fullName);
        setSuggestions([]);
        setShowDropdown(false);
        setReportReady(false);
        setRecords([]);
    };

    const handleClear = () => {
        setSelected(null);
        setQuery('');
        setSuggestions([]);
        setReportReady(false);
        setRecords([]);
        setReportOperadorNombre('');
    };

    const handleGenerar = async () => {
        if (!selected) return;
        setIsLoadingReport(true);
        setReportReady(false);
        try {
            const data = await getReporteElectores(selected.id);
            setRecords(data.electores ?? []);
            setReportOperadorNombre(data.operadorNombre);
            setReportReady(true);
        } finally {
            setIsLoadingReport(false);
        }
    };

    const handleExport = async (formato: 'xls' | 'pdf') => {
        if (!selected) return;
        setExporting(formato);
        try {
            await exportarReporteElectores(selected.id, formato, selected.fullName);
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Selector de operador */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <p className="text-gray-500 text-sm font-medium mb-5">
                    Seleccioná un operador para generar su planilla de electores.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                    {/* Autocomplete */}
                    <div className="relative flex-1 min-w-0" ref={wrapperRef}>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Operador <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (selected) setSelected(null);
                                }}
                                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                                placeholder="Buscar operador por nombre..."
                                className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                            />
                            <MagnifyingGlass
                                size={16}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isSearching ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
                            />
                            {query && (
                                <button
                                    onClick={handleClear}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                >
                                    <X size={14} weight="bold" />
                                </button>
                            )}
                        </div>

                        {/* Dropdown de sugerencias */}
                        {showDropdown && suggestions.length > 0 && (
                            <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                {suggestions.map((op) => (
                                    <li
                                        key={op.id}
                                        onMouseDown={() => handleSelect(op)}
                                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                    >
                                        <div className="font-bold text-sm text-black">{op.fullName}</div>
                                        <div className="text-xs text-gray-500 font-medium">{op.email}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Botón generar */}
                    <button
                        onClick={handleGenerar}
                        disabled={!selected || isLoadingReport}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                        <FileText size={16} weight="bold" />
                        {isLoadingReport ? 'Generando...' : 'Generar Reporte'}
                    </button>
                </div>
            </div>

            {/* Resultado del reporte */}
            {isLoadingReport && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center text-gray-500 font-bold animate-pulse">
                    Cargando electores...
                </div>
            )}

            {reportReady && selected && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-extrabold uppercase text-black tracking-tight">
                                Planilla de Electores Captados
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Operador Responsable: <strong className="text-black">{reportOperadorNombre}</strong>
                            </p>
                            <p className="text-gray-500 text-sm">Teléfono: <strong>{selected.phone}</strong></p>
                        </div>
                        <div className="flex items-start gap-3 shrink-0">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleExport('xls')}
                                    disabled={exporting !== null}
                                    className="flex items-center gap-1.5 text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold disabled:opacity-50"
                                >
                                    <FileXls size={15} weight="bold" className="text-green-600" />
                                    {exporting === 'xls' ? 'Exportando...' : 'Excel'}
                                </button>
                                <button
                                    onClick={() => handleExport('pdf')}
                                    disabled={exporting !== null}
                                    className="flex items-center gap-1.5 text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold disabled:opacity-50"
                                >
                                    <FilePdf size={15} weight="bold" className="text-red-600" />
                                    {exporting === 'pdf' ? 'Exportando...' : 'PDF'}
                                </button>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-center">
                                <p className="text-xs font-bold text-gray-500 uppercase">Total en Lista</p>
                                <p className="text-3xl font-black text-red-600">{records.length}</p>
                            </div>
                        </div>
                    </div>

                    {records.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 font-medium">
                            Este operador no tiene electores registrados.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {['N° Cédula', 'Nombre y Apellido', 'Local de Votación', 'Mesa', 'Orden', 'Firma / Asistencia'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left font-bold text-gray-700 uppercase text-xs whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {records.map((r, i) => (
                                        <tr key={`${r.nroDocumento}-${i}`} className={i % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="px-4 py-3 font-bold">{r.nroDocumento}</td>
                                            <td className="px-4 py-3 font-bold">{r.nombre} {r.apellido}</td>
                                            <td className="px-4 py-3 text-gray-700">{r.localVotacion}</td>
                                            <td className="px-4 py-3 text-center font-black">{r.mesa}</td>
                                            <td className="px-4 py-3 text-center font-black">{r.orden}</td>
                                            <td className="px-4 py-3 w-36 border-l border-gray-100"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Tab: diad ────────────────────────────────────────────────────────────────

function DiaDLocalTable({ local }: { local: ReporteDiaDLocal }) {
    return (
        <div>
            <div className="bg-red-600 text-white px-4 py-2.5 font-black uppercase tracking-wider text-sm rounded-t-lg">
                LOCAL: {local.localVotacion}
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-b-lg">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-100">
                        <tr>
                            {['Mesa', 'Ord.', 'Cédula', 'Nombre del Elector', 'Teléfono', 'Dirección Recogida', 'Transporte', 'Operador Resp.'].map((h) => (
                                <th key={h} className="px-3 py-2 text-left font-bold uppercase text-gray-700 whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {local.electores.map((r, i) => (
                            <tr key={`${r.nroCedula}-${i}`} className={r.requiereTransporte ? 'bg-red-50' : 'bg-white'}>
                                <td className="px-3 py-2 font-black text-base">{r.mesa}</td>
                                <td className="px-3 py-2 font-black">{r.orden}</td>
                                <td className="px-3 py-2">{r.nroCedula}</td>
                                <td className={`px-3 py-2 font-bold ${r.requiereTransporte ? 'text-red-900' : ''}`}>{r.nombreApellido}</td>
                                <td className="px-3 py-2 font-bold">{r.telefono}</td>
                                <td className={`px-3 py-2 ${r.requiereTransporte ? 'font-bold text-red-700' : 'text-gray-500'}`}>{r.direccionRecogida ?? '—'}</td>
                                <td className={`px-3 py-2 text-center font-black ${r.requiereTransporte ? 'text-red-600' : 'text-gray-500'}`}>
                                    {r.requiereTransporte ? 'SÍ' : 'NO'}
                                </td>
                                <td className="px-3 py-2">{r.operadorResponsable}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function TabDiaD() {
    const [reportData, setReportData] = useState<ReporteDiaDResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [exporting, setExporting] = useState<'xls' | 'pdf' | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getReporteDiaD()
            .then((data) => { setReportData(data); setReportReady(true); })
            .catch(() => setReportData(null))
            .finally(() => setIsLoading(false));
    }, []);

    const handleExport = async (fmt: 'xls' | 'pdf') => {
        setExporting(fmt);
        try {
            await exportarReporteDiaD(fmt);
        } finally {
            setExporting(null);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center text-gray-500 font-bold animate-pulse">
                Cargando reporte...
            </div>
        );
    }

    if (!reportReady || !reportData) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b-4 border-black flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-black text-black uppercase">Hoja de Ruta Logística (DÍA D)</h2>
                    <p className="text-gray-600 mt-1 font-medium text-sm">
                        Electores agrupados por Local de Votación para la organización del transporte.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => handleExport('xls')}
                        disabled={exporting !== null}
                        className="flex items-center gap-1.5 text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold disabled:opacity-50"
                    >
                        <FileXls size={15} weight="bold" className="text-green-600" />
                        {exporting === 'xls' ? 'Exportando...' : 'Excel'}
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        disabled={exporting !== null}
                        className="flex items-center gap-1.5 text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold disabled:opacity-50"
                    >
                        <FilePdf size={15} weight="bold" className="text-red-600" />
                        {exporting === 'pdf' ? 'Exportando...' : 'PDF'}
                    </button>
                    <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                        {reportData.locales.reduce((sum, l) => sum + l.electores.length, 0)} electores
                    </span>
                </div>
            </div>
            <div className="p-6 space-y-8">
                {reportData.locales.map((local, i) => (
                    <DiaDLocalTable key={`${local.localVotacion}-${i}`} local={local} />
                ))}
            </div>
        </div>
    );
}

// ─── Tab: mesas ───────────────────────────────────────────────────────────────

function MesasLocalTable({ local }: { local: ReporteCandidatosMesaLocal }) {
    return (
        <div>
            <h3 className="font-extrabold text-base bg-gray-200 px-3 py-2 border-l-4 border-black mb-0 rounded-t-lg uppercase">
                {local.localVotacion}
            </h3>
            <div className="overflow-x-auto border border-gray-200 rounded-b-lg">
                <table className="min-w-full divide-y divide-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            {['Nombre del Candidato a Mesa', 'Cédula', 'Teléfono', 'Vota en Mesa N°', 'Operador Responsable', 'Mesa Asignada / Obs.'].map((h) => (
                                <th key={h} className="px-4 py-2 text-left font-bold uppercase text-gray-700 text-xs whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {local.candidatos.map((r, i) => (
                            <tr key={`${r.nroCedula}-${i}`}>
                                <td className="px-4 py-3 font-black">{r.nombreApellido}</td>
                                <td className="px-4 py-3">{r.nroCedula}</td>
                                <td className="px-4 py-3 font-bold">{r.telefono}</td>
                                <td className="px-4 py-3 text-center font-bold">{r.mesa}</td>
                                <td className="px-4 py-3">{r.operadorResponsable}</td>
                                <td className="px-4 py-3 border-l border-gray-300 w-48"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function TabMesas() {
    const [reportData, setReportData] = useState<ReporteCandidatosMesaResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [exporting, setExporting] = useState<'xls' | 'pdf' | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getReporteCandidatosMesa()
            .then((data) => { setReportData(data); setReportReady(true); })
            .catch(() => setReportData(null))
            .finally(() => setIsLoading(false));
    }, []);

    const handleExport = async (fmt: 'xls' | 'pdf') => {
        setExporting(fmt);
        try {
            await exportarReporteCandidatosMesa(fmt);
        } finally {
            setExporting(null);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center text-gray-500 font-bold animate-pulse">
                Cargando reporte...
            </div>
        );
    }

    if (!reportReady || !reportData) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b-4 border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-black text-black uppercase">Plantel de Miembros de Mesa</h2>
                    <p className="text-gray-600 mt-1 font-medium text-sm">
                        Electores marcados con disponibilidad para cubrir mesas, agrupados por local.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => handleExport('xls')}
                        disabled={exporting !== null}
                        className="flex items-center gap-1.5 text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold disabled:opacity-50"
                    >
                        <FileXls size={15} weight="bold" className="text-green-600" />
                        {exporting === 'xls' ? 'Exportando...' : 'Excel'}
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        disabled={exporting !== null}
                        className="flex items-center gap-1.5 text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold disabled:opacity-50"
                    >
                        <FilePdf size={15} weight="bold" className="text-red-600" />
                        {exporting === 'pdf' ? 'Exportando...' : 'PDF'}
                    </button>
                    <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                        {reportData.locales.reduce((sum, l) => sum + l.candidatos.length, 0)} candidatos
                    </span>
                </div>
            </div>
            <div className="p-6 space-y-8">
                {reportData.locales.map((local, i) => (
                    <MesasLocalTable key={`${local.localVotacion}-${i}`} local={local} />
                ))}
            </div>
        </div>
    );
}

// ─── Tab: coordinador ─────────────────────────────────────────────────────────

function ReporteResumenTable({ data, onExport, exporting }: {
    data: ReporteResumenOperadoresResponse;
    onExport: (fmt: 'xls' | 'pdf') => void;
    exporting: 'xls' | 'pdf' | null;
}) {
    const { operadores, totales, coordinador } = data;
    const coordinadorNombre = coordinador
        ? typeof coordinador === 'object' ? coordinador.nombre : coordinador
        : null;
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-extrabold uppercase text-black tracking-tight">
                        Resumen de Operadores
                    </h2>
                    {coordinadorNombre && (
                        <p className="text-gray-500 text-sm font-medium mt-0.5">
                            Coordinador: <strong className="text-black">{coordinadorNombre}</strong>
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => onExport('xls')}
                        disabled={exporting !== null}
                        className="flex items-center gap-1.5 text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold disabled:opacity-50"
                    >
                        <FileXls size={15} weight="bold" className="text-green-600" />
                        {exporting === 'xls' ? 'Exportando...' : 'Excel'}
                    </button>
                    <button
                        onClick={() => onExport('pdf')}
                        disabled={exporting !== null}
                        className="flex items-center gap-1.5 text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 font-bold disabled:opacity-50"
                    >
                        <FilePdf size={15} weight="bold" className="text-red-600" />
                        {exporting === 'pdf' ? 'Exportando...' : 'PDF'}
                    </button>
                    <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                        {operadores.length} operadores
                    </span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border-b border-gray-200 text-sm">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="px-4 py-3 font-bold uppercase text-left">Operador</th>
                            <th className="px-4 py-3 font-bold uppercase text-left">Teléfono</th>
                            <th className="px-4 py-3 font-bold uppercase text-center">Electores Captados</th>
                            <th className="px-4 py-3 font-bold uppercase text-center">Miembros de Mesa</th>
                            <th className="px-4 py-3 font-bold uppercase text-center">Req. Transporte</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {operadores.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 font-medium">
                                    No hay operadores registrados.
                                </td>
                            </tr>
                        ) : (
                            operadores.map((op: ReporteOperadorItem, i: number) => (
                                <tr key={`${op.nombreOperador}-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-3 font-bold text-black">{op.nombreOperador}</td>
                                    <td className="px-4 py-3 text-gray-600">{op.telefono}</td>
                                    <td className="px-4 py-3 text-center font-bold text-black">{op.electoresCaptados.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center text-gray-700">{op.miembrosMesaDisp.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center text-gray-700">{op.reqTransporte.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {operadores.length > 0 && (
                        <tfoot>
                            <tr className="bg-gray-200 font-black text-black">
                                <td colSpan={2} className="px-4 py-3 text-right uppercase text-sm">TOTALES:</td>
                                <td className="px-4 py-3 text-center">{totales.electoresCaptados.toLocaleString()}</td>
                                <td className="px-4 py-3 text-center">{totales.miembrosMesaDisp.toLocaleString()}</td>
                                <td className="px-4 py-3 text-center">{totales.reqTransporte.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}

function TabCoordinador() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = user?.role.toLowerCase() === 'admin';

    // Estado para admin: selector de coordinador
    const [coordinators, setCoordinators] = useState<CoordinatorListItem[]>([]);
    const [selectedCoordId, setSelectedCoordId] = useState<number | ''>('');
    const [isLoadingCoords, setIsLoadingCoords] = useState(false);

    // Estado compartido: reporte
    const [reportData, setReportData] = useState<ReporteResumenOperadoresResponse | null>(null);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [exporting, setExporting] = useState<'xls' | 'pdf' | null>(null);

    // Admin: cargar lista de coordinadores
    useEffect(() => {
        if (!isAdmin) return;
        setIsLoadingCoords(true);
        getCoordinators()
            .then(setCoordinators)
            .catch(() => setCoordinators([]))
            .finally(() => setIsLoadingCoords(false));
    }, [isAdmin]);

    // Coordinador: cargar reporte automáticamente
    useEffect(() => {
        if (isAdmin) return;
        setIsLoadingReport(true);
        getReporteResumenOperadores()
            .then((data) => { setReportData(data); setReportReady(true); })
            .catch(() => setReportData(null))
            .finally(() => setIsLoadingReport(false));
    }, [isAdmin]);

    const handleGenerar = async () => {
        if (!selectedCoordId) return;
        setIsLoadingReport(true);
        setReportReady(false);
        try {
            const data = await getReporteResumenOperadores(Number(selectedCoordId));
            setReportData(data);
            setReportReady(true);
        } finally {
            setIsLoadingReport(false);
        }
    };

    const handleExport = async (fmt: 'xls' | 'pdf') => {
        setExporting(fmt);
        const coordId = isAdmin ? Number(selectedCoordId) || undefined : undefined;
        const coord = reportData?.coordinador;
        const nombre = coord ? (typeof coord === 'object' ? coord.nombre : coord) : 'resumen';
        try {
            await exportarReporteResumenOperadores(fmt, coordId, nombre);
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Selector de coordinador — solo admin */}
            {isAdmin && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-extrabold text-black mb-1">Lista Coordinador</h2>
                    <p className="text-gray-500 text-sm font-medium mb-5">
                        Seleccioná un coordinador para generar el resumen de sus operadores.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-1 min-w-0">
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Coordinador <span className="text-red-600">*</span>
                            </label>
                            <CustomSelect
                                value={selectedCoordId}
                                onChange={(v) => {
                                    setSelectedCoordId(v === '' ? '' : Number(v));
                                    setReportReady(false);
                                    setReportData(null);
                                }}
                                disabled={isLoadingCoords}
                                placeholder="— Seleccione un coordinador —"
                                options={coordinators.map((c) => ({ value: c.id, label: c.fullName }))}
                            />
                        </div>
                        <button
                            onClick={handleGenerar}
                            disabled={!selectedCoordId || isLoadingReport}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                        >
                            <FileText size={16} weight="bold" />
                            {isLoadingReport ? 'Generando...' : 'Generar Reporte'}
                        </button>
                    </div>
                </div>
            )}

            {/* Loading */}
            {isLoadingReport && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center text-gray-500 font-bold animate-pulse">
                    Cargando reporte...
                </div>
            )}

            {/* Reporte */}
            {reportReady && reportData && (
                <ReporteResumenTable
                    data={reportData}
                    onExport={handleExport}
                    exporting={exporting}
                />
            )}
        </div>
    );
}

// ─── Tab: stats ───────────────────────────────────────────────────────────────

function formatHoraPico(utcHour: number): string {
    const startUtc = Date.UTC(2000, 0, 1, utcHour, 0, 0);
    const endUtc = Date.UTC(2000, 0, 1, (utcHour + 1) % 24, 0, 0);
    const fmt = (ts: number) =>
        new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${fmt(startUtc)} – ${fmt(endUtc)}`;
}

function TabStats() {
    const [padron, setPadron] = useState<PadronPublicoStats | null>(null);
    const [topLocales, setTopLocales] = useState<TopLocalItem[]>([]);
    const [ultimasConsultas, setUltimasConsultas] = useState<UltimaConsultaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([getPadronPublicoStats(), getTopLocales(5), getUltimasConsultas(5)])
            .then(([padronData, localesData, consultasData]) => {
                setPadron(padronData);
                setTopLocales(localesData);
                setUltimasConsultas(consultasData);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const kpis: { label: string; value: string | number | null; accent?: boolean }[] = padron
        ? [
            { label: 'Total Consultas', value: padron.totalConsultas.toLocaleString(), accent: true },
            { label: 'Últimos 7 Días', value: padron.ultimosSieteDias.toLocaleString() },
            { label: 'Cédulas Únicas', value: padron.cedulasUnicas.toLocaleString() },
            { label: 'Horario Pico', value: formatHoraPico(padron.horarioPico) },
        ]
        : [
            { label: 'Total Consultas', value: null, accent: true },
            { label: 'Últimos 7 Días', value: null },
            { label: 'Cédulas Únicas', value: null },
            { label: 'Horario Pico', value: null },
        ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpis.map(({ label, value, accent }) => (
                    <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
                        {isLoading ? (
                            <div className="h-10 bg-gray-200 rounded animate-pulse w-2/3" />
                        ) : (
                            <p className={`text-3xl font-extrabold ${accent ? 'text-red-600' : 'text-black'}`}>
                                {value ?? '—'}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            {/* Top locales */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-extrabold text-black uppercase tracking-tight">Top 5 Locales más Consultados</h3>
                </div>
                {isLoading ? (
                    <div className="p-5 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                ) : topLocales.length === 0 ? (
                    <p className="px-5 py-8 text-center text-gray-400 font-medium">Sin datos disponibles.</p>
                ) : (
                    <div className="p-5 space-y-3">
                        {(() => {
                            const maxBusquedas = topLocales[0]?.totalBusquedas || 1;
                            return topLocales.map((item, i) => (
                                <div key={item.localVotacion}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-gray-800 truncate pr-4">
                                            <span className="text-gray-400 font-extrabold mr-2">#{i + 1}</span>
                                            {item.localVotacion}
                                        </span>
                                        <span className="text-sm font-extrabold text-black shrink-0">
                                            {item.totalBusquedas.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-600 rounded-full"
                                            style={{ width: `${(item.totalBusquedas / maxBusquedas) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                )}
            </div>

            {/* Últimas consultas */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-extrabold text-black uppercase tracking-tight">Últimas 5 Consultas</h3>
                </div>
                {isLoading ? (
                    <div className="p-5 space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                ) : ultimasConsultas.length === 0 ? (
                    <p className="px-5 py-8 text-center text-gray-400 font-medium">Sin datos disponibles.</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Fecha y Hora', 'Cédula', 'Resultado'].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {ultimasConsultas.map((c, i) => {
                                const fecha = new Date(c.fechaHora);
                                return (
                                    <tr key={i} className="bg-white">
                                        <td className="px-5 py-3 text-gray-600 font-medium whitespace-nowrap">
                                            {fecha.toLocaleDateString()} {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-5 py-3 font-extrabold text-black">{c.cedula}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${c.encontrado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                                                {c.encontrado ? 'Encontrado' : 'No encontrado'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm text-gray-500 font-medium">
                Los datos reflejan el uso del buscador público{' '}
                <span className="font-bold text-gray-700">/padron</span> por parte de la ciudadanía.
                {padron && (
                    <span className="ml-2 text-gray-400">
                        · Horario pico en zona horaria local (UTC{new Date().getTimezoneOffset() <= 0 ? '+' : ''}{-(new Date().getTimezoneOffset() / 60)})
                    </span>
                )}
            </div>
        </div>
    );
}

// ─── Tab: zonas ───────────────────────────────────────────────────────────────

function TabZonas() {
    const [seccionales, setSeccionales] = useState<SeccionalStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getSeccionalStats()
            .then(setSeccionales)
            .finally(() => setIsLoading(false));
    }, []);

    const sorted = [...seccionales].sort((a, b) => b.totalElectores - a.totalElectores);
    const max = sorted[0]?.totalElectores || 1;
    const total = seccionales.reduce((sum, s) => sum + s.totalElectores, 0);

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-extrabold uppercase text-black tracking-tight">
                    Captación por Seccionales
                </h2>
                <p className="text-gray-500 text-sm font-medium mt-0.5">
                    Distribución territorial de electores captados.
                </p>
            </div>

            <div className="px-6 py-5 space-y-4">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                            <div className="h-2 bg-gray-100 rounded animate-pulse w-full" />
                        </div>
                    ))
                ) : sorted.length === 0 ? (
                    <p className="text-gray-400 font-medium text-center py-8">
                        No hay datos disponibles.
                    </p>
                ) : (
                    sorted.map((s, i) => {
                        const pct = Math.round((s.totalElectores / max) * 100);
                        return (
                            <div key={s.codigoSeccional}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 text-right text-xs font-black text-gray-400">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-bold text-black">
                                            Seccional {s.codigoSeccional}
                                        </span>
                                    </div>
                                    <span className="text-sm font-extrabold text-black">
                                        {s.totalElectores.toLocaleString()}
                                    </span>
                                </div>
                                <div className="ml-9 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-600 rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {!isLoading && seccionales.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                        Total electores captados
                    </span>
                    <span className="text-xl font-extrabold text-black">
                        {total.toLocaleString()}
                    </span>
                </div>
            )}
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function ReportesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const rawTab = searchParams.get('tab') as TabId | null;
    const activeTab: TabId = TABS.some((t) => t.id === rawTab) ? rawTab! : 'planilla';

    const setTab = (id: TabId) => {
        setSearchParams({ tab: id });
    };

    return (
        <div className="fade-in space-y-6">
            {/* Page header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-black">Reportes y Planillas</h1>
                    <p className="text-gray-500 font-medium">
                        Documentación y estadísticas para impresión y análisis.
                    </p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 font-bold text-sm shadow-sm whitespace-nowrap"
                >
                    <Printer size={16} weight="bold" />
                    Imprimir / PDF
                </button>
            </div>

            {/* Tab selector */}
            <div className="overflow-x-auto -mx-1 px-1">
                <div className="flex gap-2 w-max">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        let activeClasses = 'bg-black text-white';
                        if (isActive && tab.id === 'diad') activeClasses = 'bg-red-600 text-white';
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setTab(tab.id)}
                                className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
                                    isActive
                                        ? activeClasses
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Report content */}
            {activeTab === 'planilla' && <TabPlanilla />}

            {activeTab === 'coordinador' && <TabCoordinador />}

            {activeTab === 'diad' && <TabDiaD />}

            {activeTab === 'mesas' && <TabMesas />}

            {activeTab === 'stats' && <TabStats />}

            {activeTab === 'zonas' && <TabZonas />}
        </div>
    );
}
