import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import LoadingState from './LoadingState';
import { UserRole } from '../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: UserRole;
}

/**
 * Protected route component that checks authentication and role
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingState fullScreen message="Verificando sesión..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role permission
    if (role && user.role !== role && user.role !== 'admin') {
        return <Navigate to="/app/dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
