import { START_METADATA } from "../../../constants.ts";

export function Start(pattern: string = "start"): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(START_METADATA, pattern, descriptor.value);
  };
}
