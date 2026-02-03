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
    const [isSyncing, setIsSyncing] = useState(false);
    const userRef = React.useRef<User | null>(null);

    // Actualizar el ref cada vez que el usuario cambie
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        // Check active session
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    console.log('👤 Usuario autenticado:', session.user.email);

                    let { data: profile, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    // Si el perfil no existe, crearlo
                    if (!profile || error) {
                        console.log('📝 Perfil no encontrado, creando...');
                        const newProfile = {
                            id: session.user.id,
                            email: session.user.email,
                            full_name: session.user.email?.split('@')[0] || 'User',
                            role: 'user',
                            created_at: new Date().toISOString()
                        };

                        const { data: createdProfile, error: createError } = await supabase
                            .from('profiles')
                            .insert([newProfile])
                            .select()
                            .single();

                        if (createError) {
                            console.error('Error creando perfil:', createError);
                        } else {
                            profile = createdProfile;
                            console.log('✅ Perfil creado exitosamente');
                        }
                    }

                    if (profile) {
                        setUser({
                            username: session.user.email?.split('@')[0] || 'User',
                            role: profile.role || 'user',
                            name: profile.full_name || session.user.email?.split('@')[0] || 'User',
                            avatarUrl: profile.avatar_url
                        });
                        console.log('✅ Usuario cargado:', profile.full_name);
                    }
                }
            } catch (error) {
                console.error('❌ Error initializing auth:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`🔐 Evento de Autenticación: ${event}`);

            if (session?.user) {
                // Si ya tenemos el perfil y no es un login fresco, evitamos re-fetching
                if (userRef.current && event !== 'SIGNED_IN' && event !== 'TOKEN_REFRESHED') {
                    return;
                }

                setIsSyncing(true);
                try {
                    let { data: profile, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle(); // maybeSingle es más resiliente que single()

                    if (!profile || error) {
                        console.log('📝 Perfil no detectado, intentando crear uno...');
                        const newProfile = {
                            id: session.user.id,
                            email: session.user.email,
                            full_name: session.user.email?.split('@')[0] || 'User',
                            role: 'user',
                            created_at: new Date().toISOString()
                        };

                        const { data: createdProfile, error: createError } = await supabase
                            .from('profiles')
                            .insert([newProfile])
                            .select()
                            .single();

                        if (createError) throw createError;
                        profile = createdProfile;
                    }

                    if (profile) {
                        const newUser: User = {
                            username: session.user.email?.split('@')[0] || 'User',
                            role: (profile.role as any) || 'user',
                            name: profile.full_name || session.user.email?.split('@')[0] || 'User',
                            avatarUrl: profile.avatar_url
                        };
                        setUser(newUser);
                        console.log('✅ Sesión y perfil sincronizados correctamente');
                    }
                } catch (err) {
                    console.error('❌ Error crítico en sincronización de perfil:', err);
                    // Si falla el perfil crítico, podemos decidir si dejamos entrar o no
                    // Por ahora reseteamos para forzar re-login si es necesario
                } finally {
                    setIsSyncing(false);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setIsSyncing(false);
            }
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
            console.error('Error signing out:', error);
            // Aun si hay error, forzamos la limpieza local
            setUser(null);
            throw error;
        }
    };

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...updates } : null);
    };

    return (
        <AuthContext.Provider value={{ user, loading: loading || isSyncing, signIn, signUp, signOut, updateUser }}>
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
