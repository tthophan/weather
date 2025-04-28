import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AUTHORIZATION } from 'src/constants';
import { NOT_REQUIRE_AUTHENTICATION } from './metadata.constant';

export const NotRequireAuthentication = () =>
  SetMetadata(NOT_REQUIRE_AUTHENTICATION, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handler = context.getHandler();
    const isNotRequireAuth = this.reflector.getAllAndOverride<boolean>(
      NOT_REQUIRE_AUTHENTICATION,
      [handler, context.getClass()],
    );

    if (isNotRequireAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const accessToken =
      request.header(AUTHORIZATION) ||
      request.header(AUTHORIZATION.toUpperCase());
    if (accessToken) {
      try {
        const token = accessToken.split(' ')[1];
        const userInfo = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString(),
        );
        request.context.userInfo = {
          userId: userInfo?.sub,
          deviceId: userInfo?.uniqueDeviceId,
        };

        if (userInfo?.uniqueDeviceId) {
          request.context.deviceId = userInfo.uniqueDeviceId;
        }
        return true;
      } catch (error) {
        console.warn('Error parsing user info', error);
      }
    }
    if (request.context.userInfo) {
      return true;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
