import { ContextCreator } from "../context-creator.ts";
import { ExceptionHandler } from "./exception-handler.ts";
import { TelegramAdapter } from "../adapters/telegram.abstract.ts";
import { Type } from "../../common/interfaces/mod.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";
import * as constants from "../../common/constants.ts";

export class ExceptionHandlerContextCreator extends ContextCreator {
  create(
    adapter: TelegramAdapter,
    controllerType: Type<Controller>,
    callback: (...args: any[]) => any,
  ): ExceptionHandler {
    const exceptionHandler = new ExceptionHandler(adapter);
    const handlers = this.createContext(
      controllerType,
      callback,
      constants.EXCEPTION_HANDLERS_METADATA,
    );
    if (handlers.length === 0) {
      return exceptionHandler;
    }
    exceptionHandler.setCustomHandlers(handlers.reverse());
    return exceptionHandler;
  }

  createConcreteContext(metadata: any, controllerType: Type<Controller>) {
    if (
      typeof metadata === "undefined" ||
      (Array.isArray(metadata) && metadata.length === 0)
    ) {
      return [];
    }
    return metadata.map((metatype: any) => ({
      instance: this.getInstanceByMetatype(metatype, controllerType),
      exceptionTypes: this.getExceptionTypes(metatype),
    }));
  }

  getExceptionTypes(metatype: any) {
    return Reflect.getMetadata(constants.CATCH_METADATA, metatype) || [];
  }
}
