import { Type } from "../../common/mod.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";
import { Injectable } from "../../common/interfaces/injectable.interface.ts";

export class Module {
  private controllers = new Map<string, InstanceWrapper<Controller>>();
  private injectables = new Map<string, InstanceWrapper<Injectable>>();

  constructor(public module: Type<any>) {}

  addController(controller: Type<Controller>) {
    if (this.controllers.has(controller.name)) return;
    const extendedController = this.extendInjectable(controller);
    this.controllers.set(controller.name, {
      instance: null,
      metatype: extendedController,
    });
  }

  addInjectable(injectable: Type<Injectable>) {
    if (this.injectables.has(injectable.name)) return;
    this.injectables.set(injectable.name, {
      instance: null,
      metatype: injectable,
    });
  }

  getControllers() {
    return this.controllers;
  }

  getInjectables() {
    return this.injectables;
  }

  extendInjectable<T extends Type<Controller> | Type<Injectable>>(
    controller: T,
  ) {
    return Object.defineProperty(controller, "getModule", {
      value: () => this,
      enumerable: false,
      configurable: false,
    });
  }
}

export interface InstanceWrapper<T> {
  instance: T | null;
  metatype: Type<T>;
}
