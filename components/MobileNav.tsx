import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileNavProps {
    onMenuClick: () => void;
    userRank?: { name: string; color: string; icon: string };
    isFreeUser?: boolean;
    consultationsToday?: number;
}

const MobileNav: React.FC<MobileNavProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Inicio', icon: 'dashboard', path: '/app/dashboard' },
        { name: 'Materias', icon: 'menu_book', path: '/app/explorer' },
        { name: 'Biblioteca', icon: 'library_books', path: '/app/library' },
        { name: 'Flashcards', icon: 'style', path: '/app/flashcards' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-[#e7ebf3] dark:border-slate-800 px-6 py-2 pb-safe-area shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between">
            {navItems.map((item) => (
                <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors ${isActive(item.path) ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
                        }`}
                >
                    <span className={`material-symbols-outlined text-[24px] ${isActive(item.path) ? 'fill-1' : ''}`}>
                        {item.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                        {item.name}
                    </span>
                </button>
            ))}

            <button
                onClick={onMenuClick}
                className="flex flex-col items-center gap-1 min-w-[64px] text-slate-400 dark:text-slate-500"
            >
                <div className="relative">
                    <span className="material-symbols-outlined text-[24px]">category</span>
                    <span className="absolute -top-1 -right-1 size-2 bg-primary rounded-full animate-pulse border-2 border-white dark:border-slate-900"></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                    Derecho
                </span>
            </button>
        </nav>
    );
};

export default MobileNav;
