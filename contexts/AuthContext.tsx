import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Un solo responsable para la sesión: onAuthStateChange maneja tanto el inicio como los cambios
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`🔐 [Auth] Evento: ${event}`);

            if (session?.user) {
                try {
                    console.log('🔄 [Auth] Sincronizando perfil para:', session.user.email);

                    // Timeout para la consulta del perfil (30s)
                    const profilePromise = supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Profile sync timeout')), 30000)
                    );

                    const { data: profile } = await Promise.race([profilePromise, timeoutPromise]) as any;

                    if (profile) {
                        console.log('✅ [Auth] Perfil sincronizado. Rol:', profile.role);
                        setUser({
                            username: session.user.email?.split('@')[0] || 'User',
                            role: (profile.role as any) || 'user',
                            name: profile.full_name || session.user.email?.split('@')[0] || 'User',
                            avatarUrl: profile.avatar_url
                        });
                    } else {
                        console.warn('⚠️ [Auth] No se encontró perfil en DB, asignando rol por defecto');
                        // Fail-safe: Si no hay perfil aún, permitir entrada con datos de sesión
                        setUser(prev => prev || {
                            username: session.user.email?.split('@')[0] || 'User',
                            role: 'user',
                            name: session.user.email?.split('@')[0] || 'User',
                        });
                    }
                } catch (err) {
                    console.error('❌ [Auth] Error o timeout sincronizando perfil:', err);
                    // IMPORTANTE: Si ya tenemos un usuario cargado, NO lo sobrescribimos con 'user' por defecto
                    // Esto evita que el admin sea expulsado si la DB está saturada momentáneamente
                    setUser(prev => {
                        if (prev) {
                            console.log('🧡 [Auth] Manteniendo sesión previa tras fallo de sincronización');
                            return prev;
                        }
                        return {
                            username: session.user.email?.split('@')[0] || 'User',
                            role: 'user',
                            name: session.user.email?.split('@')[0] || 'User',
                        };
                    });
                }
            } else {
                setUser(null);
            }

            // Garantizamos que tras el primer evento exitoso de sesión o fallo, loading sea false
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
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            setUser(null);
            console.error('Error signing out:', error);
        }
    };

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...updates } : null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
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
