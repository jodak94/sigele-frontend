import { useState } from 'react';
import { MagnifyingGlass, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { searchVoterByCedula } from '../../api/adminApi';
import type { VoterSearchResult } from '../../types/admin';

export function VoterSearch() {
    const [cedula, setCedula] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<VoterSearchResult | null>(null);

    const handleSearch = async () => {
        if (!cedula.trim()) return;
        setIsSearching(true);
        try {
            const data = await searchVoterByCedula(cedula.trim());
            setResult(data);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

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

            {result && (
                <div className="mt-4">
                    {result.found ? (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start">
                            <CheckCircle size={24} weight="fill" className="text-red-600 mr-3 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-extrabold text-black">¡Elector encontrado!</p>
                                <p className="text-sm font-medium text-gray-700 mt-1">
                                    El elector{' '}
                                    <span className="font-bold">
                                        {result.electorNombre} {result.electorApellido}
                                    </span>{' '}
                                    pertenece a la lista de:
                                </p>
                                <div className="mt-2 inline-block px-3 py-1.5 rounded-lg bg-red-100 text-red-800 font-bold text-sm">
                                    {result.operadorNombre}
                                </div>
                            </div>
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
