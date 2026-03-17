import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Navbar } from './Navbar';

export function ProtectedRoute(){
    const isAuthenticatd = useAuthStore((state) => state.isAuthenticated);

    if(!isAuthenticatd){
        return <Navigate to="/login" replace/>;
    }

    return (
        <>
            <Navbar />
            <main className='max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <Outlet />
            </main>
        </>
    )
}