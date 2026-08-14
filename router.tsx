import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingState from './components/LoadingState';

// Lazy Loaded Pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Explorer = React.lazy(() => import('./pages/Explorer'));
const ConceptDetail = React.lazy(() => import('./pages/ConceptDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Library = React.lazy(() => import('./pages/Library'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Flashcards = React.lazy(() => import('./pages/Flashcards'));
const CommunitySpace = React.lazy(() => import('./pages/CommunitySpace'));
const MasterClasses = React.lazy(() => import('./pages/MasterClasses'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const Contact = React.lazy(() => import('./pages/Contact'));
const RevisedJurisprudence = React.lazy(() => import('./pages/RevisedJurisprudence'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Billing = React.lazy(() => import('./pages/Billing'));
const PaymentStatus = React.lazy(() => import('./pages/PaymentStatus'));
const DigitalBrain = React.lazy(() => import('./pages/DigitalBrain'));

const withSuspense = (Component: React.ComponentType, fullScreen = false) => (
    <Suspense fallback={<LoadingState fullScreen={fullScreen} />}>
        <Component />
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: withSuspense(LandingPage, true)
    },
    {
        path: '/login',
        element: withSuspense(Auth, true)
    },
    {
        path: '/pricing',
        element: withSuspense(Pricing, true)
    },
    {
        path: '/terms',
        element: withSuspense(Terms, true)
    },
    {
        path: '/payment-status',
        element: withSuspense(PaymentStatus, true)
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
                element: withSuspense(Dashboard)
            },
            {
                path: 'explorer',
                element: withSuspense(Explorer)
            },
            {
                path: 'explorer/:category',
                element: withSuspense(Explorer)
            },
            {
                path: 'explorer/:category/:subcategory',
                element: withSuspense(Explorer)
            },
            {
                path: 'concept/:id',
                element: withSuspense(ConceptDetail)
            },
            {
                path: 'profile',
                element: withSuspense(Profile)
            },
            {
                path: 'library',
                element: withSuspense(Library)
            },
            {
                path: 'flashcards',
                element: withSuspense(Flashcards)
            },
            {
                path: 'masterclasses',
                element: withSuspense(MasterClasses)
            },
            {
                path: 'contact',
                element: withSuspense(Contact)
            },
            {
                path: 'billing',
                element: withSuspense(Billing)
            },
            {
                path: 'community',
                element: withSuspense(CommunitySpace)
            },
            {
                path: 'revised-jurisprudence',
                element: withSuspense(RevisedJurisprudence)
            },
            {
                path: 'admin',
                element: (
                    <ProtectedRoute role="admin">
                        {withSuspense(AdminPanel)}
                    </ProtectedRoute>
                )
            },
            {
                path: 'digital-brain',
                element: (
                    <ProtectedRoute role="admin">
                        {withSuspense(DigitalBrain)}
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
