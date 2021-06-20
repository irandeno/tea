import { Context, Handler, TelegramAdapter } from "../adapters/mod.ts";
import { ParamMetadata, ParamType } from "../../common/mod.ts";
import { paramFactory } from "./param-factory.ts";
import { ListenerProxy } from "./listener-proxy.ts";
import { ExceptionHandlerContextCreator } from "../exceptions/mod.ts";
import { Type } from "../../common/interfaces/mod.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";
import { Logger } from "../../services/logger.service.ts";
import { MESSAGES } from "../constants.ts";
import { parse as parsePattern } from "../../deps.ts";
import { GuardsConsumer, GuardsContextCreator } from "../guards/mod.ts";
import parse from "./response-parser.ts";
import * as constants from "../../common/constants.ts";

export class ListenerBuilder {
  private logger = new Logger("Controllers");
  private guardsContextCreator = new GuardsContextCreator();
  private guardsConsumer = new GuardsConsumer();

  constructor(
    private adapter: TelegramAdapter,
    private listenerProxy: ListenerProxy,
    private exceptionHandlerContextCreator: ExceptionHandlerContextCreator,
  ) {}

  public build(
    listenerType: symbol,
    pattern: string,
    controllerInstance: Controller,
    controllerType: Type<Controller>,
    callback: (...args: any) => any,
  ) {
    const trigger = listenerType === constants.START_METADATA
      ? pattern === "start" ? "start" : parsePattern("/start " + pattern)
      : parsePattern(pattern);

    this.logger.log(
      MESSAGES.LISTENER_BINDED
        `${pattern}${controllerType.name}${listenerType.description}`,
    );
    switch (listenerType) {
      case constants.HEARS_METADATA:
        this.adapter.hears(
          trigger,
          this.createListener(controllerInstance, controllerType, callback),
        );
        break;
      case constants.COMMAND_METADATA:
        if (trigger instanceof RegExp) {
          this.adapter.hears(
            trigger,
            this.createListener(controllerInstance, controllerType, callback),
          );
          return;
        }
        this.adapter.command(
          trigger,
          this.createListener(controllerInstance, controllerType, callback),
        );
        break;
      case constants.CALLBACK_QUERY_METADATA:
        this.adapter.callbackQuery(
          trigger,
          this.createListener(controllerInstance, controllerType, callback),
        );
        break;
      case constants.START_METADATA:
        this.adapter.start(
          trigger,
          this.createListener(controllerInstance, controllerType, callback),
        );
        break;
      default:
        throw new Error(
          `unrecognized listener type : "${listenerType.toString()}"`,
        );
    }
  }

  private createListener(
    controllerInstance: Controller,
    controllerType: Type<Controller>,
    callback: (...args: any) => any,
  ): Handler {
    const exceptionHandler = this.exceptionHandlerContextCreator.create(
      this.adapter,
      controllerType,
      callback,
    );

    const guards = this.guardsContextCreator.create(controllerType, callback);

    const paramsMetadata = this.reflectParamsMetadata(
      controllerInstance,
      callback,
    );

    return async (context: Context) => {
      const canActivate = this.guardsConsumer.tryActivate(
        guards,
        controllerInstance,
        callback,
        context,
      );
      if (!canActivate) return;
      const paramArgs = paramFactory(paramsMetadata, context);
      const hasContextParam = paramsMetadata.some(
        (param) => param.type === ParamType.CONTEXT,
      );
      if (hasContextParam) {
        this.listenerProxy.call(
          controllerInstance,
          callback,
          paramArgs,
          context,
          exceptionHandler,
        );
        return;
      }
      const callbackResponse = await this.listenerProxy.call(
        controllerInstance,
        callback,
        paramArgs,
        context,
        exceptionHandler,
      );
      if (typeof callbackResponse === "undefined") {
        return;
      }
      const response = parse(callbackResponse, this.adapter, context);
      if (typeof response === "string") {
        this.adapter.reply(response, context);
      } else if (Array.isArray(response)) {
        const [message, extra] = response;
        this.adapter.reply(message, context, extra);
      }
    };
  }

  private reflectParamsMetadata(
    controllerInstance: Controller,
    callback: (...args: any) => any,
  ) {
    return (
      Reflect.getMetadata<ParamMetadata[]>(
        constants.PARAMS_METADATA,
        controllerInstance,
        callback.name,
      ) || []
    );
  }
}
