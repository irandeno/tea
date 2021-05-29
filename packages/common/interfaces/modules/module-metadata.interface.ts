import { Type } from "../mod.ts";

export class ModuleMetadata {
  imports?: Type<any>[];
  controllers?: Type<any>[];
}
