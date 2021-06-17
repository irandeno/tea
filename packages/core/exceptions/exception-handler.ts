import { Context, TelegramAdapter } from "../adapters/telegram.abstract.ts";
import { ExceptionHandler as IExceptionHandler } from "../../common/interfaces/mod.ts";
import { ExecutionContextHost } from "../execution-context-host.ts";
import { Type } from "../../common/interfaces/mod.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";

interface ExceptionHandlerProperties {
  instance: IExceptionHandler;
  exceptionTypes: Type<Error>[];
}

export class ExceptionHandler {
  private handlers: ExceptionHandlerProperties[] = [];

  constructor(private adapter: TelegramAdapter) {}

  handle(
    exception: Error,
    context: Context,
    controllerInstance: Controller,
    callback: (...args: any) => any,
  ) {
    if (
      this.handleByCustomHandlers(
        exception,
        context,
        controllerInstance,
        callback,
      )
    ) {
      return;
    }
    this.adapter.reply(exception.message, context);
  }

  setCustomHandlers(handlers: ExceptionHandlerProperties[]) {
    this.handlers = handlers;
  }

  handleByCustomHandlers(
    exception: Error,
    context: Context,
    controllerInstance: Controller,
    callback: (...args: any) => any,
  ) {
    if (this.handlers.length === 0) return false;
    for (const handler of this.handlers) {
      const isExceptionRelevant = handler.exceptionTypes.length > 0
        ? handler.exceptionTypes.some((exceptionType) => {
          return exception instanceof exceptionType;
        })
        : true;
      if (isExceptionRelevant) {
        const executionContextHost = this.createExecutionContextHost(
          controllerInstance,
          callback,
          context,
        );
        handler.instance.handle(executionContextHost, exception);
      }
    }
    return true;
  }

  createExecutionContextHost(
    controllerInstance: Controller,
    callback: (...args: any) => any,
    context: Context,
  ) {
    return new ExecutionContextHost(
      controllerInstance.constructor,
      callback,
      context,
    );
  }
}
