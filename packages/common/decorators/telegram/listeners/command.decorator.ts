import { COMMAND_METADATA } from "../../../constants.ts";

export function Command(pattern: string): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    pattern = validatePattern(pattern);
    Reflect.defineMetadata(COMMAND_METADATA, pattern, descriptor.value);
  };
}

const validatePattern = (pattern: string) =>
  pattern.length ? (pattern[0] === "/" ? pattern.slice(1) : pattern) : pattern;
