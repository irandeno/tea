import { Context, Handler, TelegramAdapter } from "../adapters/mod.ts";
import { Container } from "../injector/mod.ts";
import { ParamMetadata } from "../../common/interfaces/mod.ts";
import { paramFactory } from "./param-factory.ts";
import parse from "./response-parser.ts";

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
        const trigger = Reflect.getMetadata<string | RegExp>(
          listenerType,
          method,
        );
        const callback = method;
        if (typeof trigger === "string" || trigger instanceof RegExp) {
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
  ): Handler {
    return (context: Context) => {
      const paramsMetadata = Reflect.getMetadata<ParamMetadata[]>(
        "params",
        instance,
        callback.name,
      ) || [];
      const paramArgs = paramFactory(paramsMetadata, context);
      const response = parse(
        callback.call(instance, ...paramArgs),
        this.adapter,
      );
      if (typeof response === "string") {
        this.adapter.reply(response, context);
      } else if (Array.isArray(response)) {
        const [message, extra] = response;
        this.adapter.reply(message, context, extra);
      }
    };
  }
}
