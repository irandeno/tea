import {
  Catch,
  ExceptionHandler,
  ExecutionContext,
} from "../../../packages/common/mod.ts";
import { RuinedWord } from "./ruined-word.exception.ts";

@Catch(RuinedWord)
export class RuinExceptionHandler implements ExceptionHandler {
  handle(executionContext: ExecutionContext, exception: RuinedWord) {
    const context = executionContext.getContext();
    const controllerName = executionContext.getClass().name;
    context.reply(
      `Error message occurred in ${controllerName} : ${exception.message}`,
    );
  }
}
