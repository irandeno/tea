import { CALLBACK_QUERY_METADATA } from "../../../constants.ts";
import { parse } from "../../../../deps.ts";
export function CallbackQuery(pattern: string): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const trigger = parse(pattern);
    Reflect.defineMetadata(CALLBACK_QUERY_METADATA, trigger, descriptor.value);
  };
}
