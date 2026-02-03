import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    hover = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'rounded-2xl transition-all duration-200';

    const variantStyles = {
        default: 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700',
        elevated: 'bg-white dark:bg-slate-800 shadow-lg',
        outlined: 'bg-transparent border-2 border-slate-200 dark:border-slate-700',
        glass: 'glass'
    };

    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`.trim();

    return (
        <div className={combinedClassName} {...props}>
            {children}
        </div>
    );
};

export default Card;
