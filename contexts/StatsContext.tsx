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
                return;
            }

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    setStats({
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
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    // Sync stats to database
    useEffect(() => {
        const syncStats = async () => {
            if (!user) return;

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            await supabase.from('profiles').update({
                xp: stats.xp,
                level: stats.level,
                points: stats.points,
                streak: stats.streak,
                learned_concepts: stats.learnedConcepts,
                completed_quizzes: stats.completedQuizzes,
                next_level_xp: stats.nextLevelXp,
                consultations_today: stats.consultationsToday,
                consultations_month: stats.consultationsMonth,
                last_consultation_at: stats.lastConsultationAt || new Date().toISOString()
            }).eq('id', session.user.id);
        };

        const timeoutId = setTimeout(syncStats, 2000);
        return () => clearTimeout(timeoutId);
    }, [stats, user]);

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
