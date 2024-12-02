import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  Delete,
  UseGuards,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { loginDto } from './auth.dto';
import { IsUserGuard } from './guards/isUser.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body() body: loginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const Keys = await this.authService.login(body);

    res.cookie('access_token', Keys['accessToken'], {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.cookie('refresh_token', Keys['refreshToken'], {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    const user = await this.userService.getByUserId(body.user_id);
    return { id: user.id, user_id: user.user_id, username: user.username };
  }

  @Post('SignUp')
  async signup(@Body() body) {
    return this.userService.createUser(body);
  }

  @UseGuards(IsUserGuard)
  @Get('logout')
  async logout(@Body() body, @Res() res: Response) {
    await this.authService.logout(body.user_id);
    console.log('done');
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.json({ success: true });
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const accessToken = await this.authService.refresh(refreshToken);
    console.log(accessToken);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return res.json({ success: true, accessToken });
  }

  @UseGuards(IsUserGuard)
  @Delete('/delete/:id')
  async withdraw(@Param('id') id: number, @Res() res: Response) {
    this.authService.withdraw(id);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
