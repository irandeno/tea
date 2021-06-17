import { CATCH_METADATA } from "../../constants.ts";
import { Type } from "../../interfaces/type.interface.ts";

export function Catch(
  ...exceptions: (Error | Type<Error> | Function)[]
): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(CATCH_METADATA, exceptions, target);
  };
}
