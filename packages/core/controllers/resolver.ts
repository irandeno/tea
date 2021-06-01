import { Context, Handler, TelegramAdapter } from "../adapters/mod.ts";
import { Container } from "../injector/mod.ts";
import { ParamMetadata, UpdateType } from "../../common/mod.ts";
import { paramFactory } from "./param-factory.ts";
import parse from "./response-parser.ts";

type anyObject = Record<string, any>;

export class ControllerResolver {
  constructor(private container: Container, private adapter: TelegramAdapter) {}

  public resolve() {
    const modules = this.container.getModules();
    modules.forEach((module) => {
      const controllers = module.getControllers();

      controllers.forEach(({ instance }, controllerType) => {
        const instancePrototype = Object.getPrototypeOf(instance);
        const methodNames = Object.getOwnPropertyNames(
          instancePrototype,
        ).filter((method) => method !== "constructor");
        const updateTypes =
          Reflect.getMetadata<UpdateType[]>("updateTypes", controllerType) ||
          [];
        this.adapter.addUpdateTypes(updateTypes);
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
        if (typeof trigger === "undefined") {
          return;
        }
        this.createListener(listenerType, trigger, method, instance);
      });
    });
  }

  private createListener(
    listenerType: string | symbol,
    trigger: string | RegExp,
    method: any,
    instance: anyObject,
  ) {
    switch (listenerType) {
      case "hears":
        return this.adapter.hears(
          trigger,
          this.createHandler(method, instance),
        );
      case "command":
        if (trigger instanceof RegExp) {
          return this.adapter.hears(
            trigger,
            this.createHandler(method, instance),
          );
        }
        return this.adapter.command(
          trigger,
          this.createHandler(method, instance),
        );
      default:
        throw new Error(
          `unrecognized listener type : "${listenerType.toString()}"`,
        );
    }
  }

  private createHandler(
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
