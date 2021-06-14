import { TelegramAdapter } from "../adapters/mod.ts";
import { Container } from "../injector/mod.ts";
import { UpdateType } from "../../common/mod.ts";
import { ListenerBuilder } from "./listener-builder.ts";
import { HandlerProxy } from "./handler-proxy.ts";
import { ExceptionHandler } from "../exceptions/mod.ts";
export type anyObject = Record<string, any>;

export class ControllerResolver {
  private listenerBuilder: ListenerBuilder;
  constructor(private container: Container, private adapter: TelegramAdapter) {
    const exceptionHandler = new ExceptionHandler(this.adapter);
    const handlerProxy = new HandlerProxy(exceptionHandler);
    this.listenerBuilder = new ListenerBuilder(this.adapter, handlerProxy);
  }

  public resolve() {
    const modules = this.container.getModules();
    modules.forEach((module) => {
      this.setupControllers(module.getControllers());
    });
  }

  private setupControllers(controllers: Map<any, any>) {
    controllers.forEach(({ instance }, controllerType) => {
      const updateTypes =
        Reflect.getMetadata<UpdateType[]>("updateTypes", controllerType) || [];
      this.adapter.addUpdateTypes(updateTypes);

      const instancePrototype = Object.getPrototypeOf(instance);
      const methodNames = Object.getOwnPropertyNames(instancePrototype).filter(
        (method) => method !== "constructor",
      );
      this.bindListenersToAdapter(methodNames, instancePrototype, instance);
    });
  }

  private bindListenersToAdapter(
    methodNames: string[],
    instancePrototype: anyObject,
    instance: anyObject,
  ) {
    methodNames.forEach((methodName) => {
      const method = instancePrototype[methodName];
      const listeners = Reflect.getMetadataKeys(method);
      listeners.forEach((listenerType) => {
        const trigger = Reflect.getMetadata<string | RegExp>(
          listenerType,
          method,
        );
        if (typeof trigger === "undefined") {
          return;
        }
        this.listenerBuilder.build(listenerType, trigger, method, instance);
      });
    });
  }
}
