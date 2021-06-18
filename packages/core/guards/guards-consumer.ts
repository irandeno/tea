import { CanActivate } from "../../common/mod.ts";
import { createExecutionContextHost } from "../helpers/mod.ts";
import { Context } from "../adapters/telegram.abstract.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";

export class GuardsConsumer {
  tryActivate(
    guards: CanActivate[],
    controllerInstance: Controller,
    callback: (...args: any) => any,
    context: Context,
  ): boolean {
    for (const guard of guards) {
      const executionContextHost = createExecutionContextHost(
        controllerInstance,
        callback,
        context,
      );
      if (guard.canActivate(executionContextHost)) continue;
      return false;
    }
    return true;
  }
}
