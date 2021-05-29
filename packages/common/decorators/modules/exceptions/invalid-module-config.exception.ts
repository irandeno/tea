import { INVALID_MODULE_CONFIG_MESSAGE } from "./constants.ts";

export class InvalidModuleConfigException extends Error {
  constructor(key: string) {
    super(INVALID_MODULE_CONFIG_MESSAGE`${key}`);
  }
}
