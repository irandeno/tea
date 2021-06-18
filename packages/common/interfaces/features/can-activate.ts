import { ExecutionContext } from "../mod.ts";

export interface CanActivate {
  canActivate(executionContext: ExecutionContext): boolean;
}
