import { ModuleMetadata } from "../../interfaces/modules/module-metadata.interface.ts";
import { MODULE_METADATA as moduleMetadata } from "../../constants.ts";
import { InvalidModuleConfigException } from "./exceptions/invalid-module-config.exception.ts";
const validMetadata = [moduleMetadata.IMPORTS, moduleMetadata.CONTROLLERS];

const validateKeys = (keys: string[] = []) => {
  const isKeyValid = (key: string) =>
    validMetadata.includes(key as moduleMetadata);
  keys.forEach((key) => {
    if (isKeyValid(key)) {
      return;
    }
    throw new InvalidModuleConfigException(key);
  });
};

export function Module(metadata: ModuleMetadata): ClassDecorator {
  validateKeys(Object.keys(metadata));
  return (target: object) => {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        Reflect.defineMetadata(property, (metadata as any)[property], target);
      }
    }
  };
}
