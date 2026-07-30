import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/context';

const PrivateRoutes = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
                </div>
                <p className="text-slate-400 font-medium text-sm mt-4 tracking-wider uppercase animate-pulse">
                    Verifying Session...
                </p>
            </div>
        );
    }

    return (
        isAuthenticated ? <Outlet /> : <Navigate to='/login' />
    )
}

export default PrivateRoutes