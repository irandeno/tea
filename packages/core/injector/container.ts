import { Module } from "./module.ts";
import { Type } from "../../common/interfaces/mod.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";
import { Injectable } from "../../common/interfaces/injectable.interface.ts";

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

  public addController(controller: Type<Controller>, module: Type<any>) {
    if (!this.modules.has(module.name)) {
      return;
    }
    const storedModule = this.modules.get(module.name);
    storedModule?.addController(controller);
  }

  public addInjectable(injectable: Type<Injectable>, module: Type<any>) {
    if (!this.modules.has(module.name)) {
      return;
    }
    const storedModule = this.modules.get(module.name);
    storedModule?.addInjectable(injectable);
  }
}
