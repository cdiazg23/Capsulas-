import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface ErrorStateProps {
    title?: string;
    message?: string;
    icon?: string;
    onRetry?: () => void;
    retryLabel?: string;
    showHomeButton?: boolean;
    onHome?: () => void;
}

/**
 * Reusable error state component for displaying errors in UI
 */
const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Error',
    message = 'Algo salió mal. Por favor, intenta nuevamente.',
    icon = 'error',
    onRetry,
    retryLabel = 'Reintentar',
    showHomeButton = false,
    onHome
}) => {
    return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
            <Card variant="outlined" padding="lg" className="max-w-md w-full text-center">
                <div className="size-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-400">
                        {icon}
                    </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                    {title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onRetry && (
                        <Button
                            variant="primary"
                            size="md"
                            onClick={onRetry}
                            leftIcon={<span className="material-symbols-outlined">refresh</span>}
                        >
                            {retryLabel}
                        </Button>
                    )}

                    {showHomeButton && onHome && (
                        <Button
                            variant="outline"
                            size="md"
                            onClick={onHome}
                            leftIcon={<span className="material-symbols-outlined">home</span>}
                        >
                            Ir al inicio
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ErrorState;
