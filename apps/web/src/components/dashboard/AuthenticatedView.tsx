import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import {
  Layers,
  LogOut,
  ShieldCheck,
  UserCheck,
  Building,
  Key,
  BadgePercent,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  ArrowRight,
  Database,
  FileCheck,
} from 'lucide-react';

interface RbacTestResult {
  endpoint: string;
  status: number;
  ok: boolean;
  message: string;
  testedAt: string;
}

export const AuthenticatedView: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<RbacTestResult | null>(null);

  const handleTestRbac = async (
    endpoint: 'check-admin' | 'check-treasurer' | 'check-approver',
  ) => {
    if (!token) return;
    setTestingEndpoint(endpoint);

    const result = await authService.checkRbacEndpoint(endpoint, token);
    setTestResult({
      endpoint: `/api/v1/auth/${endpoint}`,
      status: result.status,
      ok: result.ok,
      message: result.data.message || (result.ok ? 'Acceso autorizado' : 'Acceso denegado por RBAC'),
      testedAt: new Date().toLocaleTimeString(),
    });
    setTestingEndpoint(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Navbar Superior Corporativo */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight block text-base leading-tight">
                Grupo Prisma S.A.P.I. de C.V.
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Prisma Business Dashboard
              </span>
            </div>
          </div>

          {/* Menú de Usuario y Salida */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                {user?.fullName}
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                {user?.email}
              </span>
            </div>

            <button
              onClick={() => logout()}
              className="inline-flex items-center px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold transition-all shadow-sm group"
              title="Cerrar Sesión Activa"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner de Bienvenida y Estado del Socio */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sesión Autenticada con JWT Stateless</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bienvenido, {user?.fullName}
            </h2>
            <p className="text-sm text-slate-200 mt-1 max-w-2xl">
              Sistema de administración integral para la gobernanza corporativa, tesorería transaccional con regla 2-Man y seguimiento de proyectos de inversión.
            </p>

            {/* Badges de Roles Asignados */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-300 font-medium mr-1 flex items-center">
                <Key className="w-3.5 h-3.5 mr-1 text-slate-400" /> Roles:
              </span>
              {user?.roles.map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-500/30 border border-blue-400/40 text-blue-200 font-mono"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tarjetas de Información del Expediente de Socio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Expediente de Socio
              </span>
              <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                {user?.partner?.legalName || user?.fullName}
              </span>
              <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                RFC: {user?.partner?.rfc || 'No registrado'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <BadgePercent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Participación Paritaria
              </span>
              <span className="text-lg font-extrabold text-emerald-600 block mt-0.5">
                {user?.partner?.equityPercentage || '10.00%'}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                {user?.partner?.sharesBasisPoints || 1000} puntos base de acuerdo inicial
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Estatus Operativo
              </span>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-bold text-slate-900">
                  {user?.partner?.status || 'ACTIVO'}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Cuenta de usuario activa y verificada
              </span>
            </div>
          </div>
        </div>

        {/* Módulo de Demostración y Prueba en Vivo de Seguridad y RBAC */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Verificación en Vivo de Mecanismos de Seguridad y RBAC
              </h3>
              <p className="text-xs text-slate-500">
                Comprueba que los Guards de NestJS (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">JwtAuthGuard</code> y <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">RolesGuard</code>) protegen los recursos en tiempo real contra accesos no autorizados.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {/* Prueba 1: Endpoint SUPER_ADMIN */}
            <button
              onClick={() => handleTestRbac('check-admin')}
              disabled={!!testingEndpoint}
              className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-left transition-all flex flex-col justify-between group disabled:opacity-50"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">
                  Probar Ruta SUPER_ADMIN
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-1">
                  GET /api/v1/auth/check-admin
                </span>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Requiere rol <strong>SUPER_ADMIN</strong>.
                </span>
              </div>
              <div className="mt-3 text-xs font-semibold text-purple-700 flex items-center">
                <span>Enviar Petición</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Prueba 2: Endpoint TREASURER */}
            <button
              onClick={() => handleTestRbac('check-treasurer')}
              disabled={!!testingEndpoint}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all flex flex-col justify-between group disabled:opacity-50"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
                  Probar Ruta TREASURER
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-1">
                  GET /api/v1/auth/check-treasurer
                </span>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Requiere rol <strong>TREASURER</strong>.
                </span>
              </div>
              <div className="mt-3 text-xs font-semibold text-emerald-700 flex items-center">
                <span>Enviar Petición</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Prueba 3: Endpoint FINANCE_APPROVER */}
            <button
              onClick={() => handleTestRbac('check-approver')}
              disabled={!!testingEndpoint}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all flex flex-col justify-between group disabled:opacity-50"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-700">
                  Probar Ruta FINANCE_APPROVER
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-1">
                  GET /api/v1/auth/check-approver
                </span>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Requiere rol <strong>FINANCE_APPROVER</strong>.
                </span>
              </div>
              <div className="mt-3 text-xs font-semibold text-blue-700 flex items-center">
                <span>Enviar Petición</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>

          {/* Resultado de la Prueba en Vivo */}
          {testResult && (
            <div
              className={`mt-5 p-4 rounded-xl border flex items-start space-x-3 animate-fadeIn ${
                testResult.ok
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">
                    {testResult.endpoint} &bull; HTTP {testResult.status}{' '}
                    {testResult.ok ? 'OK (Autorizado)' : 'FORBIDDEN (Bloqueado)'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{testResult.testedAt}</span>
                </div>
                <p className="text-xs mt-1 font-medium">{testResult.message}</p>
              </div>
            </div>
          )}

          {testingEndpoint && (
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Verificando autorización con el servidor NestJS...</span>
            </div>
          )}
        </div>

        {/* Resumen del Monorepo y Persistencia Activa */}
        <div className="bg-slate-100/60 rounded-2xl p-5 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-slate-400" />
            <span>
              Persistencia: <strong>SQLite (dev.db)</strong> gobernada por <strong>Prisma ORM</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            <span>Fase 1: Interfaz de Autenticación lista para evidencias</span>
          </div>
        </div>
      </main>
    </div>
  );
};
