import { Container } from "./container.ts";
import { Type } from "../../common/mod.ts";
export class DependenciesScanner {
  constructor(private container: Container) {}

  public scan(module: Type<any>) {
    this.scanModule(module);
    this.scanModuleDependencies();
  }

  private scanModule(module: Type<any>) {
    this.storeModule(module);
    const importedModules =
      Reflect.getMetadata<Type<any>[]>("imports", module) || [];
    importedModules.forEach((importedModule) => {
      this.scanModule(importedModule);
    });
  }

  private storeModule(module: Type<any>) {
    return this.container.addModule(module);
  }

  private storeControllers(controller: Type<any>, module: Type<any>) {
    return this.container.addController(controller, module);
  }

  private scanModuleDependencies() {
    const modules = this.container.getModules();
    modules.forEach(({ module }) => {
      this.reflectControllers(module);
    });
  }

  private reflectControllers(module: Type<any>) {
    const controllers =
      Reflect.getMetadata<Type<any>[]>("controllers", module) || [];
    controllers.forEach((controller) => {
      this.storeControllers(controller, module);
    });
  }
}
