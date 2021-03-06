import { ExceptionHandler } from "../exceptions/exception-handler.ts";
import { Context } from "../adapters/telegram.abstract.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";

export class ListenerProxy {
  async call(
    controllerInstance: Controller,
    callback: (...args: any) => any,
    paramArgs: any[],
    context: Context,
    exceptionHandler: ExceptionHandler,
  ) {
    try {
      return await callback.call(controllerInstance, ...paramArgs);
    } catch (err) {
      exceptionHandler.handle(err, context, controllerInstance, callback);
    }
  }
}
