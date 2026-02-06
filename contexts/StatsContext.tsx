import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStats } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import LevelUpModal from '../components/LevelUpModal';

interface StatsContextType {
    stats: UserStats;
    loading: boolean;
    showLevelUp: boolean;
    setShowLevelUp: (show: boolean) => void;
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
    const [showLevelUp, setShowLevelUp] = useState(false);

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
                    const now = new Date();
                    const today = now.toDateString();
                    const lastDateStr = profile.last_consultation_at ? new Date(profile.last_consultation_at).toDateString() : '';

                    let newStreak = profile.streak || 0;
                    let newConsultationsToday = profile.consultations_today || 0;

                    // Logic for daily reset and streak
                    if (lastDateStr !== today) {
                        // It's a new day
                        newConsultationsToday = 0;

                        // Check if streak continues (was active yesterday)
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        const yesterdayStr = yesterday.toDateString();

                        if (lastDateStr === yesterdayStr) {
                            // Streak continues! (Will be incremented when activity happens, or now?)
                            // Let's increment it now as they just "logged in/loaded" which counts as activity
                            newStreak += 1;
                        } else if (lastDateStr === '') {
                            // First time ever
                            newStreak = 1;
                        } else {
                            // Streak broken
                            newStreak = 1; // Start a new one today
                        }

                        // Update DB immediately for the new day
                        await supabase.from('profiles').update({
                            streak: newStreak,
                            consultations_today: newConsultationsToday,
                            last_consultation_at: now.toISOString()
                        }).eq('id', user.id);
                    }

                    const loadedStats: UserStats = {
                        level: profile.level || 1,
                        xp: profile.xp || 0,
                        nextLevelXp: profile.next_level_xp || 100,
                        points: profile.points || 0,
                        streak: newStreak,
                        learnedConcepts: profile.learned_concepts || 0,
                        completedQuizzes: profile.completed_quizzes || 0,
                        consultationsToday: newConsultationsToday,
                        consultationsMonth: profile.consultations_month || 0,
                        lastConsultationAt: now.toISOString()
                    };
                    setStats(loadedStats);
                    lastSyncedStats.current = JSON.stringify(loadedStats);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
                setTimeout(() => {
                    isInitialLoad.current = false;
                }, 100);
            }
        };

        fetchStats();
    }, [user?.id]);

    // Sync stats to database (with debounce)
    useEffect(() => {
        if (!user || loading || isInitialLoad.current) return;

        const currentStatsStr = JSON.stringify(stats);
        if (currentStatsStr === lastSyncedStats.current) return;

        const syncStats = async () => {
            try {
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
                    console.log('✅ [Stats] Perfil sincronizado');
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
                setShowLevelUp(true);
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
            updateStreak,
            showLevelUp,
            setShowLevelUp
        }}>
            {showLevelUp && (
                <LevelUpModal
                    level={stats.level}
                    rank={getUserRank(stats.level).name}
                    onClose={() => setShowLevelUp(false)}
                />
            )}
            {children}
        </StatsContext.Provider>
    );
};

const getUserRank = (level: number) => {
    if (level >= 13) return { name: 'Magistrado de la Corte' };
    if (level >= 8) return { name: 'Abogado de la República' };
    if (level >= 4) return { name: 'Licenciado en Derecho' };
    return { name: 'Estudiante de Derecho' };
};

export const useStats = (): StatsContextType => {
    const context = useContext(StatsContext);
    if (!context) {
        throw new Error('useStats must be used within StatsProvider');
    }
    return context;
};
