import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDto } from 'src/users/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body): Promise<void> {
    const accessKey = this.authService.login(body.user_id, body.user_pwd);
  }

  @Post('SignUp')
  signup(@Body() body: userDto): Promise<boolean> {
    const res = this.authService.createUser(body);
    return res;
  }
}
