import { ContextCreator } from "../context-creator.ts";
import { Type } from "../../common/interfaces/mod.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";
import * as constants from "../../common/constants.ts";

export class GuardsContextCreator extends ContextCreator {
  create(controllerType: Type<Controller>, callback: (...args: any[]) => any) {
    const guards = this.createContext(
      controllerType,
      callback,
      constants.GUARDS_METADATA,
    );
    return guards.filter(
      (guard) =>
        guard && guard.canActivate && typeof guard.canActivate === "function",
    );
  }

  createConcreteContext(metadata: any, controllerType: Type<Controller>) {
    if (
      typeof metadata === "undefined" ||
      (Array.isArray(metadata) && metadata.length === 0)
    ) {
      return [];
    }
    return metadata.map((guard: any) => {
      return this.getInstanceByMetatype(guard, controllerType);
    });
  }
}
