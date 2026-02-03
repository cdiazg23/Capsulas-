import React, { Component, ErrorInfo, ReactNode } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // Log error to external service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
                    <Card variant="elevated" padding="lg" className="max-w-2xl w-full">
                        <div className="text-center">
                            <div className="size-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
                                    error
                                </span>
                            </div>

                            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                                ¡Ups! Algo salió mal
                            </h1>

                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Hemos encontrado un error inesperado. No te preocupes, tu progreso está guardado.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={this.handleReset}
                                    leftIcon={<span className="material-symbols-outlined">refresh</span>}
                                >
                                    Intentar de nuevo
                                </Button>

                                <Button
                                    variant="outline"
                                    size="md"
                                    onClick={this.handleReload}
                                    leftIcon={<span className="material-symbols-outlined">home</span>}
                                >
                                    Volver al inicio
                                </Button>
                            </div>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="text-left">
                                    <summary className="cursor-pointer font-bold text-sm text-slate-600 dark:text-slate-400 mb-3">
                                        Detalles técnicos (solo en desarrollo)
                                    </summary>
                                    <div className="bg-slate-900 text-red-400 p-4 rounded-xl overflow-auto text-xs font-mono max-h-64">
                                        <p className="font-bold mb-2">{this.state.error.name}: {this.state.error.message}</p>
                                        <pre className="whitespace-pre-wrap break-all">
                                            {this.state.error.stack}
                                        </pre>
                                        {this.state.errorInfo && (
                                            <>
                                                <p className="font-bold mt-4 mb-2">Component Stack:</p>
                                                <pre className="whitespace-pre-wrap break-all">
                                                    {this.state.errorInfo.componentStack}
                                                </pre>
                                            </>
                                        )}
                                    </div>
                                </details>
                            )}
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
