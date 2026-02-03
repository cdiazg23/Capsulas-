/**
 * Error logging and reporting utilities
 */

export interface ErrorLog {
    message: string;
    stack?: string;
    timestamp: string;
    userId?: string;
    context?: Record<string, unknown>;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Logs error to console in development, and to external service in production
 */
export const logError = (
    error: Error,
    context?: Record<string, unknown>,
    severity: ErrorLog['severity'] = 'medium'
): void => {
    const errorLog: ErrorLog = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        context,
        severity
    };

    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error logged:', errorLog);
    }

    // In production, send to external service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with Sentry or similar service
        // Sentry.captureException(error, { extra: context, level: severity });
        console.error('Production error:', errorLog);
    }

    // Store in localStorage for debugging (limited to last 10)
    try {
        const stored = localStorage.getItem('error-logs');
        const logs: ErrorLog[] = stored ? JSON.parse(stored) : [];
        logs.unshift(errorLog);
        localStorage.setItem('error-logs', JSON.stringify(logs.slice(0, 10)));
    } catch (e) {
        // Silently fail if localStorage is unavailable
    }
};

/**
 * Retrieves recent error logs from localStorage
 */
export const getRecentErrors = (): ErrorLog[] => {
    try {
        const stored = localStorage.getItem('error-logs');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

/**
 * Clears error logs from localStorage
 */
export const clearErrorLogs = (): void => {
    try {
        localStorage.removeItem('error-logs');
    } catch {
        // Silently fail
    }
};

/**
 * Creates a user-friendly error message from an error object
 */
export const getUserFriendlyMessage = (error: Error): string => {
    const errorMessages: Record<string, string> = {
        'Network request failed': 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
        'Invalid credentials': 'Credenciales incorrectas. Verifica tu correo y contraseña.',
        'User not found': 'Usuario no encontrado.',
        'Session expired': 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        'Permission denied': 'No tienes permisos para realizar esta acción.',
        'Resource not found': 'El recurso solicitado no fue encontrado.',
        'Validation error': 'Los datos ingresados no son válidos. Revisa el formulario.',
    };

    // Check if error message contains any known pattern
    for (const [pattern, message] of Object.entries(errorMessages)) {
        if (error.message.toLowerCase().includes(pattern.toLowerCase())) {
            return message;
        }
    }

    // Default message
    return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
};

/**
 * Wraps an async function with error handling
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    errorHandler?: (error: Error) => void
): T => {
    return (async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            logError(err, { functionName: fn.name, args });

            if (errorHandler) {
                errorHandler(err);
            } else {
                throw err;
            }
        }
    }) as T;
};
