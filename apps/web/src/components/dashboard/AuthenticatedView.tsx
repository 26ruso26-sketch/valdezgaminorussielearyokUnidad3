import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  LogOut,
  LayoutDashboard,
  Users,
  TrendingUp,
  Landmark,
  ArrowLeftRight,
  FileCheck,
  ScrollText,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

import { DashboardOverview } from './DashboardOverview';
import { PartnersSection } from './PartnersSection';
import { ProjectsSection } from './ProjectsSection';
import { TreasurySection } from './TreasurySection';
import { OperationsSection } from './OperationsSection';
import { ApprovalsSection } from './ApprovalsSection';
import { LedgerSection } from './LedgerSection';

export type SectionType =
  | 'dashboard'
  | 'partners'
  | 'projects'
  | 'treasury'
  | 'operations'
  | 'approvals'
  | 'ledger';

interface NavItem {
  id: SectionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'partners', label: 'Socios', icon: Users },
  { id: 'projects', label: 'Proyectos de inversión', icon: TrendingUp },
  { id: 'treasury', label: 'Tesorería', icon: Landmark },
  { id: 'operations', label: 'Operaciones financieras', icon: ArrowLeftRight },
  { id: 'approvals', label: 'Autorizaciones', icon: FileCheck, badge: '1' },
  { id: 'ledger', label: 'Movimientos y auditoría', icon: ScrollText },
];

export const AuthenticatedView: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectSection = (section: SectionType) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar Corporativo */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo y Botón Mobile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              title="Alternar Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight block text-base leading-tight">
                Grupo Prisma S.A.P.I. de C.V.
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Saber Hacer — Unidad 3 (Sistemas Web)
              </span>
            </div>
          </div>

          {/* Menú de Usuario y Salida */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                {user?.fullName}
              </span>
              <div className="flex items-center justify-end space-x-1 mt-0.5">
                <span className="text-[10px] text-indigo-600 font-mono font-bold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                  {user?.roles[0] || 'USER'}
                </span>
              </div>
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

      {/* Layout de 2 Columnas (Sidebar + Main Content) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sticky top-24 space-y-4">
            <div className="px-3 py-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Navegación del MVP
              </span>
              <span className="text-xs font-extrabold text-slate-800 block mt-0.5">
                Módulos Funcionales
              </span>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSection(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <IconComponent
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'
                          }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-black font-mono ${isActive
                            ? 'bg-white text-indigo-700'
                            : 'bg-amber-100 text-amber-800'
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Expediente del Usuario Activo */}
            <div className="pt-4 border-t border-slate-100 px-3">
              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">JWT Stateless Activo</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                {user?.email}
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar Mobile (Drawer Modal) */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex">
            <div className="w-72 bg-white h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-left">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-slate-900">Grupo Prisma</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSection(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <IconComponent
                            className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'
                              }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black font-mono ${isActive
                                ? 'bg-white text-indigo-700'
                                : 'bg-amber-100 text-amber-800'
                              }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => logout()}
                  className="w-full py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center space-x-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenido Principal Dinámico */}
        <main className="flex-1 min-w-0">
          {activeSection === 'dashboard' && (
            <DashboardOverview onNavigate={(sec) => setActiveSection(sec)} />
          )}
          {activeSection === 'partners' && <PartnersSection />}
          {activeSection === 'projects' && <ProjectsSection />}
          {activeSection === 'treasury' && <TreasurySection />}
          {activeSection === 'operations' && <OperationsSection />}
          {activeSection === 'approvals' && <ApprovalsSection />}
          {activeSection === 'ledger' && <LedgerSection />}
        </main>
      </div>
    </div>
  );
};
