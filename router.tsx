import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import ConceptDetail from './pages/ConceptDetail';
import Profile from './pages/Profile';
import Library from './pages/Library';
import Pricing from './pages/Pricing';
import Flashcards from './pages/Flashcards';
import CommunitySpace from './pages/CommunitySpace';
import MasterClasses from './pages/MasterClasses';
import AdminPanel from './pages/AdminPanel';
import Contact from './pages/Contact';
import RevisedJurisprudence from './pages/RevisedJurisprudence';
import Terms from './pages/Terms';
import Billing from './pages/Billing';
import PaymentStatus from './pages/PaymentStatus';
import DigitalBrain from './pages/DigitalBrain';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/login',
        element: <Auth />
    },
    {
        path: '/pricing',
        element: <Pricing />
    },
    {
        path: '/terms',
        element: <Terms />
    },
    {
        path: '/payment-status',
        element: <PaymentStatus />
    },

    {
        path: '/app',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/app/dashboard" replace />
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'explorer',
                element: <Explorer />
            },
            {
                path: 'explorer/:category',
                element: <Explorer />
            },
            {
                path: 'explorer/:category/:subcategory',
                element: <Explorer />
            },
            {
                path: 'concept/:id',
                element: <ConceptDetail />
            },
            {
                path: 'profile',
                element: <Profile />
            },
            {
                path: 'library',
                element: <Library />
            },
            {
                path: 'flashcards',
                element: <Flashcards />
            },
            {
                path: 'masterclasses',
                element: <MasterClasses />
            },
            {
                path: 'contact',
                element: <Contact />
            },
            {
                path: 'billing',
                element: <Billing />
            },
            {
                path: 'community',
                element: <CommunitySpace />
            },
            {
                path: 'revised-jurisprudence',
                element: <RevisedJurisprudence />
            },

            {
                path: 'admin',
                element: (
                    <ProtectedRoute role="admin">
                        <AdminPanel />
                    </ProtectedRoute>
                )
            },
            {
                path: 'digital-brain',
                element: (
                    <ProtectedRoute role="admin">
                        <DigitalBrain />
                    </ProtectedRoute>
                )
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
]);
