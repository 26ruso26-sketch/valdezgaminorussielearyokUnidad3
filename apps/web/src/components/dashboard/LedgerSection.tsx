import React, { useState } from 'react';
import {
  ScrollText,
  ShieldCheck,
  Lock,
  Search,
  CheckCircle2,
  Download,
  AlertTriangle,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';

interface MovementData {
  id: string;
  date: string;
  account: string;
  entryType: 'CARGO' | 'ABONO';
  concept: string;
  amount: string;
  amountNum: number;
  balanceBefore: string;
  balanceAfter: string;
  bankReference: string;
}

interface AuditData {
  id: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  user: string;
  ipAddress: string;
  status: 'EXITO' | 'DENEGADO' | 'ADVERTENCIA';
  details: string;
}

const INITIAL_MOVEMENTS: MovementData[] = [
  {
    id: 'MOV-001',
    date: '17/11/2026 11:15',
    account: 'Banorte Concentradora (****7821)',
    entryType: 'ABONO',
    concept: 'Reversión parcial 1:N por devolución excedente subasta (OP-2026-0002)',
    amount: '+$15,000.00 MXN',
    amountNum: 15000,
    balanceBefore: '$485,000.00 MXN',
    balanceAfter: '$500,000.00 MXN',
    bankReference: 'REF-SAT-DEV-9921',
  },
  {
    id: 'MOV-002',
    date: '17/11/2026 10:30',
    account: 'BBVA Operativa (****4490)',
    entryType: 'CARGO',
    concept: 'Anticipo compra lote automotriz subasta SAT (OP-2026-0001)',
    amount: '-$125,000.00 MXN',
    amountNum: -125000,
    balanceBefore: '$375,000.00 MXN',
    balanceAfter: '$250,000.00 MXN',
    bankReference: 'SPEI-BBVA-881920',
  },
  {
    id: 'MOV-003',
    date: '15/11/2026 09:00',
    account: 'Fondo Inversión Fiduciario',
    entryType: 'ABONO',
    concept: 'Rendimiento fiduciario devengado período mensual (OP-2026-0005)',
    amount: '+$14,250.00 MXN',
    amountNum: 14250,
    balanceBefore: '$985,750.00 MXN',
    balanceAfter: '$1,000,000.00 MXN',
    bankReference: 'BANREGIO-INT-0042',
  },
  {
    id: 'MOV-004',
    date: '15/01/2026 12:00',
    account: 'Banorte Concentradora (****7821)',
    entryType: 'ABONO',
    concept: 'Depósito de aportación de capital social 10 socios fundadores',
    amount: '+$10,000,000.00 MXN',
    amountNum: 10000000,
    balanceBefore: '$0.00 MXN',
    balanceAfter: '$10,000,000.00 MXN',
    bankReference: 'ACTA-NOT-4190-CONSTITUCION',
  },
];

const INITIAL_AUDIT_LOGS: AuditData[] = [
  {
    id: 'AUD-001',
    timestamp: '17/11/2026 11:15:32',
    action: 'REVERSAL_EXECUTED',
    entityType: 'FinancialOperation',
    entityId: 'OP-2026-0002',
    user: 'tesoreria@prisma.com (TREASURER)',
    ipAddress: '192.168.1.45',
    status: 'EXITO',
    details: 'Reversión parcial 1:N aplicada sobre OP-2026-0001 por $15,000.00 MXN.',
  },
  {
    id: 'AUD-002',
    timestamp: '17/11/2026 10:20:10',
    action: 'APPROVAL_2MAN_SIGNATURE',
    entityType: 'ApprovalRequest',
    entityId: 'SOL-2026-001',
    user: 'aprobador@prisma.com (FINANCE_APPROVER)',
    ipAddress: '192.168.1.18',
    status: 'EXITO',
    details: 'Firma 2 mancomunada ratificada con hash SIG-SHA256-556677...88.',
  },
  {
    id: 'AUD-003',
    timestamp: '17/11/2026 09:45:00',
    action: 'APPROVAL_2MAN_SIGNATURE',
    entityType: 'ApprovalRequest',
    entityId: 'SOL-2026-001',
    user: 'tesoreria@prisma.com (TREASURER)',
    ipAddress: '192.168.1.45',
    status: 'EXITO',
    details: 'Firma 1 registrada por monto de $125,000.00 MXN.',
  },
  {
    id: 'AUD-004',
    timestamp: '16/11/2026 16:45:22',
    action: 'OPERATION_REJECTED',
    entityType: 'FinancialOperation',
    entityId: 'OP-2026-0004',
    user: 'admin@prisma.com (SUPER_ADMIN)',
    ipAddress: '192.168.1.10',
    status: 'ADVERTENCIA',
    details: 'Rechazo preventivo: falta cotización comparativa tripartita en compra menor.',
  },
  {
    id: 'AUD-005',
    timestamp: '17/11/2026 08:30:11',
    action: 'USER_LOGIN_SUCCESS',
    entityType: 'AuthSession',
    entityId: 'JWT-SES-901',
    user: 'admin@prisma.com (SUPER_ADMIN)',
    ipAddress: '192.168.1.10',
    status: 'EXITO',
    details: 'Autenticación exitosa mediante bcrypt + token JWT stateless emitido.',
  },
];

export const LedgerSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'movements' | 'audit'>('movements');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDownloadReport = () => {
    setToastMessage('Reporte consolidado de auditoría generado en memoria.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredMovements = INITIAL_MOVEMENTS.filter(
    (m) =>
      m.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.bankReference.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredAudit = INITIAL_AUDIT_LOGS.filter(
    (a) =>
      a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.details.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            <ScrollText className="w-5 h-5 mr-2 text-indigo-600" />
            Movimientos y Auditoría Inmutable
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Libro Mayor contable de sólo adición (append-only) y trazabilidad completa de eventos de seguridad.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Exportar Pista de Auditoría
        </button>
      </div>

      {/* Aviso de Inmutabilidad Financiera */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 shadow-sm">
        <div className="p-2 rounded-xl bg-white/10 text-emerald-400 shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <h4 className="font-bold text-white flex items-center">
            Garantía de Integridad: Prohibición de Modificación o Eliminación
          </h4>
          <p className="text-slate-300 mt-1 leading-relaxed">
            Por regla de negocio estricta, la tabla <code className="text-emerald-400 font-mono">AccountMovement</code> no admite operaciones <code className="text-rose-400 font-mono">DELETE</code> ni <code className="text-rose-400 font-mono">UPDATE</code>. Cualquier corrección monetaria debe registrarse como un nuevo movimiento de compensación o reversión parcial 1:N.
          </p>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('movements')}
          className={`py-2.5 px-5 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'movements'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Libro Mayor Contable (AccountMovement)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2.5 px-5 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Bitácora de Auditoría del Sistema (AuditLog)</span>
        </button>
      </div>

      {/* Barra de Filtro */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en registros..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tab 1: Libro Mayor Contable */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Fecha / Folio</th>
                  <th className="py-3 px-4">Concepto Transaccional</th>
                  <th className="py-3 px-4">Cuenta</th>
                  <th className="py-3 px-4 text-center">Tipo</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-4 text-right">Saldo Resultante</th>
                  <th className="py-3 px-4">Ref. Bancaria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{mov.date}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{mov.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{mov.concept}</div>
                      <div className="text-[10px] text-slate-400">Saldo Anterior: {mov.balanceBefore}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">{mov.account}</td>
                    <td className="py-3 px-4 text-center">
                      {mov.entryType === 'ABONO' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowDownLeft className="w-3 h-3 mr-1 text-emerald-600" /> ABONO (+)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <ArrowUpRight className="w-3 h-3 mr-1 text-rose-600" /> CARGO (-)
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-bold ${
                        mov.entryType === 'ABONO' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {mov.amount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {mov.balanceAfter}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {mov.bankReference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bitácora de Auditoría */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Timestamp / ID</th>
                  <th className="py-3 px-4">Acción Auditada</th>
                  <th className="py-3 px-4">Usuario Responsable</th>
                  <th className="py-3 px-4">Detalle del Evento</th>
                  <th className="py-3 px-4">Dirección IP</th>
                  <th className="py-3 px-4 text-center">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAudit.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{log.timestamp}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{log.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                        {log.entityType} ({log.entityId})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{log.user}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">{log.details}</td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{log.ipAddress}</td>
                    <td className="py-3 px-4 text-center">
                      {log.status === 'EXITO' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> ÉXITO
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" /> ALERTA
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
