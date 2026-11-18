import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle2,
  X,
  Shield,
} from 'lucide-react';

interface PartnerData {
  id: string;
  name: string;
  rfc: string;
  equityPercentage: string;
  basisPoints: number;
  capitalContributed: string;
  position: string;
  email: string;
  phone: string;
  joinedAt: string;
  status: 'ACTIVO' | 'EN_REVISION' | 'INACTIVO';
}

const INITIAL_PARTNERS: PartnerData[] = [
  {
    id: 'PARTNER-001',
    name: 'Lic. Roberto Valdez Morales',
    rfc: 'VAMR780415HR9',
    equityPercentage: '10.00%',
    basisPoints: 1000,
    capitalContributed: '$1,000,000.00 MXN',
    position: 'Administrador General / Accionista',
    email: 'admin@prisma.com',
    phone: '+52 (81) 8200-1001',
    joinedAt: '2026-01-15',
    status: 'ACTIVO',
  },
  {
    id: 'PARTNER-002',
    name: 'C.P. Russiele Gamiño Valdez',
    rfc: 'GAVR851120KL3',
    equityPercentage: '10.00%',
    basisPoints: 1000,
    capitalContributed: '$1,000,000.00 MXN',
    position: 'Tesorero General / Accionista',
    email: 'tesoreria@prisma.com',
    phone: '+52 (81) 8200-1002',
    joinedAt: '2026-01-15',
    status: 'ACTIVO',
  },
  {
    id: 'PARTNER-003',
    name: 'Ing. Carlos Mendoza Silva',
    rfc: 'MESC820310PL8',
    equityPercentage: '10.00%',
    basisPoints: 1000,
    capitalContributed: '$1,000,000.00 MXN',
    position: 'Director de Inversiones / Accionista',
    email: 'proyectos@prisma.com',
    phone: '+52 (81) 8200-1003',
    joinedAt: '2026-01-15',
    status: 'ACTIVO',
  },
  {
    id: 'PARTNER-004',
    name: 'Mtra. Sofía Garza Salinas',
    rfc: 'GASS890724MN5',
    equityPercentage: '10.00%',
    basisPoints: 1000,
    capitalContributed: '$1,000,000.00 MXN',
    position: 'Comité de Vigilancia / Accionista',
    email: 'sofia.garza@prisma.com',
    phone: '+52 (81) 8200-1004',
    joinedAt: '2026-01-15',
    status: 'ACTIVO',
  },
  {
    id: 'PARTNER-005',
    name: 'Lic. Alejandro Ramos Castillo',
    rfc: 'RACA800115RT2',
    equityPercentage: '10.00%',
    basisPoints: 1000,
    capitalContributed: '$1,000,000.00 MXN',
    position: 'Asesor Jurídico Corporativo / Accionista',
    email: 'alejandro.ramos@prisma.com',
    phone: '+52 (81) 8200-1005',
    joinedAt: '2026-01-15',
    status: 'ACTIVO',
  },
  {
    id: 'PARTNER-006',
    name: 'Arq. Mariana Treviño Leal',
    rfc: 'TELM870912QW1',
    equityPercentage: '10.00%',
    basisPoints: 1000,
    capitalContributed: '$1,000,000.00 MXN',
    position: 'Gestora Proyectos Inmobiliarios / Accionista',
    email: 'mariana.trevino@prisma.com',
    phone: '+52 (81) 8200-1006',
    joinedAt: '2026-01-15',
    status: 'ACTIVO',
  },
  {
    id: 'PARTNER-007',
    name: 'Dr. Fernando Ortiz Cantú',
    rfc: 'OICF750603HJ4',
    equityPercentage: '10.00%',
    basisPoints: 1000,
    capitalContributed: '$1,000,000.00 MXN',
    position: 'Aprobador Financiero / Accionista',
    email: 'aprobador@prisma.com',
    phone: '+52 (81) 8200-1007',
    joinedAt: '2026-01-15',
    status: 'ACTIVO',
  },
  {
    id: 'PARTNER-008',
    name: 'Lic. Gabriela Hinojosa Peña',
    rfc: 'HIPG910418UY7',
    equityPercentage: '10.00%',
    basisPoints: 1000,
    capitalContributed: '$1,000,000.00 MXN',
    position: 'Socia Inversionista / Accionista',
    email: 'gabriela.hinojosa@prisma.com',
    phone: '+52 (81) 8200-1008',
    joinedAt: '2026-01-15',
    status: 'ACTIVO',
  },
  {
    id: 'PARTNER-009',
    name: 'Ing. Javier Zúñiga Rangel',
    rfc: 'ZURJ831205LK9',
    equityPercentage: '10.00%',
    basisPoints: 1000,
    capitalContributed: '$1,000,000.00 MXN',
    position: 'Gestor Remates Vehiculares / Accionista',
    email: 'javier.zuniga@prisma.com',
    phone: '+52 (81) 8200-1009',
    joinedAt: '2026-01-15',
    status: 'ACTIVO',
  },
  {
    id: 'PARTNER-010',
    name: 'Lic. Patricia Salgado Ríos',
    rfc: 'SARP860830NB2',
    equityPercentage: '10.00%',
    basisPoints: 1000,
    capitalContributed: '$1,000,000.00 MXN',
    position: 'Auditora Externa / Accionista',
    email: 'patricia.salgado@prisma.com',
    phone: '+52 (81) 8200-1010',
    joinedAt: '2026-01-15',
    status: 'ACTIVO',
  },
];

export const PartnersSection: React.FC = () => {
  const [partners, setPartners] = useState<PartnerData[]>(INITIAL_PARTNERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<PartnerData | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State para Nuevo Socio
  const [newName, setNewName] = useState('');
  const [newRfc, setNewRfc] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.position.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRegisterPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRfc) return;

    const newPartner: PartnerData = {
      id: `PARTNER-${String(partners.length + 1).padStart(3, '0')}`,
      name: newName,
      rfc: newRfc.toUpperCase(),
      equityPercentage: '10.00%',
      basisPoints: 1000,
      capitalContributed: '$1,000,000.00 MXN',
      position: newPosition || 'Socio Accionista',
      email: newEmail || `${newRfc.toLowerCase()}@prisma.com`,
      phone: '+52 (81) 8200-XXXX',
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVO',
    };

    setPartners([...partners, newPartner]);
    setShowNewModal(false);
    setNewName('');
    setNewRfc('');
    setNewPosition('');
    setNewEmail('');

    setToastMessage(`Socio ${newPartner.name} registrado en padrón con 1,000 puntos base.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notificación */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-700 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-indigo-600" />
            Padrón de Socios y Estructura Accionaria
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gobernanza de Grupo Prisma S.A.P.I. de C.V. — Esquema paritario equitativo de 10 socios al 10.00% c/u.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Registrar Nuevo Socio
        </button>
      </div>

      {/* Métricas del Padrón */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total de Socios
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {partners.length} Socios
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            100% Padrón verificado
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Participación Individual
          </span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">
            10.00% Paritario
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            1,000 bps por socio fundador
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Capital Social Aportado
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            $10,000,000.00
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            MXN suscrito y pagado
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Gobernanza Estatutaria
          </span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            10,000 bps
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            100.00% del quórum social
          </span>
        </div>
      </div>

      {/* Barra de Filtro y Búsqueda */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, RFC o cargo..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Mostrando {filteredPartners.length} de {partners.length} socios registrados</span>
        </div>
      </div>

      {/* Tabla de Socios */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Socio / Cargo Corporativo</th>
                <th className="py-3 px-4">RFC</th>
                <th className="py-3 px-4 text-center">Acciones / bps</th>
                <th className="py-3 px-4 text-right">Aportación Social</th>
                <th className="py-3 px-4 text-center">Estatus</th>
                <th className="py-3 px-4 text-center">Expediente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{partner.name}</div>
                    <div className="text-[11px] text-slate-500">{partner.position}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    {partner.rfc}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {partner.equityPercentage} ({partner.basisPoints} bps)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {partner.capitalContributed}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      {partner.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 transition-all shadow-sm"
                      title="Ver Expediente de Socio"
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

      {/* Modal Detalle de Expediente de Socio */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-indigo-300 uppercase">
                  {selectedPartner.id}
                </span>
                <h3 className="text-lg font-bold">{selectedPartner.name}</h3>
                <p className="text-xs text-indigo-200">{selectedPartner.position}</p>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    RFC Fiscal
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                    {selectedPartner.rfc}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Participación Paritaria
                  </span>
                  <span className="font-bold text-indigo-600 text-sm mt-0.5 block">
                    {selectedPartner.equityPercentage} (1,000 bps)
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Aportación Capital:</span>
                  <span className="font-bold text-slate-900">{selectedPartner.capitalContributed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Correo Electrónico:</span>
                  <span className="font-mono text-slate-800">{selectedPartner.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Teléfono Directo:</span>
                  <span className="text-slate-800">{selectedPartner.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha de Alta en Acta:</span>
                  <span className="text-slate-800">{selectedPartner.joinedAt}</span>
                </div>
              </div>

              <div className="border border-emerald-100 bg-emerald-50/50 p-3.5 rounded-xl">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-1">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Validación de Cumplimiento Normativo</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Expediente de identificación validado conforme a la Ley del Mercado de Valores y estatutos de Grupo Prisma S.A.P.I. de C.V.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPartner(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Nuevo Socio */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-indigo-600 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Registrar Socio en Padrón</h3>
                <p className="text-xs text-indigo-100">Grupo Prisma S.A.P.I. de C.V.</p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPartner} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo del Socio:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Ing. Ernesto Garza Treviño"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">RFC con Homoclave:</label>
                <input
                  type="text"
                  required
                  value={newRfc}
                  onChange={(e) => setNewRfc(e.target.value)}
                  placeholder="Ej. GATE800512KL4"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cargo Corporativo:</label>
                <input
                  type="text"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  placeholder="Ej. Socio Inversionista Patrimonial"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico Institucional:</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Ej. e.garza@prisma.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                <strong>Nota Estatutaria:</strong> Todo nuevo socio suscribe una aportación equivalente al 10.00% (1,000 puntos base) con valor nominal de $1,000,000.00 MXN.
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
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
