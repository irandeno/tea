import { COMMAND_METADATA } from "../../../constants.ts";
import { parse } from "../../../../deps.ts";
export function Command(pattern: string): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    pattern = validatePattern(pattern);
    const trigger = parse(pattern);
    Reflect.defineMetadata(COMMAND_METADATA, trigger, descriptor.value);
  };
}

const validatePattern = (pattern: string) =>
  pattern.length ? (pattern[0] === "/" ? pattern.slice(1) : pattern) : pattern;
