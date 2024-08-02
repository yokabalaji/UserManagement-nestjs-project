import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../config/types/jwt-payload-types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    console.log(user.sub);
    return user.sub;
  },
);
