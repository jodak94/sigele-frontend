import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, SpinnerGap } from '@phosphor-icons/react';
import { getElectoresUbicaciones } from '../../api/captacionApi';
import type { ElectorUbicacion } from '../../types/captacion';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DEFAULT_LAT = -25.2867;
const DEFAULT_LNG = -57.647;
const DEFAULT_ZOOM = 13;

interface MapaElectoresProps {
    onClose: () => void;
}

function calcularCentro(ubicaciones: ElectorUbicacion[]): [number, number] {
    if (ubicaciones.length === 0) return [DEFAULT_LAT, DEFAULT_LNG];
    const sumLat = ubicaciones.reduce((acc, u) => acc + u.lat, 0);
    const sumLng = ubicaciones.reduce((acc, u) => acc + u.lng, 0);
    return [sumLat / ubicaciones.length, sumLng / ubicaciones.length];
}

export function MapaElectores({ onClose }: MapaElectoresProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Close on Escape key
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    useEffect(() => {
        let cancelled = false;

        getElectoresUbicaciones()
            .then((ubicaciones) => {
                if (cancelled || !mapContainerRef.current) return;

                setTotal(ubicaciones.length);

                const centro = calcularCentro(ubicaciones);

                const map = L.map(mapContainerRef.current).setView(centro, DEFAULT_ZOOM);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    maxZoom: 19,
                }).addTo(map);

                ubicaciones.forEach((u) => {
                    const popup = `
                        <div style="font-family:sans-serif;min-width:160px">
                            <div style="font-weight:700;font-size:13px">${u.nombre} ${u.apellido}</div>
                            ${u.descripcion ? `<div style="font-size:12px;color:#555;margin-top:2px">${u.descripcion}</div>` : ''}
                            ${u.operadorNombre ? `<div style="font-size:11px;color:#888;margin-top:4px">Op: ${u.operadorNombre}</div>` : ''}
                        </div>
                    `;
                    L.marker([u.lat, u.lng]).addTo(map).bindPopup(popup);
                });

                mapRef.current = map;

                // Use setTimeout so the modal has fully painted before Leaflet
                // measures the container and computes zoom
                setTimeout(() => {
                    map.invalidateSize();

                    if (ubicaciones.length === 1) {
                        map.setView([ubicaciones[0].lat, ubicaciones[0].lng], 14);
                    } else {
                        const bounds = L.latLngBounds(ubicaciones.map((u) => [u.lat, u.lng]));
                        const padding = L.point(32, 32);
                        // getBoundsZoom gives the zoom needed to fit all pins in the container
                        const calculatedZoom = map.getBoundsZoom(bounds, false, padding);
                        map.setView(bounds.getCenter(), calculatedZoom);
                    }
                }, 100);
            })
            .catch(() => {
                if (!cancelled) setError('No se pudieron cargar las ubicaciones.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
            {/* Topbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <MapPin size={20} weight="fill" className="text-red-600" />
                    <span className="font-extrabold text-gray-900 text-base">Mapa de Electores</span>
                    {!isLoading && !error && (
                        <span className="ml-2 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {total} {total === 1 ? 'ubicación' : 'ubicaciones'}
                        </span>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                    title="Cerrar"
                >
                    <X size={20} weight="bold" />
                </button>
            </div>

            {/* Map area */}
            <div className="relative flex-1 min-h-0">
                <div ref={mapContainerRef} className="w-full h-full" />

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                            <SpinnerGap size={32} weight="bold" className="animate-spin text-red-600" />
                            <span className="text-sm font-bold">Cargando ubicaciones...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <div className="text-center text-gray-500">
                            <MapPin size={40} className="mx-auto mb-2 text-gray-300" />
                            <p className="font-bold text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {!isLoading && !error && total === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <div className="text-center text-gray-500">
                            <MapPin size={40} className="mx-auto mb-2 text-gray-300" />
                            <p className="font-bold text-sm">Ningún elector tiene ubicación registrada.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
