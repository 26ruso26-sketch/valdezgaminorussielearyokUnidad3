import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';

interface ProjectMilestone {
  title: string;
  status: 'COMPLETADO' | 'EN_PROCESO' | 'PENDIENTE';
  date: string;
}

interface ProjectData {
  id: string;
  code: string;
  name: string;
  category: 'VEHICULAR' | 'INMOBILIARIO' | 'COMERCIAL';
  manager: string;
  budgetTotal: string;
  budgetTotalNum: number;
  spentAmount: string;
  spentAmountNum: number;
  progressPercent: number;
  expectedRoi: string;
  timeline: string;
  status: 'EN_EJECUCION' | 'EVALUACION' | 'CONCLUIDO';
  description: string;
  milestones: ProjectMilestone[];
}

const INITIAL_PROJECTS: ProjectData[] = [
  {
    id: 'PRJ-001',
    code: 'PRJ-AUTO-2026-01',
    name: 'Remate Lote 12 Vehículos Utilitarios',
    category: 'VEHICULAR',
    manager: 'Ing. Javier Zúñiga Rangel',
    budgetTotal: '$350,000.00 MXN',
    budgetTotalNum: 350000,
    spentAmount: '$157,500.00 MXN',
    spentAmountNum: 157500,
    progressPercent: 45,
    expectedRoi: '22.5% Estimado (6 meses)',
    timeline: 'Ene 2026 - Jun 2026',
    status: 'EN_EJECUCION',
    description:
      'Adquisición en subasta pública de lote de 12 vehículos compactos utilitarios para reacondicionamiento y reventa en plaza Monterrey.',
    milestones: [
      { title: 'Adjudicación en subasta y fianza', status: 'COMPLETADO', date: '15 Ene 2026' },
      { title: 'Traslado logístico y peritaje mecánico', status: 'COMPLETADO', date: '02 Feb 2026' },
      { title: 'Reacondicionamiento estético y eléctrico', status: 'EN_PROCESO', date: 'En curso' },
      { title: 'Comercialización y colocación en mercado', status: 'PENDIENTE', date: 'Abr - May 2026' },
    ],
  },
  {
    id: 'PRJ-002',
    code: 'PRJ-INM-2026-01',
    name: 'Adquisición y Remodelación Inmueble Valle Oriente',
    category: 'INMOBILIARIO',
    manager: 'Arq. Mariana Treviño Leal',
    budgetTotal: '$850,000.00 MXN',
    budgetTotalNum: 850000,
    spentAmount: '$127,500.00 MXN',
    spentAmountNum: 127500,
    progressPercent: 15,
    expectedRoi: '18.0% Estimado (12 meses)',
    timeline: 'Feb 2026 - Ene 2027',
    status: 'EN_EJECUCION',
    description:
      'Adquisición por cesión de derechos litigiosos y remodelación comercial de inmueble en San Pedro Garza García para renta corporativa.',
    milestones: [
      { title: 'Escrituración y toma de posesión notarial', status: 'COMPLETADO', date: '28 Ene 2026' },
      { title: 'Trámite de licencias de construcción y uso de suelo', status: 'EN_PROCESO', date: 'En curso' },
      { title: 'Obra civil y modernización de fachada', status: 'PENDIENTE', date: 'May - Sep 2026' },
      { title: 'Arrendamiento a firma corporativa', status: 'PENDIENTE', date: 'Dic 2026' },
    ],
  },
  {
    id: 'PRJ-003',
    code: 'PRJ-AUTO-2026-02',
    name: 'Flotilla 5 Tractocamiones Ligeros Monterrey',
    category: 'VEHICULAR',
    manager: 'Ing. Carlos Mendoza Silva',
    budgetTotal: '$500,000.00 MXN',
    budgetTotalNum: 500000,
    spentAmount: '$0.00 MXN',
    spentAmountNum: 0,
    progressPercent: 0,
    expectedRoi: '25.0% Estimado (8 meses)',
    timeline: 'En Dictamen Técnico',
    status: 'EVALUACION',
    description:
      'Propuesta de financiamiento para compra de flotilla de carga mediana con contrato previo de renta a empresa de paquetería.',
    milestones: [
      { title: 'Dictamen de viabilidad financiera y mecánica', status: 'EN_PROCESO', date: 'En revisión' },
      { title: 'Votación del Comité de Inversiones', status: 'PENDIENTE', date: 'Por programar' },
    ],
  },
];

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'VEHICULAR' | 'INMOBILIARIO' | 'COMERCIAL'>('VEHICULAR');
  const [newBudget, setNewBudget] = useState('');
  const [newManager, setNewManager] = useState('');
  const [newRoi, setNewRoi] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBudget) return;

    const budgetVal = parseFloat(newBudget) || 300000;
    const project: ProjectData = {
      id: `PRJ-${String(projects.length + 1).padStart(3, '0')}`,
      code: `PRJ-INV-2026-0${projects.length + 1}`,
      name: newName,
      category: newCategory,
      manager: newManager || 'Comité de Inversiones',
      budgetTotal: `$${budgetVal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`,
      budgetTotalNum: budgetVal,
      spentAmount: '$0.00 MXN',
      spentAmountNum: 0,
      progressPercent: 0,
      expectedRoi: newRoi ? `${newRoi}% Anual` : '20.0% Estimado',
      timeline: '2026 - 2027',
      status: 'EVALUACION',
      description: 'Proyecto registrado para dictamen del Comité de Inversiones de Grupo Prisma.',
      milestones: [
        { title: 'Registro y asignación de gestor', status: 'COMPLETADO', date: 'Hoy' },
        { title: 'Aprobación presupuestal', status: 'PENDIENTE', date: 'Por definir' },
      ],
    };

    setProjects([...projects, project]);
    setShowNewModal(false);
    setToastMessage(`Proyecto ${project.code} añadido a la cartera de inversión.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const totalBudget = projects.reduce((acc, p) => acc + p.budgetTotalNum, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spentAmountNum, 0);

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
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Cartera de Proyectos de Inversión
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de remates vehiculares e inmobiliarios ejecutados con fondos de Grupo Prisma S.A.P.I. de C.V.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo Proyecto de Inversión
        </button>
      </div>

      {/* Métricas de Cartera */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Cartera Activa
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {projects.length} Proyectos
          </span>
          <span className="text-xs text-purple-600 font-semibold mt-0.5 block">
            2 en ejecución / 1 en dictamen
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Presupuesto Asignado
          </span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">
            ${totalBudget.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            MXN comprometidos
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Capital Ejercido
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            ${totalSpent.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            {((totalSpent / totalBudget) * 100).toFixed(1)}% de ejecución global
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Rendimiento Promedio
          </span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">
            21.8%
          </span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">
            ROI ponderado anual
          </span>
        </div>
      </div>

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5">
              {/* Top Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      project.category === 'VEHICULAR'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {project.code}
                  </span>
                  <span className="ml-1.5 text-[10px] text-slate-400 uppercase font-semibold">
                    {project.category}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    project.status === 'EN_EJECUCION'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {project.status === 'EN_EJECUCION' ? 'EN EJECUCIÓN' : 'EN EVALUACIÓN'}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-slate-900 text-sm mt-3 leading-snug">
                {project.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Financiero */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Presupuesto Aprobado:</span>
                  <span className="font-bold text-slate-900">{project.budgetTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Capital Ejercido:</span>
                  <span className="font-bold text-slate-900">{project.spentAmount}</span>
                </div>

                {/* Barra de Progreso */}
                <div className="pt-1">
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="text-slate-400">Avance Financiero</span>
                    <span className="font-bold text-slate-700">{project.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        project.category === 'VEHICULAR' ? 'bg-amber-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Info Extra */}
              <div className="mt-4 bg-slate-50 rounded-xl p-3 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Gestor:</span>
                  <span className="font-medium text-slate-900">{project.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Retorno (ROI):</span>
                  <span className="font-bold text-emerald-600">{project.expectedRoi}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vigencia:</span>
                  <span className="text-slate-500">{project.timeline}</span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-4 bg-slate-50/60 border-t border-slate-100">
              <button
                onClick={() => setSelectedProject(project)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-purple-50 hover:border-purple-300 text-purple-700 font-bold text-xs transition-all shadow-sm flex items-center justify-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                <span>Ver Hitos y Dictamen Técnico</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detalle de Proyecto */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-purple-300 uppercase">
                  {selectedProject.code} — {selectedProject.category}
                </span>
                <h3 className="text-base font-bold mt-0.5">{selectedProject.name}</h3>
                <p className="text-xs text-purple-200 mt-1">
                  Responsable: {selectedProject.manager}
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                  Descripción y Alcance
                </span>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Presupuesto
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {selectedProject.budgetTotal}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    ROI Estimado
                  </span>
                  <span className="font-bold text-emerald-600 text-sm mt-0.5 block">
                    {selectedProject.expectedRoi}
                  </span>
                </div>
              </div>

              {/* Hitos */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-purple-600" />
                  Hitos Operativos del Proyecto
                </h4>
                <div className="space-y-2">
                  {selectedProject.milestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        {milestone.status === 'COMPLETADO' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : milestone.status === 'EN_PROCESO' ? (
                          <Clock className="w-4 h-4 text-amber-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                        )}
                        <span className="font-medium text-slate-800">{milestone.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {milestone.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Proyecto */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-purple-600 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Registrar Proyecto de Inversión</h3>
                <p className="text-xs text-purple-100">Grupo Prisma S.A.P.I. de C.V.</p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Proyecto:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Remate Bodega Industrial Guadalupe"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="VEHICULAR">Vehicular / Subasta</option>
                    <option value="INMOBILIARIO">Inmobiliario / Flip</option>
                    <option value="COMERCIAL">Comercial / Maquinaria</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Presupuesto (MXN):</label>
                  <input
                    type="number"
                    required
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="Ej. 450000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Responsable Operativo:</label>
                <input
                  type="text"
                  value={newManager}
                  onChange={(e) => setNewManager(e.target.value)}
                  placeholder="Ej. Ing. Carlos Mendoza Silva"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ROI Proyectado (% Anual):</label>
                <input
                  type="number"
                  value={newRoi}
                  onChange={(e) => setNewRoi(e.target.value)}
                  placeholder="Ej. 24"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono"
                />
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
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20"
                >
                  Registrar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
