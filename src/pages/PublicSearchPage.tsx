import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, CaretLeft, MapPin, FileText, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { getElector } from '../api/padronApi';
import type { ElectorResult } from '../types/padron';
import axios from 'axios';

type SearchState = 'idle' | 'loading' | 'found' | 'not_found' | 'error';

export function PublicSearchPage() {
    const navigate = useNavigate();
    const [cedula, setCedula] = useState('');
    const [state, setState] = useState<SearchState>('idle');
    const [results, setResults] = useState<ElectorResult[]>([]);

    const handleSearch = async () => {
        const q = cedula.trim();
        if (!q) return;
        setState('loading');
        setResults([]);
        try {
            const data = await getElector(q);
            if (data.length === 0) {
                setState('not_found');
            } else {
                setResults(data);
                setState('found');
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setState('not_found');
            } else {
                setState('error');
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-6xl">
                {/* Back button */}
                <button
                    onClick={() => navigate('/login')}
                    className="text-gray-500 hover:text-black mb-4 flex items-center font-bold px-2 transition-colors"
                >
                    <CaretLeft size={16} weight="bold" className="mr-1" />
                    Volver al Login
                </button>

                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse min-h-[750px] border border-gray-100">

                    {/* Sidebar Candidato — derecha en desktop */}
                    <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-10 text-white relative overflow-hidden">
                        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-500 rounded-full mix-blend-multiply blur-3xl opacity-40 pointer-events-none" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-red-900 rounded-full mix-blend-multiply blur-3xl opacity-60 pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
                            <div className="w-full aspect-[3/4] bg-white/10 backdrop-blur-md rounded-3xl p-2 shadow-2xl mb-8 border border-white/20">
                                <img
                                    src="/login.jpeg"
                                    alt="Naomy Ferrer"
                                    className="object-cover object-top w-full h-full rounded-2xl opacity-90 contrast-125"
                                />
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight mb-1 drop-shadow-md text-center uppercase">
                                Naomy Ferrer
                            </h2>
                            <p className="text-red-200 font-bold tracking-[0.3em] mb-6 drop-shadow text-center text-sm">
                                CONCEJAL
                            </p>
                            <div className="px-8 py-2.5 bg-white/10 backdrop-blur-md rounded-full font-extrabold text-sm tracking-widest border border-white/20 shadow-inner">
                                SAN LORENZO
                            </div>
                        </div>
                    </div>

                    {/* Buscador — izquierda */}
                    <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-gray-50/50">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-2xl mb-6 shadow-inner">
                                <MagnifyingGlass size={40} weight="bold" className="text-red-600" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Consulta de Padrón
                            </h1>
                            <p className="text-gray-500 mt-2 font-medium max-w-sm mx-auto">
                                Ingrese su número de Cédula de Identidad para verificar su lugar de votación exacto.
                            </p>
                        </div>

                        <div className="max-w-sm mx-auto w-full space-y-4">
                            <input
                                type="text"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ej: 1234567"
                                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none text-lg font-bold text-center"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={state === 'loading'}
                                className="w-full py-4 rounded-2xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {state === 'loading' ? 'Buscando...' : 'Buscar Elector'}
                            </button>
                        </div>

                        {/* Resultados */}
                        <div className="max-w-md mx-auto w-full mt-10 space-y-4">
                            {state === 'found' && results.length > 0 && (
                                <>
                                    {results.length > 1 && (
                                        <div className="fade-in flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm font-bold">
                                            <WarningCircle size={18} weight="fill" className="shrink-0 mt-0.5 text-yellow-500" />
                                            Se encontraron {results.length} registros para esta cédula. Verifique cuál corresponde.
                                        </div>
                                    )}
                                    {results.map((result, idx) => (
                                        <div key={idx} className="fade-in bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-red-600" />
                                            <div className="flex items-center mb-5">
                                                <CheckCircle size={26} weight="fill" className="text-red-600 mr-2 shrink-0" />
                                                <h3 className="text-xl font-extrabold text-black">
                                                    {result.nombre} {result.apellido}
                                                </h3>
                                                {results.length > 1 && (
                                                    <span className="ml-auto shrink-0 text-xs font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">
                                                        #{idx + 1}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-y-4">
                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start">
                                                    <MapPin size={22} weight="fill" className="text-red-500 mr-3 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                                                            Local de Votación
                                                        </p>
                                                        <p className="text-black font-extrabold">{result.local.nombreLoc}</p>
                                                        <p className="text-sm text-gray-600 font-medium">
                                                            {result.seccional.nDistrito} — {result.seccional.nDepart}
                                                        </p>
                                                        {result.local.direccion && (
                                                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                                {result.local.direccion}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start">
                                                    <FileText size={22} weight="fill" className="text-red-500 mr-3 shrink-0 mt-0.5" />
                                                    <div className="flex space-x-8">
                                                        <div>
                                                            <p className="text-xs uppercase text-gray-500 font-bold mb-1">Mesa</p>
                                                            <p className="text-2xl font-black text-black">{result.mesa}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs uppercase text-gray-500 font-bold mb-1">Orden</p>
                                                            <p className="text-2xl font-black text-black">{result.orden}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {state === 'not_found' && (
                                <div className="fade-in bg-gray-50 border border-gray-200 text-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
                                    <WarningCircle size={40} weight="fill" className="mb-3 text-red-500" />
                                    <span className="font-extrabold text-lg text-black mb-1">
                                        Elector no encontrado
                                    </span>
                                    <span className="font-medium text-sm text-gray-500">
                                        No hay registros para el documento:{' '}
                                        <strong>{cedula.trim()}</strong>
                                    </span>
                                </div>
                            )}

                            {state === 'error' && (
                                <div className="fade-in bg-red-50 border border-red-200 p-6 rounded-2xl flex flex-col items-center text-center">
                                    <WarningCircle size={40} weight="fill" className="mb-3 text-red-600" />
                                    <span className="font-extrabold text-red-800">
                                        Error de conexión. Intente de nuevo.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
