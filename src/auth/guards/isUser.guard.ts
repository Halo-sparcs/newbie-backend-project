import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class IsUserGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Handle any authentication errors
    console.log(user);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}