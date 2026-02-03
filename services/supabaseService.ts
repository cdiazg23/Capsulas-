/**
 * Supabase service layer
 * Centralized database operations with error handling
 */

import { supabase } from '../lib/supabase';
import { Profile, ActivityLog, UserMastery } from '../types';

/**
 * Fetch user profile with related data in a single query
 */
export const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
      *,
      mastery:user_mastery(concept_id),
      logs:activity_logs(*)
    `)
        .eq('id', userId)
        .order('created_at', { foreignTable: 'activity_logs', ascending: false })
        .limit(10, { foreignTable: 'activity_logs' })
        .single();

    if (error) throw error;
    return data;
};

/**
 * Update user profile
 */
export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Add activity log
 */
export const createActivityLog = async (
    userId: string,
    type: ActivityLog['type'],
    description: string
) => {
    const { data, error } = await supabase
        .from('activity_logs')
        .insert({
            user_id: userId,
            type,
            description
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Toggle concept mastery
 */
export const toggleConceptMastery = async (
    userId: string,
    conceptId: string,
    isMastered: boolean
) => {
    if (isMastered) {
        // Remove mastery
        const { error } = await supabase
            .from('user_mastery')
            .delete()
            .eq('user_id', userId)
            .eq('concept_id', conceptId);

        if (error) throw error;
    } else {
        // Add mastery
        const { error } = await supabase
            .from('user_mastery')
            .insert({
                user_id: userId,
                concept_id: conceptId
            });

        if (error) throw error;
    }
};

/**
 * Batch fetch concepts with mastery status
 */
export const fetchConceptsWithMastery = async (userId: string) => {
    const [conceptsResult, masteryResult] = await Promise.all([
        supabase.from('legal_concepts').select('*').order('created_at', { ascending: true }),
        supabase.from('user_mastery').select('concept_id').eq('user_id', userId)
    ]);

    if (conceptsResult.error) throw conceptsResult.error;
    if (masteryResult.error) throw masteryResult.error;

    const masteredIds = new Set(masteryResult.data.map(m => m.concept_id));

    return {
        concepts: conceptsResult.data,
        masteredIds: Array.from(masteredIds)
    };
};

/**
 * Update user stats in batch
 */
export const batchUpdateStats = async (userId: string, stats: {
    xp?: number;
    level?: number;
    points?: number;
    streak?: number;
    learned_concepts?: number;
    completed_quizzes?: number;
    next_level_xp?: number;
}) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(stats)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};
