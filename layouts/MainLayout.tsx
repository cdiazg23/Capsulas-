import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MarchaBlancaModal from '../components/MarchaBlancaModal';

/**
 * Main layout wrapper for authenticated pages
 */
const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <MarchaBlancaModal />
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 min-w-0 overflow-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
