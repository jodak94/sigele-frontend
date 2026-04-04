import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import {
    MagnifyingGlass, X, Fingerprint, MapPin, Fire, CirclesFour,
    Warning, CaretDown, ArrowSquareOut, Spinner,
} from '@phosphor-icons/react';
import { searchOperadores } from '../api/usersApi';
import { getAuditoriaMapaOperador, getAuditoriaAlertas, getAuditoriaOperadorCaptaciones } from '../api/auditoriaApi';
import type { UserListItem } from '../types/user';
import type { AuditoriaPoint, AlertaItem, AlertaCaptacion } from '../types/auditoria';

type ViewMode = 'heat' | 'pins';

const DEFAULT_CENTER: [number, number] = [-25.2867, -57.647];
const DEFAULT_ZOOM = 13;
const HEAT_RADIUS = 45;

const ALERTA_LABELS: Record<string, { label: string; color: string }> = {
    captaciones_rapidas: { label: 'Captaciones rápidas',  color: 'bg-red-100 text-red-700'    },
    fuera_horario:       { label: 'Fuera de horario',     color: 'bg-orange-100 text-orange-700' },
    misma_coordenada:    { label: 'Misma coordenada',     color: 'bg-yellow-100 text-yellow-700' },
    ubicacion_denegada:  { label: 'Ubicación denegada',   color: 'bg-gray-100 text-gray-600'   },
};

function getAlertaMeta(tipo: string) {
    return ALERTA_LABELS[tipo] ?? { label: tipo, color: 'bg-yellow-100 text-yellow-700' };
}

function getPrimaryRgb(): string {
    return getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-rgb')
        .trim() || '107, 114, 128';
}

function drawHeat(map: L.Map, canvas: HTMLCanvasElement, points: AuditoriaPoint[]) {
    const size = map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, size.x, size.y);
    points.forEach((p) => {
        const sp = map.latLngToContainerPoint([p.lat, p.lng]);
        const grad = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, HEAT_RADIUS);
        grad.addColorStop(0,    'rgba(220, 20,  10,  0.55)');
        grad.addColorStop(0.25, 'rgba(255, 80,  0,   0.30)');
        grad.addColorStop(0.55, 'rgba(255, 200, 0,   0.10)');
        grad.addColorStop(1,    'rgba(255, 220, 0,   0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, HEAT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    });
}

function calcCentro(points: AuditoriaPoint[]): [number, number] {
    if (!points.length) return DEFAULT_CENTER;
    const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
    const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
    return [lat, lng];
}

function buildPopup(p: AuditoriaPoint): string {
    const fecha = new Date(p.creadoEn).toLocaleString('es-PY', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
    return `<div style="font-family:sans-serif;min-width:180px">
        <p style="font-weight:800;font-size:13px;margin:0 0 4px">${p.electorNombre} ${p.electorApellido}</p>
        <p style="color:#6b7280;font-size:11px;margin:0 0 2px">CI: ${p.electorCedula.toLocaleString('es-PY')}</p>
        ${p.descripcion ? `<p style="color:#6b7280;font-size:11px;margin:0 0 2px">📍 ${p.descripcion}</p>` : ''}
        <p style="color:#9ca3af;font-size:10px;margin:4px 0 0">${fecha}</p>
    </div>`;
}

export function AuditoriaPage() {
    // ── Autocomplete ──────────────────────────────────────────────────────────
    const wrapperRef = useRef<HTMLDivElement>(null);
    const mapSectionRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<UserListItem[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selected, setSelected] = useState<UserListItem | null>(null);

    // ── Map state ─────────────────────────────────────────────────────────────
    const [points, setPoints] = useState<AuditoriaPoint[]>([]);
    const [isLoadingMap, setIsLoadingMap] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('heat');

    // ── Leaflet refs ──────────────────────────────────────────────────────────
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pinsLayerRef = useRef<L.MarkerClusterGroup | null>(null);

    // ── Alertas state ─────────────────────────────────────────────────────────
    const [alertas, setAlertas] = useState<AlertaItem[]>([]);
    const [isLoadingAlertas, setIsLoadingAlertas] = useState(true);
    const [alertasError, setAlertasError] = useState<string | null>(null);
    const [expandedKey, setExpandedKey] = useState<string | null>(null);
    const [captacionesCache, setCaptacionesCache] = useState<Record<string, AlertaCaptacion[]>>({});
    const [loadingCaptaciones, setLoadingCaptaciones] = useState<string | null>(null);

    // ── Load alertas on mount ─────────────────────────────────────────────────
    useEffect(() => {
        getAuditoriaAlertas()
            .then(setAlertas)
            .catch(() => setAlertasError('Error al cargar las alertas.'))
            .finally(() => setIsLoadingAlertas(false));
    }, []);

    // ── Close dropdown on outside click ───────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
                setShowDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Debounced operator search ─────────────────────────────────────────────
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
    };

    const handleClear = () => {
        setSelected(null);
        setQuery('');
        setSuggestions([]);
        setPoints([]);
        setMapError(null);
    };

    // ── "Ver en mapa" desde una alerta ────────────────────────────────────────
    const handleVerEnMapa = (op: AlertaItem['operador']) => {
        const asUserListItem: UserListItem = {
            id: op.operadorId,
            fullName: op.operadorNombre,
            email: op.operadorEmail,
            phone: '',
            role: '',
            lastLogin: null,
            createdAt: '',
        };
        handleSelect(asUserListItem);
        setTimeout(() => {
            mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    // ── Toggle accordion row ──────────────────────────────────────────────────
    const handleToggleDetalle = async (operadorId: number, tipoAlerta: string) => {
        const key = `${operadorId}_${tipoAlerta}`;
        if (expandedKey === key) {
            setExpandedKey(null);
            return;
        }
        setExpandedKey(key);
        if (captacionesCache[key]) return;
        setLoadingCaptaciones(key);
        try {
            const data = await getAuditoriaOperadorCaptaciones(operadorId, tipoAlerta);
            setCaptacionesCache((prev) => ({ ...prev, [key]: data }));
        } catch {
            setCaptacionesCache((prev) => ({ ...prev, [key]: [] }));
        } finally {
            setLoadingCaptaciones(null);
        }
    };

    // ── Fetch data on operator select ─────────────────────────────────────────
    useEffect(() => {
        if (!selected) return;
        setIsLoadingMap(true);
        setMapError(null);
        setPoints([]);
        getAuditoriaMapaOperador(selected.id)
            .then(setPoints)
            .catch(() => setMapError('Error al cargar los datos del mapa.'))
            .finally(() => setIsLoadingMap(false));
    }, [selected]);

    // ── Initialize Leaflet when points arrive ─────────────────────────────────
    useEffect(() => {
        if (!mapContainerRef.current || isLoadingMap) return;

        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
            canvasRef.current = null;
            pinsLayerRef.current = null;
        }

        if (!points.length) return;

        const map = L.map(mapContainerRef.current).setView(calcCentro(points), DEFAULT_ZOOM);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
        }).addTo(map);

        // ── Heat canvas ──
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:450;';
        map.getContainer().appendChild(canvas);
        canvasRef.current = canvas;

        const redraw = () => drawHeat(map, canvas, points);
        map.on('moveend zoomend resize', redraw);
        map.whenReady(redraw);

        // ── Pins layer ──
        const rgb = getPrimaryRgb();
        const pinsLayer = L.markerClusterGroup({ disableClusteringAtZoom: 19 });
        points.forEach((p) => {
            L.circleMarker([p.lat, p.lng], {
                radius: 6,
                fillColor: `rgb(${rgb})`,
                fillOpacity: 0.9,
                color: '#fff',
                weight: 1.5,
            })
                .bindPopup(buildPopup(p), { maxWidth: 220 })
                .addTo(pinsLayer);
        });
        pinsLayerRef.current = pinsLayer;

        mapRef.current = map;

        return () => {
            map.off('moveend zoomend resize', redraw);
            map.remove();
            mapRef.current = null;
        };
    }, [points, isLoadingMap]);

    // ── Sync viewMode with map layers ─────────────────────────────────────────
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        if (viewMode === 'heat') {
            if (canvasRef.current) canvasRef.current.style.display = '';
            if (pinsLayerRef.current) pinsLayerRef.current.remove();
            if (canvasRef.current) drawHeat(map, canvasRef.current, points);
        } else {
            if (canvasRef.current) canvasRef.current.style.display = 'none';
            if (pinsLayerRef.current && !map.hasLayer(pinsLayerRef.current)) {
                pinsLayerRef.current.addTo(map);
            }
        }
    }, [viewMode, points]);

    // After map initializes, apply the current viewMode
    useEffect(() => {
        if (mapRef.current && points.length) {
            const map = mapRef.current;
            if (viewMode === 'heat') {
                if (pinsLayerRef.current) pinsLayerRef.current.remove();
                if (canvasRef.current) canvasRef.current.style.display = '';
            } else {
                if (canvasRef.current) canvasRef.current.style.display = 'none';
                if (pinsLayerRef.current) pinsLayerRef.current.addTo(map);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [points]);

    const showMap = !!selected && !isLoadingMap && !mapError && points.length > 0;
    const isEmpty = !!selected && !isLoadingMap && !mapError && points.length === 0;

    return (
        <div className="fade-in space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-black flex items-center gap-2">
                    <Fingerprint size={26} weight="fill" className="text-primary" />
                    Auditoría
                </h1>
                <p className="text-gray-500 font-medium">
                    Visualización geográfica de captaciones y alertas de actividad por operador.
                </p>
            </div>

            {/* ── Alertas ────────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Warning size={18} weight="fill" className="text-red-500" />
                    <h2 className="font-extrabold text-gray-900">Alertas de actividad</h2>
                    {!isLoadingAlertas && alertas.length > 0 && (
                        <span className="ml-auto text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            {alertas.length}
                        </span>
                    )}
                </div>

                {isLoadingAlertas && (
                    <div className="px-6 py-8 flex items-center justify-center gap-2 text-gray-400 font-bold">
                        <Spinner size={16} className="animate-spin" />
                        Cargando alertas...
                    </div>
                )}

                {alertasError && (
                    <div className="px-6 py-8 text-center text-sm font-bold text-red-500">{alertasError}</div>
                )}

                {!isLoadingAlertas && !alertasError && alertas.length === 0 && (
                    <div className="px-6 py-10 flex flex-col items-center gap-2 text-gray-400">
                        <Warning size={32} weight="duotone" />
                        <p className="font-bold text-sm">No hay alertas registradas.</p>
                    </div>
                )}

                {!isLoadingAlertas && alertas.length > 0 && (
                    <div className="divide-y divide-gray-100">
                        {alertas.map((alerta, idx) => {
                            const { operador } = alerta;
                            const meta = getAlertaMeta(alerta.tipoAlerta);
                            const key = `${operador.operadorId}_${alerta.tipoAlerta}`;
                            const isOpen = expandedKey === key;
                            const captaciones = captacionesCache[key];
                            const isLoadingThis = loadingCaptaciones === key;

                            return (
                                <div key={idx}>
                                    {/* Main row */}
                                    <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                        {/* Tipo badge */}
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${meta.color}`}>
                                            {meta.label}
                                        </span>

                                        {/* Descripción + operador */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 leading-snug">{alerta.descripcion}</p>
                                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                {operador.operadorNombre} &middot; {operador.operadorEmail}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => handleVerEnMapa(operador)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                                            >
                                                <ArrowSquareOut size={13} weight="bold" style={{ color: 'var(--primary)' }} />
                                                Ver en mapa
                                            </button>
                                            <button
                                                onClick={() => handleToggleDetalle(operador.operadorId, alerta.tipoAlerta)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                                    isOpen
                                                        ? 'border-primary bg-gray-50 text-gray-900'
                                                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                                }`}
                                                style={isOpen ? { borderColor: 'var(--primary)' } : undefined}
                                            >
                                                <CaretDown
                                                    size={13}
                                                    weight="bold"
                                                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                />
                                                Ver detalles
                                            </button>
                                        </div>
                                    </div>

                                    {/* Accordion: captaciones sub-table */}
                                    {isOpen && (
                                        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4">
                                            {isLoadingThis && (
                                                <div className="flex items-center gap-2 text-gray-400 text-sm font-bold py-4 justify-center">
                                                    <Spinner size={14} className="animate-spin" />
                                                    Cargando captaciones...
                                                </div>
                                            )}
                                            {!isLoadingThis && captaciones && captaciones.length === 0 && (
                                                <p className="text-sm text-gray-400 font-bold text-center py-4">
                                                    Sin captaciones registradas.
                                                </p>
                                            )}
                                            {!isLoadingThis && captaciones && captaciones.length > 0 && (
                                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-gray-100 text-left">
                                                                <th className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wider">Elector</th>
                                                                <th className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wider">Cédula</th>
                                                                <th className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wider">Fecha y hora</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 bg-white">
                                                            {captaciones.map((c, ci) => {
                                                                const fecha = new Date(c.createdAt).toLocaleString('es-PY', {
                                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                                    hour: '2-digit', minute: '2-digit',
                                                                });
                                                                return (
                                                                    <tr key={ci} className="hover:bg-gray-50">
                                                                        <td className="px-4 py-2.5 font-semibold text-gray-900">
                                                                            {c.electorNombre} {c.electorApellido}
                                                                        </td>
                                                                        <td className="px-4 py-2.5 text-gray-500 font-medium">
                                                                            {c.cedulaElector.toLocaleString('es-PY')}
                                                                        </td>
                                                                        <td className="px-4 py-2.5 text-gray-500 font-medium">
                                                                            {fecha}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Mapa ───────────────────────────────────────────────────────── */}
            <div ref={mapSectionRef}>
                {/* Controls card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                        {/* Autocomplete */}
                        <div className="relative flex-1 max-w-md" ref={wrapperRef}>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                                Operador
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
                                    className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold outline-none input-focus-primary"
                                />
                                <MagnifyingGlass
                                    size={16}
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${isSearching ? 'animate-pulse' : 'text-gray-400'}`}
                                    style={isSearching ? { color: 'var(--primary)' } : undefined}
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

                        {/* View mode toggle */}
                        {showMap && (
                            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0">
                                <button
                                    onClick={() => setViewMode('heat')}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                                        viewMode === 'heat'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Fire size={15} weight="fill" className={viewMode === 'heat' ? 'text-orange-500' : ''} />
                                    Calor
                                </button>
                                <button
                                    onClick={() => setViewMode('pins')}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                                        viewMode === 'pins'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <CirclesFour size={15} weight="fill" className={viewMode === 'pins' ? 'text-primary' : ''} />
                                    Captaciones
                                </button>
                            </div>
                        )}
                    </div>

                    {showMap && (
                        <div className="mt-4 flex items-center gap-2 text-sm font-bold text-gray-600">
                            <MapPin size={14} weight="fill" className="text-primary" />
                            {points.length} captacion{points.length !== 1 ? 'es' : ''} con ubicación registrada
                        </div>
                    )}
                </div>

                {/* Map container */}
                {selected && (
                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        {isLoadingMap && (
                            <div className="h-[540px] flex items-center justify-center text-gray-400 font-bold">
                                Cargando mapa...
                            </div>
                        )}
                        {mapError && (
                            <div className="h-[540px] flex items-center justify-center text-sm font-bold" style={{ color: 'var(--primary)' }}>
                                {mapError}
                            </div>
                        )}
                        {isEmpty && (
                            <div className="h-[540px] flex flex-col items-center justify-center gap-2 text-gray-400">
                                <MapPin size={36} weight="duotone" />
                                <p className="font-bold">Este operador no tiene captaciones con ubicación registrada.</p>
                            </div>
                        )}
                        <div
                            ref={mapContainerRef}
                            className={showMap ? '' : 'hidden'}
                            style={{ height: '540px', position: 'relative' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
