import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, MagnifyingGlass } from '@phosphor-icons/react';
import { login } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { useBrandingStore } from '../store/brandingStore';

export function LoginPage(){
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const branding = useBrandingStore((s) => s.branding);

    const candidateImage = branding?.candidateImageUrl ?? '/login.jpeg';
    const candidateName = branding?.appTitle ?? 'Naomy Ferrer';
    const candidateTitle = branding?.candidateTitle ?? 'Concejal';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await login({ email, password });
            setAuth(response.accessToken, response.refreshToken, response.user, response.user.mustChangePassword, response.tenantConfig);

            const dest = response.user.role.toLowerCase() === 'operador' ? '/panel' : '/admin';
            navigate(dest);
        } catch {
            setError('Credenciales incorrectas. Verifique su usuario y contraseña');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl min-h-[750px] border border-gray-100">

                {/* Sidebar Candidato */}
                <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center sidebar-primary p-10 text-white relative overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-multiply blur-3xl opacity-40 pointer-events-none" style={{ background: 'var(--primary)' }} />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full mix-blend-multiply blur-3xl opacity-60 pointer-events-none" style={{ background: 'var(--primary-darker)' }} />

                    <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
                        {/* Candidate photo card */}
                        <div className="w-full aspect-[3/4] bg-white/10 backdrop-blur-md rounded-3xl p-2 shadow-2xl mb-8 border border-white/20 relative">
                            <img
                                src={candidateImage}
                                alt={candidateName}
                                className="object-cover object-top w-full h-full rounded-2xl opacity-90 contrast-125"
                            />
                        </div>

                        <h2 className="text-4xl font-extrabold tracking-tight mb-1 drop-shadow-md text-center uppercase">
                            {candidateName}
                        </h2>
                        <p className="font-bold tracking-[0.3em] mb-6 drop-shadow text-center text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                            {candidateTitle.toUpperCase()}
                        </p>
                        <div className="px-8 py-2.5 bg-white/10 backdrop-blur-md rounded-full font-extrabold text-sm tracking-widest border border-white/20 shadow-inner">
                            SAN LORENZO
                        </div>
                    </div>
                </div>

                {/* Formulario */}
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
                            <div className="p-4 rounded-2xl text-sm font-medium" style={{ background: 'rgba(var(--primary-rgb), 0.06)', border: '1px solid rgba(var(--primary-rgb), 0.25)', color: 'var(--primary-darker)' }}>
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
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none font-medium text-gray-700 input-focus-primary"
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
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none font-medium text-gray-700 input-focus-primary"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center px-1 pt-2 pb-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 checkbox-primary"
                                />
                                <span className="ml-2 text-sm font-bold text-gray-400">Recordarme</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-primary hover:opacity-75">
                                ¿Olvidó su contraseña?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-2xl shadow-md text-base font-bold btn-primary"
                        >
                            {isLoading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center text-center max-w-sm mx-auto w-full">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
                            {candidateName} - {candidateTitle}
                        </p>
                        <p className="text-sm font-black uppercase tracking-widest text-primary">
                            San Lorenzo
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="mt-8 flex items-center justify-center bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-50 shadow-sm font-bold w-full"
                        >
                            <MagnifyingGlass size={18} className="text-primary mr-2" />
                            Consultar Padrón Público
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
