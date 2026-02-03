import { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { supabase } from '../lib/supabase';

interface MasteryHook {
    masteredConceptIds: string[];
    loading: boolean;
    toggleMastery: (conceptId: string) => Promise<void>;
    isMastered: (conceptId: string) => boolean;
}

/**
 * Hook for managing user's mastered concepts
 */
export const useMastery = (): MasteryHook => {
    const { user } = useAuth();
    const [masteredConceptIds, setMasteredConceptIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMastery = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const { data } = await supabase
                    .from('user_mastery')
                    .select('concept_id')
                    .eq('user_id', session.user.id);

                if (data) {
                    setMasteredConceptIds(data.map(m => m.concept_id));
                }
            } catch (error) {
                console.error('Error fetching mastery:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMastery();
    }, [user]);

    const toggleMastery = async (conceptId: string) => {
        if (!user) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const isCurrentlyMastered = masteredConceptIds.includes(conceptId);

        if (isCurrentlyMastered) {
            await supabase
                .from('user_mastery')
                .delete()
                .eq('user_id', session.user.id)
                .eq('concept_id', conceptId);

            setMasteredConceptIds(prev => prev.filter(id => id !== conceptId));
        } else {
            await supabase
                .from('user_mastery')
                .insert({ user_id: session.user.id, concept_id: conceptId });

            setMasteredConceptIds(prev => [...prev, conceptId]);
        }
    };

    const isMastered = (conceptId: string): boolean => {
        return masteredConceptIds.includes(conceptId);
    };

    return {
        masteredConceptIds,
        loading,
        toggleMastery,
        isMastered
    };
};
