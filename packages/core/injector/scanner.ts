import { Container } from "./container.ts";
import { Type } from "../../common/mod.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";
import { Injectable } from "../../common/interfaces/injectable.interface.ts";
import * as constants from "../../common/constants.ts";
import { Logger } from "../../services/logger.service.ts";
import { MESSAGES } from "../constants.ts";

export class DependenciesScanner {
  private logger = new Logger("Scanner");
  constructor(private container: Container) {}

  public scan(module: Type<any>) {
    this.scanModule(module);
    this.scanModuleDependencies();
  }

  private scanModule(module: Type<any>) {
    this.storeModule(module);
    this.logger.log(MESSAGES.OBJECT_SCANNED`${module.name}`);
    const importedModules =
      Reflect.getMetadata<Type<any>[]>("imports", module) || [];
    importedModules.forEach((importedModule) => {
      this.scanModule(importedModule);
    });
  }

  private storeModule(module: Type<any>) {
    return this.container.addModule(module);
  }

  private storeControllers(controller: Type<Controller>, module: Type<any>) {
    this.logger.log(MESSAGES.OBJECT_SCANNED`${controller.name}`);
    this.container.addController(controller, module);
  }

  private storeInjectables(injectable: Type<Injectable>, module: Type<any>) {
    this.logger.log(MESSAGES.OBJECT_SCANNED`${injectable.name}`);
    this.container.addInjectable(injectable, module);
  }

  private scanModuleDependencies() {
    const modules = this.container.getModules();
    modules.forEach(({ module }) => {
      this.reflectControllers(module);
    });
  }

  private reflectControllers(module: Type<any>) {
    const controllers =
      Reflect.getMetadata<Type<Controller>[]>("controllers", module) || [];
    controllers.forEach((controller) => {
      this.storeControllers(controller, module);
      this.reflectMethodsMetadata(controller, module);
      this.reflectDynamicMetadata(controller, module);
    });
  }

  private reflectMethodsMetadata(
    controller: Type<Controller>,
    module: Type<any>,
  ) {
    Object.getOwnPropertyNames(controller.prototype)
      .filter((methodName) => methodName !== "constructor")
      .forEach((methodName) => {
        this.reflectDynamicMetadata(controller.prototype[methodName], module);
      });
  }

  private reflectDynamicMetadata(
    target: Type<Controller> | Function,
    module: Type<any>,
  ) {
    this.reflectInjectables(
      target,
      module,
      constants.EXCEPTION_HANDLERS_METADATA,
    );
    this.reflectInjectables(target, module, constants.GUARDS_METADATA);
  }

  private reflectInjectables(
    target: Type<Controller> | Function,
    module: Type<any>,
    metadataKey: symbol,
  ) {
    const injectables =
      Reflect.getMetadata<Type<Injectable>[]>(metadataKey, target) || [];
    injectables.forEach((injectables) => {
      this.storeInjectables(injectables, module);
    });
  }
}
