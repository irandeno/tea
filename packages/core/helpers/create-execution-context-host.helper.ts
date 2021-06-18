import { ExecutionContextHost } from "../execution-context-host.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";
import { Context } from "../adapters/telegram.abstract.ts";

export function createExecutionContextHost(
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
