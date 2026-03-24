import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Printer } from '@phosphor-icons/react';
import { getOperatorInfo, getConsultasStats, getSeccionalStats } from '../api/adminApi';
import type { OperatorInfo, ConsultasStats, SeccionalStat } from '../types/admin';

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

const PLANILLA_ROWS = [
    { cedula: '1.234.567', nombre: 'ACEVEDO, JUAN CARLOS', telefono: '0981 111 222', local: 'ESCUELA MARGARITA V. DE BIBOLINI', mesa: 1, orden: 5 },
    { cedula: '2.345.678', nombre: 'GONZALEZ, MARIA',      telefono: '0982 333 444', local: 'ESCUELA MARGARITA V. DE BIBOLINI', mesa: 1, orden: 12 },
    { cedula: '3.456.789', nombre: 'LOPEZ, CARLOS',        telefono: '0971 555 666', local: 'ESCUELA N° 144 CMTE. HEBER LEO',   mesa: 3, orden: 45 },
];

function TabPlanilla() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-extrabold uppercase text-black tracking-tight">
                        Planilla de Electores Captados
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Operador Responsable: <strong className="text-black">Juan Pérez</strong>
                    </p>
                    <p className="text-gray-500 text-sm">Teléfono: <strong>0981 123 456</strong></p>
                </div>
                <div className="shrink-0 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase">Total en Lista</p>
                    <p className="text-3xl font-black text-red-600">45</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            {['N° Cédula', 'Nombre y Apellido', 'Teléfono', 'Local de Votación', 'Mesa', 'Orden', 'Firma / Asistencia'].map((h) => (
                                <th key={h} className="px-4 py-3 text-left font-bold text-gray-700 uppercase text-xs whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {PLANILLA_ROWS.map((r, i) => (
                            <tr key={r.cedula} className={i % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-4 py-3 font-bold">{r.cedula}</td>
                                <td className="px-4 py-3 font-bold">{r.nombre}</td>
                                <td className="px-4 py-3">{r.telefono}</td>
                                <td className="px-4 py-3">{r.local}</td>
                                <td className="px-4 py-3 text-center font-black">{r.mesa}</td>
                                <td className="px-4 py-3 text-center font-black">{r.orden}</td>
                                <td className="px-4 py-3 w-32"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Tab: diad ────────────────────────────────────────────────────────────────

const DIAD_GRUPOS = [
    {
        local: 'ESCUELA MARGARITA V. DE BIBOLINI',
        seccional: '354',
        rows: [
            { mesa: 1, orden: 5,  cedula: '1.234.567', nombre: 'ACEVEDO, JUAN CARLOS', telefono: '0981 111 222', direccion: 'Misma del padrón',              transporte: false, operador: 'Op. Central' },
            { mesa: 1, orden: 12, cedula: '2.345.678', nombre: 'GONZALEZ, MARIA',      telefono: '0982 333 444', direccion: 'Frente a la despensa San Juan', transporte: true,  operador: 'Op. Central' },
        ],
    },
    {
        local: 'ESC. GRADUADA N° 91',
        seccional: '172',
        rows: [
            { mesa: 2, orden: 8,  cedula: '4.567.890', nombre: 'MARTINEZ, ANA',        telefono: '0999 111 222', direccion: '—',                             transporte: false, operador: 'Op. Norte' },
        ],
    },
];

function TabDiaD() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b-4 border-black">
                <h2 className="text-2xl font-black text-black uppercase">Hoja de Ruta Logística (DÍA D)</h2>
                <p className="text-gray-600 mt-1 font-medium text-sm">
                    Electores agrupados por Local de Votación para la organización del transporte.
                </p>
            </div>
            <div className="p-6 space-y-8">
                {DIAD_GRUPOS.map((grupo) => (
                    <div key={grupo.local}>
                        <div className="bg-red-600 text-white px-4 py-2.5 font-black uppercase tracking-wider text-sm rounded-t-lg">
                            LOCAL: {grupo.local} (Seccional {grupo.seccional})
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
                                    {grupo.rows.map((r) => (
                                        <tr key={r.cedula} className={r.transporte ? 'bg-red-50' : 'bg-white'}>
                                            <td className="px-3 py-2 font-black text-base">{r.mesa}</td>
                                            <td className="px-3 py-2 font-black">{r.orden}</td>
                                            <td className="px-3 py-2">{r.cedula}</td>
                                            <td className={`px-3 py-2 font-bold ${r.transporte ? 'text-red-900' : ''}`}>{r.nombre}</td>
                                            <td className="px-3 py-2 font-bold">{r.telefono}</td>
                                            <td className={`px-3 py-2 ${r.transporte ? 'font-bold text-red-700' : 'text-gray-500'}`}>{r.direccion}</td>
                                            <td className={`px-3 py-2 text-center font-black ${r.transporte ? 'text-red-600' : 'text-gray-500'}`}>
                                                {r.transporte ? 'SÍ' : 'NO'}
                                            </td>
                                            <td className="px-3 py-2">{r.operador}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Tab: mesas ───────────────────────────────────────────────────────────────

const MESAS_GRUPOS = [
    {
        local: 'ESCUELA MARGARITA V. DE BIBOLINI',
        rows: [
            { nombre: 'ACEVEDO, JUAN CARLOS', cedula: '1.234.567', telefono: '0981 111 222', mesa: 1, operador: 'Operador Central' },
        ],
    },
    {
        local: 'ESC. GRADUADA N° 91 (GUARAMBARE)',
        rows: [
            { nombre: 'RAMIREZ, PEDRO', cedula: '5.678.901', telefono: '0982 777 888', mesa: 2, operador: 'Operador Norte' },
        ],
    },
];

function TabMesas() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b-4 border-gray-800">
                <h2 className="text-2xl font-black text-black uppercase">Plantel de Miembros de Mesa</h2>
                <p className="text-gray-600 mt-1 font-medium text-sm">
                    Electores marcados con disponibilidad para cubrir mesas, agrupados por local.
                </p>
            </div>
            <div className="p-6 space-y-8">
                {MESAS_GRUPOS.map((grupo) => (
                    <div key={grupo.local}>
                        <h3 className="font-extrabold text-base bg-gray-200 px-3 py-2 border-l-4 border-black mb-0 rounded-t-lg uppercase">
                            {grupo.local}
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
                                    {grupo.rows.map((r) => (
                                        <tr key={r.cedula}>
                                            <td className="px-4 py-3 font-black">{r.nombre}</td>
                                            <td className="px-4 py-3">{r.cedula}</td>
                                            <td className="px-4 py-3 font-bold">{r.telefono}</td>
                                            <td className="px-4 py-3 text-center font-bold">{r.mesa}</td>
                                            <td className="px-4 py-3">{r.operador}</td>
                                            <td className="px-4 py-3 border-l border-gray-300 w-48"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Tab: coordinador ─────────────────────────────────────────────────────────

function TabCoordinador() {
    const [operators, setOperators] = useState<OperatorInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getOperatorInfo()
            .then(setOperators)
            .finally(() => setIsLoading(false));
    }, []);

    const totals = operators.reduce(
        (acc, op) => ({
            electores: acc.electores + op.totalElectores,
            mesa: acc.mesa + op.miembrosMesa,
            transporte: acc.transporte + op.requierenTransporte,
        }),
        { electores: 0, mesa: 0, transporte: 0 }
    );

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-extrabold uppercase text-black tracking-tight">
                        Resumen de Operadores
                    </h2>
                    <p className="text-gray-500 text-sm font-medium mt-0.5">
                        Listado de operadores con métricas de captación.
                    </p>
                </div>
                {!isLoading && (
                    <span className="self-start sm:self-auto bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                        {operators.length} operadores
                    </span>
                )}
            </div>

            {/* Table */}
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
                        {isLoading ? (
                            // Skeleton rows
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    {Array.from({ length: 5 }).map((__, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : operators.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 font-medium">
                                    No hay operadores registrados.
                                </td>
                            </tr>
                        ) : (
                            operators.map((op, i) => (
                                <tr key={op.userId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-3 font-bold text-black">{op.fullName}</td>
                                    <td className="px-4 py-3 text-gray-600">{op.phone}</td>
                                    <td className="px-4 py-3 text-center font-bold text-black">{op.totalElectores.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center text-gray-700">{op.miembrosMesa.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center text-gray-700">{op.requierenTransporte.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {!isLoading && operators.length > 0 && (
                        <tfoot>
                            <tr className="bg-gray-200 font-black text-black">
                                <td colSpan={2} className="px-4 py-3 text-right uppercase text-sm">
                                    TOTALES:
                                </td>
                                <td className="px-4 py-3 text-center">{totals.electores.toLocaleString()}</td>
                                <td className="px-4 py-3 text-center">{totals.mesa.toLocaleString()}</td>
                                <td className="px-4 py-3 text-center">{totals.transporte.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}

// ─── Tab: stats ───────────────────────────────────────────────────────────────

function TabStats() {
    const [stats, setStats] = useState<ConsultasStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getConsultasStats()
            .then(setStats)
            .finally(() => setIsLoading(false));
    }, []);

    const kpis: { label: string; key: keyof ConsultasStats; accent: boolean }[] = [
        { label: 'Consultas Hoy', key: 'hoy', accent: true },
        { label: 'Consultas Ayer', key: 'ayer', accent: false },
        { label: 'Últimos 7 Días', key: 'ultimosSieteDias', accent: false },
        { label: 'Total Histórico', key: 'total', accent: false },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpis.map(({ label, key, accent }) => (
                    <div
                        key={key}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                    >
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
                        {isLoading ? (
                            <div className="h-10 bg-gray-200 rounded animate-pulse w-2/3" />
                        ) : (
                            <p className={`text-4xl font-extrabold ${accent ? 'text-red-600' : 'text-black'}`}>
                                {stats ? stats[key].toLocaleString() : '—'}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm text-gray-500 font-medium">
                Los datos reflejan el uso del buscador público{' '}
                <span className="font-bold text-gray-700">/padron</span> por parte de la ciudadanía.
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
