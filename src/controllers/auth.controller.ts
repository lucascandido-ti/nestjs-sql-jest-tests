import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

import { Error } from '@/interfaces';

import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Body() body: { email: string; password: string }): Promise<string | Error> {
    return await this.authService.login(body.email, body.password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.ACCEPTED)
  async logout(@Body() body: { token: string }): Promise<Error | {logout: boolean}> {
    return await this.authService.logout(body.token);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.ACCEPTED)
  async resetPassword(
    @Body() body: { email: string, password: string, newPassword: string },
  ): Promise<{passwordChange: boolean} | Error> {
    return await this.authService.resetPassword(body.email, body.password, body.newPassword);
  }
}