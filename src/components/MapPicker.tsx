import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, X, Crosshair } from '@phosphor-icons/react';
import type { Ubicacion } from '../types/captacion';

// Fix default marker icons broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Paraguay center (Asunción)
const DEFAULT_LAT = -25.2867;
const DEFAULT_LNG = -57.647;
const DEFAULT_ZOOM = 13;

interface MapPickerProps {
    value: Ubicacion | null;
    onChange: (ubicacion: Ubicacion | null) => void;
}

export function MapPicker({ value, onChange }: MapPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const onChangeRef = useRef(onChange);
    const descripcionRef = useRef(value?.descripcion ?? '');
    const initialValueRef = useRef(value);

    const [descripcion, setDescripcion] = useState(value?.descripcion ?? '');
    const [locating, setLocating] = useState(false);

    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
    useEffect(() => { descripcionRef.current = descripcion; }, [descripcion]);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const container = mapContainerRef.current;
        let map: L.Map;

        // Delay init so the modal finishes its CSS transition before Leaflet
        // measures the container — prevents the _leaflet_pos error.
        const timer = setTimeout(() => {
            if (!container) return;

            const initial = initialValueRef.current;
            const center: [number, number] = initial
                ? [initial.lat, initial.lng]
                : [DEFAULT_LAT, DEFAULT_LNG];

            map = L.map(container).setView(center, DEFAULT_ZOOM);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            // Place existing marker if value was provided
            if (initial) {
                markerRef.current = L.marker([initial.lat, initial.lng]).addTo(map);
            }

            // Center on user location only when there is no existing value
            if (!initial && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        map.setView([pos.coords.latitude, pos.coords.longitude], DEFAULT_ZOOM);
                    },
                    () => { /* permission denied or unavailable, keep default */ }
                );
            }

            map.on('click', (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;
                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                } else {
                    markerRef.current = L.marker([lat, lng]).addTo(map);
                }
                onChangeRef.current({
                    lat: parseFloat(lat.toFixed(7)),
                    lng: parseFloat(lng.toFixed(7)),
                    descripcion: descripcionRef.current,
                });
            });

            mapRef.current = map;
            map.invalidateSize();
        }, 100);

        return () => {
            clearTimeout(timer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
            }
        };
    }, []);

    const handleDescripcionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setDescripcion(text);
        if (value) {
            onChange({ ...value, descripcion: text });
        }
    };

    const handleLocate = () => {
        if (!navigator.geolocation || !mapRef.current) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                mapRef.current!.setView([pos.coords.latitude, pos.coords.longitude], DEFAULT_ZOOM);
                setLocating(false);
            },
            () => setLocating(false)
        );
    };

    const handleClear = () => {
        if (markerRef.current && mapRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
        }
        setDescripcion('');
        onChange(null);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                    <MapPin size={14} weight="fill" className="text-primary" />
                    Ubicación en Mapa (Opcional)
                </label>
                <div className="flex items-center gap-2">
                    {navigator.geolocation && (
                        <button
                            type="button"
                            onClick={handleLocate}
                            disabled={locating}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary font-bold transition-colors disabled:opacity-40"
                            title="Ir a mi ubicación"
                        >
                            <Crosshair size={14} weight="bold" className={locating ? 'animate-spin' : ''} />
                        </button>
                    )}
                    {value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary font-bold transition-colors"
                        >
                            <X size={12} weight="bold" />
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            <div
                ref={mapContainerRef}
                className="w-full h-52 rounded-lg border border-gray-300 overflow-hidden cursor-crosshair"
            />

            {!value ? (
                <p className="text-xs text-gray-400 font-medium">
                    Tocá el mapa para marcar la ubicación
                </p>
            ) : (
                <p className="text-xs text-gray-500 font-medium">
                    Lat: {value.lat.toFixed(5)}, Lng: {value.lng.toFixed(5)}
                </p>
            )}

            <input
                type="text"
                value={descripcion}
                onChange={handleDescripcionChange}
                disabled={!value}
                placeholder="Referencia (ej: Mi casa, portón verde)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none font-bold text-sm input-focus-primary disabled:opacity-40 disabled:cursor-not-allowed"
            />
        </div>
    );
}
