import { TelegramAdapter } from "../adapters/mod.ts";
import { Container, InstanceWrapper } from "../injector/mod.ts";
import { UpdateType } from "../../common/mod.ts";
import { ListenerBuilder } from "./listener-builder.ts";
import { ListenerProxy } from "./listener-proxy.ts";
import { ExceptionHandlerContextCreator } from "../exceptions/mod.ts";
import { Type } from "../../common/interfaces/type.interface.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";
import * as constants from "../../common/constants.ts";

export type anyObject = Record<string, any>;

export class ControllerResolver {
  private listenerBuilder: ListenerBuilder;
  private listenerProxy = new ListenerProxy();
  private exceptionHandlerContextCreator = new ExceptionHandlerContextCreator();
  constructor(private container: Container, private adapter: TelegramAdapter) {
    this.listenerBuilder = new ListenerBuilder(
      this.adapter,
      this.listenerProxy,
      this.exceptionHandlerContextCreator,
    );
  }

  public resolve() {
    const modules = this.container.getModules();
    modules.forEach((module) => {
      this.setupControllers(module.getControllers());
    });
  }

  private setupControllers(
    controllers: Map<string, InstanceWrapper<Controller>>,
  ) {
    controllers.forEach(
      ({ instance: controllerInstance, metatype: controllerType }) => {
        if (controllerInstance === null) return;
        const updateTypes = this.getUpdateTypes(controllerType);
        this.adapter.addUpdateTypes(updateTypes);

        const controllerPrototype = Object.getPrototypeOf(controllerInstance);
        const methodNames = Object.getOwnPropertyNames(
          controllerPrototype,
        ).filter((method) => method !== "constructor");

        this.bindListenersToAdapter(
          methodNames,
          controllerInstance,
          controllerType,
          controllerPrototype,
        );
      },
    );
  }

  private getUpdateTypes(controllerType: Type<Controller>) {
    return (
      Reflect.getMetadata<UpdateType[]>(
        constants.UPDATE_TYPES,
        controllerType,
      ) || []
    );
  }

  private bindListenersToAdapter(
    methodNames: string[],
    controllerInstance: Controller,
    controllerType: Type<Controller>,
    controllerPrototype: anyObject,
  ) {
    methodNames.forEach((methodName) => {
      const callback = controllerPrototype[methodName];
      const listeners = Reflect.getMetadataKeys(callback);
      listeners.forEach((listenerType) => {
        const trigger = Reflect.getMetadata<string | RegExp>(
          listenerType,
          callback,
        );
        if (typeof trigger === "undefined") {
          return;
        }
        this.listenerBuilder.build(
          listenerType,
          trigger,
          controllerInstance,
          controllerType,
          callback,
        );
      });
    });
  }
}
