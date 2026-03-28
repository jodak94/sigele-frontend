import { ShieldCheck, House, SignOut, LockKey } from '@phosphor-icons/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ChangePasswordModal } from './ChangePasswordModal';

export function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleHome = () => {
        navigate('/padron');
    };

    return (
        <>
        {showChangePassword && (
            <ChangePasswordModal
                onClose={() => setShowChangePassword(false)}
                onSuccess={() => setShowChangePassword(false)}
            />
        )}
        <nav className="bg-black text-white shadow-lg sticky top-0 z-50 border-b-2 border-red-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <ShieldCheck className="text-red-600 text-3xl mr-2" size={32} weight="fill" />
                        <span className="font-bold text-xl tracking-tight hidden sm:block">SIGELE</span>
                        <span className="ml-3 px-2.5 py-0.5 rounded-full bg-gray-800 text-xs font-medium text-gray-300 border border-gray-700 hidden md:block">
                            Campaña 2026
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="text-right hidden md:block mr-2">
                            <div className="text-sm font-medium">{user?.fullName}</div>
                            <div className="text-xs text-red-400 font-bold tracking-wider uppercase">
                                {user?.role}
                            </div>
                        </div>
                        <button
                            onClick={handleHome}
                            className="p-2 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white"
                            title="Inicio"
                        >
                            <House size={22} />
                        </button>
                        <button
                            onClick={() => setShowChangePassword(true)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white"
                            title="Cambiar contraseña"
                        >
                            <LockKey size={22} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-red-900/50 hover:text-red-400 transition text-gray-300"
                            title="Cerrar Sesión"
                        >
                            <SignOut size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        </>
    );
}