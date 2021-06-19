import { CanActivate, ExecutionContext } from "../../../packages/common/mod.ts";

const subscriptions = [123, 456, 789];

export class SubscriptionGuard implements CanActivate {
  canActivate(executionContext: ExecutionContext) {
    const context = executionContext.getContext();
    const senderId = context.from.id;
    return subscriptions.includes(senderId);
  }
}
