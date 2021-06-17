import { ExecutionContext } from "./execution-context.ts";
export interface ExceptionHandler {
  handle(executionContext: ExecutionContext, exception: Error): void;
}
