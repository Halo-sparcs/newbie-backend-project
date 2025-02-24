import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class IsUserGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // Handle any authentication errors
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest();
    const fieldName = this.reflector.get<string>('fieldName', context.getHandler());

    if (!fieldName) { // not using SetField
      return user;
    }

    const method = request.method;

    let fieldValue;

    if (method === 'GET') {
      if (request.query) {
        fieldValue = request.query[fieldName];
      }
      if (request.param) {
        fieldValue = request.params[fieldName];
      }
    }

    if (method === 'POST') {
      fieldValue = request.body[fieldName];
    }

    console.log(fieldValue);

    if (user.user_id !== Number(fieldValue)) {
      throw new ForbiddenException(`User id not match the ${fieldName}`);
    }

    return user;
  }
}
