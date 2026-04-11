import { Link } from 'react-router-dom';
import { ShieldCheck } from '@phosphor-icons/react';

export function NotFound404() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col sigele-public">
            {/* Header con branding Sigele fijo, sin variables de tenant */}
            <header className="bg-black text-white shadow-lg border-b-2 border-gray-700">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-2">
                    <ShieldCheck size={28} weight="fill" className="text-gray-400" />
                    <span className="font-bold text-lg tracking-tight">SIGELE</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-8xl font-extrabold text-gray-900 tracking-tighter mb-3">
                    404
                </h1>
                <p className="text-xl font-semibold text-gray-700 mb-2">
                    Página no encontrada
                </p>
                <p className="text-gray-400 mb-8 max-w-sm">
                    La dirección que ingresaste no existe o fue removida.
                </p>
                <Link
                    to="/padron"
                    className="px-6 py-3 rounded-2xl font-bold text-white shadow-md bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                    Ir al padrón
                </Link>
            </main>

            <footer className="py-5 text-center">
                <p className="text-xs text-gray-400">
                    Powered by <span className="font-bold text-gray-500">SIGELE</span>
                </p>
            </footer>
        </div>
    );
}
