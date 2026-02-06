import { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { ActivityLog } from '../types';
import { supabase } from '../lib/supabase';

interface ActivityLogHook {
    activityLogs: ActivityLog[];
    loading: boolean;
    addLog: (type: ActivityLog['type'], description: string) => Promise<void>;
    refreshLogs: () => Promise<void>;
}

/**
 * Hook for managing user activity logs
 */
export const useActivityLog = (): ActivityLogHook => {
    const { user } = useAuth();
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await supabase
                .from('activity_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (data) setActivityLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [user?.id]);

    const addLog = async (type: ActivityLog['type'], description: string) => {
        if (!user?.id) return;

        try {
            const { error } = await supabase
                .from('activity_logs')
                .insert({
                    user_id: user.id,
                    type,
                    description
                });

            if (!error) {
                // Update local state immediately
                setActivityLogs(prev => [
                    { type, description, created_at: new Date().toISOString() },
                    ...prev
                ].slice(0, 10));
            }
        } catch (error) {
            console.error('Error adding log:', error);
        }
    };

    const refreshLogs = async () => {
        await fetchLogs();
    };

    return {
        activityLogs,
        loading,
        addLog,
        refreshLogs
    };
};
