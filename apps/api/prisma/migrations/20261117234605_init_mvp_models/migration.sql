-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "legalName" TEXT NOT NULL,
    "rfc" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',
    "sharesBasisPoints" INTEGER NOT NULL DEFAULT 1000,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'VEHICULAR',
    "status" TEXT NOT NULL DEFAULT 'PLANEACION',
    "budgetAmountCents" BIGINT NOT NULL DEFAULT 0,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "managerPartnerId" TEXT,
    "managerUserId" TEXT,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedEndDate" DATETIME,
    "actualEndDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_managerPartnerId_fkey" FOREIGN KEY ("managerPartnerId") REFERENCES "Partner" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_managerUserId_fkey" FOREIGN KEY ("managerUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "accountType" TEXT NOT NULL DEFAULT 'BANCARIA',
    "accountNumber" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "balanceCents" BIGINT NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FinancialOperation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "amountCents" BIGINT NOT NULL,
    "revertedAmountCents" BIGINT NOT NULL DEFAULT 0,
    "operationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE_AUTORIZACION_1',
    "sourceAccountId" TEXT,
    "targetAccountId" TEXT,
    "projectId" TEXT,
    "createdById" TEXT NOT NULL,
    "executedById" TEXT,
    "confirmationRef" TEXT,
    "confirmationDate" DATETIME,
    "reversalOfOperationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinancialOperation_reversalOfOperationId_fkey" FOREIGN KEY ("reversalOfOperationId") REFERENCES "FinancialOperation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FinancialOperation_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FinancialOperation_targetAccountId_fkey" FOREIGN KEY ("targetAccountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FinancialOperation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FinancialOperation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FinancialOperation_executedById_fkey" FOREIGN KEY ("executedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "financialOperationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "requiredSignatures" INTEGER NOT NULL DEFAULT 2,
    "currentSignatures" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ApprovalRequest_financialOperationId_fkey" FOREIGN KEY ("financialOperationId") REFERENCES "FinancialOperation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApprovalSignature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "approvalRequestId" TEXT NOT NULL,
    "authorizerUserId" TEXT NOT NULL,
    "signatureOrder" INTEGER NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'APROBAR',
    "notes" TEXT,
    "ipAddress" TEXT NOT NULL DEFAULT '127.0.0.1',
    "signedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApprovalSignature_approvalRequestId_fkey" FOREIGN KEY ("approvalRequestId") REFERENCES "ApprovalRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApprovalSignature_authorizerUserId_fkey" FOREIGN KEY ("authorizerUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccountMovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "financialOperationId" TEXT NOT NULL,
    "movementType" TEXT NOT NULL,
    "amountCents" BIGINT NOT NULL,
    "resultingBalanceCents" BIGINT NOT NULL,
    "bankReference" TEXT,
    "registeredById" TEXT NOT NULL,
    "registeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccountMovement_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AccountMovement_financialOperationId_fkey" FOREIGN KEY ("financialOperationId") REFERENCES "FinancialOperation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AccountMovement_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_userId_key" ON "Partner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_rfc_key" ON "Partner"("rfc");

-- CreateIndex
CREATE INDEX "Partner_status_idx" ON "Partner"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_category_idx" ON "Project"("category");

-- CreateIndex
CREATE INDEX "Project_managerPartnerId_idx" ON "Project"("managerPartnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountNumber_key" ON "Account"("accountNumber");

-- CreateIndex
CREATE INDEX "Account_accountType_idx" ON "Account"("accountType");

-- CreateIndex
CREATE INDEX "Account_isActive_idx" ON "Account"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialOperation_code_key" ON "FinancialOperation"("code");

-- CreateIndex
CREATE INDEX "FinancialOperation_status_idx" ON "FinancialOperation"("status");

-- CreateIndex
CREATE INDEX "FinancialOperation_operationType_idx" ON "FinancialOperation"("operationType");

-- CreateIndex
CREATE INDEX "FinancialOperation_sourceAccountId_idx" ON "FinancialOperation"("sourceAccountId");

-- CreateIndex
CREATE INDEX "FinancialOperation_targetAccountId_idx" ON "FinancialOperation"("targetAccountId");

-- CreateIndex
CREATE INDEX "FinancialOperation_projectId_idx" ON "FinancialOperation"("projectId");

-- CreateIndex
CREATE INDEX "FinancialOperation_createdById_idx" ON "FinancialOperation"("createdById");

-- CreateIndex
CREATE INDEX "FinancialOperation_reversalOfOperationId_idx" ON "FinancialOperation"("reversalOfOperationId");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalRequest_financialOperationId_key" ON "ApprovalRequest"("financialOperationId");

-- CreateIndex
CREATE INDEX "ApprovalRequest_status_idx" ON "ApprovalRequest"("status");

-- CreateIndex
CREATE INDEX "ApprovalSignature_authorizerUserId_idx" ON "ApprovalSignature"("authorizerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalSignature_approvalRequestId_authorizerUserId_key" ON "ApprovalSignature"("approvalRequestId", "authorizerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalSignature_approvalRequestId_signatureOrder_key" ON "ApprovalSignature"("approvalRequestId", "signatureOrder");

-- CreateIndex
CREATE INDEX "AccountMovement_accountId_idx" ON "AccountMovement"("accountId");

-- CreateIndex
CREATE INDEX "AccountMovement_financialOperationId_idx" ON "AccountMovement"("financialOperationId");

-- CreateIndex
CREATE INDEX "AccountMovement_registeredById_idx" ON "AccountMovement"("registeredById");

-- CreateIndex
CREATE INDEX "AccountMovement_registeredAt_idx" ON "AccountMovement"("registeredAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_idx" ON "AuditLog"("entity");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
