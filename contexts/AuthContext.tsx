import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (password: string) => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar perfil desde caché para respuesta instantánea
        const cachedUser = localStorage.getItem('iuris_user_cache');
        if (cachedUser) {
            try {
                const parsedUser = JSON.parse(cachedUser);
                console.log('📦 [Auth] Perfil cargado desde caché:', parsedUser.email);
                setUser(parsedUser);
                setLoading(false); // Ya podemos dejar de mostrar el loading global
            } catch (e) {
                console.warn('⚠️ [Auth] Error parseando caché:', e);
            }
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`🔐 [Auth] Evento: ${event}`);

            if (session?.user) {
                try {
                    console.log('🔄 [Auth] Sincronizando perfil para:', session.user.email);

                    const profilePromise = supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Profile sync timeout')), 10000) // Reducido a 10s para ser más ágil
                    );

                    const { data: profile } = await Promise.race([profilePromise, timeoutPromise]) as any;

                    if (profile) {
                        const newUser = {
                            id: session.user.id,
                            username: session.user.email?.split('@')[0] || 'User',
                            role: (profile.role as any) || 'user',
                            name: profile.full_name || session.user.email?.split('@')[0] || 'User',
                            email: session.user.email,
                            avatarUrl: profile.avatar_url
                        };

                        console.log('✅ [Auth] Perfil sincronizado. Rol:', profile.role);
                        setUser(newUser);
                        localStorage.setItem('iuris_user_cache', JSON.stringify(newUser));
                    } else {
                        console.warn('⚠️ [Auth] No se encontró perfil en DB');
                        const fallbackUser = {
                            id: session.user.id,
                            username: session.user.email?.split('@')[0] || 'User',
                            role: 'user',
                            name: session.user.email?.split('@')[0] || 'User',
                            email: session.user.email
                        };
                        setUser(fallbackUser);
                        localStorage.setItem('iuris_user_cache', JSON.stringify(fallbackUser));
                    }
                } catch (err) {
                    console.error('❌ [Auth] Error sincronizando perfil:', err);
                }
            } else {
                setUser(null);
                localStorage.removeItem('iuris_user_cache');
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    };

    const signOut = async () => {
        try {
            console.log('🚪 [Auth] Iniciando cierre de sesión...');
            // Limpiar estado local primero para una respuesta visual instantánea
            setUser(null);
            setLoading(false);

            // Cerrar sesión en Supabase
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            console.log('✅ [Auth] Sesión cerrada correctamente');
        } catch (error) {
            console.error('❌ [Auth] Error al cerrar sesión:', error);
            // Aseguramos que el usuario sea null incluso si falla la red
            setUser(null);
        } finally {
            // No hacemos el navigate aquí, dejamos que ProtectedRoute o el componente disparen la redirección
        }
    };
    const resetPassword = async (email: string) => {
        // En desarrollo local, nos aseguramos de que window.location.origin incluya el puerto correcto
        const redirectTo = window.location.hostname === 'localhost'
            ? `${window.location.protocol}//${window.location.host}/login`
            : `${window.location.origin}/login`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        });
        if (error) throw error;
    };

    const updatePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
    };


    const updateUser = (updates: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...updates } : null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, updatePassword, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
