import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        partner: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('La cuenta de usuario se encuentra suspendida o inactiva');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  async login(loginDto: LoginDto, ipAddress: string = '127.0.0.1') {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // Extraer roles asignados
    const roles = user.userRoles.map((ur) => ur.role.code);

    // Extraer permisos únicos consolidados de todos los roles asignados
    const permissionsSet = new Set<string>();
    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        permissionsSet.add(rp.permission.code);
      }
    }
    const permissions = Array.from(permissionsSet);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      roles,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload);

    // Registrar evento en la bitácora inmutable de auditoría
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        details: JSON.stringify({
          email: user.email,
          roles,
          timestamp: new Date().toISOString(),
        }),
        ipAddress,
      },
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRATION || '900s',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles,
        permissions,
        partner: user.partner
          ? {
              id: user.partner.id,
              legalName: user.partner.legalName,
              rfc: user.partner.rfc,
              sharesBasisPoints: user.partner.sharesBasisPoints,
              equityPercentage: `${(user.partner.sharesBasisPoints / 100).toFixed(2)}%`,
            }
          : null,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        partner: {
          select: {
            id: true,
            legalName: true,
            rfc: true,
            phone: true,
            status: true,
            sharesBasisPoints: true,
            joinedAt: true,
          },
        },
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                code: true,
                name: true,
                description: true,
                rolePermissions: {
                  select: {
                    permission: {
                      select: {
                        id: true,
                        code: true,
                        description: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const roles = user.userRoles.map((ur) => ur.role.code);
    const permissions = Array.from(
      new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.code),
        ),
      ),
    );

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      roles,
      permissions,
      partner: user.partner
        ? {
            ...user.partner,
            equityPercentage: `${(user.partner.sharesBasisPoints / 100).toFixed(2)}%`,
          }
        : null,
    };
  }

  async logout(userId: string, ipAddress: string = '127.0.0.1') {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'LOGOUT',
        entity: 'User',
        entityId: userId,
        details: JSON.stringify({
          message: 'Cierre voluntario de sesión registrado',
          timestamp: new Date().toISOString(),
        }),
        ipAddress,
      },
    });

    return {
      success: true,
      message: 'Sesión finalizada exitosamente',
    };
  }
}
