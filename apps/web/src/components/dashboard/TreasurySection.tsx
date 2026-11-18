import React, { useState } from 'react';
import {
  Landmark,
  ArrowRightLeft,
  Eye,
  CheckCircle2,
  X,
  Building,
} from 'lucide-react';

interface AccountData {
  id: string;
  name: string;
  bankName: string;
  accountNumberMasked: string;
  clabe: string;
  type: 'CONCENTRADORA' | 'OPERATIVA' | 'INVERSION' | 'CAJA_CHICA';
  currency: string;
  balance: string;
  balanceNum: number;
  status: 'ACTIVA' | 'BLOQUEADA';
  description: string;
  lastMovement: string;
}

const INITIAL_ACCOUNTS: AccountData[] = [
  {
    id: 'ACC-001',
    name: 'Banorte Concentradora',
    bankName: 'Banco Mercantil del Norte (Banorte)',
    accountNumberMasked: '**** **** **** 7821',
    clabe: '072580001234567821',
    type: 'CONCENTRADORA',
    currency: 'MXN',
    balance: '$500,000.00',
    balanceNum: 500000,
    status: 'ACTIVA',
    description: 'Cuenta matriz de capital social y recepción de aportaciones de socios.',
    lastMovement: '17/11/2026 - Reversión OP-2026-0002 (+$15,000.00)',
  },
  {
    id: 'ACC-002',
    name: 'BBVA Operativa Principal',
    bankName: 'BBVA México S.A.',
    accountNumberMasked: '**** **** **** 4490',
    clabe: '012180009876544490',
    type: 'OPERATIVA',
    currency: 'MXN',
    balance: '$250,000.00',
    balanceNum: 250000,
    status: 'ACTIVA',
    description: 'Dispersión de compras para proyectos, pago a proveedores y remates.',
    lastMovement: '17/11/2026 - Anticipo OP-2026-0001 (-$125,000.00)',
  },
  {
    id: 'ACC-003',
    name: 'Fondo Inversión Fiduciario',
    bankName: 'Banco Regional (Banregio Fideicomiso #9021)',
    accountNumberMasked: 'FID-BANREGIO-9021',
    clabe: '058580000009021001',
    type: 'INVERSION',
    currency: 'MXN',
    balance: '$1,000,000.00',
    balanceNum: 1000000,
    status: 'ACTIVA',
    description: 'Patrimonio fideicomitido etiquetado para adquisiciones mayores y rendimiento líquido.',
    lastMovement: '15/11/2026 - Rendimiento fiduciario mensual (+$14,250.00)',
  },
  {
    id: 'ACC-004',
    name: 'Caja Chica Corporativa',
    bankName: 'Custodia Tesorería Grupo Prisma',
    accountNumberMasked: 'EFECTIVO-BOVEDA-01',
    clabe: 'N/A (Fondo Fijo Físico)',
    type: 'CAJA_CHICA',
    currency: 'MXN',
    balance: '$15,000.00',
    balanceNum: 15000,
    status: 'ACTIVA',
    description: 'Fondo revolvente para aranceles notariales, viáticos y gastos menores.',
    lastMovement: '10/11/2026 - Reembolso fondo fijo (+$5,000.00)',
  },
];

export const TreasurySection: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountData[]>(INITIAL_ACCOUNTS);
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Transfer Form State
  const [fromAccId, setFromAccId] = useState(INITIAL_ACCOUNTS[0].id);
  const [toAccId, setToAccId] = useState(INITIAL_ACCOUNTS[1].id);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferConcept, setTransferConcept] = useState('');

  const totalTreasury = accounts.reduce((acc, a) => acc + a.balanceNum, 0);
  const liquidTreasury = accounts
    .filter((a) => a.type !== 'INVERSION')
    .reduce((acc, a) => acc + a.balanceNum, 0);

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0 || fromAccId === toAccId) return;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromAccId) {
          const newBal = acc.balanceNum - amount;
          return {
            ...acc,
            balanceNum: newBal,
            balance: `$${newBal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            lastMovement: `Hoy - Transferencia enviada (-$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })})`,
          };
        }
        if (acc.id === toAccId) {
          const newBal = acc.balanceNum + amount;
          return {
            ...acc,
            balanceNum: newBal,
            balance: `$${newBal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            lastMovement: `Hoy - Transferencia recibida (+$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })})`,
          };
        }
        return acc;
      }),
    );

    setShowTransferModal(false);
    setTransferAmount('');
    setTransferConcept('');
    setToastMessage(`Traspaso de fondos por $${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN ejecutado correctamente.`);
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
            <Landmark className="w-5 h-5 mr-2 text-indigo-600" />
            Tesorería y Cuentas Bancarias
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Posición financiera consolidada, fondos fiduciarios y dispersión monetaria de Grupo Prisma S.A.P.I. de C.V.
          </p>
        </div>

        <button
          onClick={() => setShowTransferModal(true)}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <ArrowRightLeft className="w-4 h-4 mr-1.5" />
          Traspaso Entre Cuentas
        </button>
      </div>

      {/* Métricas de Tesorería */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Saldo Total Consolidado
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            ${totalTreasury.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            MXN en 4 instrumentos
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Disponibilidad Inmediata
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            ${liquidTreasury.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            Cuentas operativas líquidas
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Fondo Fiduciario Banregio
          </span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">
            $1,000,000.00
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            Fideicomiso de inversión #9021
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Moneda Operativa
          </span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            MXN ($)
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            Peso Mexicano (Sin flotante)
          </span>
        </div>
      </div>

      {/* Grid de Cuentas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{account.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{account.bankName}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {account.status}
                </span>
              </div>

              {/* Saldo y Tipo */}
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-inner">
                <div className="flex justify-between items-center text-[10px] tracking-widest uppercase text-slate-400">
                  <span>SALDO DISPONIBLE</span>
                  <span className="font-mono">{account.currency}</span>
                </div>
                <div className="text-2xl font-black mt-1 font-mono tracking-tight">
                  {account.balance}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] font-mono text-slate-300">
                  <span>{account.accountNumberMasked}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">
                    {account.type}
                  </span>
                </div>
              </div>

              {/* Detalles */}
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">CLABE Interbancaria:</span>
                  <span className="font-mono font-medium text-slate-800">{account.clabe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Último Movimiento:</span>
                  <span className="text-slate-700 font-medium text-[11px] truncate max-w-[240px]">
                    {account.lastMovement}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAccount(account)}
                className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-sm flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                <span>Ver Movimientos Recientes</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ver Movimientos de Cuenta */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-300 uppercase">
                  {selectedAccount.bankName}
                </span>
                <h3 className="text-base font-bold">{selectedAccount.name}</h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Saldo: {selectedAccount.balance} {selectedAccount.currency}
                </p>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">CLABE:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedAccount.clabe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Número de Cuenta:</span>
                  <span className="font-mono text-slate-800">{selectedAccount.accountNumberMasked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Propósito:</span>
                  <span className="text-slate-700">{selectedAccount.description}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Historial Reciente de la Cuenta</h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Operación Registrada</div>
                      <div className="text-[11px] text-slate-500">{selectedAccount.lastMovement}</div>
                    </div>
                    <span className="font-mono font-bold text-slate-900">Aplicado</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Suscripción Inicial Capital</div>
                      <div className="text-[11px] text-slate-500">15/01/2026 - Depósito de socios fundadores</div>
                    </div>
                    <span className="font-mono font-bold text-emerald-600">+ Capital</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAccount(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Traspaso Entre Cuentas */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-indigo-600 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Traspaso Entre Cuentas de Tesorería</h3>
                <p className="text-xs text-indigo-100">Grupo Prisma S.A.P.I. de C.V.</p>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cuenta Origen (Cargo):</label>
                <select
                  value={fromAccId}
                  onChange={(e) => setFromAccId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id} disabled={a.id === toAccId}>
                      {a.name} — {a.balance}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cuenta Destino (Abono):</label>
                <select
                  value={toAccId}
                  onChange={(e) => setToAccId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id} disabled={a.id === fromAccId}>
                      {a.name} — {a.balance}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monto a Traspasar (MXN):</label>
                <input
                  type="number"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Ej. 50000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Concepto / Justificación:</label>
                <input
                  type="text"
                  required
                  value={transferConcept}
                  onChange={(e) => setTransferConcept(e.target.value)}
                  placeholder="Ej. Fondeo cuenta operativa para remate vehicular"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Ejecutar Traspaso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
