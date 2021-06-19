import { EXCEPTION_HANDLERS_METADATA } from "../../constants.ts";
import { ExceptionHandler } from "../../mod.ts";

export function ExceptionHandlers(
  ...handlers: (ExceptionHandler | Function)[]
): MethodDecorator & ClassDecorator {
  return (
    target: object,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      EXCEPTION_HANDLERS_METADATA,
      handlers,
      descriptor ? descriptor.value : target,
    );
  };
}
