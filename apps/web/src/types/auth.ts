export interface PartnerInfo {
  id: string;
  legalName: string;
  rfc?: string;
  phone?: string;
  status: string;
  sharesBasisPoints: number;
  equityPercentage: string;
  joinedAt?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  permissions: string[];
  partner?: PartnerInfo | null;
  createdAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: User;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
