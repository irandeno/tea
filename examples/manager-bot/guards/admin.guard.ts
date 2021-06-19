import { CanActivate, ExecutionContext } from "../../../packages/common/mod.ts";

export class AdminGuard implements CanActivate {
  canActivate(executionContext: ExecutionContext) {
    const context = executionContext.getContext();
    const senderId = context.from.id;
    return senderId === 123; // admin user id
  }
}
