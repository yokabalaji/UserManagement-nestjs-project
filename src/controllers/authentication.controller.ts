import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { LoginDto } from '../dtos/login-dtos';
import { AuthenticationService } from '../services/authentication.service';
import { Public } from 'src/decorators/public-decorator';
import { RtAuthGuard } from 'src/guards/refreshToken-jwt-guard';
import { GetCurrentUser } from 'src/decorators/refreshToken-get-current-user-deco';
import { GetCurrentUserId } from 'src/decorators/refreshToken-get-current-userId-deco';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('authentication')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @UseGuards(RtAuthGuard)
  @ApiSecurity('jwt-auth')
  @Post('refresh')
  async refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return await this.authService.refreshToken(userId, refreshToken);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<string> {
    return await this.authService.sendResetLink(email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<string> {
    return await this.authService.resetPassword(token, newPassword);
  }
}
