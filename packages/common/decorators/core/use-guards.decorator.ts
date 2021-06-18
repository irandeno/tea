import { GUARDS_METADATA } from "../../constants.ts";
import { CanActivate } from "../../mod.ts";

export function UseGuards(
  ...guards: (CanActivate | Function)[]
): MethodDecorator & ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(GUARDS_METADATA, guards, target);
  };
}
