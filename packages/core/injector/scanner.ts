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
      this.reflectDynamicMetadata(controller, module);
    });
  }
  private reflectDynamicMetadata(
    controller: Type<Controller>,
    module: Type<any>,
  ) {
    this.reflectInjectables(
      controller,
      module,
      constants.EXCEPTION_HANDLERS_METADATA,
    );
  }

  private reflectInjectables(
    controller: Type<Controller>,
    module: Type<any>,
    metadataKey: string,
  ) {
    const injectables =
      Reflect.getMetadata<Type<Injectable>[]>(metadataKey, controller) || [];
    injectables.forEach((injectables) => {
      this.storeInjectables(injectables, module);
    });
  }
}
