import { useState } from 'react';
import { MagnifyingGlass, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { searchElectorEnListas } from '../../api/adminApi';
import type { ElectorEnListaResult } from '../../types/admin';

export function VoterSearch() {
    const [cedula, setCedula] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<ElectorEnListaResult[] | null>(null);

    const handleSearch = async () => {
        if (!cedula.trim()) return;
        setIsSearching(true);
        try {
            const data = await searchElectorEnListas(cedula.trim());
            setResults(data);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const found = results !== null && results.length > 0;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-extrabold text-black mb-4 flex items-center">
                <MagnifyingGlass size={20} weight="bold" className="text-red-600 mr-2" />
                Buscar Elector en Listas
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                <input
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="N° de Cédula..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold focus:ring-2 focus:ring-red-600"
                />
                <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-900 disabled:opacity-60"
                >
                    {isSearching ? 'Buscando...' : 'Verificar'}
                </button>
            </div>

            {results !== null && (
                <div className="mt-4">
                    {found ? (
                        <div className="flex flex-col gap-3">
                            {results.map((r) => (
                                <div key={r.electorId} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                    {/* Fila 1: ícono + nombre + CI + etiquetas + operador */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <CheckCircle size={20} weight="fill" className="text-red-600 shrink-0" />
                                        <span className="font-extrabold text-black">
                                            {r.nombre} {r.apellido}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">CI: {r.numeroCed}</span>
                                        {r.disponibleMiembroMesa && (
                                            <span className="px-2 py-0.5 text-xs font-bold bg-black text-white rounded">
                                                Mesa
                                            </span>
                                        )}
                                        {r.requiereTransporte && (
                                            <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded">
                                                Transporte
                                            </span>
                                        )}
                                        <span className="text-sm text-gray-500 font-medium">
                                            Lista de:{' '}
                                            <span className="font-bold text-red-700">{r.operador.fullName}</span>
                                        </span>
                                    </div>
                                    {/* Fila 2: teléfono y dirección (si tiene) */}
                                    {(r.nroTelefono || r.direccionRecogida) && (
                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 pl-7">
                                            {r.nroTelefono && (
                                                <span className="text-sm text-gray-700 font-medium">
                                                    📞 {r.nroTelefono}
                                                </span>
                                            )}
                                            {r.direccionRecogida && (
                                                <span className="text-sm text-gray-700 font-medium">
                                                    📍 {r.direccionRecogida}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start">
                            <WarningCircle size={24} weight="fill" className="text-gray-400 mr-3 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-extrabold text-gray-800">Elector libre o no empadronado.</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Este número no está registrado actualmente en ninguna lista activa.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
