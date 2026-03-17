import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ShieldCheck, MagnifyingGlass } from '@phosphor-icons/react';
import { login } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export function LoginPage(){
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try{
            const response = await login({
                email,
                password,
                tenantId: 1 //TODO
            })
            
            setAuth(response.accessToken, response.refreshToken, response.user);
            navigate('/operators');
        }catch{
            setError('Credenciales incorrectas. Verifique su usuario y contraseña');
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl min-h-[600px] border border-gray-100">

                {/* Sidebar */}
                <div className="md:w-1/2 bg-black flex flex-col items-center justify-center p-12 text-white">
                    <ShieldCheck size={80} weight="fill" className="text-red-600 mb-6" />
                    <h2 className="text-4xl font-black tracking-tight text-center uppercase">SIGELE</h2>
                    <p className="text-gray-400 mt-3 text-center font-medium">
                        Sistema de Gestión Electoral
                    </p>
                    <div className="mt-6 px-4 py-2 rounded-full bg-gray-800 border border-gray-700">
                        <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">
                            Campaña 2026
                        </span>
                    </div>
                    <div className="mt-16 text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">
                            Naomy Ferrer - Concejal
                        </p>
                        <p className="text-sm text-red-500 font-black uppercase tracking-widest">
                            San Lorenzo
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-gray-50/50">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Iniciar sesión
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">
                            Ingrese sus credenciales para acceder al sistema
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto w-full">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-medium text-gray-700"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-medium text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center px-1 pt-2 pb-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="ml-2 text-sm font-bold text-gray-400">Recordarme</span>
                            </label>
                            <a href="#" className="text-sm text-red-600 hover:text-red-800 font-bold">
                                ¿Olvidó su contraseña?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-2xl shadow-md text-base font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Ingresando...' : 'Ingresar'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/public')}
                            className="mt-4 w-full flex items-center justify-center bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-50 shadow-sm font-bold"
                        >
                            <MagnifyingGlass size={18} className="text-red-600 mr-2" />
                            Consultar Padrón Público
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}