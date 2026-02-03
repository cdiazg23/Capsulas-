import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: string;
    rightIcon?: string;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    id,
    ...props
}, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = 'block w-full bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

    const stateStyles = error
        ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/20';

    const paddingStyles = leftIcon && rightIcon
        ? 'pl-10 pr-10 py-2.5'
        : leftIcon
            ? 'pl-10 pr-4 py-2.5'
            : rightIcon
                ? 'pl-4 pr-10 py-2.5'
                : 'px-4 py-2.5';

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
        <div className={widthStyles}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg">
                        {leftIcon}
                    </span>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    className={`${baseStyles} ${stateStyles} ${paddingStyles} ${className}`.trim()}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    {...props}
                />

                {rightIcon && (
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg">
                        {rightIcon}
                    </span>
                )}
            </div>

            {error && (
                <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
