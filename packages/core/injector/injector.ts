import { Container } from "./container.ts";
import { InstanceWrapper } from "./module.ts";

export class Injector {
  constructor(private container: Container) {}

  public createInstanceOfDependencies() {
    const modules = this.container.getModules();
    modules.forEach((module) => {
      this.createInstanceOfControllers(module.getControllers());
    });
  }

  private createInstanceOfControllers(
    controllers: Map<any, InstanceWrapper<any>>,
  ) {
    controllers.forEach((wrapper, controllerType) => {
      wrapper.instance = this.createDependenciesInstances(controllerType);
    });
  }

  private createDependenciesInstances(type: any) {
    const params = Reflect.getMetadata<any>("design:paramtypes", type) || [];
    const paramInstances = params.map((param: any) => new param());
    return new type(...paramInstances);
  }
}
