import {
  Catch,
  ExceptionHandler,
  ExecutionContext,
} from "../../../packages/common/mod.ts";

@Catch()
export class GeneralExceptionHandler implements ExceptionHandler {
  handle(executionContext: ExecutionContext, exception: Error) {
    const context = executionContext.getContext();
    context.reply(`unknown error occurred : ${exception.message}`);
  }
}
