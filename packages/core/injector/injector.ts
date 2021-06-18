import { Container } from "./container.ts";
import { InstanceWrapper } from "./module.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";
import { Injectable } from "../../common/interfaces/injectable.interface.ts";
import { Logger } from "../../services/logger.service.ts";
import { MESSAGES } from "../constants.ts";

export class Injector {
  private logger = new Logger("Injector");

  constructor(private container: Container) {}

  public createInstanceOfDependencies() {
    const modules = this.container.getModules();
    modules.forEach((module) => {
      this.createInstanceOfControllers(module.getControllers());
      this.createInstanceOfInjectables(module.getInjectables());
    });
  }

  private createInstanceOfControllers(
    controllers: Map<string, InstanceWrapper<Controller>>,
  ) {
    controllers.forEach((wrapper) => {
      this.logger.log(MESSAGES.OBJECT_INJECTED`${wrapper.metatype.name}`);
      wrapper.instance = this.createDependenciesInstances(wrapper.metatype);
    });
  }

  private createInstanceOfInjectables(
    injectables: Map<string, InstanceWrapper<Injectable>>,
  ) {
    injectables.forEach((wrapper) => {
      this.logger.log(MESSAGES.OBJECT_INJECTED`${wrapper.metatype.name}`);
      wrapper.instance = this.createDependenciesInstances(wrapper.metatype);
    });
  }

  private createDependenciesInstances(type: any) {
    const params = Reflect.getMetadata<any>("design:paramtypes", type) || [];
    const paramInstances = params.map((param: any) => {
      this.logger.log(
        MESSAGES.OBJECT_PARAM_INJECTED`${type.name}${param.name}`,
      );
      return new param();
    });
    return new type(...paramInstances);
  }
}
