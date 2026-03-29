import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import LoadingState from './LoadingState';
import { UserRole } from '../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: UserRole;
    requirePremium?: boolean;
}

/**
 * Protected route component that checks authentication and subscription status
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role, requirePremium }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingState fullScreen message="Verificando sesión..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Admins have access to everything
    if (user.role === 'admin') {
        return <>{children}</>;
    }

    // Role-based protection (e.g. only admins allowed on certain routes)
    if (role && user.role !== role) {
        return <Navigate to="/app/dashboard" replace />;
    }

    // Subscription status protection
    const isActive = user.subscription_status === 'active' || user.subscription_status === 'trialing';

    if (requirePremium && !isActive) {
        return <Navigate to="/app/billing" replace />;
    }

    // General app access: if expired, they can only see billing and maybe profile/dashboard?
    // Let's be less strict on the general /app wrapper but strict on requirePremium sub-routes.
    // If we are in the main /app wrapper (no role, no requirePremium), 
    // we let them in but components will show "expired" state.

    return <>{children}</>;
};


export default ProtectedRoute;
