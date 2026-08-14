/**
 * Environment variables configuration
 * Provides type-safe access to environment variables
 */

interface EnvConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
    nodeEnv: string;
}

/**
 * Validates that required environment variables are set
 */
const validateEnv = (): void => {
    const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missing = required.filter(key => !import.meta.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env.local file.'
        );
    }
};

// Validate on module load
if (typeof window !== 'undefined') {
    validateEnv();
}

/**
 * Type-safe environment configuration
 */
export const env: EnvConfig = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    nodeEnv: import.meta.env.MODE || 'development'
};

/**
 * Check if running in development mode
 */
export const isDevelopment = env.nodeEnv === 'development';

/**
 * Check if running in production mode
 */
export const isProduction = env.nodeEnv === 'production';
