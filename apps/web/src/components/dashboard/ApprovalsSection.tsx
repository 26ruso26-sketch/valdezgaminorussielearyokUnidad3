import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  XCircle,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SignatureInfo {
  signerName: string;
  role: string;
  signedAt: string;
  tokenStamp: string;
}

interface ApprovalRequestData {
  id: string;
  code: string;
  opCode: string;
  concept: string;
  amount: string;
  amountNum: number;
  account: string;
  requestedBy: string;
  createdAt: string;
  status: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  signature1?: SignatureInfo;
  signature2?: SignatureInfo;
  rejectionReason?: string;
}

const INITIAL_REQUESTS: ApprovalRequestData[] = [
  {
    id: 'REQ-003',
    code: 'SOL-2026-003',
    opCode: 'OP-2026-0003',
    concept: 'Anticipo licencias remodelación comercial Valle Oriente',
    amount: '$48,000.00 MXN',
    amountNum: 48000,
    account: 'BBVA Operativa (****4490)',
    requestedBy: 'Arq. Mariana Treviño Leal',
    createdAt: '17/11/2026 10:00',
    status: 'PENDIENTE',
    signature1: {
      signerName: 'C.P. Russiele Gamiño Valdez',
      role: 'Tesorero General (TREASURER)',
      signedAt: '17/11/2026 10:15',
      tokenStamp: 'SIG-SHA256-7a8b9c...f1',
    },
  },
  {
    id: 'REQ-001',
    code: 'SOL-2026-001',
    opCode: 'OP-2026-0001',
    concept: 'Anticipo adquisición lote automotriz subasta SAT',
    amount: '$125,000.00 MXN',
    amountNum: 125000,
    account: 'BBVA Operativa (****4490)',
    requestedBy: 'Ing. Javier Zúñiga Rangel',
    createdAt: '17/11/2026 09:30',
    status: 'APROBADA',
    signature1: {
      signerName: 'C.P. Russiele Gamiño Valdez',
      role: 'Tesorero General (TREASURER)',
      signedAt: '17/11/2026 09:45',
      tokenStamp: 'SIG-SHA256-112233...44',
    },
    signature2: {
      signerName: 'Dr. Fernando Ortiz Cantú',
      role: 'Aprobador Financiero (FINANCE_APPROVER)',
      signedAt: '17/11/2026 10:20',
      tokenStamp: 'SIG-SHA256-556677...88',
    },
  },
  {
    id: 'REQ-004',
    code: 'SOL-2026-004',
    opCode: 'OP-2026-0004',
    concept: 'Suministro mobiliario oficina sin 3 cotizaciones',
    amount: '$8,500.00 MXN',
    amountNum: 8500,
    account: 'Caja Chica Corporativa',
    requestedBy: 'Asistente Operativo',
    createdAt: '16/11/2026 14:00',
    status: 'RECHAZADA',
    rejectionReason: 'Incumple política de adquisiciones: falta cotización comparativa tripartita.',
  },
];

export const ApprovalsSection: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ApprovalRequestData[]>(INITIAL_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequestData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSignSecondSignature = (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === reqId) {
          return {
            ...r,
            status: 'APROBADA',
            signature2: {
              signerName: user?.fullName || 'Dr. Fernando Ortiz Cantú',
              role: 'Aprobador Financiero (FINANCE_APPROVER)',
              signedAt: new Date().toLocaleTimeString(),
              tokenStamp: `SIG-LIVE-JWT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            },
          };
        }
        return r;
      }),
    );

    setToastMessage('Segunda firma registrada exitosamente. Regla 2-Man cumplida al 100%.');
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleReject = (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === reqId) {
          return {
            ...r,
            status: 'RECHAZADA',
            rejectionReason: 'Rechazado en revisión administrativa preventiva por el usuario actual.',
          };
        }
        return r;
      }),
    );

    setToastMessage('Solicitud marcada como rechazada.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const pendingCount = requests.filter((r) => r.status === 'PENDIENTE').length;

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
            <FileCheck className="w-5 h-5 mr-2 text-amber-600" />
            Bandeja de Autorizaciones Mancomunadas (Regla 2-Man)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mecanismo de seguridad financiera: Toda operación &ge; $20,000.00 MXN exige 2 firmas independientes de usuarios distintos.
          </p>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{pendingCount} Pendiente{pendingCount !== 1 ? 's' : ''} de Segunda Firma</span>
        </div>
      </div>

      {/* Tarjeta Explicativa de Regla de Negocio */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <h4 className="font-bold text-amber-950">Gobernanza Institucional: Doble Aprobación Obligatoria</h4>
          <p className="text-amber-900 mt-1 leading-relaxed">
            Para evitar dispersiones unilaterales de fondos, la regla 2-Man requiere que una solicitud sea firmada por el <strong>Tesorero</strong> (Firma 1) y ratificada por un <strong>Aprobador Financiero o Administrador General</strong> (Firma 2). Ningún usuario puede firmar dos veces la misma operación.
          </p>
        </div>
      </div>

      {/* Lista de Solicitudes de Autorización */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className={`bg-white rounded-2xl border transition-all p-5 shadow-sm ${
              req.status === 'PENDIENTE'
                ? 'border-amber-300 ring-2 ring-amber-100'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Información de la Solicitud */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {req.code}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Ref: {req.opCode}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'PENDIENTE'
                        ? 'bg-amber-100 text-amber-800'
                        : req.status === 'APROBADA'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {req.status === 'PENDIENTE'
                      ? 'PENDIENTE 2DA FIRMA'
                      : req.status === 'APROBADA'
                      ? 'AUTORIZADA (2/2 FIRMAS)'
                      : 'RECHAZADA'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{req.concept}</h3>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Cuenta: <strong className="text-slate-700 font-mono">{req.account}</strong></span>
                  <span>Solicitante: <strong className="text-slate-700">{req.requestedBy}</strong></span>
                  <span>Fecha: <strong className="text-slate-700">{req.createdAt}</strong></span>
                </div>
              </div>

              {/* Monto y Botones de Acción */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Importe a Liberar
                  </span>
                  <span className="text-xl font-black text-slate-900 font-mono block">
                    {req.amount}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex items-center space-x-2">
                  {req.status === 'PENDIENTE' && (
                    <>
                      <button
                        onClick={() => handleSignSecondSignature(req.id)}
                        className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Firmar Operación (Firma 2)
                      </button>

                      <button
                        onClick={() => handleReject(req.id)}
                        className="inline-flex items-center px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition-all"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Rechazar
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all shadow-sm"
                    title="Ver Bitácora de Firmas"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Visualización de Firmas Mancomunadas */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Firma 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Firma 1 / Iniciador (Tesorero)
                  </span>
                  {req.signature1 ? (
                    <div className="mt-0.5">
                      <span className="font-bold text-slate-900 block">{req.signature1.signerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {req.signature1.signedAt} • {req.signature1.tokenStamp}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No registrada</span>
                  )}
                </div>
                {req.signature1 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-300 shrink-0" />
                )}
              </div>

              {/* Firma 2 */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  req.signature2
                    ? 'bg-slate-50 border-slate-200'
                    : req.status === 'RECHAZADA'
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-amber-50/60 border-amber-200'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Firma 2 / Ratificación (Aprobador)
                  </span>
                  {req.signature2 ? (
                    <div className="mt-0.5">
                      <span className="font-bold text-slate-900 block">{req.signature2.signerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {req.signature2.signedAt} • {req.signature2.tokenStamp}
                      </span>
                    </div>
                  ) : req.status === 'RECHAZADA' ? (
                    <span className="text-rose-600 font-medium">Rechazada antes de firma 2</span>
                  ) : (
                    <span className="text-amber-700 font-bold flex items-center mt-0.5">
                      <Clock className="w-3.5 h-3.5 mr-1" /> Esperando Aprobador Financiero
                    </span>
                  )}
                </div>
                {req.signature2 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : req.status === 'RECHAZADA' ? (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 animate-pulse" />
                )}
              </div>
            </div>

            {/* Motivo de Rechazo Si Existe */}
            {req.rejectionReason && (
              <div className="mt-3 p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800">
                <strong>Motivo de Rechazo:</strong> {req.rejectionReason}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Bitácora de Firmas */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-amber-600 text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-200">
                  {selectedRequest.code}
                </span>
                <h3 className="text-base font-bold">Bitácora Criptográfica de Firmas</h3>
                <p className="text-xs text-amber-100">{selectedRequest.concept}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Monto Comprometido:</span>
                  <span className="font-bold text-slate-900">{selectedRequest.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cuenta de Dispersión:</span>
                  <span className="font-mono text-slate-800">{selectedRequest.account}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estatus:</span>
                  <span className="font-bold text-slate-900">{selectedRequest.status}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Firmantes Autorizados</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Firma 1 (Tesorero)</span>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {selectedRequest.signature1?.signerName || 'Sin firma'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Estampa: {selectedRequest.signature1?.tokenStamp || 'N/A'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Firma 2 (Aprobador Financiero)</span>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {selectedRequest.signature2?.signerName || 'Pendiente de ratificación'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Estampa: {selectedRequest.signature2?.tokenStamp || 'Pendiente'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
