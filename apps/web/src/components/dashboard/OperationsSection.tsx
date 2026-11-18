import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Plus,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  RefreshCw,
} from 'lucide-react';

interface OperationData {
  id: string;
  code: string;
  type: 'EGRESO' | 'INGRESO' | 'REVERSION_PARCIAL' | 'APORTACION';
  concept: string;
  amount: string;
  amountNum: number;
  account: string;
  project?: string;
  status: 'EJECUTADA' | 'PENDIENTE_APROBACION' | 'RECHAZADA';
  date: string;
  creator: string;
  approver?: string;
  reversalOfCode?: string;
  hasReversals?: boolean;
  reversalsCount?: number;
  totalReversed?: string;
}

const INITIAL_OPERATIONS: OperationData[] = [
  {
    id: 'OP-001',
    code: 'OP-2026-0001',
    type: 'EGRESO',
    concept: 'Anticipo adquisición lote automotriz subasta SAT',
    amount: '$125,000.00 MXN',
    amountNum: 125000,
    account: 'BBVA Operativa (****4490)',
    project: 'PRJ-AUTO-2026-01',
    status: 'EJECUTADA',
    date: '17/11/2026 10:30',
    creator: 'C.P. Russiele Gamiño (Tesorero)',
    approver: 'Dr. Fernando Ortiz (Aprobador)',
    hasReversals: true,
    reversalsCount: 1,
    totalReversed: '$15,000.00 MXN (12.0%)',
  },
  {
    id: 'OP-002',
    code: 'OP-2026-0002',
    type: 'REVERSION_PARCIAL',
    concept: 'Devolución excedente avalúo lote vehicular (Reversión 1:N)',
    amount: '$15,000.00 MXN',
    amountNum: 15000,
    account: 'Banorte Concentradora (****7821)',
    project: 'PRJ-AUTO-2026-01',
    status: 'EJECUTADA',
    date: '17/11/2026 11:15',
    creator: 'C.P. Russiele Gamiño (Tesorero)',
    reversalOfCode: 'OP-2026-0001',
  },
  {
    id: 'OP-003',
    code: 'OP-2026-0003',
    type: 'EGRESO',
    concept: 'Anticipo licencias remodelación comercial Valle Oriente',
    amount: '$48,000.00 MXN',
    amountNum: 48000,
    account: 'BBVA Operativa (****4490)',
    project: 'PRJ-INM-2026-01',
    status: 'PENDIENTE_APROBACION',
    date: '17/11/2026 12:00',
    creator: 'Arq. Mariana Treviño',
    approver: 'Firma 1 registrada / Esperando Firma 2',
  },
  {
    id: 'OP-004',
    code: 'OP-2026-0004',
    type: 'EGRESO',
    concept: 'Suministro mobiliario oficina sin 3 cotizaciones',
    amount: '$8,500.00 MXN',
    amountNum: 8500,
    account: 'Caja Chica Corporativa',
    status: 'RECHAZADA',
    date: '16/11/2026 16:45',
    creator: 'Asistente Operativo',
    approver: 'Rechazado: Incumple política de adquisiciones',
  },
  {
    id: 'OP-005',
    code: 'OP-2026-0005',
    type: 'INGRESO',
    concept: 'Rendimiento mensual Fideicomiso BANREGIO #9021',
    amount: '$14,250.00 MXN',
    amountNum: 14250,
    account: 'Fondo Inversión Fiduciario',
    status: 'EJECUTADA',
    date: '15/11/2026 09:00',
    creator: 'Sistema Fiduciario Automático',
    approver: 'Liquidado en estado de cuenta',
  },
  {
    id: 'OP-006',
    code: 'OP-2026-0006',
    type: 'APORTACION',
    concept: 'Aportación de capital exhibido socios fundadores (Lote 1)',
    amount: '$10,000,000.00 MXN',
    amountNum: 10000000,
    account: 'Banorte Concentradora (****7821)',
    status: 'EJECUTADA',
    date: '15/01/2026 12:00',
    creator: 'Lic. Roberto Valdez Morales',
    approver: 'Asamblea General Constitutiva',
  },
];

export const OperationsSection: React.FC = () => {
  const [operations, setOperations] = useState<OperationData[]>(INITIAL_OPERATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('TODOS');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [selectedOp, setSelectedOp] = useState<OperationData | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Op Form
  const [newConcept, setNewConcept] = useState('');
  const [newType, setNewType] = useState<'EGRESO' | 'INGRESO' | 'REVERSION_PARCIAL'>('EGRESO');
  const [newAmount, setNewAmount] = useState('');
  const [newAccount, setNewAccount] = useState('BBVA Operativa (****4490)');
  const [newProject, setNewProject] = useState('PRJ-AUTO-2026-01');

  const filteredOps = operations.filter((op) => {
    const matchesSearch =
      op.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'TODOS' || op.type === typeFilter;
    const matchesStatus = statusFilter === 'TODOS' || op.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateOperation = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(newAmount);
    if (!newConcept || !amountVal) return;

    const requiresTwoMan = amountVal >= 20000;
    const op: OperationData = {
      id: `OP-${String(operations.length + 1).padStart(3, '0')}`,
      code: `OP-2026-${String(operations.length + 1).padStart(4, '0')}`,
      type: newType,
      concept: newConcept,
      amount: `$${amountVal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`,
      amountNum: amountVal,
      account: newAccount,
      project: newProject,
      status: requiresTwoMan ? 'PENDIENTE_APROBACION' : 'EJECUTADA',
      date: new Date().toLocaleString(),
      creator: 'Usuario Autenticado',
      approver: requiresTwoMan
        ? 'Regla 2-Man: Requiere 2 firmas mancomunadas'
        : 'Aprobación directa (< $20k)',
    };

    setOperations([op, ...operations]);
    setShowNewModal(false);
    setNewConcept('');
    setNewAmount('');
    setToastMessage(
      `Operación ${op.code} registrada con estatus ${op.status}. ${
        requiresTwoMan ? '(Enviada a bandeja de aprobaciones)' : ''
      }`,
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-700 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
            <ArrowLeftRight className="w-5 h-5 mr-2 text-indigo-600" />
            Operaciones Financieras y Reversiones 1:N
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro transaccional de ingresos, egresos y reversiones parciales acumulables conforme al acuerdo de negocio.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Nueva Operación Financiera
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por concepto o código..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 font-medium">Tipo:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-700"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="EGRESO">Egresos</option>
              <option value="INGRESO">Ingresos</option>
              <option value="REVERSION_PARCIAL">Reversión 1:N</option>
              <option value="APORTACION">Aportaciones</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400 font-medium">Estatus:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-700"
            >
              <option value="TODOS">Todos los estatus</option>
              <option value="EJECUTADA">Ejecutada</option>
              <option value="PENDIENTE_APROBACION">Pendiente 2-Man</option>
              <option value="RECHAZADA">Rechazada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Operaciones */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Código / Fecha</th>
                <th className="py-3 px-4">Concepto / Vínculo 1:N</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Cuenta Aplicada</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4 text-center">Estatus</th>
                <th className="py-3 px-4 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOps.map((op) => (
                <tr key={op.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-blue-700 block">{op.code}</span>
                    <span className="text-[10px] text-slate-400 block">{op.date}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{op.concept}</div>
                    {op.hasReversals && (
                      <span className="inline-flex items-center text-[10px] font-bold text-indigo-600 mt-0.5">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Tiene reversión parcial 1:N ({op.totalReversed})
                      </span>
                    )}
                    {op.reversalOfCode && (
                      <span className="inline-flex items-center text-[10px] font-bold text-purple-600 mt-0.5">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Reversión vinculada a: {op.reversalOfCode}
                      </span>
                    )}
                    {op.project && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        Proyecto: {op.project}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {op.type === 'EGRESO' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        EGRESO
                      </span>
                    )}
                    {op.type === 'INGRESO' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        INGRESO
                      </span>
                    )}
                    {op.type === 'REVERSION_PARCIAL' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        REVERSIÓN 1:N
                      </span>
                    )}
                    {op.type === 'APORTACION' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        APORTACIÓN
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">{op.account}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {op.type === 'REVERSION_PARCIAL' ? `+${op.amount}` : op.amount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {op.status === 'EJECUTADA' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> EJECUTADA
                      </span>
                    )}
                    {op.status === 'PENDIENTE_APROBACION' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3 mr-1 text-amber-600" /> PENDIENTE 2-MAN
                      </span>
                    )}
                    {op.status === 'RECHAZADA' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        <AlertCircle className="w-3 h-3 mr-1 text-rose-600" /> RECHAZADA
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedOp(op)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 transition-all shadow-sm"
                      title="Ver Detalle y Reversiones"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalle de Operación y Regla 1:N */}
      {selectedOp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-300 uppercase">
                  {selectedOp.code} — {selectedOp.type}
                </span>
                <h3 className="text-base font-bold">{selectedOp.concept}</h3>
                <p className="text-xs text-slate-200 mt-0.5">{selectedOp.amount}</p>
              </div>
              <button
                onClick={() => setSelectedOp(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Estatus Transaccional
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {selectedOp.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Fecha y Hora
                  </span>
                  <span className="font-mono font-medium text-slate-800 text-sm mt-0.5 block">
                    {selectedOp.date}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cuenta Afectada:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedOp.account}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Creado Por:</span>
                  <span className="font-medium text-slate-800">{selectedOp.creator}</span>
                </div>
                {selectedOp.approver && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Autorización:</span>
                    <span className="text-slate-800">{selectedOp.approver}</span>
                  </div>
                )}
                {selectedOp.project && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Proyecto Asignado:</span>
                    <span className="font-mono text-purple-700">{selectedOp.project}</span>
                  </div>
                )}
              </div>

              {/* Demostración de Reversiones 1:N */}
              {selectedOp.hasReversals && (
                <div className="border border-indigo-200 bg-indigo-50/60 p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-indigo-900 font-bold">
                    <RefreshCw className="w-4 h-4 text-indigo-600" />
                    <span>Demostración de Reversiones Parciales Acumulables (1:N)</span>
                  </div>
                  <p className="text-[11px] text-indigo-800">
                    Esta operación cuenta con reversión parcial registrada, conservando el historial inmutable y recalculando el neto ejercido:
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-indigo-100 text-[11px] space-y-1">
                    <div className="flex justify-between font-mono">
                      <span>Monto Original de Egreso:</span>
                      <span className="font-bold text-slate-900">$125,000.00 MXN</span>
                    </div>
                    <div className="flex justify-between font-mono text-indigo-700">
                      <span>Reversión Parcial 1 (OP-2026-0002):</span>
                      <span className="font-bold">-$15,000.00 MXN</span>
                    </div>
                    <div className="pt-1 border-t border-slate-100 flex justify-between font-mono font-bold text-emerald-700">
                      <span>Neto Ejercido Efectivo:</span>
                      <span>$110,000.00 MXN</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOp(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Nueva Operación */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-indigo-600 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Registrar Operación Financiera</h3>
                <p className="text-xs text-indigo-100">Grupo Prisma S.A.P.I. de C.V.</p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOperation} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Concepto de la Operación:</label>
                <input
                  type="text"
                  required
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  placeholder="Ej. Pago de derechos notariales escrituración"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Flujo:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="EGRESO">Egreso de Fondos</option>
                    <option value="INGRESO">Ingreso / Retorno</option>
                    <option value="REVERSION_PARCIAL">Reversión Parcial 1:N</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monto (MXN):</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="Ej. 35000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cuenta Bancaria:</label>
                <select
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="BBVA Operativa (****4490)">BBVA Operativa Principal (****4490)</option>
                  <option value="Banorte Concentradora (****7821)">Banorte Concentradora (****7821)</option>
                  <option value="Fondo Inversión Fiduciario">Fondo Inversión Fiduciario Banregio</option>
                  <option value="Caja Chica Corporativa">Caja Chica Corporativa</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Proyecto Vinculado (Opcional):</label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="PRJ-AUTO-2026-01">PRJ-AUTO-2026-01 — Remate Vehículos Utilitarios</option>
                  <option value="PRJ-INM-2026-01">PRJ-INM-2026-01 — Remodelación Valle Oriente</option>
                  <option value="">Ninguno / Gasto General</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[11px]">
                <strong>Regla de Gobernanza 2-Man:</strong> Si el importe supera $20,000.00 MXN, se generará una solicitud en la bandeja de autorizaciones que requerirá 2 firmas mancomunadas de usuarios distintos.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Guardar Operación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
