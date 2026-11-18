import React from 'react';
import {
  DollarSign,
  Landmark,
  TrendingUp,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  BadgePercent,
  Lock,
  ArrowLeftRight,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

interface DashboardOverviewProps {
  onNavigate: (section: 'dashboard' | 'partners' | 'projects' | 'treasury' | 'operations' | 'approvals' | 'ledger') => void;
}

interface RbacTestResult {
  endpoint: string;
  status: number;
  ok: boolean;
  message: string;
  testedAt: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const [testingEndpoint, setTestingEndpoint] = React.useState<string | null>(null);
  const [testResult, setTestResult] = React.useState<RbacTestResult | null>(null);

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
    <div className="space-y-6">
      {/* Banner Superior Corporativo */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial-pattern pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Ejercicio Fiscal 2026 — Sociedad Anónima Promotora de Inversión</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tablero de Control Financiero y Gobernanza
          </h2>
          <p className="text-sm text-slate-200 mt-2 leading-relaxed">
            Monitoreo en tiempo real de capital social suscrito, fondos fiduciarios, proyectos de remates y autorizaciones mancomunadas de Grupo Prisma S.A.P.I. de C.V.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-300 font-medium mr-1 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Usuario Activo:
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/15 border border-white/20 text-white">
              {user?.fullName} ({user?.roles.join(', ')})
            </span>
          </div>
        </div>
      </div>

      {/* 4 KPIs Clave del MVP Escolar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Capital Social */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capital de Socios</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">$10,000,000.00</span>
            <span className="text-xs text-slate-500 block font-medium mt-0.5">MXN suscrito y exhibido</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center">
              <BadgePercent className="w-3.5 h-3.5 mr-1" /> 10 Socios Fundadores
            </span>
            <span className="text-slate-400">10.00% c/u</span>
          </div>
        </div>

        {/* KPI 2: Saldo en Tesorería */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo en Cuentas</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-600">$1,765,000.00</span>
            <span className="text-xs text-slate-500 block font-medium mt-0.5">Tesorería consolidada</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">4 Cuentas bancarias</span>
            <button
              onClick={() => onNavigate('treasury')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
            >
              Ver detalle <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* KPI 3: Proyectos de Inversión */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proyectos Activos</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">2 Proyectos</span>
            <span className="text-xs text-slate-500 block font-medium mt-0.5">$1,200,000.00 asignados</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-purple-600 font-semibold">1 Vehicular / 1 Inmueble</span>
            <button
              onClick={() => onNavigate('projects')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
            >
              Inspeccionar <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* KPI 4: Flujo y Aprobaciones */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bandeja 2-Man</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-600">1 Pendiente</span>
            <span className="text-xs text-slate-500 block font-medium mt-0.5">$48,000.00 en espera de 2da firma</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-semibold flex items-center">
              <Clock className="w-3 h-3 mr-1" /> Requiere Aprobación
            </span>
            <button
              onClick={() => onNavigate('approvals')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
            >
              Revisar <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Distribución de Fondos y Proyectos Activos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desglose de Cuentas */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Landmark className="w-4 h-4 mr-2 text-indigo-600" />
              Distribución de Fondos en Tesorería
            </h3>
            <span className="text-xs font-bold text-slate-500">100% Líquido</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 font-semibold">Fondo Inversión Fiduciario (Banregio)</span>
                <span className="text-slate-900 font-bold">$1,000,000.00 (56.7%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '56.7%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 font-semibold">Banorte Concentradora (Cta. 7821)</span>
                <span className="text-slate-900 font-bold">$500,000.00 (28.3%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '28.3%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 font-semibold">BBVA Operativa (Cta. 4490)</span>
                <span className="text-slate-900 font-bold">$250,000.00 (14.2%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '14.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 font-semibold">Caja Chica Corporativa</span>
                <span className="text-slate-900 font-bold">$15,000.00 (0.8%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '0.8%' }} />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Total Tesorería: <strong>$1,765,000.00 MXN</strong></span>
            <button
              onClick={() => onNavigate('treasury')}
              className="text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Gestionar Tesorería →
            </button>
          </div>
        </div>

        {/* Resumen de Proyectos de Inversión */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Building className="w-4 h-4 mr-2 text-purple-600" />
              Proyectos de Inversión en Curso
            </h3>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800"
            >
              Ver Cartera Completa →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Proyecto 1 */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-700">
                    PRJ-AUTO-2026-01
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">
                    Remate Lote 12 Vehículos Utilitarios
                  </h4>
                  <span className="text-[11px] text-slate-500">Subasta SAT Monterrey</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  EJECUCIÓN
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Presupuesto Aprobado:</span>
                  <span className="font-bold text-slate-900">$350,000.00 MXN</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Capital Ejercido:</span>
                  <span className="font-bold text-slate-900">$157,500.00 (45%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Resp: Ing. Javier Zúñiga</span>
                  <span className="font-semibold text-emerald-600">ROI Est: 22.5%</span>
                </div>
              </div>
            </div>

            {/* Proyecto 2 */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-700">
                    PRJ-INM-2026-01
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">
                    Adquisición y Remodelación Valle Oriente
                  </h4>
                  <span className="text-[11px] text-slate-500">Inmueble Comercial San Pedro</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  INICIO
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Presupuesto Aprobado:</span>
                  <span className="font-bold text-slate-900">$850,000.00 MXN</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Capital Ejercido:</span>
                  <span className="font-bold text-slate-900">$127,500.00 (15%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '15%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Resp: Arq. Mariana Treviño</span>
                  <span className="font-semibold text-blue-600">ROI Est: 18.0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad Financiera Reciente y Reglas de Negocio Demostradas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <ArrowLeftRight className="w-4 h-4 mr-2 text-blue-600" />
              Operaciones Financieras Recientes del MVP
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Demostración de reversiones parciales 1:N, estados de autorización y flujo monetario inmutable.
            </p>
          </div>
          <button
            onClick={() => onNavigate('operations')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Ver Todas las Operaciones →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Concepto / Proyecto</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Cuenta</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4 text-center">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-blue-700">OP-2026-0001</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">Anticipo adquisición lote automotriz subasta SAT</div>
                  <div className="text-[11px] text-slate-400">PRJ-AUTO-2026-01 | Reversión parcial 1:N activa</div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    EGRESO
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 font-mono">BBVA Operativa (****4490)</td>
                <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">$125,000.00</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> EJECUTADA
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/70 transition-colors bg-blue-50/20">
                <td className="py-3 px-4 font-mono font-bold text-indigo-700">OP-2026-0002</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">Devolución excedente avalúo lote vehicular</div>
                  <div className="text-[11px] text-indigo-600 font-medium">Reversión parcial 1:N vinculada a OP-2026-0001</div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    REVERSIÓN 1:N
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 font-mono">Banorte Concentradora (****7821)</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700 font-mono">+$15,000.00</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> EJECUTADA
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-blue-700">OP-2026-0003</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">Anticipo licencias remodelación comercial</div>
                  <div className="text-[11px] text-slate-400">PRJ-INM-2026-01 | Firma 1 completada, esperando Firma 2</div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    EGRESO
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 font-mono">BBVA Operativa (****4490)</td>
                <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">$48,000.00</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    <Clock className="w-3 h-3 mr-1 text-amber-600" /> PENDIENTE 2DA FIRMA
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-blue-700">OP-2026-0004</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">Suministro mobiliario oficina sin 3 cotizaciones</div>
                  <div className="text-[11px] text-rose-500 font-medium">Rechazada por incumplimiento de política de compras</div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    EGRESO
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 font-mono">Caja Chica Corporativa</td>
                <td className="py-3 px-4 text-right font-bold text-slate-400 line-through font-mono">$8,500.00</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    <AlertCircle className="w-3 h-3 mr-1 text-rose-600" /> RECHAZADA
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Módulo de Demostración y Prueba en Vivo de Seguridad y RBAC (Integrado con backend NestJS) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
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
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Solo SUPER_ADMIN
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-100 text-purple-700 font-bold">
                  GET /check-admin
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Gobernanza corporativa y control del padrón de socios.
              </p>
            </div>
            <button
              onClick={() => handleTestRbac('check-admin')}
              disabled={!!testingEndpoint}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 text-indigo-700 font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm disabled:opacity-50"
            >
              {testingEndpoint === 'check-admin' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <span>Probar Autorización</span>
            </button>
          </div>

          {/* Prueba 2: Endpoint TREASURER */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Solo TREASURER
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-700 font-bold">
                  GET /check-treasurer
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Dispersión de fondos, tesorería y reversiones 1:N.
              </p>
            </div>
            <button
              onClick={() => handleTestRbac('check-treasurer')}
              disabled={!!testingEndpoint}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50 text-emerald-700 font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm disabled:opacity-50"
            >
              {testingEndpoint === 'check-treasurer' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>Probar Autorización</span>
            </button>
          </div>

          {/* Prueba 3: Endpoint FINANCE_APPROVER */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Solo APPROVER
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-700 font-bold">
                  GET /check-approver
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Firma 2 mancomunada para operaciones &gt; $20,000 MXN.
              </p>
            </div>
            <button
              onClick={() => handleTestRbac('check-approver')}
              disabled={!!testingEndpoint}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 text-amber-700 font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm disabled:opacity-50"
            >
              {testingEndpoint === 'check-approver' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>Probar Autorización</span>
            </button>
          </div>
        </div>

        {/* Panel de Resultado de la Prueba RBAC */}
        {testResult && (
          <div
            className={`mt-4 p-4 rounded-xl border transition-all ${
              testResult.ok
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {testResult.ok ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-xs uppercase tracking-wide">
                    {testResult.ok
                      ? `HTTP ${testResult.status} — AUTORIZADO (RBAC OK)`
                      : `HTTP ${testResult.status} — DENEGADO (FORBIDDEN)`}
                  </span>
                  <p className="text-xs mt-0.5 font-medium">{testResult.message}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {testResult.testedAt}
              </span>
            </div>
            <div className="mt-2 text-[11px] font-mono opacity-80 border-t border-slate-200/60 pt-1.5">
              Endpoint evaluado: <span className="font-bold">{testResult.endpoint}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
