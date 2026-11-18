import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CheckCircle,
  Users,
} from 'lucide-react';

interface DemoAccount {
  label: string;
  email: string;
  roleDescription: string;
  badgeColor: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Director / Super Admin',
    email: 'director@grupoprisma.com.mx',
    roleDescription: 'SUPER_ADMIN • Acceso Total y Gobernanza',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    label: 'Tesorero',
    email: 'tesorero@grupoprisma.com.mx',
    roleDescription: 'TREASURER • Movimientos y Cuentas',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    label: 'Autorizador Financiero',
    email: 'autorizador1@grupoprisma.com.mx',
    roleDescription: 'FINANCE_APPROVER • Doble Firma',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    label: 'Gestor Proyectos Auto',
    email: 'proyectos.auto@grupoprisma.com.mx',
    roleDescription: 'PROJECT_MANAGER • Remates Vehiculares',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    label: 'Socio Fundador',
    email: 'socio7@grupoprisma.com.mx',
    roleDescription: 'PARTNER • Participación Paritaria 10%',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
  },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor ingrese correo electrónico y contraseña.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Prisma2026!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Cabecera Corporativa */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30 text-white mb-4">
            <Layers className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Grupo Prisma S.A.P.I. de C.V.
          </h1>
          <p className="text-sm font-medium text-slate-300 mt-1">
            Prisma Business Dashboard &bull; Saber Hacer Unidad 3
          </p>
        </div>

        {/* Tarjeta de Formulario */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Iniciar Sesión</h2>
              <p className="text-xs text-slate-500">Ingrese sus credenciales corporativas</p>
            </div>
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              JWT + bcrypt
            </span>
          </div>

          {/* Banner de Error */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Correo Electrónico */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@grupoprisma.com.mx"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder-slate-400"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder-slate-400"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-60 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <span>Ingresar al Sistema</span>
              )}
            </button>
          </form>

          {/* Accesos Rápidos de Prueba (Seed) */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 flex items-center">
                <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Cuentas Demo del Seed (Clic para autocompletar)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Pass: Prisma2026!</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectDemo(acc.email)}
                  className="w-full text-left p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors flex items-center justify-between group"
                >
                  <div className="truncate">
                    <span className="text-xs font-semibold text-slate-800 block truncate group-hover:text-blue-700">
                      {acc.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate font-mono">
                      {acc.email}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ml-2 ${acc.badgeColor}`}
                  >
                    {acc.label.split('/')[0].trim()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pie de página con certificación de seguridad */}
        <div className="mt-5 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Autenticación protegida con hash bcrypt y token JWT en memoria</span>
        </div>
      </div>
    </div>
  );
};
