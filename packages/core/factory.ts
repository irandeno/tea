import { Container } from "./injector/mod.ts";
import { DependenciesScanner, Injector } from "./injector/mod.ts";
import { GrammyAdapter } from "./adapters/mod.ts";
import { Application } from "./application.ts";
import { Type } from "../common/interfaces/mod.ts";

export class TeaFactory {
  private static container = new Container();
  private static dependenciesScanner = new DependenciesScanner(this.container);
  private static injector = new Injector(this.container);

  public static create(module: Type<any>, token: string) {
    this.dependenciesScanner.scan(module);
    this.injector.createInstanceOfDependencies();
    const adapter = new GrammyAdapter(token);
    return new Application(this.container, adapter);
  }
}
