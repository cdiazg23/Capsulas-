/**
 * Judicial career ranks and utilities for IurisAcademy
 */

export interface RankInfo {
    level: number;
    name: string;
    icon: string;
    colorClass: string;       // Color theme class (e.g., bg-slate-600)
    textColorClass: string;   // Tailwind text color class
    bgClass: string;          // Tailwind background color class
    borderClass: string;      // Tailwind border color class
}

export const JUDICIAL_CAREER: RankInfo[] = [
    { 
        level: 1, 
        name: 'Estudiante de Derecho', 
        icon: 'auto_stories', 
        colorClass: 'bg-slate-600', 
        textColorClass: 'text-slate-600', 
        bgClass: 'bg-slate-50', 
        borderClass: 'border-slate-200' 
    },
    { 
        level: 2, 
        name: 'Procurador', 
        icon: 'ink_pen', 
        colorClass: 'bg-slate-600', 
        textColorClass: 'text-slate-600', 
        bgClass: 'bg-slate-50', 
        borderClass: 'border-slate-200' 
    },
    { 
        level: 4, 
        name: 'Licenciado en Derecho', 
        icon: 'verified', 
        colorClass: 'bg-emerald-600', 
        textColorClass: 'text-emerald-600', 
        bgClass: 'bg-emerald-50', 
        borderClass: 'border-emerald-100' 
    },
    { 
        level: 6, 
        name: 'Bachiller en Ciencias Jurídicas', 
        icon: 'school', 
        colorClass: 'bg-emerald-600', 
        textColorClass: 'text-emerald-600', 
        bgClass: 'bg-emerald-50', 
        borderClass: 'border-emerald-100' 
    },
    { 
        level: 8, 
        name: 'Abogado de la República', 
        icon: 'history_edu', 
        colorClass: 'bg-primary', 
        textColorClass: 'text-primary', 
        bgClass: 'bg-primary/5', 
        borderClass: 'border-primary/20' 
    },
    { 
        level: 10, 
        name: 'Juez de Letras', 
        icon: 'balance', 
        colorClass: 'bg-primary', 
        textColorClass: 'text-primary', 
        bgClass: 'bg-primary/5', 
        borderClass: 'border-primary/20' 
    },
    { 
        level: 13, 
        name: 'Magistrado de Corte', 
        icon: 'gavel', 
        colorClass: 'bg-indigo-600', 
        textColorClass: 'text-indigo-600', 
        bgClass: 'bg-indigo-50', 
        borderClass: 'border-indigo-100' 
    },
    { 
        level: 16, 
        name: 'Ministro de la Corte Suprema', 
        icon: 'account_balance', 
        colorClass: 'bg-indigo-600', 
        textColorClass: 'text-indigo-600', 
        bgClass: 'bg-indigo-50', 
        borderClass: 'border-indigo-100' 
    }
];

/**
 * Calculates the user rank based on their current level
 * @param level The current level of the user
 * @returns The matching RankInfo object
 */
export const getUserRank = (level: number): RankInfo => {
    const rank = [...JUDICIAL_CAREER].reverse().find(r => level >= r.level);
    return rank || JUDICIAL_CAREER[0];
};
