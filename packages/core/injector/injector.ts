import { Container } from "./container.ts";
import { InstanceWrapper } from "./module.ts";
import { Controller } from "../../common/interfaces/controllers/controller.interface.ts";
import { Injectable } from "../../common/interfaces/injectable.interface.ts";

export class Injector {
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
      wrapper.instance = this.createDependenciesInstances(wrapper.metatype);
    });
  }

  private createInstanceOfInjectables(
    injectables: Map<string, InstanceWrapper<Injectable>>,
  ) {
    injectables.forEach((wrapper) => {
      wrapper.instance = this.createDependenciesInstances(wrapper.metatype);
    });
  }

  private createDependenciesInstances(type: any) {
    const params = Reflect.getMetadata<any>("design:paramtypes", type) || [];
    const paramInstances = params.map((param: any) => {
      return new param();
    });
    return new type(...paramInstances);
  }
}
