import { ExceptionHandler } from "../exceptions/exception-handler.ts";
import { anyObject } from "./resolver.ts";
import { Context } from "../adapters/telegram.abstract.ts";

export class HandlerProxy {
  constructor(private exceptionHandler: ExceptionHandler) {}
  call(
    callback: (...args: any) => any,
    instance: anyObject,
    paramArgs: any[],
    context: Context,
  ) {
    try {
      return callback.call(instance, ...paramArgs);
    } catch (err) {
      this.exceptionHandler.handle(err, context);
    }
  }
}
