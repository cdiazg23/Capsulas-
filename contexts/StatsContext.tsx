import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStats } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface StatsContextType {
    stats: UserStats;
    loading: boolean;
    updateStats: (updates: Partial<UserStats>) => void;
    addXP: (xp: number) => void;
    incrementLearnedConcepts: () => void;
    incrementCompletedQuizzes: () => void;
    updateStreak: (streak: number) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats>({
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        points: 0,
        streak: 0,
        learnedConcepts: 0,
        completedQuizzes: 0,
        consultationsToday: 0,
        consultationsMonth: 0
    });
    const [loading, setLoading] = useState(true);

    const isInitialLoad = React.useRef(true);
    const lastSyncedStats = React.useRef<string>('');

    // Fetch stats when user changes
    useEffect(() => {
        const fetchStats = async () => {
            if (!user) {
                setStats({
                    level: 1,
                    xp: 0,
                    nextLevelXp: 100,
                    points: 0,
                    streak: 0,
                    learnedConcepts: 0,
                    completedQuizzes: 0,
                    consultationsToday: 0,
                    consultationsMonth: 0
                });
                setLoading(false);
                isInitialLoad.current = false;
                return;
            }

            try {
                setLoading(true);
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    const loadedStats: UserStats = {
                        level: profile.level || 1,
                        xp: profile.xp || 0,
                        nextLevelXp: profile.next_level_xp || 100,
                        points: profile.points || 0,
                        streak: profile.streak || 0,
                        learnedConcepts: profile.learned_concepts || 0,
                        completedQuizzes: profile.completed_quizzes || 0,
                        consultationsToday: profile.consultations_today || 0,
                        consultationsMonth: profile.consultations_month || 0,
                        lastConsultationAt: profile.last_consultation_at
                    };
                    setStats(loadedStats);
                    lastSyncedStats.current = JSON.stringify(loadedStats);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
                // Pequeño delay para asegurar que el siguiente useEffect no se dispare por el setStats de arriba
                setTimeout(() => {
                    isInitialLoad.current = false;
                }, 100);
            }
        };

        fetchStats();
    }, [user?.id]);

    // Sync stats to database
    useEffect(() => {
        if (!user || loading || isInitialLoad.current) return;

        const currentStatsStr = JSON.stringify(stats);
        if (currentStatsStr === lastSyncedStats.current) return;

        const syncStats = async () => {
            try {
                console.log('💾 [Stats] Sincronizando avances...');
                const { error } = await supabase.from('profiles').update({
                    xp: stats.xp,
                    level: stats.level,
                    points: stats.points,
                    streak: stats.streak,
                    learned_concepts: stats.learnedConcepts,
                    completed_quizzes: stats.completedQuizzes,
                    next_level_xp: stats.nextLevelXp,
                    consultations_today: stats.consultationsToday,
                    consultations_month: stats.consultationsMonth,
                    last_consultation_at: stats.lastConsultationAt
                }).eq('id', user.id);

                if (!error) {
                    lastSyncedStats.current = currentStatsStr;
                    console.log('✅ [Stats] Avances guardados correctamente');
                } else {
                    console.error('❌ [Stats] Error al sincronizar:', error);
                }
            } catch (err) {
                console.error('❌ [Stats] Error en syncStats:', err);
            }
        };

        const timeoutId = setTimeout(syncStats, 1500);
        return () => clearTimeout(timeoutId);
    }, [stats, user?.id, loading]);

    const updateStats = (updates: Partial<UserStats>) => {
        setStats(prev => ({ ...prev, ...updates }));
    };

    const addXP = (xp: number) => {
        setStats(prev => {
            let newXp = prev.xp + xp;
            let newLevel = prev.level;
            let newNextLevelXp = prev.nextLevelXp;

            // Level up logic
            while (newXp >= newNextLevelXp) {
                newLevel += 1;
                newXp -= newNextLevelXp;
                newNextLevelXp = Math.round(newNextLevelXp * 1.5);
            }

            return {
                ...prev,
                xp: newXp,
                level: newLevel,
                nextLevelXp: newNextLevelXp,
                points: prev.points + xp
            };
        });
    };

    const incrementLearnedConcepts = () => {
        setStats(prev => ({ ...prev, learnedConcepts: prev.learnedConcepts + 1 }));
    };

    const incrementCompletedQuizzes = () => {
        setStats(prev => ({ ...prev, completedQuizzes: prev.completedQuizzes + 1 }));
    };

    const updateStreak = (streak: number) => {
        setStats(prev => ({ ...prev, streak }));
    };

    return (
        <StatsContext.Provider value={{
            stats,
            loading,
            updateStats,
            addXP,
            incrementLearnedConcepts,
            incrementCompletedQuizzes,
            updateStreak
        }}>
            {children}
        </StatsContext.Provider>
    );
};

export const useStats = (): StatsContextType => {
    const context = useContext(StatsContext);
    if (!context) {
        throw new Error('useStats must be used within StatsProvider');
    }
    return context;
};
