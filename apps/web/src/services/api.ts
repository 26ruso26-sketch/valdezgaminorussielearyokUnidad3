import { LoginResponse, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Array.isArray(data.message)
          ? data.message.join('. ')
          : data.message || 'Error en las credenciales proporcionadas';
        throw new ApiError(errorMsg, response.status);
      }

      return data as LoginResponse;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(
        'No se pudo establecer conexión con el servidor backend (NestJS). Verifique que esté ejecutándose en http://localhost:3000.',
        0,
      );
    }
  },

  async getProfile(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.message || 'Sesión inválida o expirada', response.status);
      }

      return data as User;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError('Error de red al consultar el perfil de usuario', 0);
    }
  },

  async logout(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { success: true, message: 'Sesión finalizada localmente' };
      }

      return await response.json();
    } catch {
      return { success: true, message: 'Sesión finalizada localmente' };
    }
  },

  async checkRbacEndpoint(endpoint: 'check-admin' | 'check-treasurer' | 'check-approver', token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      return {
        status: response.status,
        ok: response.ok,
        data,
      };
    } catch (err: any) {
      return {
        status: 0,
        ok: false,
        data: { message: 'Error de red al contactar endpoint protegido' },
      };
    }
  },
};
