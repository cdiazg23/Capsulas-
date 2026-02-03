import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
    dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    size = 'md',
    icon,
    dot = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center font-bold uppercase tracking-wider rounded-full';

    const variantStyles = {
        primary: 'bg-primary text-white',
        success: 'bg-emerald-500 text-white',
        warning: 'bg-amber-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        neutral: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
    };

    const sizeStyles = {
        sm: 'px-2 py-0.5 text-[9px] gap-1',
        md: 'px-2.5 py-1 text-[10px] gap-1.5',
        lg: 'px-3 py-1.5 text-xs gap-2'
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    return (
        <span className={combinedClassName} {...props}>
            {dot && <span className="size-1.5 rounded-full bg-current opacity-75" />}
            {icon && <span className={`material-symbols-outlined ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>{icon}</span>}
            {children}
        </span>
    );
};

export default Badge;
