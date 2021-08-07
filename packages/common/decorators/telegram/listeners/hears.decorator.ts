import { HEARS_METADATA } from "../../../constants.ts";

export function Hears(pattern: string | RegExp): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(HEARS_METADATA, pattern, descriptor.value);
  };
}
