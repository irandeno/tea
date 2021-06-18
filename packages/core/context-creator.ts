import { Type } from "../common/interfaces/mod.ts";
import { Controller } from "../common/interfaces/controllers/controller.interface.ts";

export abstract class ContextCreator {
  public abstract createConcreteContext(
    metadata: any,
    controller: Type<Controller>,
  ): any;
  createContext(
    controller: Type<Controller>,
    callback: (...args: any[]) => any,
    metadataKey: symbol,
  ) {
    const controllerMetadata = Reflect.getMetadata(metadataKey, controller);
    const callbackMetadata = Reflect.getMetadata(metadataKey, callback);
    return [
      ...this.createConcreteContext(controllerMetadata, controller),
      ...this.createConcreteContext(callbackMetadata, controller),
    ];
  }

  getInstanceByMetatype(metatype: any, controllerType: Type<Controller>) {
    return (controllerType as any)
      .getModule()
      .getInjectables()
      .get(metatype.name).instance;
  }
}
