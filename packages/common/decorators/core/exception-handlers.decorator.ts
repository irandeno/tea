import { EXCEPTION_HANDLERS_METADATA } from "../../constants.ts";
import { ExceptionHandler } from "../../mod.ts";

export function ExceptionHandlers(
  ...handlers: (ExceptionHandler | Function)[]
): MethodDecorator & ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(EXCEPTION_HANDLERS_METADATA, handlers, target);
  };
}
