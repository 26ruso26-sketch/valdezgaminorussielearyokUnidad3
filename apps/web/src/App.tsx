import React from 'react';
import { Layers, Shield, Database, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Prisma Business Dashboard
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Grupo Prisma S.A.P.I. de C.V. &bull; Fase 1
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6 flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-sm font-semibold text-emerald-900">
              Monorepo y Entorno Inicializados
            </h2>
            <p className="text-xs text-emerald-700 mt-0.5">
              npm workspaces, NestJS backend, Vite + React frontend, Tailwind CSS y Prisma ORM con SQLite configurados exitosamente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center space-x-3">
            <Shield className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-700 block">Arquitectura Monorepo</span>
              <span>apps/api (NestJS) + apps/web (React)</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center space-x-3">
            <Database className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-700 block">Persistencia Local</span>
              <span>Prisma ORM con SQLite en apps/api/prisma</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          En espera de la Fase 2: Modelo de Datos y Migraciones SQLite
        </div>
      </div>
    </div>
  );
};

export default App;

