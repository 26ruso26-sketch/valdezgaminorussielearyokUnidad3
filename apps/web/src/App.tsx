import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { AuthenticatedView } from './components/dashboard/AuthenticatedView';
import { Loader2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <span className="text-sm font-semibold text-slate-300">
          Cargando entorno seguro de Grupo Prisma...
        </span>
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedView /> : <LoginPage />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default App;
