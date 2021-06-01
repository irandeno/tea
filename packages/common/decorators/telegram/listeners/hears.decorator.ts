import { HEARS_METADATA } from "../../../constants.ts";
import { parse } from "../../../../deps.ts";

export function Hears(pattern: string): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    //TODO: should handle in adapter level
    const trigger = parse(pattern);

    Reflect.defineMetadata(HEARS_METADATA, trigger, descriptor.value);
  };
}
