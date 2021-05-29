import { TelegramAdapter } from "../adapters/mod.ts";
import { Container } from "../injector/mod.ts";
import parse from "./response-parser.ts";
import { paramFactory } from "./param-factory.ts";

type anyObject = Record<string, any>;

export class ControllerResolver {
  constructor(private container: Container, private adapter: TelegramAdapter) {}

  public resolve() {
    const modules = this.container.getModules();
    modules.forEach((module) => {
      const controllers = module.getControllers();
      controllers.forEach(({ instance }) => {
        const instancePrototype = Object.getPrototypeOf(instance);
        const methodNames = Object.getOwnPropertyNames(
          instancePrototype,
        ).filter((method) => method !== "constructor");
        this.bindListenersToAdapter(methodNames, instancePrototype, instance);
      });
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
        const trigger = Reflect.getMetadata<string>(listenerType, method);
        const callback = method;
        if (typeof trigger === "string") {
          this.adapter.hears(
            trigger,
            this.createMiddleware(callback, instance),
          );
        }
      });
    });
  }

  private createMiddleware(
    callback: (...args: any) => any,
    instance: anyObject,
  ) {
    return (ctx: any) => {
      const paramMetadata =
        Reflect.getMetadata("params", instance, callback.name) || [];
      const paramArgs = paramFactory(paramMetadata, ctx);
      const message = parse(callback.call(instance, ...paramArgs));
      this.adapter.reply(message, ctx);
    };
  }
}
