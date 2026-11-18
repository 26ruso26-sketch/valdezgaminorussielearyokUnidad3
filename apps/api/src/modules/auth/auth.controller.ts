import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    return this.authService.login(loginDto, ipAddress);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: any, @Req() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    return this.authService.logout(user.id, ipAddress);
  }

  // --- Endpoints de Verificación de Mecanismos de Seguridad y RBAC ---

  @Get('check-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  checkAdminAccess(@CurrentUser() user: any) {
    return {
      accessGranted: true,
      message: 'Acceso autorizado exclusivamente para rol SUPER_ADMIN',
      user: { id: user.id, email: user.email, roles: user.roles },
    };
  }

  @Get('check-treasurer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TREASURER')
  checkTreasurerAccess(@CurrentUser() user: any) {
    return {
      accessGranted: true,
      message: 'Acceso autorizado exclusivamente para rol TREASURER',
      user: { id: user.id, email: user.email, roles: user.roles },
    };
  }

  @Get('check-approver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FINANCE_APPROVER')
  checkApproverAccess(@CurrentUser() user: any) {
    return {
      accessGranted: true,
      message: 'Acceso autorizado para usuarios facultados con rol FINANCE_APPROVER',
      user: { id: user.id, email: user.email, roles: user.roles },
    };
  }
}
