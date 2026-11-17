import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: string; phase: string; timestamp: string } {
    return {
      status: 'ok',
      phase: 'FASE 1: Configuración del Entorno y Repositorio Monorepo',
      timestamp: new Date().toISOString(),
    };
  }
}

