import { ControllerMetadata } from "../../interfaces/mod.ts";

export function Controller(metadata?: ControllerMetadata): ClassDecorator {
  return (target: object) => {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        Reflect.defineMetadata(property, (metadata as any)[property], target);
      }
    }
  };
}
