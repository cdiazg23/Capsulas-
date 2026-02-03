import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('iuris-theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newValue = !prev;
            const root = window.document.documentElement;

            if (newValue) {
                root.classList.add('dark');
                localStorage.setItem('iuris-theme', 'dark');
            } else {
                root.classList.remove('dark');
                localStorage.setItem('iuris-theme', 'light');
            }

            return newValue;
        });
    };

    const setDarkMode = (value: boolean) => {
        setIsDarkMode(value);
        const root = window.document.documentElement;

        if (value) {
            root.classList.add('dark');
            localStorage.setItem('iuris-theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('iuris-theme', 'light');
        }
    };

    // Apply theme on mount
    React.useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
