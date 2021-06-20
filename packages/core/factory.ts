import { Container } from "./injector/mod.ts";
import { DependenciesScanner, Injector } from "./injector/mod.ts";
import { GrammyAdapter } from "./adapters/mod.ts";
import { Application } from "./application.ts";
import { Type } from "../common/interfaces/mod.ts";
import { Harmony } from "./harmony.ts";
export class TeaFactory {
  private static container = new Container();
  private static dependenciesScanner = new DependenciesScanner(this.container);
  private static harmony = new Harmony(this.container);
  private static injector = new Injector(this.container);

  public static create(module: Type<any>, token: string) {
    this.dependenciesScanner.scan(module);
    this.injector.createInstanceOfDependencies();
    this.harmony.check();
    const adapter = new GrammyAdapter(token);
    return new Application(this.container, adapter);
  }
}
