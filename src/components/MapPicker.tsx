import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, X } from '@phosphor-icons/react';
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

    const [descripcion, setDescripcion] = useState(value?.descripcion ?? '');

    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
    useEffect(() => { descripcionRef.current = descripcion; }, [descripcion]);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current).setView(
            [DEFAULT_LAT, DEFAULT_LNG],
            DEFAULT_ZOOM
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

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

        // Ensure Leaflet calculates the correct container size after mount
        requestAnimationFrame(() => map.invalidateSize());

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []);

    const handleDescripcionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setDescripcion(text);
        if (value) {
            onChange({ ...value, descripcion: text });
        }
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
                    <MapPin size={14} weight="fill" className="text-red-600" />
                    Ubicación en Mapa (Opcional)
                </label>
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 font-bold transition-colors"
                    >
                        <X size={12} weight="bold" />
                        Limpiar
                    </button>
                )}
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
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none font-bold text-sm focus:ring-2 focus:ring-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
            />
        </div>
    );
}
