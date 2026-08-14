import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import IurisBot from '../components/IurisBot';
import { useAuth, useStats, useConcepts } from '../contexts';


/**
 * Main layout wrapper for authenticated pages
 */
const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();
    const { stats } = useStats();
    const { concepts } = useConcepts();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
            <Header />

            <div className="flex flex-1 relative">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    stats={stats}
                    user={user}
                />
                <main className="flex-1 p-4 md:p-6 min-w-0 overflow-hidden pb-24 md:pb-6">
                    <Outlet />
                </main>
            </div>

            <IurisBot 
                concepts={concepts || []} 
                onSelectConcept={(concept) => navigate(`/app/concept/${concept.id}`)} 
            />

            <MobileNav onMenuClick={() => setIsSidebarOpen(true)} />
        </div>
    );
};

export default MainLayout;
