import { Context, Handler, TelegramAdapter } from "../adapters/mod.ts";
import { ParamMetadata } from "../../common/mod.ts";
import { paramFactory } from "./param-factory.ts";
import { anyObject } from "./resolver.ts";
import parse from "./response-parser.ts";
import * as constants from "../../common/constants.ts";

export class ListenerBuilder {
  constructor(private adapter: TelegramAdapter) {}

  public build(
    listenerType: string | symbol,
    trigger: string | RegExp,
    method: () => any,
    instance: anyObject,
  ) {
    switch (listenerType) {
      case constants.HEARS_METADATA:
        this.adapter.hears(trigger, this.createHandler(method, instance));
      case constants.COMMAND_METADATA:
        if (trigger instanceof RegExp) {
          this.adapter.hears(trigger, this.createHandler(method, instance));
          return;
        }
        this.adapter.command(trigger, this.createHandler(method, instance));
      case constants.CALLBACK_QUERY_METADATA:
        this.adapter.callbackQuery(
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
        context,
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
