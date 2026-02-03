import React from 'react';

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
}

/**
 * Reusable loading state component
 */
const LoadingState: React.FC<LoadingStateProps> = ({
    message = 'Cargando...',
    fullScreen = false
}) => {
    const content = (
        <div className="text-center">
            <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-slate-400 dark:text-slate-500 font-bold animate-pulse">{message}</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
            {content}
        </div>
    );
};

export default LoadingState;
