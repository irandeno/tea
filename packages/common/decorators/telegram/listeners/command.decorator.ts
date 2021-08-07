import { COMMAND_METADATA } from "../../../constants.ts";

export function Command(pattern: string | RegExp): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    pattern = validatePattern(pattern);
    Reflect.defineMetadata(COMMAND_METADATA, pattern, descriptor.value);
  };
}

const validatePattern = (pattern: string | RegExp) =>
  pattern.toString().length
    ? pattern.toString()[0] === "/" ? pattern.toString().slice(1) : pattern
    : pattern;
