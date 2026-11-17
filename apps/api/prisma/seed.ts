import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra de datos maestros (Seed) para Grupo Prisma S.A.P.I. de C.V....');

  // Limpiar datos existentes en orden inverso de dependencias para evitar colisiones en re-ejecución
  await prisma.accountMovement.deleteMany({});
  await prisma.approvalSignature.deleteMany({});
  await prisma.approvalRequest.deleteMany({});
  await prisma.financialOperation.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.partner.deleteMany({});
  await prisma.userRole.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Tablas limpiadas exitosamente.');

  // ----------------------------------------------------------------------------
  // 1. Roles del Sistema
  // ----------------------------------------------------------------------------
  const rolesData = [
    { code: 'SUPER_ADMIN', name: 'Super Administrador', description: 'Gobernanza corporativa, administración del padrón de socios y configuración.' },
    { code: 'PARTNER', name: 'Socio Inversionista', description: 'Acceso a estados de cuenta de aportaciones, dashboard patrimonial y dividendos.' },
    { code: 'TREASURER', name: 'Tesorero del Grupo', description: 'Gestión operativa de cuentas bancarias, transferencias y ejecución de desembolsos.' },
    { code: 'FINANCE_APPROVER', name: 'Autorizador Financiero', description: 'Facultad para emitir Firma 1 o Firma 2 en solicitudes de operación financiera.' },
    { code: 'PROJECT_MANAGER', name: 'Gestor de Proyectos', description: 'Líder responsable de proyectos de inversión vehiculares o inmobiliarios.' },
    { code: 'PROJECT_MEMBER', name: 'Miembro Operativo', description: 'Colaborador técnico en el seguimiento y ejecución de proyectos.' },
  ];

  const roles: Record<string, any> = {};
  for (const r of rolesData) {
    roles[r.code] = await prisma.role.create({ data: r });
  }
  console.log(`✅ ${Object.keys(roles).length} roles creados.`);

  // ----------------------------------------------------------------------------
  // 2. Permisos Granulares y Asignación
  // ----------------------------------------------------------------------------
  const permissionsData = [
    { code: 'users:read', description: 'Ver catálogo de usuarios' },
    { code: 'users:manage', description: 'Crear y editar usuarios y asignación de roles' },
    { code: 'partners:read', description: 'Consultar padrón de socios y tenencia' },
    { code: 'partners:manage', description: 'Administrar socios y participaciones' },
    { code: 'projects:read', description: 'Ver proyectos y avances' },
    { code: 'projects:manage', description: 'Crear proyectos y presupuestos' },
    { code: 'treasury:read', description: 'Consultar saldos y cuentas de tesorería' },
    { code: 'treasury:operate', description: 'Solicitar egresos, ingresos y transferencias' },
    { code: 'treasury:execute', description: 'Registrar la dispersión bancaria real en el libro mayor' },
    { code: 'finance:approve', description: 'Emitir firmas de autorización financiera independiente' },
    { code: 'ledger:read', description: 'Consultar libro mayor inmutable de movimientos' },
    { code: 'audit:read', description: 'Inspeccionar bitácora de auditoría' },
  ];

  const permissions: Record<string, any> = {};
  for (const p of permissionsData) {
    permissions[p.code] = await prisma.permission.create({ data: p });
  }

  // Vincular permisos al rol SUPER_ADMIN
  for (const p of Object.values(permissions)) {
    await prisma.rolePermission.create({
      data: { roleId: roles['SUPER_ADMIN'].id, permissionId: p.id },
    });
  }

  // Vincular permisos a TREASURER
  const treasurerPerms = ['treasury:read', 'treasury:operate', 'treasury:execute', 'ledger:read', 'projects:read'];
  for (const code of treasurerPerms) {
    await prisma.rolePermission.create({
      data: { roleId: roles['TREASURER'].id, permissionId: permissions[code].id },
    });
  }

  // Vincular permisos a FINANCE_APPROVER
  const approverPerms = ['treasury:read', 'finance:approve', 'projects:read', 'ledger:read'];
  for (const code of approverPerms) {
    await prisma.rolePermission.create({
      data: { roleId: roles['FINANCE_APPROVER'].id, permissionId: permissions[code].id },
    });
  }

  console.log(`✅ ${Object.keys(permissions).length} permisos granulares configurados.`);

  // ----------------------------------------------------------------------------
  // 3. Usuarios y Socios Fundadores (10 Socios al 10% Paritario = 10,000 bps)
  // ----------------------------------------------------------------------------
  // Hash bcrypt estándar para la contraseña inicial de prueba: "Prisma2026!"
  const defaultPasswordHash = '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm';

  const sociosData = [
    {
      email: 'director@grupoprisma.com.mx',
      fullName: 'Lic. Roberto Valdez Morales',
      legalName: 'Roberto Valdez Morales',
      rfc: 'VAMR800101XYZ',
      phone: '+52 844 111 2233',
      roles: ['SUPER_ADMIN', 'PARTNER', 'FINANCE_APPROVER'],
    },
    {
      email: 'tesorero@grupoprisma.com.mx',
      fullName: 'C.P. Russiele Gamiño Valdez',
      legalName: 'Russiele Gamiño Valdez',
      rfc: 'GAVR850202ABC',
      phone: '+52 844 222 3344',
      roles: ['TREASURER', 'PARTNER'],
    },
    {
      email: 'autorizador1@grupoprisma.com.mx',
      fullName: 'Ing. Carlos Mendoza Alatorre',
      legalName: 'Carlos Mendoza Alatorre',
      rfc: 'MEAC790303DEF',
      phone: '+52 844 333 4455',
      roles: ['FINANCE_APPROVER', 'PARTNER'],
    },
    {
      email: 'autorizador2@grupoprisma.com.mx',
      fullName: 'Mtra. Sofía Garza Villarreal',
      legalName: 'Sofía Garza Villarreal',
      rfc: 'GAVS820404GHI',
      phone: '+52 844 444 5566',
      roles: ['FINANCE_APPROVER', 'PARTNER'],
    },
    {
      email: 'proyectos.auto@grupoprisma.com.mx',
      fullName: 'Lic. Alejandro Ramos Arizpe',
      legalName: 'Alejandro Ramos Arizpe',
      rfc: 'RAAA810505JKL',
      phone: '+52 844 555 6677',
      roles: ['PROJECT_MANAGER', 'PARTNER'],
    },
    {
      email: 'proyectos.inm@grupoprisma.com.mx',
      fullName: 'Arq. Mariana Treviño Cantú',
      legalName: 'Mariana Treviño Cantú',
      rfc: 'TRCM860606MNO',
      phone: '+52 844 666 7788',
      roles: ['PROJECT_MANAGER', 'PARTNER'],
    },
    {
      email: 'socio7@grupoprisma.com.mx',
      fullName: 'Dr. Fernando Ortiz Monasterio',
      legalName: 'Fernando Ortiz Monasterio',
      rfc: 'OIMF780707PQR',
      phone: '+52 844 777 8899',
      roles: ['PARTNER'],
    },
    {
      email: 'socio8@grupoprisma.com.mx',
      fullName: 'Lic. Gabriela Hinojosa Elizondo',
      legalName: 'Gabriela Hinojosa Elizondo',
      rfc: 'HIEG840808STU',
      phone: '+52 844 888 9900',
      roles: ['PARTNER'],
    },
    {
      email: 'socio9@grupoprisma.com.mx',
      fullName: 'Ing. Javier Zúñiga Benavides',
      legalName: 'Javier Zúñiga Benavides',
      rfc: 'ZUBJ830909VWX',
      phone: '+52 844 999 0011',
      roles: ['PARTNER'],
    },
    {
      email: 'socio10@grupoprisma.com.mx',
      fullName: 'Lic. Patricia Salgado Cárdenas',
      legalName: 'Patricia Salgado Cárdenas',
      rfc: 'SACP871010YZA',
      phone: '+52 844 000 1122',
      roles: ['PARTNER'],
    },
  ];

  const createdUsers: Record<string, any> = {};
  const createdPartners: Record<string, any> = {};

  for (const s of sociosData) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash: defaultPasswordHash,
        fullName: s.fullName,
        isActive: true,
      },
    });
    createdUsers[s.email] = user;

    // Asignar roles al usuario
    for (const rCode of s.roles) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: roles[rCode].id,
        },
      });
    }

    // Crear expediente de socio (10% paritario = 1,000 bps)
    const partner = await prisma.partner.create({
      data: {
        userId: user.id,
        legalName: s.legalName,
        rfc: s.rfc,
        phone: s.phone,
        status: 'ACTIVO',
        sharesBasisPoints: 1000,
      },
    });
    createdPartners[s.email] = partner;
  }

  console.log(`✅ 10 Socios Fundadores creados con participación del 10.00% cada uno (Total: 10,000 bps = 100.00%).`);

  // ----------------------------------------------------------------------------
  // 4. Cuentas de Tesorería
  // ----------------------------------------------------------------------------
  const accountsData = [
    {
      name: 'Banorte Concentradora Fondos',
      accountType: 'BANCARIA',
      accountNumber: '072180001234567890',
      currency: 'MXN',
      balanceCents: BigInt(50000000), // $500,000.00 MXN
      isActive: true,
    },
    {
      name: 'BBVA Cuenta Operativa Proyectos',
      accountType: 'BANCARIA',
      accountNumber: '012180009876543210',
      currency: 'MXN',
      balanceCents: BigInt(25000000), // $250,000.00 MXN
      isActive: true,
    },
    {
      name: 'Caja Chica Administración',
      accountType: 'CAJA_CHICA',
      accountNumber: 'CAJA-CHICA-01',
      currency: 'MXN',
      balanceCents: BigInt(1500000), // $15,000.00 MXN
      isActive: true,
    },
    {
      name: 'Fondo Inversión Fiduciario',
      accountType: 'FONDO_INVERSION',
      accountNumber: 'FID-INVER-2026',
      currency: 'MXN',
      balanceCents: BigInt(100000000), // $1,000,000.00 MXN
      isActive: true,
    },
  ];

  const createdAccounts: Record<string, any> = {};
  for (const a of accountsData) {
    const acc = await prisma.account.create({ data: a });
    createdAccounts[a.name] = acc;
  }
  console.log(`✅ ${Object.keys(createdAccounts).length} cuentas de tesorería registradas.`);

  // ----------------------------------------------------------------------------
  // 5. Proyectos de Inversión (Remates de Vehículos e Inmuebles)
  // ----------------------------------------------------------------------------
  const projectAuto = await prisma.project.create({
    data: {
      code: 'PRJ-AUTO-2026-01',
      name: 'Remate Vehicular Lote 14 - Monterrey',
      description: 'Adquisición, reacondicionamiento mecánico y venta de lote de 3 camionetas SUV recuperadas de aseguradora.',
      category: 'VEHICULAR',
      status: 'ACTIVO',
      budgetAmountCents: BigInt(35000000), // $350,000.00 MXN
      progressPercentage: 45,
      managerPartnerId: createdPartners['proyectos.auto@grupoprisma.com.mx'].id,
      managerUserId: createdUsers['proyectos.auto@grupoprisma.com.mx'].id,
      startDate: new Date('2026-10-01'),
      estimatedEndDate: new Date('2026-12-15'),
    },
  });

  const projectInm = await prisma.project.create({
    data: {
      code: 'PRJ-INM-2026-01',
      name: 'Remate Bancario Inmueble Saltillo Centro',
      description: 'Adjudicación en litigio y remodelación estética de casa habitación para venta comercial.',
      category: 'INMOBILIARIO',
      status: 'PLANEACION',
      budgetAmountCents: BigInt(85000000), // $850,000.00 MXN
      progressPercentage: 15,
      managerPartnerId: createdPartners['proyectos.inm@grupoprisma.com.mx'].id,
      managerUserId: createdUsers['proyectos.inm@grupoprisma.com.mx'].id,
      startDate: new Date('2026-11-01'),
      estimatedEndDate: new Date('2027-03-30'),
    },
  });

  console.log(`✅ 2 proyectos de inversión creados (Vehicular e Inmobiliario).`);

  // ----------------------------------------------------------------------------
  // 6. Operación Financiera 1: Egreso Ejecutado con Doble Firma y Movimiento Contable
  // ----------------------------------------------------------------------------
  const op1 = await prisma.financialOperation.create({
    data: {
      code: 'OP-2026-0001',
      concept: 'Anticipo para adquisición en subasta de lote vehicular #14',
      amountCents: BigInt(12500000), // $125,000.00 MXN
      revertedAmountCents: BigInt(1500000), // Se le aplicará reversión parcial de $15,000
      operationType: 'EGRESO',
      status: 'EJECUTADO',
      sourceAccountId: createdAccounts['Banorte Concentradora Fondos'].id,
      projectId: projectAuto.id,
      createdById: createdUsers['proyectos.auto@grupoprisma.com.mx'].id,
      executedById: createdUsers['tesorero@grupoprisma.com.mx'].id,
      createdAt: new Date('2026-10-05T10:00:00Z'),
    },
  });

  // Solicitud de aprobación de la Operación 1 (con 2 firmas independientes)
  const appReq1 = await prisma.approvalRequest.create({
    data: {
      financialOperationId: op1.id,
      status: 'APROBADO',
      requiredSignatures: 2,
      currentSignatures: 2,
    },
  });

  // Firma 1 emitida por Carlos Mendoza (FINANCE_APPROVER)
  await prisma.approvalSignature.create({
    data: {
      approvalRequestId: appReq1.id,
      authorizerUserId: createdUsers['autorizador1@grupoprisma.com.mx'].id,
      signatureOrder: 1,
      action: 'APROBAR',
      notes: 'Licitación y avalúo preliminar revisados conforme a reglas.',
      ipAddress: '192.168.1.101',
      signedAt: new Date('2026-10-05T11:30:00Z'),
    },
  });

  // Firma 2 emitida por Sofía Garza (FINANCE_APPROVER) - Distinta al solicitante y al primer autorizador
  await prisma.approvalSignature.create({
    data: {
      approvalRequestId: appReq1.id,
      authorizerUserId: createdUsers['autorizador2@grupoprisma.com.mx'].id,
      signatureOrder: 2,
      action: 'APROBAR',
      notes: 'Segunda firma otorgada tras verificar saldo en cuenta concentradora.',
      ipAddress: '192.168.1.102',
      signedAt: new Date('2026-10-05T14:15:00Z'),
    },
  });

  // Movimiento contable en libro mayor inmutable (CARGO) ejecutado por el Tesorero
  await prisma.accountMovement.create({
    data: {
      accountId: createdAccounts['Banorte Concentradora Fondos'].id,
      financialOperationId: op1.id,
      movementType: 'CARGO',
      amountCents: BigInt(12500000),
      resultingBalanceCents: BigInt(37500000), // $375,000.00 MXN tras el cargo
      bankReference: 'SPEI-BANORTE-882194',
      registeredById: createdUsers['tesorero@grupoprisma.com.mx'].id,
      registeredAt: new Date('2026-10-05T16:00:00Z'),
    },
  });

  console.log(`✅ Operación 1 (Egreso ejecutado con 2 firmas y movimiento) creada.`);

  // ----------------------------------------------------------------------------
  // 7. Operación Financiera 2: Reversión Parcial 1:N Vinculada a Operación 1
  // ----------------------------------------------------------------------------
  const op2Reversion = await prisma.financialOperation.create({
    data: {
      code: 'OP-2026-0002',
      concept: 'Reversión parcial: Devolución por excedente en arancel de subasta vehicular',
      amountCents: BigInt(1500000), // $15,000.00 MXN
      operationType: 'REVERSION_EGRESO',
      status: 'EJECUTADO',
      sourceAccountId: createdAccounts['Banorte Concentradora Fondos'].id,
      projectId: projectAuto.id,
      createdById: createdUsers['proyectos.auto@grupoprisma.com.mx'].id,
      executedById: createdUsers['tesorero@grupoprisma.com.mx'].id,
      confirmationRef: 'NC-SUBASTAS-2026-991',
      confirmationDate: new Date('2026-10-10'),
      reversalOfOperationId: op1.id, // Enlace autorreferencial 1:N a la operacion origen
      createdAt: new Date('2026-10-10T09:00:00Z'),
    },
  });

  // Movimiento contable compensatorio en libro mayor (ABONO) que reingresa los fondos
  await prisma.accountMovement.create({
    data: {
      accountId: createdAccounts['Banorte Concentradora Fondos'].id,
      financialOperationId: op2Reversion.id,
      movementType: 'ABONO',
      amountCents: BigInt(1500000),
      resultingBalanceCents: BigInt(39000000), // $390,000.00 MXN tras reingreso
      bankReference: 'SPEI-DEV-00192',
      registeredById: createdUsers['tesorero@grupoprisma.com.mx'].id,
      registeredAt: new Date('2026-10-10T12:00:00Z'),
    },
  });

  console.log(`✅ Operación 2 (Reversión parcial 1:N demostrada con movimiento) creada.`);

  // ----------------------------------------------------------------------------
  // 8. Operación Financiera 3: En Proceso de Aprobación (Demostración de PENDIENTE_2)
  // ----------------------------------------------------------------------------
  const op3 = await prisma.financialOperation.create({
    data: {
      code: 'OP-2026-0003',
      concept: 'Pago de honorarios periciales y notariales inmueble Saltillo Centro',
      amountCents: BigInt(4800000), // $48,000.00 MXN
      operationType: 'EGRESO',
      status: 'PENDIENTE_AUTORIZACION_2',
      sourceAccountId: createdAccounts['BBVA Cuenta Operativa Proyectos'].id,
      projectId: projectInm.id,
      createdById: createdUsers['proyectos.inm@grupoprisma.com.mx'].id,
      createdAt: new Date('2026-11-15T08:30:00Z'),
    },
  });

  const appReq3 = await prisma.approvalRequest.create({
    data: {
      financialOperationId: op3.id,
      status: 'PENDIENTE',
      requiredSignatures: 2,
      currentSignatures: 1,
    },
  });

  // Solo Firma 1 registrada por Roberto Valdez (SUPER_ADMIN / FINANCE_APPROVER)
  await prisma.approvalSignature.create({
    data: {
      approvalRequestId: appReq3.id,
      authorizerUserId: createdUsers['director@grupoprisma.com.mx'].id,
      signatureOrder: 1,
      action: 'APROBAR',
      notes: 'Honorarios notariales verificados con presupuesto asignado.',
      ipAddress: '192.168.1.100',
      signedAt: new Date('2026-11-15T10:00:00Z'),
    },
  });

  console.log(`✅ Operación 3 (En revisión con 1 sola firma, sin afectación de saldo) creada.`);

  // ----------------------------------------------------------------------------
  // 9. Registro de Auditoría Inicial
  // ----------------------------------------------------------------------------
  await prisma.auditLog.create({
    data: {
      userId: createdUsers['director@grupoprisma.com.mx'].id,
      action: 'SEED_INITIALIZATION',
      entity: 'SystemDatabase',
      details: JSON.stringify({
        message: 'Base de datos inicializada y poblada con datos maestros ficticios para el MVP.',
        sociosCount: 10,
        cuentasCount: 4,
        proyectosCount: 2,
      }),
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Bitácora de auditoría inicializada.');
  console.log('🎉 Siembra de datos completada exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la siembra de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
