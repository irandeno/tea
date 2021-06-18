import { CALLBACK_QUERY_METADATA } from "../../../constants.ts";

export function CallbackQuery(pattern: string): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(CALLBACK_QUERY_METADATA, pattern, descriptor.value);
  };
}
