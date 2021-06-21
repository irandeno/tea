import { CanActivate, ExecutionContext } from "../../../packages/common/mod.ts";

const allowedStatuses = ["creator", "administrator", "member"];

export class SubscriptionGuard implements CanActivate {
  async canActivate(executionContext: ExecutionContext) {
    const context = executionContext.getContext();
    const senderId = context.from.id;
    const member = await context.api.getChatMember("@channel", senderId);
    return allowedStatuses.includes(member.status);
  }
}
