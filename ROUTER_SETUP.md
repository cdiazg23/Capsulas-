# Configuración de React Router

## Instalación

Debido a los permisos de PowerShell, debes ejecutar este comando manualmente:

```powershell
# Primero, habilita la ejecución de scripts (ejecuta como Administrador)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Luego instala React Router
npm install react-router-dom
```

## Configuración Recomendada

### 1. Crear Router Configuration

Crea `src/router.tsx`:

```typescript
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import ConceptDetail from './pages/ConceptDetail';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import LandingPage from './pages/LandingPage';
import Library from './pages/Library';
import Pricing from './pages/Pricing';
import Flashcards from './pages/Flashcards';
import CommunitySpace from './pages/CommunitySpace';
import { ProtectedRoute } from './components/ProtectedRoute';

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
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: '/explorer',
    element: <ProtectedRoute><Explorer /></ProtectedRoute>
  },
  {
    path: '/explorer/:category',
    element: <ProtectedRoute><Explorer /></ProtectedRoute>
  },
  {
    path: '/explorer/:category/:subcategory',
    element: <ProtectedRoute><Explorer /></ProtectedRoute>
  },
  {
    path: '/concept/:id',
    element: <ProtectedRoute><ConceptDetail /></ProtectedRoute>
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: '/library',
    element: <ProtectedRoute><Library /></ProtectedRoute>
  },
  {
    path: '/flashcards',
    element: <ProtectedRoute role="founder"><Flashcards /></ProtectedRoute>
  },
  {
    path: '/community',
    element: <ProtectedRoute role="founder"><CommunitySpace /></ProtectedRoute>
  },
  {
    path: '/admin',
    element: <ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>
  }
]);
```

### 2. Crear ProtectedRoute Component

Crea `components/ProtectedRoute.tsx`:

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import LoadingState from './LoadingState';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
```

### 3. Actualizar index.tsx

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider, StatsProvider, ThemeProvider, ConceptsProvider } from './contexts';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <StatsProvider>
            <ConceptsProvider>
              <RouterProvider router={router} />
            </ConceptsProvider>
          </StatsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
```

### 4. Actualizar Header Component

Reemplaza las funciones `onClick` con navegación de React Router:

```typescript
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/dashboard')}>
      Dashboard
    </button>
  );
};
```

## Beneficios de React Router

✅ URLs limpias y semánticas  
✅ Navegación con botones adelante/atrás del navegador  
✅ Lazy loading automático de páginas  
✅ Protección de rutas mejorada  
✅ Parámetros de URL tipados  
✅ Mejor SEO

## Migración Gradual

Puedes migrar gradualmente sin romper el código existente:

1. Instala react-router-dom
2. Crea la configuración del router
3. Actualiza index.tsx con providers
4. Reemplaza navigateTo() por navigate() gradualmente
5. Elimina el estado ViewType cuando todo esté migrado
