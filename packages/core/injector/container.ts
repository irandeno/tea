import { Module } from "./module.ts";
import { Type } from "../../common/interfaces/mod.ts";

export class Container {
  private readonly modules = new Map<string, Module>();

  public addModule(module: Type<any>) {
    const token = module.name;
    if (this.modules.has(token)) {
      return;
    }
    this.modules.set(token, new Module(module));
  }

  public getModules() {
    return this.modules;
  }

  public addController(controller: Type<any>, module: Type<any>) {
    if (!this.modules.has(module.name)) throw new Error("error");
    const storedModule = this.modules.get(module.name);
    storedModule?.addController(controller);
  }
}
