import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: undefined | string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return !data ? request.user : request.user[data];
  },
);
