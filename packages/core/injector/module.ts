import { Type } from "../../common/mod.ts";

export class Module {
  private controllers = new Map<any, InstanceWrapper<any>>();

  constructor(public module: Type<any>) {}

  addController(controller: Type<any>) {
    if (this.controllers.has(controller)) return;
    this.controllers.set(controller, { instance: null });
  }

  getControllers() {
    return this.controllers;
  }
}

export interface InstanceWrapper<T> {
  instance: T;
}
